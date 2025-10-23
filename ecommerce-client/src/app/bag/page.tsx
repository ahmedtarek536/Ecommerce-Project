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

import { getBag } from "@/api/bageAPI";
import ProductsBagList from "@/components/Products/ProductsBagList";
import { cookies } from "next/headers";
import React from "react";
import Link from "next/link";

export default async function Bag() {
  const token = (await cookies()).get("auth-token-ecommerce")?.value;

  if (!token) {
    return (
      <div className="container ">
        <h3 className="mt-2 font-semibold text-2xl  py-4 ">Your Bag</h3>
        <div className="flex flex-col md:flex-row  justify-start gap-12 ">
          <ProductsBagList products={[]} token={undefined} />
          <div className="">
            <div className="py-4 px-4 border rounded-md text-sm lg:text-base">
              <p className="font-mono text-nowrap mt-2">
                SubTotal (0 Items): 0.00
              </p>
              <p className="font-mono text-nowrap mt-1">Fees: 0.00 $</p>
              <p className="font-mono text-nowrap mt-1">Shipping: 0.00 $</p>
              <p className="font-mono text-nowrap mt-1">Total Price: 0.00 $</p>
              <Link
                href="/checkout"
                className="btn text-nowrap mt-2 w-full text-sm"
              >
                Procced To Check Out
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const products = await getBag(token);

  return (
    <div className="container ">
      <h3 className="mt-2 font-semibold text-2xl  py-4 ">Your Bag</h3>
      <div className="flex flex-col md:flex-row  justify-start gap-12 ">
        <ProductsBagList products={products?.data} token={token} />
        <div className="">
          <div className="py-4 px-4 border rounded-md text-sm lg:text-base">
            <p className="font-mono text-nowrap mt-2">
              SubTotal (6 Items): 1200.12
            </p>
            <p className="font-mono text-nowrap mt-1">Fees: 12.000 $</p>
            <p className="font-mono text-nowrap mt-1">Shipping: 24.00 $</p>
            <p className="font-mono text-nowrap mt-1">Total Price: 124.00 $</p>
            <Link
              href="/checkout"
              className="btn text-nowrap mt-2 w-full text-sm"
            >
              Procced To Check Out
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
