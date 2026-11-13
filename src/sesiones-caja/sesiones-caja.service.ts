import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { AbrirSesionCajaDto } from './dto/create-sesion-caja.dto.js';
import { CerrarSesionCajaDto } from './dto/cerrar-sesion-caja.dto.js';
@Injectable()
export class SesionesCajaService {
  constructor(private readonly prisma: PrismaService) {}

  async abrir(dto: AbrirSesionCajaDto) {
    const pos = await this.prisma.pos.findUnique({
      where: {
        id: dto.id_pos,
      },
    });

    if (!pos) {
      throw new NotFoundException(`El POS ${dto.id_pos} no existe`);
    }

    if (!pos.activo) {
      throw new BadRequestException(`El POS ${pos.numero} está inactivo`);
    }
    const cajero = await this.prisma.user.findUnique({
      where: { id: dto.id_cajero, role: 'CAJERO' },
    });

    if (!cajero) {
      throw new NotFoundException(
        `El usuario con id: ${dto.id_cajero} no tiene el rol cajero`,
      );
    }

    const sesionAbierta = await this.prisma.sesionCaja.findFirst({
      where: {
        id_pos: dto.id_pos,
        estado: 'ABIERTA',
      },
    });

    if (sesionAbierta) {
      throw new BadRequestException(
        `El POS ${pos.numero} ya tiene una sesión abierta`,
      );
    }

    return this.prisma.sesionCaja.create({
      data: {
        id_pos: dto.id_pos,
        id_usuario_apertura: dto.id_cajero,
        monto_inicial: dto.monto_inicial,
      },
      select: {
        estado: true,
        monto_inicial: true,
        fecha_apertura: true,
        pos: {
          select: {
            nombre: true,
          },
        },
        usuario: {
          select: {
            nombre: true,
          },
        },
      },
    });
  }
  async cerrar(id: number, dto: CerrarSesionCajaDto) {
    return this.prisma.$transaction(async (tx) => {
      const sesionCaja = await tx.sesionCaja.findUnique({
        where: {
          id,
        },
        include: {
          pos: true,
        },
      });

      if (!sesionCaja) {
        throw new NotFoundException(`La sesión de caja ${id} no existe`);
      }

      if (sesionCaja.estado === 'CERRADA') {
        throw new BadRequestException(
          `La sesión de caja ${id} ya está cerrada`,
        );
      }

      // Obtener ventas en efectivo de esta sesión
      const ventasEfectivo = await tx.ventas.aggregate({
        where: {
          id_sesion_caja: id,
          tipo_pago: 'EFECTIVO',
          estado: 'COMPLETADA',
        },
        _sum: {
          total: true,
        },
        _count: {
          id: true,
        },
      });
      const totalVentasEfectivo = Number(ventasEfectivo._sum.total ?? 0);
      const montoInicial = Number(sesionCaja.monto_inicial);

      const efectivoEsperado = montoInicial + totalVentasEfectivo;

      const efectivoContado = dto.monto_cierre;

      const diferencia = efectivoContado - efectivoEsperado;
      const ventas = await tx.ventas.findMany({
        where: {
          id_sesion_caja: id,
        },
      });
      const ventasPorMetodoPago = await tx.ventas.groupBy({
        by: ['tipo_pago'],
        where: {
          id_sesion_caja: id,
          estado: 'COMPLETADA',
        },
        _sum: {
          total: true,
        },
        _count: {
          id: true,
        },
      });
      const cancelaciones = await tx.ventas.aggregate({
        where: {
          id_sesion_caja: id,
          estado: 'CANCELADA',
        },
        _sum: {
          total: true,
        },
        _count: {
          id: true,
        },
      });
      const devoluciones = await tx.devoluciones.aggregate({
        where: {
          venta: {
            id_sesion_caja: id,
          },
        },
        _sum: {
          total: true,
        },
        _count: {
          id: true,
        },
      });

      const fechaCierre = new Date();

      await tx.sesionCaja.update({
        where: { id },
        data: {
          fecha_cierre: fechaCierre,
          monto_cierre: efectivoContado,
          estado: 'CERRADA',
        },
      });
      return {
        sesion: {
          id: sesionCaja.id,
          pos: sesionCaja.pos,
          fecha_apertura: sesionCaja.fecha_apertura,
          fecha_cierre: new Date(),
          monto_inicial: sesionCaja.monto_inicial,
        },

        ventas: {
          porMetodoPago: ventasPorMetodoPago,
          total: ventas,
        },

        cancelaciones: {
          cantidad: cancelaciones._count.id,
          total: cancelaciones._sum.total ?? 0,
        },

        devoluciones: {
          cantidad: devoluciones._count.id,
          total: devoluciones._sum.total ?? 0,
        },

        efectivo: {
          cantidad: ventasEfectivo._count.id,
          total: totalVentasEfectivo,
        },
        arqueo: {
          montoInicial,
          ventasEfectivo: totalVentasEfectivo,
          efectivoEsperado,
          efectivoContado,
          diferencia,
        },
      };
    });
  }

