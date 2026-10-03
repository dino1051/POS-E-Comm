import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateCategoriaDto } from '../categorias/dto/update-categoria.dto.js';
import { CreateCategoriaDto } from '../categorias/dto/create-categoria.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class CategoriasService {
  constructor(private readonly prisma: PrismaService) {}

  async findCategoriaByName(nombre: string) {
    return await this.prisma.categorias.findFirst({
      where: {
        nombre: {
          equals: nombre,
          mode: 'insensitive',
        },
      },
    });
  }

  async findByQuery(nombre: string) {
    return this.prisma.articulos.findMany({
      where: {
        categoria: {
          nombre: {
            startsWith: nombre,
            mode: 'insensitive',
          },
        },
      },
      include: {
        categoria: true,
      },
    });
  }

  async createCategoria(createCategoriaDto: CreateCategoriaDto) {
    const existe = await this.findCategoriaByName(createCategoriaDto.nombre);
    if (existe) {
      throw new ConflictException('Ya existe una categoria con ese nombre');
    }
    return await this.prisma.categorias.create({
      data: {
        nombre: createCategoriaDto.nombre,
      },
    });
  }

  async findAllCategorias() {
    return await this.prisma.categorias.findMany({ orderBy: { id: 'asc' } });
  }

  async updateCategoria(id: number, updateCategoriaDto: UpdateCategoriaDto) {
    return await this.prisma.categorias.update({
      where: { id },
      data: updateCategoriaDto,
    });
  }

  async findOneCategoria(id: number) {
    const categoria = await this.prisma.categorias.findUnique({
      where: { id },
    });
    if (!categoria) {
      throw new NotFoundException(`categoria de ID: ${id} no encontrado`);
    }
    return categoria;
  }

  async removeCategoria(id: number) {
    const categoria = await this.prisma.categorias.findUnique({
      where: { id },
    });
    if (!categoria) {
      throw new NotFoundException(`categoria de ID: ${id} no encontrada`);
    }
    return await this.prisma.categorias.delete({
      where: { id },
    });
  }
}
