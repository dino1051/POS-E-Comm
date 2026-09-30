import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { CategoriasService } from './categorias.service.js';
import { CreateCategoriaDto } from './dto/create-categoria.dto.js';
import { UpdateCategoriaDto } from './dto/update-categoria.dto.js';

@Controller('categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  @Post()
  createCategoria(@Body() createCategoria: CreateCategoriaDto) {
    return this.categoriasService.createCategoria(createCategoria);
  }

  @Get()
  findAllCategorias() {
    return this.categoriasService.findAllCategorias();
  }

  @Get(':id')
  findOneCategoria(@Param('id') id: string) {
    return this.categoriasService.findOneCategoria(+id);
  }
  @Patch(':id')
  updateCategoria(
    @Param('id') id: string,
    @Body() updateCategoriaDto: UpdateCategoriaDto,
  ) {
    return this.categoriasService.updateCategoria(+id, updateCategoriaDto);
  }

  @Delete('id')
  removeCategoria(@Param('id') id: string) {
    return this.categoriasService.removeCategoria(+id);
  }

  @Get('buscar')
  findByName(@Query('nombre') nombre: string) {
    return this.categoriasService.findByQuery(nombre);
  }
}
