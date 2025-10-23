"use client";

import { ArchiveBoxXMarkIcon } from "@heroicons/react/24/outline";
import BagItem from "../BagItem";
import { useState } from "react";

interface ProductsBagListProps {
  products: any[];
  token?: string;
}

export default function ProductsBagList({ products, token }: ProductsBagListProps) {
  const [productsBag, setProductsBag] = useState(products);
  return (
    <div className="w-full">
      {productsBag?.length ? (
        <div className=" flex flex-col gap-4">
          {productsBag.map((item: any) => (
            <BagItem
              key={item.id}
              item={item}
              setProductsBag={setProductsBag}
              token={token}
            />
          ))}
        </div>
      ) : (
        <div className=" mt-16">
          <div className="flex items-center justify-center">
            <ArchiveBoxXMarkIcon className="w-16 text-secondary " />
          </div>
          <p className="text-center font-semibold text-3xl mt-3">
            Your Bag are Empty !!
          </p>
        </div>
      )}
    </div>
  );
}
