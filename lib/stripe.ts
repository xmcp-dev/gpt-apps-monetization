import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function getCheckoutSession(priceIds: string[]) {
  const lineItems = priceIds.map((price) => ({ price, quantity: 1 }));

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    success_url: "https://example.com/checkout/success",
  });

  return session;
}
