import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { VentasWebService } from './ventas-web.service.js';
import { CreateVentaWebDto } from './dto/create-ventaweb.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { AuthUser } from '../auth/interfaces/auth-user.interface.js';

@Controller('ventas-web')
export class VentasWebController {
  constructor(private readonly ventasWebService: VentasWebService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  crear(@Body() dto: CreateVentaWebDto, @CurrentUser() user: AuthUser) {
    return this.ventasWebService.crear(dto, user.userId);
  }
}
