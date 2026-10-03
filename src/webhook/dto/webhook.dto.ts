import {
  IsIn,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class MockPayWebhookDto {
  @IsIn(['payment.succeeded', 'payment.failed'])
  event: string;

  @IsString()
  id: string;

  @IsNumber()
  amount: number;

  @IsString()
  currency: string;

  @IsIn(['SUCCEEDED', 'FAILED'])
  status: string;

  @IsOptional()
  @IsString()
  failure_reason: string | null;

  @IsObject()
  metadata: {
    order_id: string;
  };

  @IsString()
  created_at: string;
}
