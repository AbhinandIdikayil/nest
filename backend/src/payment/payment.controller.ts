import { Controller, Post, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';
import {
  CreateRazorpayOrderDto,
  VerifyRazorpayPaymentDto,
} from './dto/razorpay-payment.dto';
import {
  CreatePhonePeOrderDto,
  VerifyPhonePePaymentDto,
} from './dto/phonepe-payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('razorpay/order')
  async createRazorpayOrder(@Body() dto: CreateRazorpayOrderDto) {
    return this.paymentService.createRazorpayOrder(dto);
  }

  @Post('razorpay/verify')
  async verifyRazorpayPayment(@Body() dto: VerifyRazorpayPaymentDto) {
    return this.paymentService.verifyRazorpayPayment(dto);
  }

  @Post('phonepe/order')
  async createPhonePeOrder(@Body() dto: CreatePhonePeOrderDto) {
    return this.paymentService.createPhonePeOrder(dto);
  }

  @Post('phonepe/verify')
  async verifyPhonePePayment(@Body() dto: VerifyPhonePePaymentDto) {
    return this.paymentService.verifyPhonePePayment(dto);
  }
}
