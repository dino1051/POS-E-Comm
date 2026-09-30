import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { VentasService } from './ventas.service.js';
import { CreateVentaDto } from './dto/create-venta.dto.js';
import { DevolucionVentaDto } from './dto/create-devolucion.dto.js';

@Controller('ventas')
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  @Post()
  create(@Body() createVentaDto: CreateVentaDto) {
    return this.ventasService.createVenta(createVentaDto);
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
