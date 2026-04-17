import { IsString, IsEmail, Length, IsOptional, IsNotEmpty, Matches } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty({ message: 'Email is required' })
  firstName: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  @Length(10)
  @Matches(/^[0-9]+$/, { message: 'Phone must contain only numbers' }) 
  @IsNotEmpty({ message: 'Phone is required' })
  phone: string;
}