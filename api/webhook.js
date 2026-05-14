// /api/webhook.js
// Vercel serverless function. Receives the Stripe `checkout.session.completed`
// event after a Founding Member pays, then sends the confirmation email via
// Resend. This fires server-side so the email goes out even if the user
// closes their browser before reaching thanks.html.
//
// Required env vars:
//   STRIPE_SECRET_KEY        sk_live_... / sk_test_...
//   STRIPE_WEBHOOK_SECRET    whsec_...   (from Stripe → Developers → Webhooks)
//   RESEND_API_KEY           re_...      (from resend.com)
//   FROM_EMAIL               "HealthLink360 <hello@healthlink360.ai>"
//
// IMPORTANT: Stripe webhooks require the raw request body to verify the
// signature. Vercel parses JSON by default, so we disable that below.

import Stripe from 'stripe';
import { Resend } from 'resend';

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
});
const resend = new Resend(process.env.RESEND_API_KEY);

// Helper: read the raw request body as a Buffer
async function buffer(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method not allowed');
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    const raw = await buffer(req);
    event = stripe.webhooks.constructEvent(
      raw,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('[webhook] signature verification failed', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const email = session.customer_details?.email || session.customer_email;
    const name = session.customer_details?.name || 'there';

    if (!email) {
      console.warn('[webhook] no email on session', session.id);
      return res.status(200).json({ received: true });
    }

    try {
      await resend.emails.send({
        from: process.env.FROM_EMAIL,
        to: email,
        subject: "You're in — HealthLink360 founding cohort",
        html: confirmationEmailHTML({ name, sessionId: session.id }),
      });
      console.log('[webhook] confirmation sent to', email);
    } catch (err) {
      console.error('[webhook] resend send failed', err);
      // Return 200 anyway so Stripe doesn't retry the webhook for an email failure.
      // Monitor Resend dashboard for delivery problems separately.
    }
  }

  return res.status(200).json({ received: true });
}

// ──────────────────────────────────────────────────────────────────
// Confirmation email template (inline HTML — kept simple on purpose)
// ──────────────────────────────────────────────────────────────────
function confirmationEmailHTML({ name, sessionId }) {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#08030f;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#fff;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#08030f;padding:40px 20px;">
      <tr><td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:linear-gradient(180deg,#1a0e2a 0%,#110820 100%);border:1px solid rgba(255,255,255,0.10);border-radius:24px;padding:48px 40px;">
          <tr><td>
            <div style="display:inline-block;font-family:ui-monospace,monospace;font-size:11px;letter-spacing:0.12em;color:#ff2bd6;background:rgba(255,43,214,0.16);padding:6px 12px;border-radius:999px;text-transform:uppercase;margin-bottom:20px;">Reservation Confirmed</div>
            <h1 style="font-size:32px;font-weight:600;letter-spacing:-0.02em;margin:0 0 16px;color:#fff;line-height:1.1;">You're in, ${escapeHtml(name)}.</h1>
            <p style="font-size:16px;line-height:1.55;color:rgba(255,255,255,0.78);margin:0 0 28px;">
              Welcome to the HealthLink360 founding cohort. Your $80 reservation is secured and your founding spot is locked in.
            </p>

            <h2 style="font-size:14px;font-family:ui-monospace,monospace;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.55);margin:32px 0 16px;">What happens next</h2>
            <ol style="margin:0 0 28px;padding-left:20px;color:rgba(255,255,255,0.85);font-size:15px;line-height:1.6;">
              <li style="margin-bottom:10px;">We'll invite you in waves as the product opens — typically 4 to 8 weeks.</li>
              <li style="margin-bottom:10px;">You'll get a short survey to help us prioritize what to build first.</li>
              <li>Your founding-tier price is locked in for life.</li>
            </ol>

            <p style="font-size:14px;color:rgba(255,255,255,0.55);margin:32px 0 0;border-top:1px solid rgba(255,255,255,0.08);padding-top:20px;">
              Questions? Just reply to this email or write to <a href="mailto:info@healthlink360.ai" style="color:#ff2bd6;text-decoration:none;">info@healthlink360.ai</a>.
            </p>
            <p style="font-size:11px;font-family:ui-monospace,monospace;color:rgba(255,255,255,0.35);margin:16px 0 0;">
              Receipt ref · ${sessionId}
            </p>
          </td></tr>
        </table>
        <p style="font-size:12px;color:rgba(255,255,255,0.35);margin-top:24px;">© 2026 HealthLink360, Inc.</p>
      </td></tr>
    </table>
  </body>
</html>`;
}

function escapeHtml(s = '') {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
