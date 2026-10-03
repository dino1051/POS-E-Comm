import { IsInt, IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AbrirSesionCajaDto {
  @IsInt()
  @IsPositive()
  @ApiProperty({
    example: 4,
    description: 'El ID del POS el cual tendrá la sesión',
  })
  id_pos: number;
  @IsInt()
  @IsPositive()
  @ApiProperty({
    example: 4,
    description: 'El ID del cajero asignado a esta sesión de caja',
  })
  id_cajero: number;
  @IsNumber()
  @IsPositive()
  @ApiProperty({
    example: 500,
    description: 'El monto inicial de efectivo en la sesión de caja',
  })
  monto_inicial: number;
}
