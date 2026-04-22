import {
  IsString,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AddToCartItemDto {
  @IsString()
  variantId: string;

  @IsNumber()
  quantity: number;

  @IsOptional()
  @IsString()
  productTitle?: string;

  @IsOptional()
  @IsString()
  productDescription?: string;

  @IsOptional()
  @IsNumber()
  unitPrice?: number;
}

export class AddToCartDto {
  @IsOptional()
  @IsString()
  customerId?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AddToCartItemDto)
  items: AddToCartItemDto[];
}
