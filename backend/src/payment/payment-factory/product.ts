export interface PaymentProduct {
  createOrder(
    amount: number,
    cartId: string,
    customer: {
      email: string;
      phone: string;
      id: string;
      name: string;
    },
    metadata?: Record<string, any>,
  ): Promise<OrderResponse>;
  verifyPayment(
    paymentId: string,
    orderId: string,
    signature?: string,
  ): Promise<VerifyResponse>;
}

export interface OrderResponse {
  orderId: string;
  paymentId?: string;
  amount: number;
  status?: string;
  paymentUrl?: string;
}

export interface VerifyResponse {
  success: boolean;
  message: string;
  transactionId?: string;
}
