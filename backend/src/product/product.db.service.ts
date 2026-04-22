import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Product } from '../common/entity/product.entity';
import { ProductImage } from '../common/entity/product-image.entity';
import { ProductVariant } from '../common/entity/product-variant.entity';
import { ProductVariantOption } from '../common/entity/product-variant-option.entity';
import { ProductOptionValue } from '../common/entity/product-option-value.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { ulid } from 'ulid';

@Injectable()
export class ProductDbService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async createProduct(
    createProductDto: CreateProductDto,
  ): Promise<{ id: string } & CreateProductDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const productId = `prod_${ulid()}`;

      const product = queryRunner.manager.create(Product, {
        id: productId,
        name: createProductDto.name,
        description: createProductDto.description,
        thumbnail: createProductDto.thumbnail,
        created_at: new Date().toISOString(),
      });
      await queryRunner.manager.save(product);

      if (createProductDto.images?.length) {
        const images = createProductDto.images.map((img) => {
          return queryRunner.manager.create(ProductImage, {
            id: `img_${ulid()}`,
            url: img.url,
            productId,
          });
        });
        await queryRunner.manager.save(images);
      }

      if (createProductDto.options?.length) {
        for (const opt of createProductDto.options) {
          const optionId = `opt_${ulid()}`;

          const option = queryRunner.manager.create(ProductVariantOption, {
            id: optionId,
            name: opt.name,
            productId,
          });
          await queryRunner.manager.save(option);

          for (const val of opt.values) {
            const optionValue = queryRunner.manager.create(ProductOptionValue, {
              id: `optval_${ulid()}`,
              value: val,
              optionId,
            });
            await queryRunner.manager.save(optionValue);
          }
        }
      }

      if (createProductDto.variants?.length) {
        for (const variant of createProductDto.variants) {
          const variantEntity = queryRunner.manager.create(ProductVariant, {
            id: `variant_${ulid()}`,
            title: variant.title,
            price: variant.price,
            discountedPrice: variant.discountedPrice ?? null,
            quantity: variant.quantity ?? 0,
            weight: variant.weight ?? null,
            productId,
          });
          await queryRunner.manager.save(variantEntity);
        }
      }

      await queryRunner.commitTransaction();

      return { id: productId, ...createProductDto };
    } catch (err: unknown) {
      console.error('err', err);
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({
      relations: ['images', 'options', 'variants'],
    });
  }
}
