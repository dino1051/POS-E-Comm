import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class CerrarSesionCajaDto {
  @ApiProperty({
    example: 1650,
    description: 'Efectivo contado físicamente al cerrar la caja',
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  monto_cierre: number;
}
