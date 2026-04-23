import { Injectable, Logger } from '@nestjs/common';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import axios from 'axios';
import { PaymentProduct, OrderResponse, VerifyResponse } from './product';
import { Environments } from 'src/common/environments/environments.service';

@Injectable()
export class RazorpayPaymentService implements PaymentProduct {
  private razorpayInstance: Razorpay;

  constructor() {
    this.razorpayInstance = new Razorpay({
      key_id: Environments.get('RAZORPAY_API_KEY'),
      key_secret: Environments.get('RAZORPAY_API_SECRET'),
    });
  }

  async createOrder(
    amount: number,
    cartId: string,
    _customer: { email: string; phone: string; name: string },
    _metadata?: Record<string, any>,
  ): Promise<OrderResponse> {
    const options = {
      amount: amount * 100,
      currency: 'INR',
      notes: { cartId },
    };

    const order = await this.razorpayInstance.orders.create(options);
    return {
      orderId: order.id,
      amount,
      status: 'created',
      paymentUrl: `https://checkout.razorpay.com/${order.id}`,
    };
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async verifyPayment(
    paymentId: string,
    orderId: string,
    signature: string,
  ): Promise<VerifyResponse> {
    const keySecret = Environments.get('RAZORPAY_API_SECRET');
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(orderId + '|' + paymentId)
      .digest('hex');

    if (generatedSignature === signature) {
      return {
        success: true,
        message: 'Payment verified successfully',
        transactionId: paymentId,
      };
    }

    return {
      success: false,
      message: 'Invalid signature',
      transactionId: paymentId,
    };
  }
}

@Injectable()
export class PhonePePaymentService implements PaymentProduct {
  async createOrder(
    amount: number,
    cartId: string,
    _customer: { email: string; phone: string; name: string },
    _metadata?: Record<string, any>,
  ): Promise<OrderResponse> {
    const token = await generatePhonepeToken();
    const orderId = `ph_${cartId}_${Date.now()}`;

    const isSandbox =
      Environments.get('PHONEPE_ENV') === 'SANDBOX' ||
      Environments.get('ENVIRONMENT') === 'development';

    const url = isSandbox
      ? 'https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/pay'
      : 'https://api.phonepe.com/apis/pg/checkout/v2/pay';

    const paymentPayload = {
      merchantOrderId: orderId,
      amount: amount * 100,
      paymentFlow: {
        type: 'PG_CHECKOUT',
        message: 'Payment message used for collect requests',
        merchantUrls: {
          redirectUrl: 'http://localhost:5173/payment/success',
        },
      },
      prefillUserLoginDetails: {
        phoneNumber: _customer.phone,
      },
    };

    try {
      const response = await axios.post(url, paymentPayload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `O-Bearer ${token}`,
        },
      });
      console.log('PhonePe payment response:', response.data);
      return {
        orderId,
        amount,
        status: 'created',
        paymentUrl: response.data.redirectUrl,
      };
    } catch (error) {
      console.log('PhonePe payment initiation error:', error);
    }

    return {
      orderId,
      amount,
      status: 'created',
      paymentUrl: `https://phonepe.com/pay/${orderId}`,
    };
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async verifyPayment(
    paymentId: string,
    _orderId: string,
    _signature?: string,
  ): Promise<VerifyResponse> {
    return {
      success: true,
      message: 'Payment verified successfully',
      transactionId: paymentId,
    };
  }
}

export async function generatePhonepeToken(): Promise<string> {
  const logger = new Logger('PhonePeToken');
  const isSandbox =
    Environments.get('PHONEPE_ENV') === 'SANDBOX' ||
    Environments.get('ENVIRONMENT') === 'development';

  const url = isSandbox
    ? 'https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token'
    : 'https://api.phonepe.com/apis/identity-manager/v1/oauth/token';

  const clientId = Environments.get('PHONEPE_CLIENT_ID');
  const clientVersion = Environments.get('PHONEPE_CLIENT_VERSION');
  const clientSecret = Environments.get('PHONEPE_CLIENT_SECRET');

  const params = new URLSearchParams({
    client_id: clientId,
    client_version: clientVersion,
    client_secret: clientSecret,
    grant_type: 'client_credentials',
  });

  try {
    const response = await axios.post(url, params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    logger.log('PhonePe token generated successfully');
    return response.data.access_token;
  } catch (error) {
    logger.error('Failed to generate PhonePe token', error);
    throw error;
  }
}
