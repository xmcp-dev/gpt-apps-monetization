import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function getCheckoutSession(priceId: string) {
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: "https://example.com/checkout/success",
    cancel_url: "https://example.com/checkout/cancel",
  });

  return session;
}

export async function getCheckoutSessionForProducts(priceIds: string[]) {
  const uniquePriceIds = Array.from(new Set(priceIds));

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: uniquePriceIds.map((priceId) => ({
      price: priceId,
      quantity: 1,
    })),
    success_url: "https://example.com/checkout/success",
    cancel_url: "https://example.com/checkout/cancel",
  });

  return session;
}

export type FormattedProduct = {
  id: string;
  priceId: string;
  image: string | null;
  name: string;
  description: string | null;
};

export async function getProducts(): Promise<FormattedProduct[]> {
  const { data: products } = await stripe.products.list();
  return products.map((product) => {
    return {
      id: product.id,
      priceId: product.default_price as string,
      image: product.images?.[0],
      name: product.name,
      description: product.description,
    };
  });
}
