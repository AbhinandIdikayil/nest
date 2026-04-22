import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerDto } from './create-auth.dto';

export class UpdateAuthDto extends PartialType(CreateCustomerDto) {}
