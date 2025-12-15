import { getAppsSdkCompatibleHtml } from "@/lib/utils";
import { ToolMetadata } from "xmcp";

export const metadata: ToolMetadata = {
  name: "list_products",
  description: "List the products available for purchase",
  _meta: {
    openai: {
      widgetCSP: {
        connect_domains: ["https://checkout.stripe.com"],
        resource_domains: ["https://checkout.stripe.com"],
      },
    },
  },
};

export default async function handler() {
  const suggestedProducts = [
    // The price IDs from the earlier step
    { priceId: "price_1Secq0Bl7UhENxFIHZHYMbXG", name: "Test product 1" },
    { priceId: "price_1SecosBl7UhENxFI2Wulmea8", name: "Test product 2" },
  ];

  console.log(suggestedProducts);

  return {
    structuredContent: { products: suggestedProducts },
    content: [
      {
        type: "text",
        text: await getAppsSdkCompatibleHtml("/products"),
      },
    ],
  };
}
