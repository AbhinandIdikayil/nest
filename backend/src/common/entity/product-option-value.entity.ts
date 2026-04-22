import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ProductVariantOption } from './product-variant-option.entity';

@Entity('product_option_values')
export class ProductOptionValue {
  @PrimaryColumn()
  id: string;

  @Column()
  value: string;

  @Column({ name: 'option_id' })
  optionId: string;

  @ManyToOne(() => ProductVariantOption, (opt) => opt.values, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'option_id' })
  option: ProductVariantOption;
}
