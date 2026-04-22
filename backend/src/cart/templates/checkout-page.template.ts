import { Cart } from '../../common/entity/cart.entity';
import { LineItem } from '../../common/entity/line-item.entity';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount / 100);
}

function renderItems(items: LineItem[]): string {
  return items
    .map((item, index) => {
      const itemTotal = item.quantity * item.unitPrice;

      return `
        <article class="line-item">
          <div class="line-item__meta">
            <p class="line-item__eyebrow">Line ${String(index + 1).padStart(2, '0')}</p>
            <h3>${escapeHtml(item.productTitle || 'Untitled product')}</h3>
            <p>${escapeHtml(item.productDescription || 'Ready to ship from your active cart.')}</p>
            <div class="line-item__tags">
              <span>Variant ${escapeHtml(item.variantId || 'N/A')}</span>
              <span>Qty ${item.quantity}</span>
            </div>
          </div>
          <div class="line-item__price">
            <strong>${formatCurrency(itemTotal)}</strong>
            <span>${formatCurrency(item.unitPrice)} each</span>
          </div>
        </article>
      `;
    })
    .join('');
}

export function renderCheckoutPage(cart: Cart): string {
  const items = cart.items ?? [];
  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0,
  );
  const total = subtotal;
  const customerName = [cart.customer?.firstName, cart.customer?.lastName]
    .filter(Boolean)
    .join(' ');
  const identityLabel = customerName || cart.customer?.email || cart.customerId;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Checkout for ${escapeHtml(identityLabel)}</title>
    <style>
      :root {
        --paper: #f7f1e8;
        --paper-deep: #ead9c2;
        --ink: #1d1b19;
        --muted: #675e57;
        --accent: #c24d2c;
        --accent-soft: rgba(194, 77, 44, 0.14);
        --panel: rgba(255, 252, 247, 0.74);
        --line: rgba(29, 27, 25, 0.08);
        --shadow: 0 20px 70px rgba(72, 49, 23, 0.14);
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        min-height: 100vh;
        font-family: Georgia, "Times New Roman", serif;
        color: var(--ink);
        background:
          radial-gradient(circle at top left, rgba(194, 77, 44, 0.22), transparent 34%),
          radial-gradient(circle at top right, rgba(40, 89, 76, 0.18), transparent 32%),
          linear-gradient(135deg, var(--paper) 0%, #f3e5d0 42%, #f8f5ef 100%);
      }

      body::before {
        content: "";
        position: fixed;
        inset: 0;
        pointer-events: none;
        opacity: 0.22;
        background-image:
          linear-gradient(rgba(29, 27, 25, 0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(29, 27, 25, 0.04) 1px, transparent 1px);
        background-size: 28px 28px;
        mask-image: radial-gradient(circle at center, black, transparent 82%);
      }

      .shell {
        width: min(1160px, calc(100vw - 32px));
        margin: 0 auto;
        padding: 32px 0 48px;
      }

      .marquee {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        margin-bottom: 22px;
        padding: 10px 16px;
        border: 1px solid var(--line);
        border-radius: 999px;
        font-size: 12px;
        letter-spacing: 0.24em;
        text-transform: uppercase;
        background: rgba(255, 255, 255, 0.38);
        backdrop-filter: blur(14px);
      }

      .hero {
        display: grid;
        grid-template-columns: 1.15fr 0.85fr;
        gap: 24px;
        align-items: stretch;
      }

      .summary-card,
      .items-card {
        position: relative;
        overflow: hidden;
        border: 1px solid rgba(29, 27, 25, 0.09);
        background: var(--panel);
        backdrop-filter: blur(18px);
        box-shadow: var(--shadow);
      }

      .summary-card {
        padding: 32px;
        border-radius: 34px 34px 34px 110px;
      }

      .items-card {
        padding: 18px;
        border-radius: 32px;
      }

      .summary-card::after {
        content: "";
        position: absolute;
        inset: auto -60px -60px auto;
        width: 180px;
        height: 180px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(194, 77, 44, 0.22), transparent 68%);
      }

      .section-label,
      .line-item__eyebrow {
        margin: 0 0 12px;
        color: var(--muted);
        font-size: 12px;
        letter-spacing: 0.26em;
        text-transform: uppercase;
      }

      h2,
      h3,
      .amount {
        font-family: "Palatino Linotype", "Book Antiqua", Palatino, serif;
      }

      .amount {
        display: block;
        font-size: 1.55rem;
        line-height: 1.1;
      }

      .summary-list span,
      .line-item__price span {
        color: var(--muted);
      }

      .summary-list {
        display: grid;
        gap: 16px;
        margin: 28px 0;
      }

      .payment-methods {
        display: grid;
        gap: 12px;
        margin: 0 0 26px;
      }

      .payment-option {
        position: relative;
      }

      .payment-option input {
        position: absolute;
        opacity: 0;
        pointer-events: none;
      }

      .payment-option label {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 16px 18px;
        border: 1px solid var(--line);
        border-radius: 20px;
        background: rgba(255, 255, 255, 0.56);
        cursor: pointer;
        transition:
          border-color 160ms ease,
          transform 160ms ease,
          background 160ms ease,
          box-shadow 160ms ease;
      }

      .payment-option label::before {
        content: "";
        width: 18px;
        height: 18px;
        border: 1.5px solid rgba(29, 27, 25, 0.3);
        border-radius: 50%;
        background: linear-gradient(135deg, #fffaf4, #f1e4d0);
        flex-shrink: 0;
      }

      .payment-option strong {
        display: block;
        font-size: 1rem;
      }

      .payment-option span {
        color: var(--muted);
        font-size: 0.88rem;
      }

      .payment-option input:checked + label {
        border-color: rgba(194, 77, 44, 0.38);
        background: rgba(194, 77, 44, 0.12);
        box-shadow: 0 12px 30px rgba(194, 77, 44, 0.1);
        transform: translateY(-1px);
      }

      .payment-option input:checked + label::before {
        border-color: var(--accent);
        background:
          radial-gradient(circle at center, var(--accent) 0 45%, transparent 46% 100%),
          linear-gradient(135deg, #fffaf4, #f1e4d0);
      }

      .summary-row {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 12px;
        padding-bottom: 14px;
        border-bottom: 1px solid var(--line);
      }

      .summary-row.total {
        padding-top: 10px;
        border-bottom: 0;
      }

      .cta {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        padding: 16px 18px;
        border: 0;
        border-radius: 999px;
        background: linear-gradient(135deg, #1d1b19 0%, #42362d 100%);
        color: #f8f5ef;
        font-weight: 700;
        font-size: 0.95rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .summary-note {
        margin: 16px 0 0;
        color: var(--muted);
        font-size: 0.92rem;
        line-height: 1.6;
      }

      .items-grid {
        display: grid;
        gap: 14px;
      }

      .line-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        padding: 22px;
        border-radius: 24px;
        border: 1px solid var(--line);
        background:
          linear-gradient(135deg, rgba(255, 255, 255, 0.66), rgba(255, 255, 255, 0.3)),
          var(--accent-soft);
      }

      .line-item h3 {
        margin: 0;
        font-size: 1.5rem;
      }

      .line-item p {
        margin: 8px 0 0;
        max-width: 64ch;
        color: var(--muted);
        line-height: 1.6;
      }

      .line-item__tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 16px;
      }

      .line-item__tags span {
        padding: 8px 12px;
        border-radius: 999px;
        font-size: 0.78rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        background: rgba(255, 255, 255, 0.72);
      }

      .line-item__price {
        min-width: 150px;
        text-align: right;
      }

      .line-item__price strong {
        display: block;
        font-size: 1.6rem;
      }

      .empty-state {
        padding: 30px;
        text-align: center;
        border-radius: 24px;
        border: 1px dashed rgba(29, 27, 25, 0.18);
        color: var(--muted);
        background: rgba(255, 255, 255, 0.42);
      }

      @media (max-width: 900px) {
        .hero {
          grid-template-columns: 1fr;
        }

        .summary-card {
          border-radius: 28px;
        }
      }

      @media (max-width: 640px) {
        .shell {
          width: min(100vw - 18px, 100%);
          padding: 18px 0 28px;
        }

        .marquee {
          flex-direction: column;
          border-radius: 22px;
          letter-spacing: 0.16em;
        }

        .summary-card,
        .items-card {
          padding: 20px;
        }

        .line-item {
          flex-direction: column;
          align-items: flex-start;
        }

        .line-item__price {
          min-width: unset;
          text-align: left;
        }
      }
    </style>
  </head>
  <body>
    <main class="shell">
      <section class="marquee">
        <span>Checkout Ledger</span>
        <span>Customer ${escapeHtml(cart.customerId)}</span>
        <span>Cart ${escapeHtml(cart.id)}</span>
      </section>

      <section class="hero">
        <section class="items-card">
          <p class="section-label">Cart Contents</p>
          <div class="items-grid">
            ${
              items.length > 0
                ? renderItems(items)
                : '<div class="empty-state">This active cart exists, but there are no line items in it yet.</div>'
            }
          </div>
        </section>

        <aside class="summary-card">
          <p class="section-label">Order Summary</p>
          <div class="summary-row">
            <span>Customer</span>
            <strong>${escapeHtml(identityLabel)}</strong>
          </div>
          <div class="summary-row">
            <span>Items</span>
            <strong>${itemCount}</strong>
          </div>
          <div class="summary-row">
            <span>Status</span>
            <strong>${cart.completedAt ? 'Closed' : 'Open'}</strong>
          </div>
          <div class="summary-list">
            <div class="summary-row">
              <span>Merchandise</span>
              <strong>${formatCurrency(subtotal)}</strong>
            </div>
            <div class="summary-row total">
              <span>Total due</span>
              <strong class="amount">${formatCurrency(total)}</strong>
            </div>
          </div>

          <p class="section-label">Payment Method</p>
          <div class="payment-methods">
            <div class="payment-option">
              <input id="razorpay" type="radio" name="paymentMethod" value="razorpay" checked />
              <label for="razorpay">
                <div>
                  <strong>Razorpay</strong>
                  <span>Cards, UPI, wallets and netbanking</span>
                </div>
              </label>
            </div>
            <div class="payment-option">
              <input id="phonepe" type="radio" name="paymentMethod" value="phonepe" />
              <label for="phonepe">
                <div>
                  <strong>PhonePe</strong>
                  <span>Fast UPI checkout with PhonePe</span>
                </div>
              </label>
            </div>
          </div>

          <button class="cta" type="button">Proceed to payment</button>
        </aside>
      </section>
    </main>
  </body>
</html>`;
}
