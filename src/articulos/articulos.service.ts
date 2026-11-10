import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateArticuloDto } from './dto/create-articulo.dto.js';
import { UpdateArticuloDto } from './dto/update-articulo.dto.js';

@Injectable()
export class ArticulosService {
  constructor(private readonly prisma: PrismaService) {}

  async findArticuloByName(nombre: string) {
    return await this.prisma.articulos.findFirst({
      where: {
        nombre: {
          equals: nombre,
          mode: 'insensitive',
        },
      },
    });
  }

  async findByStock(Max: string) {
    const stockMax = Number(Max);

    if (!Number.isInteger(stockMax) || stockMax < 0 || Max.trim() === '') {
      throw new BadRequestException(
        'El stock máximo debe ser un número entero no negativo',
      );
    }

    return this.prisma.articulos.findMany({
      where: {
        stock: {
          lte: stockMax,
        },
      },
      select: {
        id: true,
        nombre: true,
        stock: true,
        precioVenta: true,
        precioCompra: true,
        categoria: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
      orderBy: { stock: 'asc' },
    });
  }

  async createArticulo(createArticuloDto: CreateArticuloDto) {
    const existe = await this.findArticuloByName(createArticuloDto.nombre);
    if (existe) {
      throw new ConflictException('Ya existe un artículo con ese nombre');
    }
    return await this.prisma.articulos.create({
      data: {
        nombre: createArticuloDto.nombre,
        descripcion: createArticuloDto.descripcion,
        stock: createArticuloDto.stock,
        precioVenta: createArticuloDto.precioVenta,
        precioCompra: createArticuloDto.precioCompra,
        id_categoria: createArticuloDto.id_categoria,
      },
    });
  }

  async findAllArticulos() {
    return this.prisma.articulos.findMany({
      select: {
        id: true,
        nombre: true,
        descripcion: true,
        stock: true,
        precioVenta: true,
        id_categoria: true,
        categoria: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
      orderBy: { id: 'asc' },
    });
  }

  async updateArticulo(id: number, updateArticuloDto: UpdateArticuloDto) {
    return await this.prisma.articulos.update({
      where: { id },
      data: updateArticuloDto,
    });
  }

  async findOneArticulo(id: number) {
    const articulo = await this.prisma.articulos.findUnique({
      where: { id },
      select: {
        id: true,
        nombre: true,
        descripcion: true,
        stock: true,
        precioVenta: true,
        id_categoria: true,
        creadoEn: true,
        categoria: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
    });

    if (!articulo) {
      throw new NotFoundException(`Artículo de ID: ${id} no encontrado`);
    }

    return articulo;
  }

  async findAllAdmin() {
    return this.prisma.articulos.findMany({
      select: {
        id: true,
        nombre: true,
        descripcion: true,
        stock: true,
        precioVenta: true,
        precioCompra: true,
        id_categoria: true,
        creadoEn: true,
        categoria: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
      orderBy: { id: 'asc' },
    });
  }

  async removeArticulo(id: number) {
    const articulo = await this.prisma.articulos.findUnique({
      where: { id },
    });
    if (!articulo) {
      throw new NotFoundException(`articulo de ID: ${id} no encontrado`);
    }
    return await this.prisma.articulos.delete({
      where: { id },
    });
  }
}
