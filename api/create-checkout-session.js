import Stripe from 'stripe';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.STRIPE_SECRET_KEY;

  if (!apiKey) {
    console.error('[checkout] STRIPE_SECRET_KEY is not set');
    return res.status(500).json({ error: 'Stripe key not configured' });
  }

  const stripe = new Stripe(apiKey, {
    apiVersion: '2024-06-20',
  });

  const base = process.env.PUBLIC_BASE_URL || `https://${req.headers.host}`;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      customer_creation: 'always',
      success_url: `${base}/thanks.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/waitlist.html`,
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('[checkout error]', err.message);
    return res.status(500).json({ error: err.message });
  }
}
