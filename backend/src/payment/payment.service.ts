import { Injectable } from '@nestjs/common';
import {
  RazorpayPaymentService,
  PhonePePaymentService,
} from './payment-factory/concrete.product';
import {
  CreateRazorpayOrderDto,
  VerifyRazorpayPaymentDto,
} from './dto/razorpay-payment.dto';
import {
  CreatePhonePeOrderDto,
  VerifyPhonePePaymentDto,
} from './dto/phonepe-payment.dto';
import { OrderResponse, VerifyResponse } from './payment-factory/product';
import { CustomerSession } from 'src/auth/types/jwt.payload';

@Injectable()
export class PaymentService {
  constructor(
    private readonly razorpayService: RazorpayPaymentService,
    private readonly phonePeService: PhonePePaymentService,
  ) {}

  async createRazorpayOrder(
    dto: CreateRazorpayOrderDto,
    user: CustomerSession,
  ): Promise<OrderResponse> {
    return this.razorpayService.createOrder(
      dto.amount,
      dto.cartId,
      { ...dto.customer, id: user.id },
      dto.metadata,
    );
  }

  async verifyRazorpayPayment(
    dto: VerifyRazorpayPaymentDto,
  ): Promise<VerifyResponse> {
    return this.razorpayService.verifyPayment(
      dto.razorpayPaymentId,
      dto.razorpayOrderId,
      dto.razorpaySignature || '',
    );
  }

  async createPhonePeOrder(
    dto: CreatePhonePeOrderDto,
    user: CustomerSession,
  ): Promise<OrderResponse> {
    return this.phonePeService.createOrder(
      dto.amount,
      dto.cartId,
      { ...dto.customer, id: user.id },
      dto.metadata,
    );
  }

  async verifyPhonePePayment(
    dto: VerifyPhonePePaymentDto,
  ): Promise<VerifyResponse> {
    return this.phonePeService.verifyPayment(
      dto.paymentId,
      dto.orderId,
      dto.signature,
    );
  }
}
