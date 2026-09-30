import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
@Controller('users')
// @ApiBearerAuth('JWT-auth')
// @ApiResponse({
//   status: 401,
//   description: 'no tienes permisos mi kin',
// })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  //   @ApiOperation({ summary: 'crea un nuevo usuario' })
  //   @ApiResponse({
  //     status: 201,
  //     description: 'usuario creado exitosamente ',
  //   })
  //   @ApiResponse({
  //     status: 400,
  //     description: 'mal formato en el cuerpo de la solicitud',
  //   })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  //   @ApiOperation({
  //     summary: 'trae a todos los usuarios solo disponible para un ADMIN',
  //   })
  //   @ApiResponse({
  //     status: 200,
  //     description: 'vista de usuarios exitosa ',
  //   })
  //   @UseGuards(JwtAuthGuard, RolesGuard)
  //   @Roles('ADMIN')
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  //   @ApiOperation({ summary: 'trae a un usuario en especifico' })
  //   @ApiResponse({
  //     status: 200,
  //     description: 'el usuario fue traido exitosamente',
  //   })
  //   @ApiResponse({
  //     status: 404,
  //     description: 'no encontrado :c',
  //   })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  //   @ApiResponse({
  //     status: 200,
  //     description: 'usuario actualizado exitosamente',
  //   })
  //   @ApiOperation({
  //     summary: 'actualiza a un usuario en especifico disponible solo para ADMIN',
  //   })
  //   @Roles('ADMIN')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  //   @ApiOperation({
  //     summary: 'ELIMINA a un usuario solo disponible para un ADMIN',
  //   })
  //   @ApiResponse({
  //     status: 200,
  //     description: 'usuario eliminado exitosamente',
  //   })
  //   @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
