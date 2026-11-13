import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { EstadoWeb } from '../../generated/prisma/enums.js';

export class ActualizarEstadoWebDto {
  @ApiProperty({
    enum: EstadoWeb,
    example: EstadoWeb.EN_CAMINO,
  })
  @IsEnum(EstadoWeb)
  estado: EstadoWeb;
}
