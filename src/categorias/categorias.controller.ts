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
import { CategoriasService } from './categorias.service.js';
import { CreateCategoriaDto } from './dto/create-categoria.dto.js';
import { UpdateCategoriaDto } from './dto/update-categoria.dto.js';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Role } from '../generated/prisma/enums.js';
import { Roles } from '../auth/decorators/roles.decorator.js';

@ApiTags('Categorias')
@Controller('categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Crear una nueva categoría',
    description: 'Crear una nueva categoría.',
  })
  @ApiResponse({
    status: 201,
    description: 'Categoría creada correctamente.',
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
  createCategoria(@Body() createCategoria: CreateCategoriaDto) {
    return this.categoriasService.createCategoria(createCategoria);
  }

  @ApiOperation({
    summary: 'Buscar categoría por su nombre ',
    description: 'Permite filtrar categorías mediante parámetros de consulta.',
  })
  @ApiQuery({
    name: 'nombre',
    required: true,
    example: 'Elect',
    description: 'Buscar articulos por categoria por nombre',
  })
  @Get('buscar')
  findByName(@Query('nombre') nombre: string) {
    return this.categoriasService.findByQuery(nombre);
  }

  @ApiOperation({
    summary: 'Listar todas las categorías',
    description: 'Listar todas las categorías.',
  })
  @Get()
  findAllCategorias() {
    return this.categoriasService.findAllCategorias();
  }

  @ApiOperation({
    summary: 'Lista una categoría por ID',
    description: 'Lista una categoría por su ID.',
  })
  @ApiResponse({
    status: 404,
    description: 'No encontrado.',
  })
  @Get(':id')
  findOneCategoria(@Param('id') id: string) {
    return this.categoriasService.findOneCategoria(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Modifica una categoría',
    description: 'Modifica una categoría con su ID.',
  })
  @ApiResponse({
    status: 201,
    description: 'Categoría actualizada correctamente.',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado.',
  })
  @ApiResponse({
    status: 404,
    description: 'ID de categoría no encontrado.',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflicto encontrado.',
  })
  @Patch(':id')
  updateCategoria(
    @Param('id') id: string,
    @Body() updateCategoriaDto: UpdateCategoriaDto,
  ) {
    return this.categoriasService.updateCategoria(+id, updateCategoriaDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Elimina una categoría',
    description: 'Elimina una categoría con su ID.',
  })
  @ApiResponse({
    status: 201,
    description: 'Categoría eliminada correctamente.',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado.',
  })
  @ApiResponse({
    status: 404,
    description: 'ID de categoría no encontrada.',
  })
  @Delete(':id')
  removeCategoria(@Param('id') id: string) {
    return this.categoriasService.removeCategoria(+id);
  }
}
