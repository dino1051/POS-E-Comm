import {
  BadGatewayException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateVentaWebDto } from './dto/create-ventaweb.dto.js';
import { MockPayWebhookDto } from '../webhook/dto/webhook.dto.js';
import { EstadoWeb } from '../generated/prisma/enums.js';

@Injectable()
export class VentasWebService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async crear(dto: CreateVentaWebDto, userId: number) {
    const venta = await this.prisma.$transaction(async (tx) => {
      let total = 0;
      const detalles = [];

      for (const detalle of dto.detalles) {
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
            `Stock insuficiente para ${articulo.nombre}`,
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
      }

      return tx.ventasWeb.create({
        data: {
          id_usuario: userId,
          total,
          estadoweb: 'PENDIENTE',
          estado_pago: 'PENDIENTE',
          detallesventaweb: {
            create: detalles,
          },
        },
      });
    });

    // La transacción de base de datos ya terminó.
    // Ahora solicitamos el pago a MockPay.
    const pago = await this.crearIntencionPago(venta.id, Number(venta.total));

    const ventaActualizada = await this.prisma.ventasWeb.update({
      where: {
        id: venta.id,
      },
      data: {
        id_pago_externo: pago.id,
      },
    });

    return {
      venta: ventaActualizada,
      checkout_url: pago.checkout_url,
    };
  }

  private async crearIntencionPago(ventaId: number, total: number) {
    const apiUrl = this.configService.getOrThrow<string>('MOCKPAY_API_URL');

    const secretKey =
      this.configService.getOrThrow<string>('MOCKPAY_SECRET_KEY');

    const response = await fetch(`${apiUrl}/api/v1/payments`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: total,
        currency: 'USD',
        metadata: {
          order_id: String(ventaId),
        },
      }),
      signal: AbortSignal.timeout(10000),
    });

    const responseText = await response.text();

    if (!response.ok) {
      throw new BadGatewayException(
        `MockPay respondió con HTTP ${response.status}`,
      );
    }

    let data: {
      id_transaccion: string;
      checkout_url: string;
    };

    try {
      data = JSON.parse(responseText);
    } catch {
      throw new BadGatewayException(
        'MockPay devolvió una respuesta JSON inválida',
      );
    }

    if (!data.id_transaccion || !data.checkout_url) {
      throw new BadGatewayException(
        'MockPay devolvió una respuesta incompleta',
      );
    }

    return {
      id: data.id_transaccion,
      checkout_url: data.checkout_url,
    };
  }

  async procesarWebhook(body: MockPayWebhookDto) {
    const ventaId = Number(body.metadata.order_id);

    if (!Number.isInteger(ventaId)) {
      throw new BadRequestException('order_id inválido');
    }

    const venta = await this.prisma.ventasWeb.findUnique({
      where: {
        id: ventaId,
      },
    });

    if (!venta) {
      throw new NotFoundException(`No existe la venta ${ventaId}`);
    }

    if (venta.id_pago_externo && venta.id_pago_externo !== body.id) {
      throw new BadRequestException('La transacción no corresponde a la venta');
    }

    if (Number(venta.total) !== body.amount) {
      throw new BadRequestException(
        'El monto del pago no coincide con el total de la venta',
      );
    }

    if (body.currency !== 'USD') {
      throw new BadRequestException('Moneda de pago no válida');
    }

    if (body.event === 'payment.succeeded') {
      await this.prisma.ventasWeb.update({
        where: {
          id: ventaId,
        },
        data: {
          estado_pago: 'PAGADO',
          id_pago_externo: body.id,
        },
      });

      return {
        received: true,
        status: 'PAGADO',
        venta_id: ventaId,
      };
    }

    if (body.event === 'payment.succeeded') {
      if (
        venta.estado_pago === 'REEMBOLSADO' ||
        venta.estadoweb === 'CANCELADO'
      ) {
        throw new BadRequestException(
          'No se puede confirmar un pedido cancelado o reembolsado',
        );
      }

      await this.prisma.ventasWeb.updateMany({
        where: {
          id: ventaId,
          estado_pago: 'PENDIENTE',
          estadoweb: 'PENDIENTE',
        },
        data: {
          estado_pago: 'PAGADO',
          estadoweb: 'PAGADO',
          id_pago_externo: body.id,
        },
      });

      return {
        received: true,
        status: 'PAGADO',
        venta_id: ventaId,
      };
    }

    return {
      received: true,
    };
  }

  async resumenPedidos() {
    const [pedidosPendientes, pedidosRecientes] = await Promise.all([
      this.prisma.ventasWeb.count({
        where: {
          estadoweb: 'PENDIENTE',
        },
      }),

      this.prisma.ventasWeb.findMany({
        take: 5,
        orderBy: {
          fecha: 'desc',
        },
        select: {
          id: true,
          fecha: true,
          total: true,
          estadoweb: true,
          estado_pago: true,
          usuario: {
            select: {
              nombre: true,
              apellido: true,
            },
          },
        },
      }),
    ]);

    return {
      pedidosPendientes,
      pedidosRecientes,
    };
  }

  async obtenerTodas() {
    return this.prisma.ventasWeb.findMany({
      select: {
        id: true,
        fecha: true,
        total: true,
        estadoweb: true,
        estado_pago: true,
        estado: true,
        id_pago_externo: true,

        usuario: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
          },
        },

        _count: {
          select: {
            detallesventaweb: true,
          },
        },
      },

      orderBy: {
        fecha: 'desc',
      },
    });
  }

  async obtenerPorId(id: number) {
    const venta = await this.prisma.ventasWeb.findUnique({
      where: { id },

      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
          },
        },

        detallesventaweb: {
          select: {
            id: true,
            cantidadArticulos: true,
            cantidadDevuelta: true,
            subtotal: true,

            articulo: {
              select: {
                id: true,
                nombre: true,
                precioVenta: true,
              },
            },
          },
        },

        devolucion: true,
      },
    });

    if (!venta) {
      throw new NotFoundException(`La venta web ${id} no existe`);
    }

    return venta;
  }

  async actualizarEstado(id: number, nuevoEstado: EstadoWeb) {
    if (
      nuevoEstado !== EstadoWeb.EN_CAMINO &&
      nuevoEstado !== EstadoWeb.ENTREGADO
    ) {
      throw new BadRequestException(
        'Este endpoint solo permite enviar o entregar pedidos',
      );
    }

    const venta = await this.prisma.ventasWeb.findUnique({
      where: { id },
      select: {
        id: true,
        estadoweb: true,
        estado_pago: true,
      },
    });

    if (!venta) {
      throw new NotFoundException(`La venta web ${id} no existe`);
    }

    if (venta.estado_pago !== 'PAGADO') {
      throw new BadRequestException('El pedido debe tener el pago confirmado');
    }

    const transicionValida =
      (venta.estadoweb === EstadoWeb.PAGADO &&
        nuevoEstado === EstadoWeb.EN_CAMINO) ||
      (venta.estadoweb === EstadoWeb.EN_CAMINO &&
        nuevoEstado === EstadoWeb.ENTREGADO);

    if (!transicionValida) {
      throw new BadRequestException(
        `No se permite cambiar de ${venta.estadoweb} a ${nuevoEstado}`,
      );
    }

    // Actualización condicional para impedir que dos solicitudes
    // avancen simultáneamente desde el mismo estado.
    const resultado = await this.prisma.ventasWeb.updateMany({
      where: {
        id,
        estadoweb: venta.estadoweb,
        estado_pago: 'PAGADO',
      },
      data: {
        estadoweb: nuevoEstado,
      },
    });

    if (resultado.count === 0) {
      throw new BadRequestException(
        'El pedido cambió de estado. Actualiza e inténtalo de nuevo.',
      );
    }

    return this.prisma.ventasWeb.findUnique({
      where: { id },
      select: {
        id: true,
        fecha: true,
        estadoweb: true,
        estado_pago: true,
      },
    });
  }

  async obtenerMisPedidos(userId: number) {
    return this.prisma.ventasWeb.findMany({
      where: {
        id_usuario: userId,
      },

      select: {
        id: true,
        fecha: true,
        total: true,
        estadoweb: true,
        estado_pago: true,
        estado: true,

        detallesventaweb: {
          select: {
            id: true,
            cantidadArticulos: true,
            subtotal: true,

            articulo: {
              select: {
                id: true,
                nombre: true,
              },
            },
          },
        },
      },

      orderBy: {
        fecha: 'desc',
      },
    });
  }

  async obtenerMiPedidoPorId(id: number, userId: number) {
    const pedido = await this.prisma.ventasWeb.findFirst({
      where: {
        id,
        id_usuario: userId,
      },

      select: {
        id: true,
        fecha: true,
        total: true,
        estadoweb: true,
        estado_pago: true,
        estado: true,

        detallesventaweb: {
          select: {
            id: true,
            cantidadArticulos: true,
            cantidadDevuelta: true,
            subtotal: true,

            articulo: {
              select: {
                id: true,
                nombre: true,
              },
            },
          },
        },
      },
    });

    if (!pedido) {
      throw new NotFoundException(`No se encontró el pedido ${id}`);
    }

    return pedido;
  }
}
