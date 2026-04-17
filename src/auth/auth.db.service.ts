import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from 'src/common/entity/customer.entity';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/create-auth.dto';
import { ulid } from 'ulid';

@Injectable()
export class AuthDbService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async createUser(data: CreateCustomerDto): Promise<Customer> {
    const customer = this.customerRepository.create({
      id: ulid(),
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName ?? '',
      phone: data.phone,
    });

    return this.customerRepository.save(customer);
  }

  async getUserById(id: string): Promise<Customer | null> {
    return this.customerRepository.findOne({ where: { id } });
  }

  async getUserByEmail(email: string): Promise<Customer | null> {
    return this.customerRepository.findOne({ where: { email } });
  }
}
