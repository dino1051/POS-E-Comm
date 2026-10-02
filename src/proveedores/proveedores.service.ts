import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateProveedorDto } from './dto/create-proveedor.dto.js';
import { UpdateProveedorDto } from './dto/update-proveedor.dto.js';

@Injectable()
export class ProveedoresService {
  constructor(private readonly prisma: PrismaService) {}

  async findProveedorByName(nombre: string) {
    return await this.prisma.proveedores.findFirst({
      where: {
        nombre: {
          equals: nombre,
          mode: 'insensitive',
        },
      },
    });
  }

  async createProveedor(createProveedorDto: CreateProveedorDto) {
    const existe = await this.findProveedorByName(createProveedorDto.nombre);
    if (existe) {
      throw new ConflictException('Ya existe una categoria con ese nombre');
    }
    return await this.prisma.proveedores.create({
      data: {
        nombre: createProveedorDto.nombre,
        email: createProveedorDto.email,
        telefono: createProveedorDto.telefono,
      },
    });
  }
  async findAllProveedores() {
    return await this.prisma.proveedores.findMany({ orderBy: { id: 'asc' } });
  }
  async updateProveedor(id: number, updateProveedorDto: UpdateProveedorDto) {
    return await this.prisma.proveedores.update({
      where: { id },
      data: updateProveedorDto,
    });
  }
  async findOneProveedor(id: number) {
    const proveedor = await this.prisma.proveedores.findUnique({
      where: { id },
    });
    if (!proveedor) {
      throw new NotFoundException(`proveedor de ID: ${id} no encontrado`);
    }
    return proveedor;
  }
}
