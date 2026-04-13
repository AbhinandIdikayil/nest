import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { PaymentModule } from './payment/payment.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [ProductModule, AuthModule, CartModule, PaymentModule, OrderModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
