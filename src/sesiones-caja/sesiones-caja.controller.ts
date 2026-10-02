import { Controller, UseGuards, Post, Param, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../generated/prisma/enums.js';
import {
  AbrirSesionCajaDto,
  CerrarSesionCajaDto,
} from './dto/create-sesion-caja.dto.js';
import { SesionesCajaService } from './sesiones-caja.service.js';

@Controller('sesiones-caja')
export class SesionesCajaController {
  constructor(private readonly sesionesCajaService: SesionesCajaService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('abrir')
  abrir(@Body() abrirSesionCajaDto: AbrirSesionCajaDto) {
    return this.sesionesCajaService.abrir(abrirSesionCajaDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post(':id/cerrar')
  cerrar(
    @Param('id') id: string,
    @Body() cerrarSesionCajaDto: CerrarSesionCajaDto,
  ) {
    return this.sesionesCajaService.cerrar(Number(id));
  }
}
