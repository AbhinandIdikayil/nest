import { PaymentProduct } from './product';

export abstract class PaymentCreator {
  abstract createPayment(): PaymentProduct;
}
