"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "quill/dist/quill.snow.css"; // Snow theme for Quill editor
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { HeartIcon } from "@heroicons/react/24/outline";
import { AddItemToBag } from "@/api/bageAPI";
import { addItemToWishlist, removeItemFromWishlist } from "@/api/wishlistAPI";
import AuthModel from "../auth/Auth";
import ProductDetailsAndReviews from "./ProductDetailsAndReviews";
import { useAppStore } from "@/store/useAppStore";

type Image = {
  id: number;
  productVariantId: number;
  imageUrl: string;
};

type Size = {
  id: number;
  productVariantId: number;
  name: string;
  quantity: number;
};

type ProductVariant = {
  id: number;
  color: string;
  quantity: number;
  sizes: Size[];
  images: Image[];
  favorite: boolean;
};

type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  category: { name: string };
  subCategory: { name: string };
  quantity: number;
  sizes: string[];
  productVariants: ProductVariant[];
};

export default function ProductDetails({ product }: { product: Product }) {
  console.log("Product Details:", product.sizes);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { token } = useAppStore();

  const variantId = searchParams?.get("variant");
  const [mainVariant, setMainVariant] = useState<ProductVariant>(
    product.productVariants.find((v) => v.id === Number(variantId)) ||
      product.productVariants[0]
  );

  const [image, setImage] = useState<Image | null>(
    mainVariant?.images[0] || null
  );
  const [mainSize, setMainSize] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [favorite, setFavorite] = useState<boolean>(mainVariant?.favorite);
  const [model, setModel] = useState(false);

  useEffect(() => {
    const updatedVariant =
      product.productVariants.find((v) => v.id === Number(variantId)) ||
      product.productVariants[0];
    setMainVariant(updatedVariant);
    setImage(updatedVariant?.images[0] || null);
    setMainSize("");
  }, [variantId, product.productVariants]);

  const currentSize = mainVariant.sizes.find((s) => s.name === mainSize);
  const isSoldOut =
    product.quantity === 0 || (mainSize && currentSize?.quantity === 0);
  const buttonClass = "w-full py-3 rounded-3xl font-semibold mt-2";

  const handleChangeColor = (variant: ProductVariant) => {
    setMainVariant(variant);
    setImage(variant.images[0] || null);
    setMainSize("");
    router.push(`/products/${product.id}?variant=${variant.id}`);
  };

  const handleAddToBag = async () => {
    if (!mainSize) {
      alert("Please Select a Size");
      return;
    }
    if (!currentSize) {
      alert("This Size is not available");
      return;
    }
    if (currentSize.quantity < quantity) {
      alert(`Only ${currentSize.quantity} items available in this size`);
      return;
    }

    if (!token) {
      setModel(true);
      return;
    }

    try {
      console.log("=== DEBUG: Add to Bag ===");
      console.log("Selected size name:", mainSize);
      console.log("Current size object:", currentSize);
      console.log("All available sizes:", mainVariant.sizes);
      console.log("Sending to API:", {
        productId: product.id,
        variantId: mainVariant.id,
        sizeId: currentSize.id,
        quantity,
      });

      const response = await AddItemToBag(
        product.id,
        mainVariant.id,
        currentSize.id,
        quantity,
        token
      );

      console.log("Add to bag response:", response);

      if (response?.success) {
        alert("Item added to bag successfully!");
      } else {
        const errorMsg = response?.message || "Failed to add item to bag";
        console.error("Add to bag failed:", errorMsg);
        alert(errorMsg);
      }
    } catch (error) {
      console.error("Error adding to bag:", error);
      alert("Failed to add item to bag. Please check console for details.");
    }
  };

  const handleWishlistToggle = async () => {
    try {
      if (!token) {
        setModel(true);
      } else {
        setFavorite((prev) => !prev);
        favorite
          ? await removeItemFromWishlist(mainVariant.id, token)
          : await addItemToWishlist(product.id, mainVariant.id, token);
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
    }
  };
  console.log("Rendering ProductDetails with mainVariant:", mainVariant);
  return (
    <>
      <AuthModel model={model} setModel={setModel} />
      <div>
        <div className="lg:grid lg:grid-cols-6 gap-12 lg:relative right-24 mt-10">
          {/* Product Images */}
          <div className="lg:col-span-4 flex flex-col-reverse sm:flex-row justify-center lg:justify-end gap-4">
            <div className="flex sm:flex-col gap-2">
              {mainVariant.images.map((img) => (
                <div
                  key={img.id}
                  className="w-14 h-16 rounded-lg border overflow-hidden cursor-pointer"
                >
                  {img?.imageUrl[img.imageUrl.length - 1] != "4" ? (
                    <img
                      src={img.imageUrl}
                      className="w-full object-cover"
                      onClick={() => setImage(img)}
                    />
                  ) : (
                    <video
                      autoPlay
                      className="w-full object-cover rounded-md shadow-md"
                      onClick={() => setImage(img)}
                    >
                      <source src={img.imageUrl} type="video/mp4" />
                    </video>
                  )}
                </div>
              ))}
            </div>
            {image?.imageUrl[image.imageUrl.length - 1] != "4" ? (
              <img
                src={image?.imageUrl || ""}
                alt="Product Image"
                className="w-[470px] h-[450px] sm:h-[500px] rounded-lg object-cover"
              />
            ) : (
              <video
                autoPlay
                className="w-[470px] h-[450px] sm:h-[500px] rounded-lg object-cover"
              >
                <source src={image?.imageUrl || ""} type="video/mp4" />
              </video>
            )}
          </div>

          {/* Product Details */}
          <div className="lg:col-span-2 mt-12 lg:mt-0">
            <h5 className="font-semibold text-lg">{product.name}</h5>
            <p className="text-secondary text-lg">
              {product.category.name}, {product.subCategory.name}
            </p>
            <p className="font-mono mt-4">{product.price} $</p>

            {/* Color Selection */}
            <p className="font-semibold mt-8">Color: {mainVariant.color}</p>
            <div className="flex gap-2 flex-wrap mt-2">
              {product.productVariants.map((variant) => (
                <div
                  key={variant.id}
                  className={`w-14 h-16 rounded-lg border overflow-hidden cursor-pointer ${
                    variant.id === mainVariant.id ? "border-2 border-black" : ""
                  }`}
                  onClick={() => handleChangeColor(variant)}
                >
                  <img
                    src={variant.images[0]?.imageUrl || ""}
                    className="w-full object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Size Selection */}
            <div className="mt-6">
              <h4 className="font-semibold">Select Size</h4>
              <div className="flex gap-3 mt-2 font-semibold flex-wrap">
                {product.sizes.map((size) => (
                  <div
                    key={size}
                    className={`border px-9 py-2 rounded-md cursor-pointer ${
                      mainVariant.sizes.find((s) => s.name === size)
                        ? "bg-white text-black"
                        : "bg-gray-200 text-gray-400"
                    } ${size === mainSize ? "border-2 border-black" : ""}`}
                    onClick={() => setMainSize(size)}
                  >
                    {size}
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <h4 className="font-semibold mt-10">Quantity</h4>
            <div className="flex items-center gap-2 mt-2">
              <button
                className="bg-gray-300 w-6 h-6 rounded-full"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                -
              </button>
              <span className="font-mono text-lg">{quantity}</span>
              <button
                className="bg-gray-300 w-6 h-6 rounded-full"
                onClick={() => setQuantity((q) => q + 1)}
              >
                +
              </button>
            </div>

            {/* Actions */}
            <button
              className={`${buttonClass} ${
                isSoldOut ? "bg-gray-300 text-secondary" : "bg-black text-white"
              }`}
              onClick={handleAddToBag}
            >
              {isSoldOut ? "Sold Out" : "Add To Bag"}
            </button>
            <button
              className="border mt-2 w-full py-3 rounded-3xl font-semibold flex items-center justify-center"
              onClick={handleWishlistToggle}
            >
              Favorite{" "}
              {favorite ? (
                <HeartIconSolid className="w-6" />
              ) : (
                <HeartIcon className="w-6" />
              )}
            </button>
          </div>
        </div>
        <ProductDetailsAndReviews product={product} />
      </div>
    </>
  );
}
