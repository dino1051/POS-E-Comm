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
    description: 'El nombre del proveedor a ser creado',
  })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MinLength(2, { message: 'El nombre debe tener almenos 2 caracteres' })
  @Matches(/\S/, {
    message: 'El nombre  no puede contener solo espacios',
  })
  nombre: string;
  @ApiProperty({
    example: 'ventas@gamesa.com',
    description: 'El correo del proveedor a ser creado',
  })
  @IsEmail({}, { message: 'El email debe estar en el formato correcto' })
  @IsNotEmpty({ message: 'El email es obligatorio' })
  email: string;
  @ApiProperty({
    example: '55662233',
    description: 'El teléfono del proveedor a ser creado',
  })
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El teléfono es obligatorio' })
  @MinLength(2, { message: 'El teléfono debe tener almenos 2 caracteres' })
  @Matches(/\S/, {
    message: 'El teléfono  no puede contener solo espacios',
  })
  telefono: string;
}
