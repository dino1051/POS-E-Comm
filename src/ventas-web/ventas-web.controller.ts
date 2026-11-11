import { Body, Controller, Post, UseGuards, Get } from '@nestjs/common';
import { VentasWebService } from './ventas-web.service.js';
import { CreateVentaWebDto } from './dto/create-ventaweb.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { AuthUser } from '../auth/interfaces/auth-user.interface.js';
import { ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../generated/prisma/enums.js';

@Controller('ventas-web')
export class VentasWebController {
  constructor(private readonly ventasWebService: VentasWebService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  crear(@Body() dto: CreateVentaWebDto, @CurrentUser() user: AuthUser) {
    return this.ventasWebService.crear(dto, user.userId);
  }

  @ApiOperation({
    summary: 'Resumen de pedidos web para el Dashboard',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('resumen')
  resumenPedidos() {
    return this.ventasWebService.resumenPedidos();
  }
}
