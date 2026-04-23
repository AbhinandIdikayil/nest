import { IsString, IsOptional, IsEnum } from 'class-validator';
import { PaymentProvider } from './create-payment.dto';

export class VerifyPaymentDto {
  @IsString()
  paymentId: string;

  @IsString()
  orderId: string;

  @IsString()
  @IsOptional()
  signature?: string;

  @IsEnum(PaymentProvider)
  provider: PaymentProvider;
}