  async obtenerSesionesAbiertas() {
    return this.prisma.sesionCaja.findMany({
      where: {
        estado: 'ABIERTA',
      },
      select: {
        id: true,
        id_pos: true,
        id_usuario_apertura: true,
        fecha_apertura: true,
        monto_inicial: true,
        estado: true,
        pos: {
          select: {
            numero: true,
            nombre: true,
          },
        },
        usuario: {
          select: {
            nombre: true,
            apellido: true,
          },
        },
      },
      orderBy: {
        fecha_apertura: 'desc',
      },
    });
  }
  async obtenerResumen(id: number) {
    const sesion = await this.prisma.sesionCaja.findUnique({
      where: { id },
      include: {
        pos: {
          select: {
            numero: true,
            nombre: true,
          },
        },
        usuario: {
          select: {
            nombre: true,
            apellido: true,
          },
        },
      },
    });

    if (!sesion) {
      throw new NotFoundException(`La sesión de caja ${id} no existe`);
    }

    if (sesion.estado !== 'ABIERTA') {
      throw new BadRequestException('La sesión de caja ya está cerrada');
    }

    const ventasPorMetodoPago = await this.prisma.ventas.groupBy({
      by: ['tipo_pago'],
      where: {
        id_sesion_caja: id,
        estado: 'COMPLETADA',
      },
      _sum: {
        total: true,
      },
      _count: {
        id: true,
      },
    });

    const totalEfectivo = ventasPorMetodoPago
      .filter((venta) => venta.tipo_pago === 'EFECTIVO')
      .reduce((total, venta) => total + Number(venta._sum.total ?? 0), 0);

    const montoInicial = Number(sesion.monto_inicial);

    return {
      sesion: {
        id: sesion.id,
        fecha_apertura: sesion.fecha_apertura,
        monto_inicial: montoInicial,
        pos: sesion.pos,
        usuario: sesion.usuario,
      },
      ventasPorMetodoPago,
      efectivo: {
        montoInicial,
        ventasEfectivo: totalEfectivo,
        esperado: montoInicial + totalEfectivo,
      },
    };
  }

  async obtenerHistorial() {
    return this.prisma.sesionCaja.findMany({
      select: {
        id: true,
        id_pos: true,
        id_usuario_apertura: true,
        fecha_apertura: true,
        fecha_cierre: true,
        monto_inicial: true,
        monto_cierre: true,
        estado: true,
        pos: {
          select: {
            numero: true,
            nombre: true,
          },
        },
        usuario: {
          select: {
            nombre: true,
            apellido: true,
          },
        },
      },
      orderBy: {
        fecha_apertura: 'desc',
      },
    });
  }

  async obtenerDetalle(id: number) {
    const sesion = await this.prisma.sesionCaja.findUnique({
      where: { id },
      include: {
        pos: {
          select: {
            id: true,
            numero: true,
            nombre: true,
          },
        },
        usuario: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
          },
        },
        ventas: {
          select: {
            id: true,
            fecha: true,
            total: true,
            tipo_pago: true,
            estado: true,
            detallesVenta: {
              select: {
                id: true,
                cantidadArticulos: true,
                subtotal: true,
                articulo: {
                  select: {
                    nombre: true,
                  },
                },
              },
            },
          },
          orderBy: {
            fecha: 'desc',
          },
        },
      },
    });

    if (!sesion) {
      throw new NotFoundException(`La sesión de caja ${id} no existe`);
    }

    const ventasCompletadas = sesion.ventas.filter(
      (venta) => venta.estado === 'COMPLETADA',
    );

    const ventasPorMetodo = {
      EFECTIVO: 0,
      TARJETA: 0,
      TRANSFERENCIAQR: 0,
    };

    for (const venta of ventasCompletadas) {
      ventasPorMetodo[venta.tipo_pago] += Number(venta.total);
    }

    const totalVentas = Object.values(ventasPorMetodo).reduce(
      (total, importe) => total + importe,
      0,
    );

    const cancelaciones = sesion.ventas.filter(
      (venta) => venta.estado === 'CANCELADA',
    );

    const devoluciones = await this.prisma.devoluciones.findMany({
      where: {
        venta: {
          id_sesion_caja: id,
        },
      },
      select: {
        id: true,
        total: true,
      },
    });

    const totalDevoluciones = devoluciones.reduce(
      (total, devolucion) => total + Number(devolucion.total),
      0,
    );

    const montoInicial = Number(sesion.monto_inicial);

    // Cálculo preliminar, sin ajustes de efectivo.
    const efectivoEsperado = montoInicial + ventasPorMetodo.EFECTIVO;

    const montoContado =
      sesion.monto_cierre === null ? null : Number(sesion.monto_cierre);

    return {
      sesion: {
        id: sesion.id,
        estado: sesion.estado,
        fecha_apertura: sesion.fecha_apertura,
        fecha_cierre: sesion.fecha_cierre,
        monto_inicial: montoInicial,
        monto_cierre: montoContado,
        pos: sesion.pos,
        usuario: sesion.usuario,
      },
      resumen: {
        cantidadVentasCompletadas: ventasCompletadas.length,
        totalVentas,
        ventasPorMetodo,
        cancelaciones: {
          cantidad: cancelaciones.length,
          total: cancelaciones.reduce(
            (total, venta) => total + Number(venta.total),
            0,
          ),
        },
        devoluciones: {
          cantidad: devoluciones.length,
          total: totalDevoluciones,
        },
        arqueo: {
          efectivoEsperado,
          efectivoContado: montoContado,
          diferencia:
            montoContado === null ? null : montoContado - efectivoEsperado,
        },
      },
      ventas: sesion.ventas,
    };
  }
}
