import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from 'src/common/entity/cart.entity';
import { Order } from 'src/common/entity/order.entity';
import { Repository } from 'typeorm';
import { ulid } from 'ulid';

@Injectable()
export class PaymentDbService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
  ) {}

  async createOrder(cartId: string, customerId: string): Promise<Order> {
    const entity = this.orderRepository.create({
      id: `order_${ulid()}`,
      cartId,
      customerId,
    });
    return await this.orderRepository.save(entity);
  }

  async completeCart(cartId: string, orderId: string) {
    return this.cartRepository.update(
      { id: cartId },
      { completedAt: new Date(), orderId },
    );
  }
}
