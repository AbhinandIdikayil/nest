import {
  Column,
  Entity,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Cart } from 'src/common/entity/cart.entity';
import { Customer } from 'src/common/entity/customer.entity';

@Entity('orders')
export class Order {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'cart_id' })
  cartId: string;

  @ManyToOne(() => Cart, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;

  @Column({ name: 'customer_id' })
  customerId: string;

  @ManyToOne(() => Customer, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
