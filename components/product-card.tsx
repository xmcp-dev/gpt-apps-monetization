"use client";

import Image from "next/image";
import { ChangeEvent } from "react";

type Product = {
  name: string;
  priceId: string;
  image: string | null;
};

type ProductCardProps = {
  product: Product;
  quantity: number;
  onQuantityChange: (priceId: string, quantity: number) => void;
};

export function ProductCard({
  product,
  quantity,
  onQuantityChange,
}: ProductCardProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextQuantity = Math.max(
      0,
      Math.floor(Number(event.target.value) || 0)
    );
    onQuantityChange(product.priceId, nextQuantity);
  };

  return (
    <div className="flex flex-col gap-3 rounded border border-gray-200 p-3">
      <div className="aspect-video overflow-hidden rounded bg-gray-50">
        {product.image ? (
          <Image
            src={product.image}
            width={100}
            height={100}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-500">
            No image available
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <span className="font-medium">{product.name}</span>
      </div>
      <label className="flex items-center justify-between gap-3 text-sm font-medium">
        <span>Quantity</span>
        <input
          type="number"
          name={`quantity-${product.priceId}`}
          min={0}
          step={1}
          value={quantity}
          onChange={handleChange}
          className="w-24 rounded border border-gray-200 px-2 py-1 text-right"
        />
      </label>
    </div>
  );
}
