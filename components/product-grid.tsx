"use client";

import { ProductCard } from "./product-card";

type Product = {
  name: string;
  priceId: string;
  image: string | null;
};

type ProductGridProps = {
  products: Product[];
  quantities: Record<string, number>;
  onQuantityChange: (priceId: string, quantity: number) => void;
};

export function ProductGrid({
  products,
  quantities,
  onQuantityChange,
}: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {products.map((product) => (
        <ProductCard
          key={product.priceId}
          product={product}
          quantity={quantities[product.priceId] ?? 0}
          onQuantityChange={onQuantityChange}
        />
      ))}
    </div>
  );
}
