import { getCheckoutSession } from "@/lib/stripe";
import { InferSchema } from "xmcp";
import { z } from "zod";
import { ToolMetadata } from "xmcp";

export const schema = {
  priceIds: z.array(z.string()).describe("The IDs of the products to buy"),
};

export const metadata: ToolMetadata = {
  name: "buy_product",
  description:
    "Create a checkout page link for purchasing the selected products",
};

export default async function handler({
  priceIds,
}: InferSchema<typeof schema>) {
  const session = await getCheckoutSession(priceIds);

  return {
    content: [
      {
        type: "text",
        text: `[Complete your purchase here](${session.url})`,
      },
    ],
    structuredContent: {
      checkoutSessionId: session.id,
      checkoutSessionUrl: session.url,
    },
  };
}
