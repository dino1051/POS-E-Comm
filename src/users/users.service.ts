import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import bcrypt from 'bcryptjs';
import { Role } from '../generated/prisma/enums.js';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const existe = await this.findByEmail(createUserDto.email);
    if (existe) {
      throw new ConflictException('ya existe un usuario con ese email');
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    return await this.prisma.user.create({
      data: {
        nombre: createUserDto.nombre,
        apellido: createUserDto.apellido,
        email: createUserDto.email,
        password: hashedPassword,
        role: createUserDto.role ?? Role.CLIENTEWEB,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        creadoEn: true,
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        creadoEn: true,
      },
    });
    if (!user) {
      throw new NotFoundException(`usuario de ID: ${id} no encontrado`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`usuario de ID: ${id} no encontrado`);
    }
    return await this.prisma.user.delete({
      where: { id },
    });
  }
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
}
