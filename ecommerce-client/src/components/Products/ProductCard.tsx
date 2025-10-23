"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { addItemToWishlist, removeItemFromWishlist } from "@/api/wishlistAPI";
import AuthModel from "../auth/Auth";
import { useAppStore } from "@/store/useAppStore";

type Image = {
  id: number;
  productVariantId: number;
  imageUrl: string;
  productVariant: null;
};

type ProductVariant = {
  id: number;
  color: string;
  quantity: number;
  images: Image[];
  favorite: boolean;
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
  quantity: number;
  productVariants: ProductVariant[];
  sizes: { id: number; name: string }[];
};

export default function ProductCard({
  product,
  productVariantId,
  setProductsWishlist,
}: {
  product: Product;
  productVariantId: number;
  setProductsWishlist?: (callback: (products: any[]) => any[]) => void;
}) {
  const router = useRouter();

  const { token } = useAppStore();
  const initialVariant: ProductVariant =
    productVariantId != null
      ? product.productVariants.find((v) => v.id === productVariantId)
      : product.productVariants[0];

  const [mainVariant, setMainVariant] = useState<ProductVariant>(
    initialVariant || product.productVariants[0]
  );
  const [openColors, setOpenColors] = useState(false);
  const [favorite, setFavorite] = useState<boolean>(
    mainVariant?.favorite || false
  );
  const [showAuthModal, setShowAuthModal] = useState(false);

  const toggleColorOptions = (open: boolean) => setOpenColors(open);

  const navigateToProduct = () => {
    router.push(`/products/${product.id}?variant=${mainVariant?.id}`);
  };

  const handleWishlistToggle = async () => {
    if (!token) {
      setShowAuthModal(true);
      return;
    }

    if (favorite) {
      await removeItemFromWishlist(mainVariant?.id, token);
      setFavorite(false);
      setProductsWishlist?.((products) =>
        products.filter((p) => p.product.id !== product.id)
      );
    } else {
      await addItemToWishlist(product.id, mainVariant?.id, token);
      setFavorite(true);
    }
  };

  return (
    <>
      <AuthModel model={showAuthModal} setModel={setShowAuthModal} />
      <div
        className="border border-1 shadow-sm"
        onMouseEnter={() => toggleColorOptions(true)}
        onMouseLeave={() => toggleColorOptions(false)}
      >
        <img
          src={mainVariant?.images[0]?.imageUrl || "/placeholder-image.jpg"}
          alt={product.name}
          className="max-h-80 object-cover w-full cursor-pointer"
          onClick={navigateToProduct}
        />

        {/* Color Variants */}
        {openColors && (
          <div className="flex items-center justify-start gap-2 px-4 flex-wrap">
            {product.productVariants.map((variant) => (
              <div
                key={variant.id}
                className={`cursor-pointer rounded-sm border overflow-hidden w-8 h-8 ${
                  variant.id === mainVariant?.id ? "border-2 border-black" : ""
                }`}
                onClick={() => setMainVariant(variant)}
              >
                <img
                  src={variant.images[0]?.imageUrl || "/placeholder-image.jpg"}
                  alt={variant.color}
                  className="w-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* Product Details */}
        <div className="p-4">
          <h5
            className="font-semibold text-sm cursor-pointer"
            onClick={navigateToProduct}
          >
            {product.name}
          </h5>
          <p className="text-secondary text-sm">
            {product.category.name}, {product.subCategory.name}
          </p>
          <p className="text-secondary text-sm">
            {product.productVariants.length} Colors
          </p>
          {product.quantity === 0 && (
            <p className="text-secondary font-mono text-sm">Sold Out</p>
          )}

          {/* Price & Wishlist Button */}
          <div className="flex justify-between items-center font-mono">
            <p>{product.price} $</p>
            <div className="rounded-full border w-fit p-[6px] h-fit">
              {favorite ? (
                <HeartIconSolid
                  className="w-4 sm:w-5 cursor-pointer"
                  onClick={handleWishlistToggle}
                />
              ) : (
                <HeartIcon
                  className="w-4 sm:w-5 cursor-pointer"
                  onClick={handleWishlistToggle}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
