import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartService } from './cart.service';
import { CartDbService } from './cart.db.service';
import { CartController } from './cart.controller';
import { Cart } from '../common/entity/cart.entity';
import { LineItem } from '../common/entity/line-item.entity';
import { CustomerGuard } from '../common/guards/customer.guard';
import { Environments } from '../common/environments/environments.service';

@Module({
  imports: [
    JwtModule.register({
      secret: Environments.get('JWT_SECRET'),
    }),
    TypeOrmModule.forFeature([Cart, LineItem]),
  ],
  controllers: [CartController],
  providers: [CartService, CartDbService, CustomerGuard],
})
export class CartModule {}
