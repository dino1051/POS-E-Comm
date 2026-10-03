import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsPositive,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { Pagos } from '../../generated/prisma/enums.js';
import { ApiProperty } from '@nestjs/swagger';

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
  @ApiProperty({
    example: 3,
    description: 'ID del proveedor',
  })
  id_proveedor: number;
  @IsEnum(Pagos)
  @ApiProperty({
    example: 'EFECTIVO',
    description: 'Método de Pago (EFECTIVO, TARJETA, TRANSFERENCIAQR)',
  })
  tipo_pago: Pagos;
  @ApiProperty({
    type: [CreateDetalleCompraDto],
    example: [
      {
        id_articulo: 1,
        cantidadArticulos: 2,
      },
      {
        id_articulo: 5,
        cantidadArticulos: 1,
      },
    ],
    description: 'Lista de artículos incluidos en la compra',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDetalleCompraDto)
  detalles: CreateDetalleCompraDto[];
}
