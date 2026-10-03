import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { MockPayWebhookDto } from './dto/webhook.dto.js';
import { VentasWebService } from '../ventas-web/ventas-web.service.js';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly ventasWebService: VentasWebService) {}

  @Post('mockpay')
  @HttpCode(HttpStatus.OK)
  async recibirMockPay(@Body() body: MockPayWebhookDto) {
    console.log('🔥🔥🔥 WEBHOOK MOCKPAY RECIBIDO');
    console.log('🔥 BODY:', body);

    return this.ventasWebService.procesarWebhook(body);
  }
}
