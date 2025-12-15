"use client";

import { FormEvent, useState } from "react";
import { useToolOutput } from "../../hooks/use-tool-output";
import { useCallTool } from "../../hooks/use-call-tool";
import { useOpenExternal } from "../../hooks/use-open-external";

type Product = {
  name: string;
  priceId: string;
};

export default function ProductsPage() {
  const callTool = useCallTool();
  const openExternal = useOpenExternal();
  const toolOutput = useToolOutput<{ products?: Product[] }>();
  const products = Array.isArray(toolOutput?.products)
    ? toolOutput.products
    : [];

  const [status, setStatus] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const selectedIds = formData.getAll("cart[]").map(String);

    if (!selectedIds.length) {
      setStatus("Select at least one product to continue.");
      return;
    }

    try {
      const result = await callTool("buy-products", {
        priceIds: selectedIds,
      });

      const checkoutUrl =
        result?.structuredContent &&
        (result.structuredContent as { checkoutSessionUrl?: string })
          .checkoutSessionUrl;

      if (checkoutUrl) {
        setCheckoutUrl(checkoutUrl);
        setStatus("Checkout ready. Click the button below to continue.");
      } else {
        setStatus("No checkout URL returned. Please try again.");
      }
    } catch (error) {
      console.error("Failed to start checkout", error);
      setStatus("Failed to start checkout. Please try again.");
    }
  };

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Select products to purchase</h1>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-3">
          {products.length ? (
            products.map((product) => (
              <label
                key={product.priceId}
                className="flex items-center gap-3 rounded border border-gray-200 p-3"
              >
                <input
                  type="checkbox"
                  name="cart[]"
                  value={product.priceId}
                  className="size-4"
                />
                <span className="font-medium">{product.name}</span>
              </label>
            ))
          ) : (
            <p className="text-sm text-gray-500">
              Waiting for products from the tool output…
            </p>
          )}
        </div>

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-black/90 disabled:opacity-60"
          disabled={!products.length}
        >
          Buy
        </button>

        {checkoutUrl ? (
          <button
            type="button"
            onClick={() => checkoutUrl && openExternal(checkoutUrl)}
            className="inline-flex w-full items-center justify-center rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 transition hover:bg-gray-50"
          >
            Open checkout
          </button>
        ) : null}

        {status ? (
          <p className="text-sm text-gray-700" role="status">
            {status}
          </p>
        ) : null}
      </form>
    </main>
  );
}
