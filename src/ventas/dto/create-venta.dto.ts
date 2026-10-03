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
  @ApiProperty({
    example: 'EFECTIVO',
    description: 'Método de pago (EFECTIVO, TARJETA, TRANSFERENCIAQR)',
  })
  tipo_pago: Pagos;
  @ApiProperty({
    type: [CreateDetalleVentaDto],
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
    description: 'Lista de artículos incluidos en la venta',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDetalleVentaDto)
  detalles: CreateDetalleVentaDto[];
}
