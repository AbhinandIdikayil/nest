import { IsString, IsOptional, IsDateString } from 'class-validator';

export class UpdateCartDto {
  @IsOptional()
  @IsString()
  customerId?: string;

  @IsOptional()
  @IsDateString()
  completedAt?: string;
}
