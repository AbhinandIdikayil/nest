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

export class CreatePhonePeOrderDto {
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

export class VerifyPhonePePaymentDto {
  @IsString()
  merchantOrderId: string;

  @IsString()
  cartId: string;
}
