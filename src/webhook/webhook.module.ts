import { Module } from '@nestjs/common';
import { WebhooksController } from './webhook.controller.js';
import { WebhookService } from './webhook.service.js';
import { VentasWebService } from '../ventas-web/ventas-web.service.js';

@Module({
  controllers: [WebhooksController],
  providers: [WebhookService, VentasWebService],
})
export class WebhookModule {}
