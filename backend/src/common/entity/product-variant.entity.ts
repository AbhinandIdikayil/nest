import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { ProductVariantOptionValue } from './product-variant-option-value.entity';

@Entity('variants')
export class ProductVariant {
  @PrimaryColumn()
  id: string;

  @Column({ nullable: true })
  title?: string;

  @Column('numeric')
  price: number;

  @Column('numeric', { name: 'discounted_price', nullable: true })
  discountedPrice?: number;

  @Column({ default: 0 })
  quantity: number;

  @Column('numeric', { nullable: true })
  weight?: number;

  @Column({ name: 'product_id' })
  productId: string;

  @ManyToOne(() => Product, (product) => product.variants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @OneToMany(() => ProductVariantOptionValue, (vov) => vov.variant)
  optionValues: ProductVariantOptionValue[];
}
