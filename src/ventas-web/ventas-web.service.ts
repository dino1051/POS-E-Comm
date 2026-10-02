import {
  BadGatewayException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateVentaWebDto } from './dto/create-ventaweb.dto.js';

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

    if (!response.ok) {
      const errorBody = await response.text();

      console.error('Error de MockPay:', {
        status: response.status,
        statusText: response.statusText,
        body: errorBody,
      });

      throw new BadGatewayException(
        `MockPay respondió con HTTP ${response.status}`,
      );
    }

    const pago: {
      id: string;
      checkout_url: string;
    } = await response.json();

    if (!pago.id || !pago.checkout_url) {
      throw new BadGatewayException(
        'MockPay devolvió una respuesta incompleta',
      );
    }

    return pago;
  }
}
