import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import {
  CreateRazorpayOrderDto,
  VerifyRazorpayPaymentDto,
} from './dto/razorpay-payment.dto';
import {
  CreatePhonePeOrderDto,
  VerifyPhonePePaymentDto,
} from './dto/phonepe-payment.dto';
import { CustomerGuard } from 'src/common/guards/customer.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { CustomerSession } from 'src/auth/types/jwt.payload';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(CustomerGuard)
  @Post('razorpay/order')
  async createRazorpayOrder(
    @Body() dto: CreateRazorpayOrderDto,
    @CurrentUser() user: CustomerSession,
  ) {
    return this.paymentService.createRazorpayOrder(dto, user);
  }

  @Post('razorpay/verify')
  async verifyRazorpayPayment(@Body() dto: VerifyRazorpayPaymentDto) {
    return this.paymentService.verifyRazorpayPayment(dto);
  }

  @UseGuards(CustomerGuard)
  @Post('phonepe/order')
  async createPhonePeOrder(
    @Body() dto: CreatePhonePeOrderDto,
    @CurrentUser() user: CustomerSession,
  ) {
    return this.paymentService.createPhonePeOrder(dto, user);
  }

  @Post('phonepe/verify')
  async verifyPhonePePayment(@Body() dto: VerifyPhonePePaymentDto) {
    return this.paymentService.verifyPhonePePayment(dto);
  }
}
