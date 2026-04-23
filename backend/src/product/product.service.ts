import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../common/entity/product.entity';
import { ProductDbService } from './product.db.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private productDbService: ProductDbService,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      return await this.productDbService.createProduct(createProductDto);
    } catch (error) {
      throw error;
    }
  }

  async getAllProducts() {
    try {
      return await this.productDbService.findAll();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async findOne(id: string) {
    return this.productRepository.findOne({
      where: { id },
      relations: ['images', 'options', 'variants'],
    });
  }

  async update(id: string, updateProductDto: Partial<CreateProductDto>) {
    const updateData: Partial<Product> = {};
    if (updateProductDto.name) updateData.name = updateProductDto.name;
    if (updateProductDto.description)
      updateData.description = updateProductDto.description;
    if (updateProductDto.thumbnail)
      updateData.thumbnail = updateProductDto.thumbnail;

    await this.productRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.productRepository.delete(id);
    return { deleted: true };
  }
}
