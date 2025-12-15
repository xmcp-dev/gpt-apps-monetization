"use client";

import { FormEvent, useState } from "react";
import { useCallTool } from "@/hooks/use-call-tool";
import { FormattedProduct } from "@/lib/stripe";

type CheckoutOutput = {
  checkoutSessionId: string;
  checkoutSessionUrl: string | null;
};

export default function ProductsClient({
  products,
}: {
  products: FormattedProduct[];
}) {
  const callTool = useCallTool();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!callTool) {
      setError("Tool calling is not available yet.");
      return;
    }

    if (!selectedId) {
      setError("Select a product to continue.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await callTool("buy_product", { priceId: selectedId });
      const checkoutUrl = (response?.structuredContent as CheckoutOutput | null)
        ?.checkoutSessionUrl;

      if (checkoutUrl) {
        if (window.openai?.openExternal) {
          window.openai.openExternal({ href: checkoutUrl });
        } else {
          window.open(checkoutUrl, "_blank");
        }
      }
    } catch (toolError) {
      console.error("Failed to start checkout:", toolError);
      setError("Unable to start checkout. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Select a product to purchase</h1>
        <p className="text-sm text-gray-600">
          Choose one item and we&apos;ll open a checkout session for you.
        </p>
      </header>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-3">
          {products.length ? (
            products.map((product) => (
              <label
                key={product.priceId}
                className="flex gap-3 rounded border border-gray-200 p-3"
              >
                <input
                  type="radio"
                  name="product"
                  value={product.priceId}
                  checked={selectedId === product.priceId}
                  onChange={() => setSelectedId(product.priceId)}
                  className="mt-1 h-4 w-4"
                />
                <div className="flex flex-col gap-1">
                  <span className="font-medium">{product.name}</span>
                  {product.description && (
                    <span className="text-sm text-gray-500">
                      {product.description}
                    </span>
                  )}
                </div>
              </label>
            ))
          ) : (
            <p className="text-sm text-gray-500">No products available.</p>
          )}
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          className="w-full rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        >
          {isSubmitting ? "Creating checkout..." : "Buy"}
        </button>
      </form>
    </main>
  );
}
