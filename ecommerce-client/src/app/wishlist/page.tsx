import { getWishlist } from "@/api/wishlistAPI";
import ProductsWishlist from "@/components/Products/ProductsWishlist";
import { cookies } from "next/headers";
import React from "react";

export default async function Wishlist() {
  const token = (await cookies()).get("auth-token-ecommerce")?.value;

  if (!token) {
    return <ProductsWishlist products={[]} />;
  }

  const products = await getWishlist(token);

  return <ProductsWishlist products={products?.data} />;
}
