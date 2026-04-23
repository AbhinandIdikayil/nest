import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { PaymentDbService } from './payment.db.service';
import {
  RazorpayPaymentService,
  PhonePePaymentService,
} from './payment-factory/concrete.product';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/common/entity/order.entity';

@Module({
  controllers: [PaymentController],
  imports: [TypeOrmModule.forFeature([Order])],
  providers: [
    PaymentService,
    PaymentDbService,
    RazorpayPaymentService,
    PhonePePaymentService,
  ],
})
export class PaymentModule {}
