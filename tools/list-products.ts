import { getAppsSdkCompatibleHtml } from "@/lib/utils";
import { ToolMetadata } from "xmcp";

export const metadata: ToolMetadata = {
  name: "list_products",
  description: "List the products available for purchase",
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

export default async function handler() {
  return await getAppsSdkCompatibleHtml("/products");
}
