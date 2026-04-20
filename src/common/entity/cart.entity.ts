import {
  Column,
  Entity,
  PrimaryColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { LineItem } from './line-item.entity';
import { Customer } from './customer.entity';

@Entity('carts')
export class Cart {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'customer_id' })
  customerId: string;

  @ManyToOne(() => Customer, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column({ name: 'created_at', default: () => 'now()' })
  createdAt: Date;

  @Column({ name: 'updated_at', default: () => 'now()' })
  updatedAt: Date;

  @Column({ name: 'completed_at', nullable: true })
  completedAt: Date | null;

  @OneToMany(() => LineItem, (item) => item.cart, { cascade: true })
  items: LineItem[];
}
