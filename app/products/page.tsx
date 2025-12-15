import { getCheckoutSession, getProducts } from "@/lib/stripe";
import Image from "next/image";

export default async function ProductsPage() {
  const products = await getProducts();

  const handleSubmit = async (formData: FormData) => {
    "use server";

    const priceId = formData.get("priceId") as string;

    if (!priceId) {
      return;
    }

    const session = await getCheckoutSession(priceId);

    console.log(session);
  };

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Select product to purchase</h1>
      </header>

      <form action={handleSubmit} className="space-y-4">
        <div className="space-y-3">
          {products.length ? (
            products.map((product) => (
              <label
                key={product.priceId}
                className="flex items-center gap-3 rounded border border-gray-200 p-3"
              >
                <input
                  type="radio"
                  name="priceId"
                  value={product.priceId}
                  className="size-4"
                />
                {product.image && (
                  <Image
                    width={40}
                    height={40}
                    src={product.image}
                    alt={product.name}
                    className="rounded object-cover border"
                  />
                )}
                <div className="flex flex-col gap-1">
                  <span className="font-medium">{product.name}</span>
                  <span className="text-sm text-gray-500">
                    {product.description}
                  </span>
                </div>
              </label>
            ))
          ) : (
            <p className="text-sm text-gray-500">Loading...</p>
          )}
        </div>

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-black/90 disabled:opacity-60"
          disabled={!products.length}
        >
          Buy
        </button>
      </form>
    </main>
  );
}
