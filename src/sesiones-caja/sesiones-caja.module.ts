import { Module } from '@nestjs/common';
import { SesionesCajaController } from './sesiones-caja.controller.js';
import { SesionesCajaService } from './sesiones-caja.service.js';

@Module({
  controllers: [SesionesCajaController],
  providers: [SesionesCajaService]
})
export class SesionesCajaModule {}
