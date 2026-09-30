import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateVentaDto } from './create-venta.dto.js';

export class UpdateVentaDto extends PartialType(
  OmitType(CreateVentaDto, ['id_usuario'] as const),
) {}
