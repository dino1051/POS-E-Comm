import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  AbrirSesionCajaDto,
  CerrarSesionCajaDto,
} from './dto/create-sesion-caja.dto.js';

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
  async cerrar(id: number) {
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

      await tx.sesionCaja.update({
        where: {
          id,
        },
        data: {
          fecha_cierre: new Date(),
          monto_cierre: totalVentasEfectivo,
          estado: 'CERRADA',
        },
        include: {
          pos: true,
          usuario: true,
          ventas: true,
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
      };
    });
  }
}
