"use client";

import { useCallTool } from "@/hooks/use-call-tool";
import { FormattedProduct } from "@/lib/stripe";
import Image from "next/image";

export default function Product({ product }: { product: FormattedProduct }) {
  const callTool = useCallTool();

  const handleClick = async () => {
    const response = await callTool("buy_product", {
      priceId: product.priceId,
    });
    console.log(response?.structuredContent);
  };

  return (
    <button
      className="flex items-center gap-3 rounded border border-gray-200 p-3 cursor-pointer"
      onClick={handleClick}
    >
      {product.image && (
        <Image src={product.image} alt={product.name} width={40} height={40} />
      )}
      <div className="flex flex-col gap-1">
        <span className="font-medium">{product.name}</span>
        <span className="text-sm text-gray-500">{product.description}</span>
      </div>
    </button>
  );
}
