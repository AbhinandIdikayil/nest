import { IsEmail, IsNotEmpty } from 'class-validator';

export class SigninDto {
  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  email: string;
}
