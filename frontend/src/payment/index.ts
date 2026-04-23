import { paymentGatewayFactory } from '../config/payment';
import type { PaymentGateway } from '../config/payment';
import { RazorpayGateway } from './RazorpayGateway';
import { PhonePeGateway } from './PhonePeGateway';

const gateways: PaymentGateway[] = [
  new RazorpayGateway({ name: 'Razorpay' }),
  new PhonePeGateway({ name: 'PhonePe' }),
];

gateways.forEach((gateway) => {
  paymentGatewayFactory.registerGateway(gateway);
});

export { paymentGatewayFactory };
export { RazorpayGateway } from './RazorpayGateway';
export { PhonePeGateway } from './PhonePeGateway';
export type { PaymentGateway, PaymentGatewayFactory } from '../config/payment';
export type { PaymentGatewayType, PaymentGatewayConfig } from '../config/payment.config';