export type PaymentGatewayType = 'razorpay' | 'phonepe';

export interface PaymentGatewayConfig {
  name: string;
  key?: string;
}