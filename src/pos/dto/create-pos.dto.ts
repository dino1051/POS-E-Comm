import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePosDto {
  @IsInt()
  @IsPositive()
  @ApiProperty({
    example: 3050,
    description: 'El número del POS a ser creado',
  })
  numero: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Pos 3050 Suc 03',
    description: 'El nombre del POS a ser creado',
  })
  nombre?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    example: true,
    description: 'El estado del POS',
  })
  activo?: boolean;
}
