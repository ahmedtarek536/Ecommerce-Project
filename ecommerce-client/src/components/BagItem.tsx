"use client";

import { addItemToWishlist, removeItemFromWishlist } from "@/api/wishlistAPI";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { HeartIcon, TrashIcon } from "@heroicons/react/24/outline";

import { useState } from "react";
import { removeItemFromBag, UpdateItemInBag } from "@/api/bageAPI";
type Image = {
  id: number;
  productVariantId: number;
  imageUrl: string;
  productVariant: null;
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

type Category = {
  name: string;
};

type SubCategory = {
  name: string;
};

type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  category: Category;
  subCategory: SubCategory;
  quantity: number;
  sizes: string[];
  productVariants: ProductVariant[];
};

type Item = {
  id: number;
  customerId: number;
  product: Product;
  productVariantId: number;
  size: string;
  sizeId: number;
  quantity: number;
};

export default function BagItem({ 
  item, 
  setProductsBag,
  token 
}: { 
  item: Item;
  setProductsBag?: any;
  token?: string;
}) {
  const { product }: { product: Product } = item;
  const [quantity, setQuantity] = useState<number>(item.quantity);
  const [favorite, setFavorite] = useState<boolean>(
    product.productVariants[0]?.favorite
  );
  async function handleIncreaseQuantity() {
    if (!token) return;
    setQuantity((q) => q + 1);
    await UpdateItemInBag(item.id, quantity + 1, token);
  }
  async function handleDecreaseQuantity() {
    if (!token) return;
    if (quantity > 1) {
      setQuantity((q) => q - 1);
      await UpdateItemInBag(item.id, quantity - 1, token);
    }
  }

  async function handleAddItemToWishlist() {
    if (!token) return;
    setFavorite(true);
    await addItemToWishlist(product.id, product.productVariants[0]?.id, token);
  }

  async function handleRemoveItemFromWishlist() {
    if (!token) return;
    setFavorite(false);
    await removeItemFromWishlist(product.productVariants[0]?.id, token);
  }

  async function handleRemoveItemFromBag() {
    if (!token) return;
    await removeItemFromBag(item.id, token);

    if (setProductsBag) {
      setProductsBag((products: Item[]) => products.filter((p: Item) => p.id !== item.id));
    }
  }

  return (
    <div className="flex justify-start items-start gap-4 ">
      <img
        src={product.productVariants[0].images[0].imageUrl}
        alt="product Bag Image"
        className="w-24  sm:w-32 h-36 object-cover rounded-md border"
      />
      <div className="flex items-start justify-between gap-2 sm:gap-4 w-full">
        <div>
          <h3 className="font-semibold text-xs sm:text-lg">{product.name}</h3>
          <p className="text-secondary text-xs sm:text-sm">
            {product.category.name} {product.subCategory.name}
          </p>
          <p className=" text-xs sm:text-sm mt-2">
            Color: {item.product.productVariants[0].color}
          </p>
          <p className=" text-xs sm:text-sm">Size: {item.size}</p>
          <div className="flex items-end gap-2 sm:gap-4 ">
            {" "}
            <div className="flex items-center justify-start gap-3 sm:gap-6 mt-2 border w-fit py-1 px-4 rounded-full">
              <button className=" sm:text-xl" onClick={handleDecreaseQuantity}>
                {quantity == 1 ? (
                  <TrashIcon
                    className="w-3 sm:w-4"
                    onClick={handleRemoveItemFromBag}
                  />
                ) : (
                  "-"
                )}
              </button>
              <span className="font-mono ">{quantity}</span>
              <button className=" sm:text-xl" onClick={handleIncreaseQuantity}>
                +
              </button>
            </div>
            <div className="rounded-full border w-fit p-2 h-fit">
              {favorite ? (
                <HeartIconSolid
                  className="w-4 sm:w-5 cursor-pointer"
                  onClick={handleRemoveItemFromWishlist}
                />
              ) : (
                <HeartIcon
                  className="w-4 sm:w-5 cursor-pointer "
                  onClick={handleAddItemToWishlist}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="font-mono text-sm sm:text-lg text-nowrap">
        {(product.price * quantity).toFixed(2)} $
      </div>
    </div>
  );
}
