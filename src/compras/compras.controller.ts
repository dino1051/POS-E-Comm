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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiTags('Compras')
@Controller('compras')
export class ComprasController {
  constructor(private readonly comprasService: ComprasService) {}

  @ApiOperation({
    summary: 'Crear una nueva compra',
    description: 'Crear una nueva compra.',
  })
  @ApiResponse({
    status: 201,
    description: 'Compra creada correctamente.',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado.',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflicto encontrado.',
  })
  @Post()
  create(
    @Body() createCompraDto: CreateCompraDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.comprasService.createCompra(createCompraDto, user.userId);
  }

  @ApiOperation({
    summary: 'Listar todas las compras',
    description: 'Listar todas las compras.',
  })
  @Get()
  findAll() {
    return this.comprasService.findAll();
  }

  @ApiOperation({
    summary: 'Lista una compra',
    description: 'Lista una compra con su ID.',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado.',
  })
  @ApiResponse({
    status: 404,
    description: 'ID de compra no encontrado.',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.comprasService.findOne(+id);
  }

  @ApiOperation({
    summary: 'Modifica una compra',
    description: 'Modifica una compra con su ID.',
  })
  @ApiResponse({
    status: 201,
    description: 'Compra actualizada correctamente.',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado.',
  })
  @ApiResponse({
    status: 404,
    description: 'ID de compra no encontrado.',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflicto encontrado.',
  })
  @Patch(':id')
  update(@Body() Dto: UpdateCompraDto, @Param() id: string) {
    return this.comprasService.update(Dto, Number(id));
  }
}
