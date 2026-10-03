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
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiTags('POS')
@Controller('pos')
export class PosController {
  constructor(private readonly posService: PosService) {}

  @ApiOperation({
    summary: 'Crear un nuevo POS',
    description: 'Crear un nuevo POS.',
  })
  @ApiResponse({
    status: 201,
    description: 'POS creado correctamente.',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado.',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflicto encontrado.',
  })
  @Post()
  abrir(@Body() createPosDto: CreatePosDto) {
    return this.posService.create(createPosDto);
  }

  @ApiOperation({
    summary: 'Lista todos los POS',
    description: 'Lista Todos los POS.',
  })
  @Get()
  findAll() {
    return this.posService.findAll();
  }

  @ApiOperation({
    summary: 'Lista un POS',
    description: 'Lista un POS con su ID.',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado.',
  })
  @ApiResponse({
    status: 404,
    description: 'ID de POS no encontrado.',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.posService.findOne(Number(id));
  }
}
