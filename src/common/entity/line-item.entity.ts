import { Column, Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Cart } from './cart.entity';

@Entity('cart_items')
export class LineItem {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'product_title', nullable: true })
  productTitle: string;

  @Column({ name: 'product_description', nullable: true })
  productDescription: string;

  @Column({ name: 'cart_id' })
  cartId: string;

  @Column({ name: 'variant_id', nullable: true })
  variantId: string;

  @Column({ name: 'quantity' })
  quantity: number;

  @Column({ name: 'unit_price' })
  unitPrice: number;

  @Column({ name: 'created_at', default: () => 'now()' })
  createdAt: Date;

  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;
}
