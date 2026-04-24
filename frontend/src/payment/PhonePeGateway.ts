import { post } from '../services/api';
import type { PaymentGateway, PaymentGatewayConfig, PaymentGatewayType } from '../config/payment';

declare global {
  interface Window {
    PhonePeCheckout: {
      transact: (options: PhonePeTransactOptions) => void;
    };
  }
}

interface PhonePeTransactOptions {
  tokenUrl: string;
  callback: (response: string) => void;
  type: 'IFRAME' | 'REDIRECT';
}


export class PhonePeGateway implements PaymentGateway {
  readonly type: PaymentGatewayType = 'phonepe';
  readonly config: PaymentGatewayConfig;

  constructor(config: PaymentGatewayConfig) {
    this.config = config;
  }

  async initiateCheckout(params: { amount: number; cartId: string; customer: { name: string; email: string; phone: string } }): Promise<void> {
    const script = document.createElement('script');
    script.src = 'https://mercury.phonepe.com/web/bundle/checkout.js';
    script.defer = true;
    document.body.appendChild(script);

    await new Promise<void>((resolve) => {
      script.onload = () => resolve();
    });

    const response = await post('/payment/phonepe/order', {
      amount: params.amount,
      cartId: params.cartId,
      customer: {
        phone: params.customer.phone,
        name: params.customer.name,
        email: params.customer.email,
      },
    }, {});

    const callback = (paymentResponse: string) => {
      console.log('paymentResponse', paymentResponse)
      if (paymentResponse === 'CONCLUDED') {
        post('/payment/phonepe/verify', {
          merchantOrderId: response.orderId,
          cartId: params.cartId,
        }, {}).then(() => {
          alert('Payment successful!');
        }).catch((error) => {
          console.error('Verification failed:', error);
          alert('Payment verified but failed to update. Please contact support.');
        });
      } else {
        alert('Payment failed. Please try again.');
      }
    };

    window.PhonePeCheckout.transact({ 
      tokenUrl: response.paymentUrl, 
      callback, 
      type: 'IFRAME',
    });
  }
}