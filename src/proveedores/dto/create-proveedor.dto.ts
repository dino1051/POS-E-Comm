import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProveedorDto {
  @ApiProperty({
    example: 'GAMESA',
    description: 'el nombre del proveedor a ser creado',
  })
  @IsString({ message: 'el nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'el nombre es obligatorio' })
  @MinLength(2, { message: 'El nombre debe tener almenos 2 caracteres' })
  @Matches(/\S/, {
    message: 'El nombre  no puede contener solo espacios',
  })
  nombre: string;
  @ApiProperty({
    example: 'ventas@gamesa.com',
    description: 'el correo del proveedor a ser creado',
  })
  @IsEmail({}, { message: 'el email debe estar en el formato correcto' })
  @IsNotEmpty({ message: 'el email es obligatorio' })
  email: string;
  @ApiProperty({
    example: 'Galletas emperador chocolate presentacion 110gr',
    description: 'la descripción del artículo a ser creado',
  })
  @ApiProperty({
    example: '55662233',
    description: 'el telefono del proveedor a ser creado',
  })
  @IsString({ message: 'el telefono debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'el telefono es obligatorio' })
  @MinLength(2, { message: 'el telefono debe tener almenos 2 caracteres' })
  @Matches(/\S/, {
    message: 'el telefono  no puede contener solo espacios',
  })
  telefono: string;
}
