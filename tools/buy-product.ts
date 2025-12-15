import { getCheckoutSession } from "@/lib/stripe";
import { InferSchema } from "xmcp";
import { z } from "zod";
import { ToolMetadata } from "xmcp";

export const schema = {
  priceId: z.string().describe("The ID of the product to buy"),
};

export const metadata: ToolMetadata = {
  name: "buy_product",
  description:
    "Create a checkout page link for purchasing the selected products",
  annotations: {
    readOnlyHint: true,
  },
  _meta: {
    openai: {
      widgetAccessible: true,
      resultCanProduceWidget: true,
    },
  },
};

export default async function handler({ priceId }: InferSchema<typeof schema>) {
  const session = await getCheckoutSession(priceId);

  console.log(session);

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
