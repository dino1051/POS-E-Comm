import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ProveedoresService } from './proveedores.service.js';
import { CreateProveedorDto } from './dto/create-proveedor.dto.js';
import { UpdateProveedorDto } from './dto/update-proveedor.dto.js';
import {
  ApiBearerAuth,
  ApiTags,
  ApiResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../generated/prisma/enums.js';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiTags('Proveedores')
@Controller('proveedores')
export class ProveedoresController {
  constructor(private readonly proveedorService: ProveedoresService) {}

  @ApiOperation({
    summary: 'Crear un nuevo proveedor',
    description: 'Crear un nuevo proveedor.',
  })
  @ApiResponse({
    status: 201,
    description: 'Proveedor creado correctamente.',
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
  create(@Body() createProveedor: CreateProveedorDto) {
    return this.proveedorService.createProveedor(createProveedor);
  }

  @ApiOperation({
    summary: 'Lista todos los proveedores',
    description: 'Lista Todos los proveedores.',
  })
  @Get()
  findAllProveedores() {
    return this.proveedorService.findAllProveedores();
  }

  @ApiOperation({
    summary: 'Lista un proveedor',
    description: 'Lista un proveedor con su ID.',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado.',
  })
  @ApiResponse({
    status: 404,
    description: 'ID de proveedor no encontrado.',
  })
  @Get(':id')
  findOneProveedor(@Param('id') id: string) {
    return this.proveedorService.findOneProveedor(+id);
  }

  @ApiOperation({
    summary: 'Modifica un proveedor',
    description: 'Modifica un proveedor con su ID.',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado.',
  })
  @ApiResponse({
    status: 404,
    description: 'ID de proveedor no encontrado.',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflicto encontrado.',
  })
  @Patch(':id')
  updateProveedor(
    @Param('id') id: string,
    @Body() updateProveedorDto: UpdateProveedorDto,
  ) {
    return this.proveedorService.updateProveedor(+id, updateProveedorDto);
  }
}
