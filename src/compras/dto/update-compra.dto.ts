import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateCompraDto } from './create-compra.dto.js';

export class UpdateCompraDto extends PartialType(
  OmitType(CreateCompraDto, ['id_proveedor'] as const),
) {}
