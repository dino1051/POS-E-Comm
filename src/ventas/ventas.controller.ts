import { Body, Controller, Post, Get, Param, Query } from '@nestjs/common';
import { VentasService } from './ventas.service.js';
import { CreateVentaDto } from './dto/create-venta.dto.js';
import { DevolucionVentaDto } from './dto/create-devolucion.dto.js';
import { UseGuards } from '@nestjs/common';
import type { AuthUser } from '../auth/interfaces/auth-user.interface.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../generated/prisma/enums.js';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.CAJERO)
@ApiTags('Ventas')
@Controller('ventas')
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  @Roles(Role.CAJERO)
  @ApiOperation({
    summary: 'Crear una nueva venta',
    description: 'Crear una nueva venta',
  })
  @ApiResponse({
    status: 201,
    description: 'Venta creada correctamente.',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado.',
  })
  @Post()
  create(
    @Body() createVentaDto: CreateVentaDto,
    @CurrentUser() user: AuthUser,
  ) {
    const id = user.userId;
    return this.ventasService.createVenta(createVentaDto, id);
  }

  @ApiOperation({
    summary: 'Reporte Mensual ',
    description: 'Permite generar un reporte mensual de ventas.',
  })
  @ApiQuery({
    name: 'mes',
    required: true,
    example: 9,
    description: 'Busca ventas del mes y año ingresado',
  })
  @ApiQuery({
    name: 'anio',
    required: true,
    example: 2026,
    description: 'Busca ventas del mes y año ingresado',
  })
  @Roles(Role.ADMIN)
  @Get('reporte-mensual')
  reporteMensual(@Query('mes') mes: string, @Query('anio') anio: string) {
    return this.ventasService.reporteMensual(+mes, +anio);
  }

  @ApiOperation({
    summary: 'Lista las ventas del cajero logeado',
    description: 'Lista las ventas del cajero logeado',
  })
  @Roles(Role.CAJERO)
  @Get('misventas')
  findMine(@CurrentUser() user: AuthUser) {
    const id = user.userId;
    return this.ventasService.findMisVentas(id);
  }

  @ApiOperation({
    summary: 'Lista todas las ventas',
    description: 'Lista todas las ventas',
  })
  @Roles(Role.ADMIN)
  @Get()
  findAll() {
    return this.ventasService.findAllVentas();
  }

  @ApiOperation({
    summary: 'Lista una venta',
    description: 'Lista una venta con su ID.',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado.',
  })
  @ApiResponse({
    status: 404,
    description: 'ID de venta no encontrado.',
  })
  @Roles(Role.ADMIN)
  @Get(':id')
  findVenta(@Param('id') id: string) {
    return this.ventasService.findVenta(+id);
  }

  @ApiOperation({
    summary: 'Cancela una venta',
    description: 'Cancela una venta con su ID.',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado.',
  })
  @ApiResponse({
    status: 404,
    description: 'ID de venta no encontrado.',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflicto encontrado.',
  })
  @Roles(Role.ADMIN)
  @Post(':id/cancelar')
  cancelar(@Param('id') id: string) {
    return this.ventasService.cancelar(+id);
  }

  @ApiOperation({
    summary: 'Realiza una devolucion a venta',
    description: 'Realiza una devolucion a una venta con su ID.',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado.',
  })
  @ApiResponse({
    status: 404,
    description: 'ID de venta no encontrado.',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflicto encontrado.',
  })
  @Post(':id/devolucion')
  devolucion(
    @Param('id') id: string,
    @Body() devolucionVentaDto: DevolucionVentaDto,
  ) {
    return this.ventasService.devolver(+id, devolucionVentaDto);
  }
}
