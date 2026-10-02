import {
  Controller,
  HttpCode,
  HttpStatus,
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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: ExpressRequest) {
    return this.authService.login(req.user);
  }
  @Post('register')
  async register(@Body() createUser: CreateUserDto) {
    return this.authService.register(createUser);
  }
  @Get('usuarios')
  async findAll() {
    return this.authService.findAll();
  }

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
