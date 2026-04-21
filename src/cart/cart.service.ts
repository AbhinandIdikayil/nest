import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from '../common/entity/cart.entity';
import { LineItem } from '../common/entity/line-item.entity';
import { CartDbService } from './cart.db.service';
import { AddToCartDto } from './dto/create-cart.dto';
import { renderCheckoutPage } from './templates/checkout-page.template';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(LineItem)
    private lineItemRepository: Repository<LineItem>,
    private cartDbService: CartDbService,
  ) {}

  async addItem(customerId: string, addToCartDto: AddToCartDto) {
    return await this.cartDbService.addItemToCart(customerId, addToCartDto);
  }

  async findAll() {
    return this.cartRepository.find();
  }

  async findByCartId(id: string) {
    return await this.cartRepository.findOne({ where: { id } });
  }

  async getCheckoutPage(customerId: string) {
    const cart = await this.cartDbService.getCartByCustomerId(customerId);

    if (!cart) {
      throw new NotFoundException(
        `No active cart found for customer ${customerId}`,
      );
    }

    return renderCheckoutPage(cart);
  }

  async update(id: string, updateData: Partial<Cart>) {
    await this.cartRepository.update(id, updateData);
    return this.findByCartId(id);
  }

  async remove(id: string) {
    await this.cartRepository.delete(id);
    return { deleted: true };
  }
}
