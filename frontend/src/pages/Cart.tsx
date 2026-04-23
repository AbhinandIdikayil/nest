import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { get, post } from '../services/api';
import { RazorpayGateway, PhonePeGateway } from '../payment';
import type { PaymentGatewayType } from '../config/payment';

interface CartItem {
  id: string;
  productTitle: string;
  productDescription: string;
  cartId: string;
  variantId: string;
  quantity: number;
  unitPrice: number;
  createdAt: string;
}

interface Cart {
  id: string;
  customerId: string;
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  items: CartItem[];
}

const gateways = {
  razorpay: new RazorpayGateway({ name: 'Razorpay' }),
  phonepe: new PhonePeGateway({ name: 'PhonePe' }),
};

function Cart() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentGatewayType>('razorpay');

  useEffect(() => {
    const token = searchParams.get('tk');
    if (token) {
      localStorage.setItem('access_token', token);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await get(`/cart/customer/${id}`);
        setCart(data);
      } catch (error) {
        console.error('Failed to fetch cart:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [id]);

  const cartItems = cart?.items || [];
  const subtotal = cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const total = subtotal;

  const handleCheckout = async () => {
    if (!cart?.customer) return;
    
    try {
      setCheckoutLoading(true);
      const gateway = gateways[paymentMethod];
      if (!gateway) {
        throw new Error(`Gateway ${paymentMethod} not available`);
      }
      await gateway.initiateCheckout({
        amount: total,
        cartId: id!,
        customer: {
          name: `${cart.customer.firstName} ${cart.customer.lastName}`.trim(),
          email: cart.customer.email,
          phone: cart.customer.phone,
        },
      });
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Failed to initiate checkout. Please try again.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="size-6 border-2 border-(--border) border-t-(--accent) rounded-full animate-spin" style={{ animationDuration: '0.8s' }} />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen relative bg-(--bg)">
      <div className="fixed inset-0 pointer-events-none z-0" style={{ background: 'radial-gradient(circle at 20% 20%, var(--accent-bg) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(170, 59, 255, 0.05) 0%, transparent 50%)' }} />
      
      <header className="relative z-10 px-6 py-8 border-b border-(--border)">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <span className="w-10 h-10 flex items-center justify-center text-2xl font-semibold text-(--accent) border border-(--accent) rounded-lg">C</span>
          <h1 className="flex-1 text-2xl font-medium tracking-tight text-(--text-h) text-left">Your Bag</h1>
          <span className="text-sm text-(--text)">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</span>
        </div>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2 space-y-4">
            <span className="text-xs uppercase tracking-widest text-(--text)">Selected</span>
            
            {cartItems.length === 0 ? (
              <div className="py-12 text-center text-(--text)">
                <span className="block text-5xl mb-4 text-(--border)">○</span>
                <p>Your bag is empty</p>
              </div>
            ) : (
              <ul className="space-y-0">
                {cartItems.map((item, index) => (
                  <li 
                    key={item.id} 
                    className="flex items-center gap-4 py-4 border-b border-(--border) animate-fadeSlideIn"
                    style={{ animationDelay: `${index * 80}ms` }}
                  >
                    <div className="w-18 h-18 bg-(--code-bg) rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                      <span className="text-2xl text-(--border)">●</span>
                    </div>
                    <div className="flex-1 flex flex-col gap-1">
                      <h3 className="text-sm font-medium text-(--text-h)">{item.productTitle}</h3>
                      <p className="text-xs text-(--text) line-clamp-1">{item.productDescription}</p>
                      <span className="text-xs text-(--text)">Qty: {item.quantity}</span>
                    </div>
                    <span className="text-sm font-medium text-(--text-h) font-mono">₹{(item.unitPrice * item.quantity / 100).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <aside className="flex flex-col gap-4">
            <div className="bg-(--code-bg) rounded-xl p-6">
              <h2 className="text-lg font-medium text-(--text-h) mb-5">Summary</h2>
              
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-(--text)">Subtotal</span>
                  <span className="text-(--text-h) font-mono">₹{(subtotal / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-(--border)">
                  <span className="font-medium text-(--text-h)">Total</span>
                  <span className="font-medium text-(--text-h) font-mono">₹{(total / 100).toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-5 space-y-2">
                {Object.keys(gateways).map((gateway) => (
                  <label key={gateway} className="flex items-center gap-3 p-3 bg-(--bg) rounded-lg cursor-pointer hover:bg-opacity-80 transition-all">
                    <input
                      type="radio"
                      name="payment"
                      value={gateway}
                      checked={paymentMethod === gateway}
                      onChange={() => setPaymentMethod(gateway as PaymentGatewayType)}
                      className="size-4 text-(--accent)"
                    />
                    <span className="text-sm text-(--text-h)">Pay with {gateway.charAt(0).toUpperCase() + gateway.slice(1)}</span>
                  </label>
                ))}
              </div>

              <button
                onClick={handleCheckout}
                disabled={cartItems.length === 0 || checkoutLoading}
                className="w-full mt-5 py-3.5 px-6 bg-(--accent) text-white border-none rounded-lg text-sm font-medium tracking-wide cursor-pointer transition-all hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {checkoutLoading ? 'Processing...' : 'Checkout'}
              </button>
            </div>

            <div className="bg-(--code-bg) rounded-xl p-6">
              <h3 className="text-sm font-medium text-(--text-h) mb-4">Accept</h3>
              <div className="flex gap-2">
                <span className="text-[0.625rem] py-1.5 px-2.5 bg-(--bg) rounded text-(--text)">VISA</span>
                <span className="text-[0.625rem] py-1.5 px-2.5 bg-(--bg) rounded text-(--text)">MC</span>
                <span className="text-[0.625rem] py-1.5 px-2.5 bg-(--bg) rounded text-(--text)">AMEX</span>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default Cart;