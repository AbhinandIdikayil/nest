import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ProductOptionValue } from './product-option-value.entity';
import { ProductVariant } from './product-variant.entity';

@Entity('variant_option_values')
export class ProductVariantOptionValue {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'variant_id' })
  variantId: string;

  @Column({ name: 'option_value_id' })
  optionValueId: string;

  @ManyToOne(() => ProductVariant, (variant) => variant.optionValues, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'variant_id' })
  variant: ProductVariant;

  @ManyToOne(() => ProductOptionValue, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'option_value_id' })
  optionValue: ProductOptionValue;
}
