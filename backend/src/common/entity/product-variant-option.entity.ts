import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { ProductOptionValue } from './product-option-value.entity';
import { ProductVariantOptionValue } from './product-variant-option-value.entity';

@Entity('product_options')
export class ProductVariantOption {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column({ name: 'product_id' })
  productId: string;

  @ManyToOne(() => Product, (product) => product.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @OneToMany(() => ProductOptionValue, (val) => val.option)
  values: ProductVariantOptionValue[];
}
