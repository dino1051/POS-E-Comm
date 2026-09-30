import { Module } from '@nestjs/common';
import { ComprasService } from './compras.service.js';
import { ComprasController } from './compras.controller.js';

@Module({
  providers: [ComprasService],
  controllers: [ComprasController]
})
export class ComprasModule {}
