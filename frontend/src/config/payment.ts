import type { PaymentGatewayType, PaymentGatewayConfig } from './payment.config';

export type { PaymentGatewayType, PaymentGatewayConfig };

export type PaymentGateway = {
  readonly type: PaymentGatewayType;
  readonly config: PaymentGatewayConfig;
  initiateCheckout(params: { amount: number; cartId: string; customer: { name: string; email: string; phone: string } }): Promise<void>;
};

export type PaymentGatewayFactory = {
  getGateway(type: PaymentGatewayType): PaymentGateway | null;
  registerGateway(gateway: PaymentGateway): void;
  getAvailableGateways(): PaymentGatewayType[];
};

const registeredGateways = new Map<PaymentGatewayType, PaymentGateway>();

export const paymentGatewayFactory: PaymentGatewayFactory = {
  getGateway(type: PaymentGatewayType): PaymentGateway | null {
    return registeredGateways.get(type) || null;
  },

  registerGateway(gateway: PaymentGateway): void {
    registeredGateways.set(gateway.type, gateway);
  },

  getAvailableGateways(): PaymentGatewayType[] {
    return Array.from(registeredGateways.keys());
  },
};