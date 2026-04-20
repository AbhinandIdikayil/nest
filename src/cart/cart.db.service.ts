import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Cart } from '../common/entity/cart.entity';
import { LineItem } from '../common/entity/line-item.entity';
import { AddToCartDto, AddToCartItemDto } from './dto/create-cart.dto';
import { ulid } from 'ulid';

@Injectable()
export class CartDbService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(LineItem)
    private lineItemRepository: Repository<LineItem>,
  ) {}

  async addItemToCart(
    customerId: string,
    addToCartDto: AddToCartDto,
  ): Promise<{ cartId: string; customerId: string; items: LineItem[] }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const customerIdVal: string = customerId;
      let cart = await this.cartRepository.findOne({
        where: {
          customerId: customerIdVal,
          completedAt: null as unknown as Date,
        },
      });

      if (!cart) {
        const cartId = `cart_${ulid()}`;
        cart = queryRunner.manager.create(Cart, {
          id: cartId,
          customerId: customerIdVal,
          createdAt: new Date(),
          updatedAt: new Date(),
          completedAt: null,
        });
        await queryRunner.manager.save(cart);
      }

      const addedItems: LineItem[] = [];

      const items = addToCartDto.items;
      if (items && items.length > 0) {
        for (const item of items) {
          const lineItemId = `line_${ulid()}`;
          const itemVal: AddToCartItemDto = item;
          const lineItem = queryRunner.manager.create(LineItem, {
            id: lineItemId,
            productTitle: itemVal.productTitle ?? '',
            productDescription: itemVal.productDescription ?? '',
            cartId: cart.id,
            variantId: itemVal.variantId,
            quantity: itemVal.quantity,
            unitPrice: itemVal.unitPrice ?? 0,
          });
          await queryRunner.manager.save(lineItem);
          addedItems.push(lineItem);
        }
      }

      await queryRunner.commitTransaction();

      return {
        cartId: cart.id,
        customerId: cart.customerId,
        items: addedItems,
      };
    } catch (err: unknown) {
      console.error('Error adding to cart:', err);
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getCartByCustomerId(customerId: string): Promise<Cart | null> {
    return this.cartRepository.findOne({
      where: { customerId, completedAt: null as unknown as Date },
      order: { createdAt: 'DESC' },
    });
  }
}
