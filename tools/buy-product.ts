import { getCheckoutSession } from "@/lib/stripe";
import { InferSchema } from "xmcp";
import { z } from "zod";
import { ToolMetadata } from "xmcp";

export const schema = {
  priceId: z.string().describe("The ID of the product to buy"),
};

export const metadata: ToolMetadata = {
  name: "buy-product",
  description:
    "Create a checkout page link for purchasing the selected products",
  _meta: {
    openai: {
      widgetAccessible: true,
      resultCanProduceWidget: true,
    },
  },
};

export default async function handler({ priceId }: InferSchema<typeof schema>) {
  try {
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
  } catch (error) {
    console.error("Failed to create checkout session", error);
    return {
      content: [
        {
          type: "text",
          text: "Unable to start checkout right now. Please try again.",
        },
      ],
      structuredContent: null,
    };
  }
}
