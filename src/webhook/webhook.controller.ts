import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

@Controller('webhooks')
export class WebhooksController {
  @Post('mockpay')
  @HttpCode(HttpStatus.OK)
  recibirMockPay(@Body() body: unknown) {
    console.log('🔥 WEBHOOK MOCKPAY RECIBIDO');
    console.log(body);

    return {
      received: true,
    };
  }
}
