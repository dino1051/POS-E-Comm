import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateVentaDto } from './dto/create-venta.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { DevolucionVentaDto } from './dto/create-devolucion.dto.js';

@Injectable()
export class VentasService {
  constructor(private readonly prisma: PrismaService) {}

  async createVenta(createVentaDto: CreateVentaDto, id: number) {
    return this.prisma.$transaction(async (tx) => {
      const sesionCaja = await tx.sesionCaja.findFirst({
        where: {
          id_usuario_apertura: id,
          estado: 'ABIERTA',
        },
      });

      if (!sesionCaja) {
        throw new BadRequestException('No tienes una sesión de caja abierta');
      }

      let total = 0;

      const detalles = [];

      for (const detalle of createVentaDto.detalles) {
        const articulo = await tx.articulos.findUnique({
          where: {
            id: detalle.id_articulo,
          },
        });

        if (!articulo) {
          throw new NotFoundException(
            `El artículo ${detalle.id_articulo} no existe`,
          );
        }

        if (articulo.stock < detalle.cantidadArticulos) {
          throw new BadRequestException(
            `Stock insuficiente para el artículo ${articulo.nombre}`,
          );
        }

        const subtotal =
          Number(articulo.precioVenta) * detalle.cantidadArticulos;

        total += subtotal;

        detalles.push({
          id_articulo: articulo.id,
          cantidadArticulos: detalle.cantidadArticulos,
          subtotal,
        });

        await tx.articulos.update({
          where: {
            id: articulo.id,
          },
          data: {
            stock: {
              decrement: detalle.cantidadArticulos,
            },
          },
        });
      }

      const venta = await tx.ventas.create({
        data: {
          id_usuario: id,
          id_sesion_caja: sesionCaja.id,
          tipo_pago: createVentaDto.tipo_pago,
          total,

          detallesVenta: {
            create: detalles,
          },
        },

        select: {
          fecha: true,
          total: true,
          tipo_pago: true,
          detallesVenta: {
            select: {
              cantidadArticulos: true,
              subtotal: true,
              articulo: {
                select: {
                  nombre: true,
                  precioVenta: true,
                },
              },
            },
          },
          usuario: {
            select: {
              nombre: true,
            },
          },
          sesionCaja: {
            select: {
              id_pos: true,
            },
          },
        },
      });

      return venta;
    });
  }
  async findVenta(id: number) {
    return this.prisma.ventas.findUnique({
      where: { id },
      include: {
        usuario: {
          select: {
            nombre: true,
            apellido: true,
          },
        },
      },
      omit: {
        id_usuario: true,
      },
    });
  }
  async findAllVentas() {
    return this.prisma.ventas.findMany({ orderBy: { id: 'asc' } });
  }
  async findMisVentas(id_usuario: number) {
    return this.prisma.ventas.findMany({
      where: { id_usuario },
      include: {
        usuario: true,
      },
    });
  }

  async cancelar(id: number) {
    return this.prisma.$transaction(async (tx) => {
      const venta = await tx.ventas.findUnique({
        where: { id },
        include: {
          detallesVenta: true,
        },
      });

      if (!venta) {
        throw new NotFoundException(`La venta ${id} no existe`);
      }

      if (venta.estado !== 'COMPLETADA') {
        throw new BadRequestException(
          `La venta ${id} no puede ser cancelada porque su estado actual es ${venta.estado}`,
        );
      }

      for (const detalle of venta.detallesVenta) {
        await tx.articulos.update({
          where: {
            id: detalle.id_articulo,
          },
          data: {
            stock: {
              increment: detalle.cantidadArticulos,
            },
          },
        });
      }

      return tx.ventas.update({
        where: {
          id,
        },
        data: {
          estado: 'CANCELADA',
        },
        include: {
          detallesVenta: {
            include: {
              articulo: true,
            },
          },
          usuario: true,
        },
      });
    });
  }

