import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './product.service';
import { ProductDbService } from './product.db.service';
import { ProductController } from './product.controller';
import { Product } from '../common/entity/product.entity';
import { AdminGuard } from '../common/guards/admin.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductController],
  providers: [ProductService, ProductDbService, AdminGuard],
})
export class ProductModule {}
