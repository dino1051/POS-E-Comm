import { IsArray, IsInt, IsPositive, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Pagos } from '../../generated/prisma/enums.js';

export class DevolucionDetalleDto {
  @IsInt()
  @IsPositive()
  id_detalle: number;

  @IsInt()
  @IsPositive()
  cantidad: number;
}

export class DevolucionVentaDto {
  @ApiProperty({
    example: 'EFECTIVO',
    description: 'Método de Pago (EFECTIVO, TARJETA, TRANSFERENCIAQR)',
  })
  tipo_pago: Pagos;
  @ApiProperty({
    type: [DevolucionDetalleDto],
    example: [
      {
        id_detalle: 1,
        cantidad: 2,
      },
      {
        id_detalle: 2,
        cantidad: 1,
      },
    ],
    description: 'Lista de artículos incluidos en la devolución',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DevolucionDetalleDto)
  detalles: DevolucionDetalleDto[];
}