  async devolver(id: number, devolucionDto: DevolucionVentaDto) {
    return this.prisma.$transaction(async (tx) => {
      const venta = await tx.ventas.findUnique({
        where: { id },
        include: {
          detallesVenta: true,
        },
      });

      if (!venta) {
        throw new NotFoundException(`La venta ${id} no existe`);
      }

      if (venta.estado === 'CANCELADA' || venta.estado === 'DEVUELTA') {
        throw new BadRequestException(
          `La venta ${id} ya no puede recibir devoluciones`,
        );
      }

      for (const devolucion of devolucionDto.detalles) {
        const detalle = venta.detallesVenta.find(
          (d) => d.id === devolucion.id_detalle,
        );

        if (!detalle) {
          throw new BadRequestException(
            `El detalle ${devolucion.id_detalle} no pertenece a la venta ${id}`,
          );
        }

        const cantidadDisponible =
          detalle.cantidadArticulos - detalle.cantidadDevuelta;

        if (devolucion.cantidad > cantidadDisponible) {
          throw new BadRequestException(
            `No se pueden devolver ${devolucion.cantidad} unidades de este artículo. ` +
              `Solo quedan ${cantidadDisponible} unidades disponibles para devolución.`,
          );
        }

        await tx.articulos.update({
          where: {
            id: detalle.id_articulo,
          },
          data: {
            stock: {
              increment: devolucion.cantidad,
            },
          },
        });

        await tx.detallesVenta.update({
          where: {
            id: detalle.id,
          },
          data: {
            cantidadDevuelta: {
              increment: devolucion.cantidad,
            },
          },
        });
      }

      // Volvemos a consultar los detalles para conocer
      // el estado final de las devoluciones.
      const detallesActualizados = await tx.detallesVenta.findMany({
        where: {
          id_venta: id,
        },
      });

      const todosDevueltos = detallesActualizados.every(
        (detalle) => detalle.cantidadDevuelta === detalle.cantidadArticulos,
      );

      return tx.ventas.update({
        where: {
          id,
        },
        data: {
          estado: todosDevueltos ? 'DEVUELTA' : 'DEVUELTA_PARCIAL',
        },
        include: {
          detallesVenta: {
            include: {
              articulo: true,
            },
          },
          usuario: true,
        },
      });
    });
  }

  async reporteMensual(mes: number, anio: number) {
    if (!Number.isInteger(mes) || mes < 1 || mes > 12) {
      throw new BadRequestException('El mes debe estar entre 1 y 12');
    }

    if (!Number.isInteger(anio) || anio < 2000 || anio > 2100) {
      throw new BadRequestException('Año inválido');
    }

    const fechaInicio = new Date(anio, mes - 1, 1);
    const fechaFin = new Date(anio, mes, 1);

    const where = {
      fecha: {
        gte: fechaInicio,
        lt: fechaFin,
      },
    };

    const resumen = await this.prisma.ventas.aggregate({
      where,
      _count: {
        _all: true,
      },
      _sum: {
        total: true,
      },
    });

    const ventasPorPago = await this.prisma.ventas.groupBy({
      by: ['tipo_pago'],
      where,
      _count: {
        _all: true,
      },
      _sum: {
        total: true,
      },
    });

    const ventas = await this.prisma.ventas.findMany({
      where,
      select: {
        id: true,
        fecha: true,
        total: true,
        tipo_pago: true,
      },
      orderBy: {
        fecha: 'desc',
      },
    });

    return {
      periodo: {
        mes,
        anio,
        fechaInicio,
        fechaFin,
      },
      resumen: {
        cantidadVentas: resumen._count._all,
        totalVendido: resumen._sum.total ?? 0,
      },
      ventasPorPago: ventasPorPago.map((grupo) => ({
        tipoPago: grupo.tipo_pago,
        cantidadVentas: grupo._count._all,
        totalVendido: grupo._sum.total ?? 0,
      })),
      ventas,
    };
  }
}
