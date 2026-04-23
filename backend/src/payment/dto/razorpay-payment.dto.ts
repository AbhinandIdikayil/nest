import {
  IsNumber,
  IsString,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CustomerDto {
  @IsString()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  name: string;
}

export class CreateRazorpayOrderDto {
  @IsNumber()
  amount: number;

  @IsString()
  cartId: string;

  @ValidateNested()
  @Type(() => CustomerDto)
  customer: CustomerDto;

  @IsOptional()
  metadata?: Record<string, any>;
}

export class VerifyRazorpayPaymentDto {
  @IsString()
  razorpayPaymentId: string;

  @IsString()
  razorpayOrderId: string;

  @IsString()
  @IsOptional()
  razorpaySignature?: string;
}
