import { IsInt, IsNumber, IsPositive } from 'class-validator';

export class AbrirSesionCajaDto {
  @IsInt()
  @IsPositive()
  id_pos: number;
  @IsInt()
  @IsPositive()
  id_cajero: number;
  @IsNumber()
  @IsPositive()
  monto_inicial: number;
}

export class CerrarSesionCajaDto {
  @IsNumber()
  @IsPositive()
  monto_cierre: number;
}
