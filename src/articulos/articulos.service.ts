import {
  ConflictException,
  Injectable,
  NotFoundException,
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

  async createArticulo(createArticuloDto: CreateArticuloDto) {
    const existe = await this.findArticuloByName(createArticuloDto.nombre);
    if (existe) {
      throw new ConflictException('Ya existe una categoria con ese nombre');
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
    return await this.prisma.articulos.findMany({ orderBy: { id: 'asc' } });
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
    });
    if (!articulo) {
      throw new NotFoundException(`articulo de ID: ${id} no encontrado`);
    }
    return articulo;
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
