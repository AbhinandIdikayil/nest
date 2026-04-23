import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/common/entity/order.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentDbService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  // eslint-disable-next-line @typescript-eslint/require-await
  async createOrder() {
    return this.orderRepository.create({});
  }
}
