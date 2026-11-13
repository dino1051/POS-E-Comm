import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { VentasWebService } from './ventas-web.service.js';
import { CreateVentaWebDto } from './dto/create-ventaweb.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { AuthUser } from '../auth/interfaces/auth-user.interface.js';
import { ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../generated/prisma/enums.js';
import { ActualizarEstadoWebDto } from './dto/update-estado-web.dto.js';

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

  @ApiOperation({
    summary: 'Lista todas las ventas web',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  obtenerTodas() {
    return this.ventasWebService.obtenerTodas();
  }

  @ApiOperation({
    summary: 'Obtiene los pedidos del cliente autenticado',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CLIENTEWEB)
  @Get('mis-pedidos')
  obtenerMisPedidos(@CurrentUser() user: AuthUser) {
    return this.ventasWebService.obtenerMisPedidos(user.userId);
  }

  @ApiOperation({
    summary: 'Obtiene un pedido del cliente autenticado',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.CLIENTEWEB)
  @Get('mis-pedidos/:id')
  obtenerMiPedidoPorId(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthUser,
  ) {
    return this.ventasWebService.obtenerMiPedidoPorId(id, user.userId);
  }

  @ApiOperation({
    summary: 'Obtiene una venta web por ID',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get(':id')
  obtenerPorId(@Param('id', ParseIntPipe) id: number) {
    return this.ventasWebService.obtenerPorId(id);
  }

  @ApiOperation({
    summary: 'Actualiza el estado de entrega de un pedido web',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id/estado')
  actualizarEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ActualizarEstadoWebDto,
  ) {
    return this.ventasWebService.actualizarEstado(id, dto.estado);
  }
}
