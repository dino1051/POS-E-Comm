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

  async createVenta(createVentaDto: CreateVentaDto) {
    return this.prisma.$transaction(async (tx) => {
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
          id_usuario: createVentaDto.id_usuario,
          tipo_pago: createVentaDto.tipo_pago,
          total,

          detallesVenta: {
            create: detalles,
          },
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

      return venta;
    });
  }
  async findVenta(id: number) {
    return this.prisma.ventas.findUnique({
      where: { id },
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
}
