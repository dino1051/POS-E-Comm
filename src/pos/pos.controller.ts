import {
  UseGuards,
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
} from '@nestjs/common';
import { PosService } from './pos.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Role } from '../generated/prisma/enums.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CreatePosDto } from './dto/create-pos.dto.js';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('pos')
export class PosController {
  constructor(private readonly posService: PosService) {}

  @Post()
  abrir(@Body() createPosDto: CreatePosDto) {
    return this.posService.create(createPosDto);
  }

  @Get()
  findAll() {
    return this.posService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.posService.findOne(Number(id));
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.posService.delete(Number(id));
  }
}
