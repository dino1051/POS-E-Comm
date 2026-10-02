import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreatePosDto } from './dto/create-pos.dto.js';

@Injectable()
export class PosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPosDto: CreatePosDto) {
    return this.prisma.pos.create({
      data: createPosDto,
    });
  }

  async findAll() {
    return this.prisma.pos.findMany({
      orderBy: {
        numero: 'asc',
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.pos.findUnique({
      where: { id },
    });
  }

  async delete(id: number) {
    return this.prisma.pos.delete({ where: { id } });
  }
}
