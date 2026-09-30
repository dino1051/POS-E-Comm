import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
  IsOptional,
  IsEnum,
} from 'class-validator';

import { Role } from '../../generated/prisma/enums.js';
import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDto {
  @ApiProperty({
    example: 'Juan',
    description: 'el nombre del usuario a ser creado',
  })
  @IsString({ message: 'el nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'el nombre es obligatorio' })
  @MinLength(2, { message: 'El nombre debe tener almenos 2 caracteres' })
  @Matches(/\S/, {
    message: 'El nombre  no puede contener solo espacios',
  })
  nombre: string;
  @ApiProperty({
    example: 'Perez',
    description: 'el apellido del usuario a ser creado',
  })
  @IsString({ message: 'el apellido debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'el apellido es obligatorio' })
  @MinLength(2, { message: 'El apellido debe tener almenos 2 caracteres' })
  @Matches(/\S/, {
    message: 'El apellido  no puede contener solo espacios',
  })
  apellido: string;
  @ApiProperty({
    example: 'juanfunval@gmail.com',
    description: 'el correo del usuario a ser creado',
  })
  @IsEmail({}, { message: 'el email debe estar en el formato correcto' })
  @IsNotEmpty({ message: 'el email es obligatorio' })
  email: string;
  @ApiProperty({
    example: 'A1C2B3',
    description: 'la contraseña del usuario a ser creado',
  })
  @IsString({ message: 'password debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'password es obligatorio' })
  @MinLength(6, { message: 'la contraseña debe tener almenos 6 caracteres' })
  @Matches(/\S/, {
    message: 'La contraseña no puede contener solo espacios',
  })
  password: string;
  @ApiProperty({
    example: 'Calle 13, La Quebrada, Cuautitlan Izcalli, México, México',
    description: 'la dirección del usuario a ser creado',
  })
  @IsString({ message: 'la dirección debe ser una cadena de texto' })
  @MinLength(2, { message: 'la dirección debe tener almenos 2 caracteres' })
  @Matches(/\S/, {
    message: 'la dirección  no puede contener solo espacios',
  })
  @IsOptional()
  direccion?: string;
  @ApiProperty({
    example: 'ADMIN',
    description: 'el ROL del usuario a ser creado',
  })
  @IsOptional()
  @IsEnum(Role, { message: 'El rol debe ser ADMIN o CAJERO o CLIENTEWEB' })
  role?: Role;
}
