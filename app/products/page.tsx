import Product from "@/components/product";
import { getProducts } from "@/lib/stripe";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Select product to purchase</h1>
      </header>

      <div className="space-y-3">
        {products.length ? (
          products.map((product) => (
            <Product key={product.priceId} product={product} />
          ))
        ) : (
          <p className="text-sm text-gray-500">Loading...</p>
        )}
      </div>
    </main>
  );
}
