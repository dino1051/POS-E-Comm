import {
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
  IsOptional,
  IsPositive,
  IsInt,
  IsIn,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateArticuloDto {
  @ApiProperty({
    example: 'Galletas Emperador 110gr',
    description: 'el nombre del articulo a ser creado',
  })
  @IsString({ message: 'el nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'el nombre es obligatorio' })
  @MinLength(2, { message: 'El nombre debe tener almenos 2 caracteres' })
  @Matches(/\S/, {
    message: 'El nombre  no puede contener solo espacios',
  })
  nombre: string;
  @ApiProperty({
    example: 'Galletas emperador chocolate presentacion 110gr',
    description: 'la descripción del artículo a ser creado',
  })
  @IsString({ message: 'la descripción debe ser una cadena de texto' })
  @MinLength(2, { message: 'la descripción debe tener almenos 2 caracteres' })
  @Matches(/\S/, {
    message: 'la descripción no puede contener solo espacios',
  })
  @IsOptional()
  descripcion?: string;
  @ApiProperty({
    example: 12,
    description: 'el stock inicial del artículo a ser creado',
  })
  @IsInt({ message: 'El stock debe ser un numero entero' })
  @IsPositive({ message: 'el stock debe ser un numero entero positivo' })
  @IsNotEmpty({ message: 'Se debe proporcionar un numero' })
  stock: number;
  @ApiProperty({
    example: 15.3,
    description: 'el precio a la venta del artículo a ser creado',
  })
  @IsPositive({ message: 'el precio a la venta debe ser un numero positivo' })
  @IsNotEmpty({ message: 'Se debe proporcionar un numero' })
  precioVenta: number;
  @ApiProperty({
    example: 12.6,
    description: 'el precio a la compra del artículo a ser creado',
  })
  @IsPositive({ message: 'el precio a la compra debe ser un numero positivo' })
  @IsNotEmpty({ message: 'Se debe proporcionar un numero' })
  precioCompra: number;
  @IsNotEmpty({ message: 'debes proporcionar el id de una categoria' })
  @IsInt({ message: 'el id de la categoria debe ser un entero' })
  @IsPositive({ message: 'el id de la categoria debe ser positivo' })
  id_categoria: number;
}
