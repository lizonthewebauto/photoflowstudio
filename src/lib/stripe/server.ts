import Stripe from 'stripe';

let _stripe: Stripe | null = null;

export function getStripeServer(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      typescript: true,
    });
  }
  return _stripe;
}

// Re-export as `stripe` for convenience (lazy getter)
export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    return (getStripeServer() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

// Stripe price IDs (live)
export const PRICE_IDS = {
  pro_monthly: 'price_1TIDDZ6sBUq9lSXptdpu6JWC', // $29/mo
  pro_annual: 'price_1TIDco6sBUq9lSXp2bYaxW4a',   // $290/yr (10x monthly)
} as const;

// Pricing: annual = 10x monthly (2 months free)
export const PLANS = {
  pro: {
    name: 'Gridshot Pro',
    productId: 'prod_UGkihdxvFjsmBT',
    monthlyPrice: 2900, // $29/mo in cents
    annualPrice: 29000, // $290/yr in cents (10x monthly)
    features: [
      'Unlimited branded carousels',
      'AI copywriting in your brand voice',
      'Publish to 8 platforms',
      'Brand extraction from website',
      'Priority support',
    ],
  },
} as const;

export const TRIAL_DAYS = 7;
