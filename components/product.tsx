"use client";

import { useState } from "react";
import { useCallTool } from "@/hooks/use-call-tool";
import { useToolOutput } from "@/hooks/use-tool-output";
import { FormattedProduct } from "@/lib/stripe";
import Image from "next/image";

type CheckoutOutput = {
  checkoutSessionId: string;
  checkoutSessionUrl: string | null;
};

export default function Product({ product }: { product: FormattedProduct }) {
  const callTool = useCallTool();
  const toolOutput = useToolOutput<CheckoutOutput>();
  const [isPurchasing, setIsPurchasing] = useState(false);

  const defaultOutput: CheckoutOutput = {
    checkoutSessionId: "",
    checkoutSessionUrl: null,
  };

  const checkoutOutput = toolOutput || defaultOutput;

  const handleClick = async () => {
    if (!callTool) {
      console.error("callTool not available");
      return;
    }

    setIsPurchasing(true);
    try {
      await callTool("buy_product", {
        priceId: product.priceId,
      });
    } catch (error) {
      console.error("Failed to start checkout:", error);
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 rounded border border-gray-200 p-3">
      <button
        className="flex items-center gap-3 text-left"
        onClick={handleClick}
        disabled={isPurchasing || !callTool}
      >
        {product.image && (
          <Image
            src={product.image}
            alt={product.name}
            width={40}
            height={40}
          />
        )}
        <div className="flex flex-col gap-1">
          <span className="font-medium">{product.name}</span>
          <span className="text-sm text-gray-500">{product.description}</span>
        </div>
        <span className="ml-auto text-sm text-blue-600">
          {isPurchasing ? "Creating checkout..." : "Buy"}
        </span>
      </button>

      {checkoutOutput.checkoutSessionUrl && (
        <a
          className="text-sm text-green-700 underline"
          href={checkoutOutput.checkoutSessionUrl}
          target="_blank"
          rel="noreferrer"
        >
          Resume checkout
        </a>
      )}
    </div>
  );
}
