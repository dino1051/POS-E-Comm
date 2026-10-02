import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsPositive,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { Pagos } from '../../generated/prisma/enums.js';

export class CreateDetalleVentaDto {
  @IsInt()
  @IsPositive()
  id_articulo: number;

  @IsInt()
  @IsPositive()
  cantidadArticulos: number;
}

export class CreateVentaDto {
  @IsEnum(Pagos)
  tipo_pago: Pagos;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDetalleVentaDto)
  detalles: CreateDetalleVentaDto[];
}
