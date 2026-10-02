import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ComprasService } from './compras.service.js';
import { CreateCompraDto } from './dto/create-compra.dto.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import type { AuthUser } from '../auth/interfaces/auth-user.interface.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Role } from '../generated/prisma/enums.js';
import { UpdateCompraDto } from './dto/update-compra.dto.js';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('compras')
export class ComprasController {
  constructor(private readonly comprasService: ComprasService) {}

  @Post()
  create(
    @Body() createCompraDto: CreateCompraDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.comprasService.createCompra(createCompraDto, user.userId);
  }

  @Get()
  findAll() {
    return this.comprasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.comprasService.findOne(+id);
  }

  @Patch(':id')
  update(@Body() Dto: UpdateCompraDto, @Param() id: string) {
    return this.comprasService.update(Dto, Number(id));
  }
}
