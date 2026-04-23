import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PaymentDbService } from './payment.db.service';
import {
  RazorpayPaymentService,
  PhonePePaymentService,
} from './payment-factory/concrete.product';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/common/entity/order.entity';
import { CustomerGuard } from 'src/common/guards/customer.guard';
import { Environments } from 'src/common/environments/environments.service';
import { Cart } from 'src/common/entity/cart.entity';

@Module({
  imports: [
    JwtModule.register({
      secret: Environments.get('JWT_SECRET'),
    }),
    TypeOrmModule.forFeature([Order, Cart]),
  ],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    PaymentDbService,
    RazorpayPaymentService,
    PhonePePaymentService,
    CustomerGuard,
  ],
})
export class PaymentModule {}
