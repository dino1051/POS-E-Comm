import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsPositive,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Pagos } from '../../generated/prisma/enums.js';

export class CreateDetalleVentaWebDto {
  @IsInt()
  @IsPositive()
  id_articulo: number;

  @IsInt()
  @IsPositive()
  cantidadArticulos: number;
}

export class CreateVentaWebDto {
  @IsArray()
  @ArrayMinSize(1)
  @ApiProperty({
    example: 'EFECTIVO',
    description: 'Método de pago (EFECTIVO, TARJETA, TRANSFERENCIAQR)',
  })
  tipo_pago: Pagos;
  @ApiProperty({
    type: [CreateDetalleVentaWebDto],
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
    description: 'Lista de artículos incluidos en la ventaWeb',
  })
  @ValidateNested({ each: true })
  @Type(() => CreateDetalleVentaWebDto)
  detalles: CreateDetalleVentaWebDto[];
}
