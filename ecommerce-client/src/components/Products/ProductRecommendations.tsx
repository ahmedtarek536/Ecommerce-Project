import { getProductReccomendation } from "@/api/productsAPI";
import ProductCard from "./ProductCard";
import { cookies } from "next/headers";
type Image = {
  id: number;
  productVariantId: number;
  imageUrl: string;
  productVariant: null; // Adjust if this should be a type or object
};

type ProductVariant = {
  id: number;
  color: string;
  quantity: number;
  images: Image[];
};

type SubCategory = {
  name: string;
};

type Category = {
  name: string;
};

type Product = {
  id: number;
  name: string;
  price: number;
  category: Category;
  subCategory: SubCategory;
  productVariants: ProductVariant[];
};

export default async function ProductRecommendations({
  productId,
}: {
  productId: number;
}) {
  const token = (await cookies()).get("auth-token-ecommerce")?.value;

  const products = await getProductReccomendation(productId, token);

  return (
    <div className="mt-16 ">
      {products.data.length ? (
        <>
          <div className="flex justify-between items-center gap-3 border-b pb-3">
            <h5 className="font-bold text-lg sm:text-2xl text-black">
              You May Also Like
            </h5>
          </div>
          <div className="w-full recommendation overflow-x-auto mt-8">
            <div className="flex gap-6 flex-nowrap">
              {products.data.map((product: Product) => (
                <div key={product.id} className="shrink-0 w-[250px]">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div></div>
      )}
    </div>
  );
}
