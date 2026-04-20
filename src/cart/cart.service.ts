import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from '../common/entity/cart.entity';
import { LineItem } from '../common/entity/line-item.entity';
import { CartDbService } from './cart.db.service';
import { AddToCartDto } from './dto/create-cart.dto';

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

  async findOne(id: string) {
    return this.cartRepository.findOne({ where: { id } });
  }

  async update(id: string, updateData: Partial<Cart>) {
    await this.cartRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.cartRepository.delete(id);
    return { deleted: true };
  }
}
