import { post } from '../services/api';
import type { PaymentGateway, PaymentGatewayConfig, PaymentGatewayType } from '../config/payment';

export interface RazorpayOrderResponse {
  orderId: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
}

export interface RazorpayOptions {
  key: string;
  amount: string;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  handler: (response: RazorpayPaymentResponse) => void;
  modal?: {
    ondismiss: () => void;
  };
}

export interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayInstance {
  open(): void;
  on(event: string, handler: (response: unknown) => void): void;
}

export class RazorpayGateway implements PaymentGateway {
  readonly type: PaymentGatewayType = 'razorpay';
  readonly config: PaymentGatewayConfig;

  constructor(config: PaymentGatewayConfig) {
    this.config = config;
  }

  async createOrder(params: { amount: number; cartId: string; customer: { name: string; email: string; phone: string } }): Promise<RazorpayOrderResponse> {
    const response = await post('/payment/razorpay/order', {
      amount: params.amount,
      cartId: params.cartId,
    }, {});

    return {
      orderId: response.id,
      razorpayOrderId: response.razorpayOrderId,
      amount: response.amount,
      currency: response.currency,
    };
  }

  async initiateCheckout(params: { amount: number; cartId: string; customer: { name: string; email: string; phone: string } }): Promise<void> {
    const order = await this.createOrder(params);
    console.log('import.meta.env.VITE_RAZORPAY_KEY_ID',import.meta.env.VITE_RAZORPAY_KEY_ID)
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    await new Promise<void>((resolve) => {
      script.onload = () => resolve();
    });

    const options: RazorpayOptions = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: String(order.amount),
      currency: order?.currency || 'INR',
      name: 'Your Store',
      description: 'Purchase',
      order_id: order.orderId,
      prefill: {
        name: params.customer.name,
        email: params.customer.email,
        contact: params.customer.phone,
      },
      theme: {
        color: '#aa3bff',
      },
      handler: async (response) => {
        await this.verifyPayment({
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
          cartId: params.cartId,
        });
      },
      modal: {
        ondismiss: () => {
          console.log('Payment modal closed');
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', (response) => {
      console.error('Payment failed:', response);
      alert(`Payment failed: ${(response as { description: string }).description}`);
    });
    rzp.open();
  }

  private async verifyPayment(params: {
    razorpayPaymentId: string;
    razorpayOrderId: string;
    razorpaySignature: string;
    cartId: string;
  }): Promise<void> {
    await post('/payment/razorpay/verify', {
      razorpayPaymentId: params.razorpayPaymentId,
      razorpayOrderId: params.razorpayOrderId,
      razorpaySignature: params.razorpaySignature,
      cartId: params.cartId,
    }, {});
  }
}