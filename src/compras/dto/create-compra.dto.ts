import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsPositive,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { Pagos } from '../../generated/prisma/enums.js';

export class CreateDetalleCompraDto {
  @IsInt()
  @IsPositive()
  id_articulo: number;

  @IsInt()
  @IsPositive()
  cantidadArticulos: number;
}

export class CreateCompraDto {
  @IsInt()
  @IsPositive()
  id_proveedor: number;
  @IsEnum(Pagos)
  tipo_pago: Pagos;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDetalleCompraDto)
  detalles: CreateDetalleCompraDto[];
}
