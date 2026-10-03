import { Controller, UseGuards, Post, Param, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../generated/prisma/enums.js';
import { AbrirSesionCajaDto } from './dto/create-sesion-caja.dto.js';
import { SesionesCajaService } from './sesiones-caja.service.js';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiTags('Sesiones Caja')
@Controller('sesiones-caja')
export class SesionesCajaController {
  constructor(private readonly sesionesCajaService: SesionesCajaService) {}

  @ApiOperation({
    summary: 'Crear una nueva sesión de caja',
    description: 'Crear una nueva sesión de caja.',
  })
  @ApiResponse({
    status: 201,
    description: 'Sesión de caja creada correctamente.',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado.',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflicto encontrado.',
  })
  @Post('abrir')
  abrir(@Body() abrirSesionCajaDto: AbrirSesionCajaDto) {
    return this.sesionesCajaService.abrir(abrirSesionCajaDto);
  }

  @ApiOperation({
    summary: 'Cerrar una sesión de caja',
    description: 'Cerrar una sesión de caja.',
  })
  @ApiResponse({
    status: 201,
    description: 'Sesión de caja cerrada correctamente.',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado.',
  })
  @Post(':id/cerrar')
  cerrar(@Param('id') id: string) {
    return this.sesionesCajaService.cerrar(Number(id));
  }
}
