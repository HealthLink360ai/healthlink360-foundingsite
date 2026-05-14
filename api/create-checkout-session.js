// /api/create-checkout-session.js
// Vercel serverless function. Creates a Stripe Checkout Session for the
// HealthLink360 Founding Member reservation and returns its hosted URL.
//
// Required env vars (set in Vercel → Project Settings → Environment Variables):
//   STRIPE_SECRET_KEY    sk_live_... (or sk_test_... for testing)
//   STRIPE_PRICE_ID      price_...  (NOT prod_... — get this from your Stripe Product page)
//   PUBLIC_BASE_URL      https://yourdomain.com  (no trailing slash; used for redirect URLs)

import Stripe from 'stripe';

const stripe = new Stripe(' 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 ', {
  apiVersion: '2024-06-20',
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const base = process.env.PUBLIC_BASE_URL || `https://${req.headers.host}`;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      // Always collect email so we can send the confirmation
      customer_creation: 'always',
      billing_address_collection: 'auto',
      allow_promotion_codes: true,
      // Where Stripe sends the user after success / cancel
      success_url: `${base}/thanks.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/waitlist.html`,
      metadata: {
        product: 'healthlink360_founding_member',
      },
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('[create-checkout-session]', err);
    return res.status(500).json({ error: err.message });
  }
}
