import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { ProveedoresService } from './proveedores.service.js';
import { CreateProveedorDto } from './dto/create-proveedor.dto.js';
import { UpdateProveedorDto } from './dto/update-proveedor.dto.js';

@Controller('proveedores')
export class ProveedoresController {
  constructor(private readonly proveedorService: ProveedoresService) {}

  @Post()
  create(@Body() createProveedor: CreateProveedorDto) {
    return this.proveedorService.createProveedor(createProveedor);
  }

  @Get()
  findAllProveedores() {
    return this.proveedorService.findAllProveedores();
  }

  @Get(':id')
  findOneProveedor(@Param('id') id: string) {
    return this.proveedorService.findOneProveedor(+id);
  }
  @Patch(':id')
  updateProveedor(
    @Param('id') id: string,
    @Body() updateProveedorDto: UpdateProveedorDto,
  ) {
    return this.proveedorService.updateProveedor(+id, updateProveedorDto);
  }
}
