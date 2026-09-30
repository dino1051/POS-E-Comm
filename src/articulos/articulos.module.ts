import { Module } from '@nestjs/common';
import { ArticulosService } from './articulos.service.js';
import { ArticulosController } from './articulos.controller.js';

@Module({
  providers: [ArticulosService],
  controllers: [ArticulosController]
})
export class ArticulosModule {}
