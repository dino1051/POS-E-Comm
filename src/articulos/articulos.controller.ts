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
import { ArticulosService } from './articulos.service.js';
import { CreateArticuloDto } from './dto/create-articulo.dto.js';
import { UpdateArticuloDto } from './dto/update-articulo.dto.js';

@Controller('articulos')
export class ArticulosController {
  constructor(private readonly articulosService: ArticulosService) {}

  @Post()
  create(@Body() createArticulo: CreateArticuloDto) {
    return this.articulosService.createArticulo(createArticulo);
  }

  @Get()
  findByStock(@Query('Max') Max: string) {
    return this.articulosService.findByStock(Max);
  }

  @Get()
  findAllArticulos() {
    return this.articulosService.findAllArticulos();
  }

  @Get(':id')
  findOneArticulo(@Param('id') id: string) {
    return this.articulosService.findOneArticulo(+id);
  }
  @Patch(':id')
  updateArticulo(
    @Param('id') id: string,
    @Body() updateArticuloDto: UpdateArticuloDto,
  ) {
    return this.articulosService.updateArticulo(+id, updateArticuloDto);
  }

  @Delete('id')
  removeArticulo(@Param('id') id: string) {
    return this.articulosService.removeArticulo(+id);
  }
}
