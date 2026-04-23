import { IsNumber, IsString, IsEnum } from 'class-validator';

export enum PaymentProvider {
  RAZORPAY = 'razorpay',
  PHONEPE = 'phonepe',
}

class CustomerDto {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  phone: string;
}
export class CreatePaymentDto {
  @IsNumber()
  amount: number;

  @IsString()
  cartId: string;

  @IsEnum(PaymentProvider)
  provider: PaymentProvider;

  customer: CustomerDto;
}

export class CreateOrderDto extends CreatePaymentDto {}
