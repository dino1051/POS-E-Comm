import { Module } from '@nestjs/common';
import { VentasWebService } from './ventas-web.service.js';
import { VentasWebController } from './ventas-web.controller.js';

@Module({
  providers: [VentasWebService],
  controllers: [VentasWebController]
})
export class VentasWebModule {}
