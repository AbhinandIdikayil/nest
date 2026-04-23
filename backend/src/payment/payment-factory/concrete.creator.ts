import { Injectable } from '@nestjs/common';
import { PaymentCreator } from './abstract.creator';
import {
  RazorpayPaymentService,
  PhonePePaymentService,
} from './concrete.product';

@Injectable()
export class RazorpayCreator extends PaymentCreator {
  constructor(private readonly razorpayService: RazorpayPaymentService) {
    super();
  }

  createPayment() {
    return this.razorpayService;
  }
}

@Injectable()
export class PhonePeCreator extends PaymentCreator {
  constructor(private readonly phonePeService: PhonePePaymentService) {
    super();
  }

  createPayment() {
    return this.phonePeService;
  }
}
