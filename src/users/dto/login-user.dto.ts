import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    example: 'juanfunval@gmail.com',
    description: 'El correo del usuario a ser creado',
  })
  @IsEmail({}, { message: 'El email debe estar en el formato correcto' })
  @IsNotEmpty({ message: 'El email es obligatorio' })
  email: string;
  @ApiProperty({
    example: 'A1C2B3',
    description: 'la contraseña del usuario a ser creado',
  })
  @IsString({ message: 'El password debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El password es obligatorio' })
  @MinLength(6, { message: 'la contraseña debe tener almenos 6 caracteres' })
  @Matches(/\S/, {
    message: 'La contraseña no puede contener solo espacios',
  })
  password: string;
}
