# Stripe + Email Setup (Vercel)

This site has a paid founding-member waitlist. Reservations charge $80 via
Stripe Checkout, and a confirmation email is sent via Resend on the
`checkout.session.completed` webhook.

## Files

```
api/
  create-checkout-session.js   creates the Stripe Checkout Session
  webhook.js                   handles checkout.session.completed → sends email
package.json                   declares stripe + resend deps
.env.example                   template for env vars (do not commit real .env)
waitlist.html                  marketing page + pay button
thanks.html                    post-payment confirmation page
```

## One-time setup

### 1. Stripe

1. In the Stripe Dashboard, create a **Product** called something like
   "HealthLink360 Founding Member".
2. Add a **Price** of $80 USD, one-time.
3. Copy the **Price ID** (starts with `price_…`).
   - ✅ You already have this: `price_1TWwCVE9LPwfUjXM3fjzyrsF`. It's prefilled
     in `.env.example`. Just paste it into Vercel as `STRIPE_PRICE_ID`.
4. Copy your **Secret key** (`sk_live_…` or `sk_test_…` for testing).

### 2. Resend

1. Create a free account at [resend.com](https://resend.com).
2. Add and verify your sending domain (`healthlink360.ai`) — Resend will give
   you DNS records to add.
3. Create an **API key** (`re_…`).

### 3. Vercel deploy

1. Push this repo to GitHub and import it into Vercel.
2. In **Project Settings → Environment Variables**, add the values from
   `.env.example`:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_PRICE_ID`
   - `STRIPE_WEBHOOK_SECRET` (filled in step 4 below)
   - `RESEND_API_KEY`
   - `FROM_EMAIL`
   - `PUBLIC_BASE_URL`
3. Deploy.

### 4. Stripe webhook

1. In Stripe Dashboard → **Developers → Webhooks → Add endpoint**.
2. URL: `https://yourdomain.com/api/webhook`
3. Event to listen for: `checkout.session.completed`
4. After creating, reveal the **Signing secret** (`whsec_…`) and set it as
   `STRIPE_WEBHOOK_SECRET` in Vercel. Redeploy.

## Testing locally

You can run a Stripe test flow without any real money:

1. Use the test secret key (`sk_test_…`) and a test Price ID.
2. Forward webhooks to localhost:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhook
   ```
   The CLI prints a `whsec_…` — use that as `STRIPE_WEBHOOK_SECRET` while
   testing.
3. Test card: `4242 4242 4242 4242`, any future expiry, any CVC.

## How the flow works

```
waitlist.html
  ↓ click "Reserve my spot"
POST /api/create-checkout-session   (Stripe Checkout Session created)
  ↓ 302
checkout.stripe.com  (hosted by Stripe — handles card entry, 3DS, etc.)
  ↓ on success
thanks.html?session_id=cs_…

(in parallel, server-side:)
Stripe → POST /api/webhook
  ↓ verify signature
  ↓ extract customer email + name
Resend → confirmation email
```

The confirmation email is sent from the webhook, not from `thanks.html`,
so it goes out reliably even if the user closes their browser before
landing on the thank-you page.
