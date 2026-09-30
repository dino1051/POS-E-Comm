import {
  Controller,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  Post,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard.js';
import type { Request as ExpressRequest } from 'express';
import { AuthService } from './auth.service.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: ExpressRequest) {
    return this.authService.login(req.user);
  }
}
