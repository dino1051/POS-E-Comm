import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCompraDto } from './dto/create-compra.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { UpdateCompraDto } from './dto/update-compra.dto.js';

@Injectable()
export class ComprasService {
  constructor(private readonly prisma: PrismaService) {}

  async createCompra(createCompraDto: CreateCompraDto, idUser: number) {
    return this.prisma.$transaction(async (tx) => {
      let total = 0;

      const detalles = [];

      for (const detalle of createCompraDto.detalles) {
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

        const subtotal =
          Number(articulo.precioCompra) * detalle.cantidadArticulos;

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
              increment: detalle.cantidadArticulos,
            },
          },
        });
      }

      const compra = await tx.compras.create({
        data: {
          id_usuario: idUser,
          tipo_pago: createCompraDto.tipo_pago,
          id_proveedor: createCompraDto.id_proveedor,
          total,

          detallescompra: {
            create: detalles,
          },
        },

        select: {
          fecha: true,
          total: true,
          tipo_pago: true,
          detallescompra: {
            select: {
              cantidadArticulos: true,
              subtotal: true,
              articulo: {
                select: {
                  nombre: true,
                  precioCompra: true,
                },
              },
            },
          },
          usuarios: {
            select: {
              nombre: true,
            },
          },
        },
      });

      return compra;
    });
  }
  async findAll() {
    return await this.prisma.compras.findMany({ orderBy: { id: 'asc' } });
  }
  async findOne(id: number) {
    return await this.prisma.compras.findUnique({
      where: { id },
      omit: {
        id_proveedor: true,
        id_usuario: true,
      },
      include: {
        usuarios: {
          select: {
            nombre: true,
            role: true,
          },
        },
        proveedores: true,
      },
    });
  }

  async update(Dto: UpdateCompraDto, id: number) {
    return this.prisma.$transaction(async (tx) => {
      const compraActual = await tx.compras.findUnique({
        where: { id },
        include: {
          detallescompra: true,
        },
      });

      if (!compraActual) {
        throw new NotFoundException(`La compra ${id} no existe`);
      }

      if (Dto.detalles) {
        let total = 0;

        // 1. Revertir el stock de la compra anterior
        for (const detalle of compraActual.detallescompra) {
          await tx.articulos.update({
            where: {
              id: detalle.id_articulo,
            },
            data: {
              stock: {
                decrement: detalle.cantidadArticulos,
              },
            },
          });
        }

        // 2. Eliminar los detalles anteriores
        await tx.detallesCompra.deleteMany({
          where: {
            id_compra: id,
          },
        });

        // 3. Crear los nuevos detalles y aumentar stock
        const detalles = [];

        for (const detalle of Dto.detalles) {
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

          const subtotal =
            Number(articulo.precioCompra) * detalle.cantidadArticulos;

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
                increment: detalle.cantidadArticulos,
              },
            },
          });
        }

        // 4. Actualizar la compra y crear los nuevos detalles
        return tx.compras.update({
          where: {
            id,
          },
          data: {
            total,

            detallescompra: {
              create: detalles,
            },
          },
          include: {
            detallescompra: true,
          },
        });
      }

      // Si no vienen detalles, solamente actualizamos
      // los campos permitidos de la compra.
      return tx.compras.update({
        where: {
          id,
        },
        data: {
          Dto,
        },
      });
    });
  }
}
