import { getProductById } from "@/api/productsAPI";
import ProductDetails from "@/components/Products/ProductDetails";
import ProductRecommendations from "@/components/Products/ProductRecommendations";
import { cookies } from "next/headers";
import { Suspense } from "react";

// Loading component with better skeleton UI
function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image skeleton */}
        <div className="animate-pulse">
          <div className="bg-gray-200 rounded-lg aspect-square w-full"></div>
          <div className="flex gap-2 mt-4">
            <div className="bg-gray-200 rounded-lg w-20 h-20"></div>
            <div className="bg-gray-200 rounded-lg w-20 h-20"></div>
            <div className="bg-gray-200 rounded-lg w-20 h-20"></div>
          </div>
        </div>

        {/* Details skeleton */}
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          <div className="h-10 bg-gray-200 rounded w-1/3 mt-8"></div>
        </div>
      </div>
    </div>
  );
}

// Component
export default async function ProductDetailsPage({
  params,
}: {
  params: { productId: string };
}) {
  try {
    const token = (await cookies()).get("auth-token-ecommerce")?.value || "";
    const { productId } = await params;

    // Fetch product data with a shorter timeout
    const productPromise = getProductById(productId, token);
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timeout")), 3000)
    );

    const productResponse = await Promise.race([
      productPromise,
      timeoutPromise,
    ]);
    const product = productResponse?.data;

    if (!product) {
      return <p className="text-center text-gray-500">Product not found</p>;
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<Loading />}>
          <ProductDetails product={product} />
        </Suspense>

        {/* Load recommendations after main content */}
        <Suspense
          fallback={
            <div className="h-48 bg-gray-100 rounded-lg mt-8 animate-pulse"></div>
          }
        >
          <ProductRecommendations productId={product.id} />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error("Error loading product:", error);
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-red-500">
          {error instanceof Error
            ? error.message
            : "Failed to load product. Please try again."}
        </p>
      </div>
    );
  }
}
