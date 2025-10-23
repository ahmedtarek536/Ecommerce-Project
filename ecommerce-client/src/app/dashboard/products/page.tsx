// `ProductsPage.tsx` - Server Component

import { getProducts } from "@/api/productsAPI";
import ProductTable from "@/components/Products/ProductTable";

export default async function ProductsPage() {
  const products = await getProducts("", "");

  return (
    <div className="">
      <div className="px-4">
        <ProductTable products={products.data} />
      </div>
    </div>
  );
}
