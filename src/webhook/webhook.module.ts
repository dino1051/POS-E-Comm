import { Module } from '@nestjs/common';
import { WebhooksController } from './webhook.controller.js';
import { WebhookService } from './webhook.service.js';

@Module({
  controllers: [WebhooksController],
  providers: [WebhookService],
})
export class WebhookModule {}
