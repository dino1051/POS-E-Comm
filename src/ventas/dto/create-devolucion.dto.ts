import { IsArray, IsInt, IsPositive, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class DevolucionDetalleDto {
  @IsInt()
  @IsPositive()
  id_detalle: number;

  @IsInt()
  @IsPositive()
  cantidad: number;
}

export class DevolucionVentaDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DevolucionDetalleDto)
  detalles: DevolucionDetalleDto[];
}
