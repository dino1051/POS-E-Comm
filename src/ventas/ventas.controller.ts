import { Body, Controller, Post, Get, Param, Query } from '@nestjs/common';
import { VentasService } from './ventas.service.js';
import { CreateVentaDto } from './dto/create-venta.dto.js';
import { DevolucionVentaDto } from './dto/create-devolucion.dto.js';
import { UseGuards } from '@nestjs/common';
import type { AuthUser } from '../auth/interfaces/auth-user.interface.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

@Controller('ventas')
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createVentaDto: CreateVentaDto,
    @CurrentUser() user: AuthUser,
  ) {
    const id = user.userId;
    return this.ventasService.createVenta(createVentaDto, id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('reporte-mensual')
  reporteMensual(@Query('mes') mes: string, @Query('anio') anio: string) {
    return this.ventasService.reporteMensual(+mes, +anio);
  }

  @UseGuards(JwtAuthGuard)
  @Get('mispedidos')
  findMine(@CurrentUser() user: AuthUser) {
    const id = user.userId;
    return this.ventasService.findMisVentas(id);
  }

  @Get()
  findAll() {
    return this.ventasService.findAllVentas();
  }

  @Get(':id')
  findVenta(@Param('id') id: string) {
    return this.ventasService.findVenta(+id);
  }

  @Post(':id/cancelar')
  cancelar(@Param('id') id: string) {
    return this.ventasService.cancelar(+id);
  }

  @Post(':id/devolucion')
  devolucion(
    @Param('id') id: string,
    @Body() devolucionVentaDto: DevolucionVentaDto,
  ) {
    return this.ventasService.devolver(+id, devolucionVentaDto);
  }
}
