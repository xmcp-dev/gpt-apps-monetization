import { getCheckoutSessionForProducts } from "@/lib/stripe";
import { ToolMetadata, InferSchema } from "xmcp";
import { z } from "zod";

export const schema = {
  priceIds: z
    .array(z.string())
    .nonempty()
    .describe("The IDs of the products to buy"),
};

export const metadata: ToolMetadata = {
  name: "buy-products",
  description:
    "Create a checkout page link for purchasing the selected products",
  _meta: {
    openai: {
      widgetAccessible: true,
      resultCanProduceWidget: true,
    },
  },
};

export default async function handler({
  priceIds,
}: InferSchema<typeof schema>) {
  const session = await getCheckoutSessionForProducts(priceIds);

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
