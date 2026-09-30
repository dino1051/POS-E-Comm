import { PartialType } from '@nestjs/swagger';
import { CreateArticuloDto } from './create-articulo.dto.js';

export class UpdateArticuloDto extends PartialType(CreateArticuloDto) {}
