import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/server';
import { createAdminClient } from '@/lib/supabase/admin';
import type Stripe from 'stripe';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: `Webhook error: ${message}` }, { status: 400 });
  }

  const supabase = createAdminClient();

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.supabase_user_id
        || (session.subscription
          ? ((await stripe.subscriptions.retrieve(session.subscription as string)).metadata.supabase_user_id)
          : null);

      if (userId && session.subscription) {
        const sub = await stripe.subscriptions.retrieve(session.subscription as string);
        const trialEnd = sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null;
        const interval = sub.items.data[0]?.price?.recurring?.interval || 'year';

        await supabase.from('profiles').update({
          subscription_tier: 'pro',
          subscription_status: sub.status,
          stripe_subscription_id: sub.id,
          trial_ends_at: trialEnd,
          billing_interval: interval,
          onboarding_step: 3,
        }).eq('id', userId);
      }
      break;
    }

    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription;
      const userId = sub.metadata.supabase_user_id;

      if (userId) {
        const tier = sub.status === 'active' || sub.status === 'trialing' ? 'pro' : 'free';
        await supabase.from('profiles').update({
          subscription_tier: tier,
          subscription_status: sub.status,
        }).eq('id', userId);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
