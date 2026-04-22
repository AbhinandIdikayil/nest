import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { ProductImage } from './product-image.entity';
import { ProductVariantOption } from './product-variant-option.entity';
import { ProductVariant } from './product-variant.entity';

@Entity('products')
export class Product {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  thumbnail: string;

  @Column()
  created_at: string;

  @OneToMany(() => ProductImage, (img) => img.product)
  images: ProductImage[];

  @OneToMany(() => ProductVariantOption, (opt) => opt.product)
  options: ProductVariantOption[];

  @OneToMany(() => ProductVariant, (variant) => variant.product)
  variants: ProductVariant[];
}
