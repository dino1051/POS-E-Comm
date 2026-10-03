import {
  Controller,
  UseGuards,
  Request,
  Post,
  Body,
  Get,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard.js';
import type { Request as ExpressRequest } from 'express';
import { AuthService } from './auth.service.js';
import { CreateUserDto } from '../users/dto/create-user.dto.js';
import { CurrentUser } from './decorators/current-user.decorator.js';
import type { AuthUser } from './interfaces/auth-user.interface.js';
import { LoginUserDto } from '../users/dto/login-user.dto.js';
import {
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateClienteDto } from '../users/dto/create-cliente.dto.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { RolesGuard } from './guards/roles.guard.js';
import { Role } from '../generated/prisma/enums.js';
import { Roles } from './decorators/roles.decorator.js';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({ status: 200, description: 'Inicio de sesión exitoso' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  @Post('login')
  async login(@Request() req: ExpressRequest) {
    return this.authService.login(req.user);
  }

  @ApiOperation({
    summary: 'Registrar un empleado nuevo',
    description: 'Registrar un empleado nuevo.',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado.',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflicto encontrado.',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('register/empleados')
  async registerEmpleados(@Body() createUser: CreateUserDto) {
    return this.authService.register(createUser);
  }

  @ApiOperation({
    summary: 'Crear un nuevo cliente',
    description: 'Crear un nuevo cliente.',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflicto encontrado.',
  })
  @Post('register/clientes')
  async registerClientes(@Body() createUser: CreateClienteDto) {
    return this.authService.register(createUser);
  }

  @ApiOperation({
    summary: 'Listar a todos los usuarios',
    description: 'Listar a todos los usuarios.',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado.',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('usuarios')
  async findAll() {
    return this.authService.findAll();
  }

  @ApiOperation({
    summary: 'Listar informacion del usuario logeado',
    description: 'Listar informacion del usuario logeado.',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado.',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.CAJERO, Role.CLIENTEWEB)
  @Get('profile')
  @UseGuards(LocalAuthGuard)
  getProfile(@CurrentUser() user: AuthUser) {
    return {
      id: user.userId,
      email: user.email,
      role: user.role,
    };
  }
}
