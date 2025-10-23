"use client";
import { ArchiveBoxXMarkIcon } from "@heroicons/react/24/outline";
import ProductCard from "./ProductCard";
import { useState } from "react";

export default function ProductsWishlist({ products }) {
  const [productsWishlist, setProductsWishlist] = useState(products);
  return (
    <div className="container">
      <h3 className="mt-2 font-semibold text-2xl  py-4 ">Your Wishlist</h3>
      {productsWishlist?.length ? (
        <div className=" grid grid-template-250 gap-6 ">
          {productsWishlist.map((product) => (
            <div key={product.productVariantId} className="relative">
              <ProductCard
                product={product.product}
                productVariantId={product.productVariantId}
                setProductsWishlist={setProductsWishlist}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className=" mt-16">
          <div className="flex items-center justify-center">
            <ArchiveBoxXMarkIcon className="w-16 text-secondary " />
          </div>
          <p className="text-center font-semibold text-3xl mt-3">
            Your Wishlist are Empty !!
          </p>
        </div>
      )}
    </div>
  );
}
