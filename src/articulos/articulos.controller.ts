import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Patch,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ArticulosService } from './articulos.service.js';
import { CreateArticuloDto } from './dto/create-articulo.dto.js';
import { UpdateArticuloDto } from './dto/update-articulo.dto.js';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../generated/prisma/enums.js';

@ApiTags('Articulos')
@Controller('articulos')
export class ArticulosController {
  constructor(private readonly articulosService: ArticulosService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Crear un artículo',
    description: 'Crea un nuevo artículo.',
  })
  @ApiResponse({
    status: 201,
    description: 'Artículo creado correctamente.',
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
  create(@Body() createArticulo: CreateArticuloDto) {
    return this.articulosService.createArticulo(createArticulo);
  }

  @ApiOperation({
    summary: 'Buscar artículo por cantidad Máxima en stock',
    description: 'Permite filtrar artículos mediante parámetros de consulta.',
  })
  @ApiQuery({
    name: 'Max',
    required: true,
    example: 10,
    description: 'Cantidad máxima de stock',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflicto encontrado.',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @Get('/stock')
  findByStock(@Query('Max') Max: string) {
    return this.articulosService.findByStock(Max);
  }

  @ApiOperation({
    summary: 'Lista todos los artículos',
    description: 'Lista todos los artículos.',
  })
  @Get()
  findAllArticulos() {
    return this.articulosService.findAllArticulos();
  }

  @ApiOperation({
    summary: 'Lista un artículo por ID',
    description: 'Lista un artículo por su ID.',
  })
  @ApiResponse({
    status: 404,
    description: 'No encontrado.',
  })
  @Get(':id')
  findOneArticulo(@Param('id') id: string) {
    return this.articulosService.findOneArticulo(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Modifica un artículo',
    description: 'Modifica un artículo con su ID.',
  })
  @ApiResponse({
    status: 201,
    description: 'Artículo actualizado correctamente.',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado.',
  })
  @ApiResponse({
    status: 404,
    description: 'ID de artículo no encontrado.',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflicto encontrado.',
  })
  @Patch(':id')
  updateArticulo(
    @Param('id') id: string,
    @Body() updateArticuloDto: UpdateArticuloDto,
  ) {
    return this.articulosService.updateArticulo(+id, updateArticuloDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Elimina un artículo',
    description: 'Elimina un artículo con su ID.',
  })
  @ApiResponse({
    status: 201,
    description: 'Artículo eliminado correctamente.',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado.',
  })
  @ApiResponse({
    status: 404,
    description: 'ID de artículo no encontrado.',
  })
  @Delete('id')
  removeArticulo(@Param('id') id: string) {
    return this.articulosService.removeArticulo(+id);
  }
}
