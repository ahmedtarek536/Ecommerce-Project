"use client";

import {
  MagnifyingGlassMinusIcon,
  ShoppingBagIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import AuthModel from "./auth/Auth";
import { useAppStore } from "@/store/useAppStore";
import { logoutAction } from "@/actions/authActions";
const categories = [
  {
    name: "New",
    id: 1,
    subCategories: [
      {
        name: "Featured",
        id: 2,
        items: [
          "New Arrivals",
          "Best Sellers",
          "Latest Drops",
          "Air Max Dn8 & More",
          "Vomero 18",
          "SNKRS Launch Calendar",
        ],
      },
      {
        name: "Shop New",
        id: 3,
        items: ["Men", "Women", "Kids", "Shop All"],
      },
      {
        name: "Trending",
        id: 4,
        items: [
          "24.7 Collection",
          "Nike Style By",
          "So Win Collection",
          "ACG Essentials",
          "Rare Air Collection",
          "Running Shoe Finder",
        ],
      },
    ],
  },
  {
    name: "Men",
    id: 5,
    subCategories: [
      {
        name: "Shoes",
        id: 6,
        items: [
          "New Releases",
          "Best Sellers",
          "Lifestyle",
          "Running",
          "Basketball",
          "Training & Gym",
          "Soccer",
          "Skateboarding",
          "Sandals & Slides",
        ],
      },
      {
        name: "Clothing",
        id: 7,
        items: [
          "Tops & T-Shirts",
          "Shorts",
          "Hoodies & Sweatshirts",
          "Pants & Tights",
          "Jackets & Vests",
        ],
      },
      {
        name: "Accessories & Equipment",
        id: 8,
        items: [
          "Socks",
          "Bags & Backpacks",
          "Hats & Headwear",
          "Sunglasses",
          "Watches",
        ],
      },
    ],
  },
  {
    name: "Women",
    id: 9,
    subCategories: [
      {
        name: "Shoes",
        id: 10,
        items: [
          "New Releases",
          "Best Sellers",
          "Lifestyle",
          "Running",
          "Training & Gym",
          "Soccer",
          "Sandals & Slides",
        ],
      },
    ],
  },
  {
    name: "Kids",
    id: 11,
    subCategories: [
      {
        name: "Shoes",
        id: 12,
        items: ["Boys' Shoes", "Girls' Shoes", "New Arrivals", "Best Sellers"],
      },
      {
        name: "Clothing",
        id: 13,
        items: ["Tops & T-Shirts", "Shorts", "Hoodies & Sweatshirts"],
      },
    ],
  },
  {
    name: "Jordan",
    id: 14,
    subCategories: [
      {
        name: "Featured",
        id: 15,
        items: ["New Releases", "Best Sellers", "Classic Sneakers"],
      },
      {
        name: "Shoes",
        id: 16,
        items: [
          "Men's Jordan Shoes",
          "Women's Jordan Shoes",
          "Kids' Jordan Shoes",
        ],
      },
    ],
  },
  {
    name: "Sport",
    id: 17,
    subCategories: [
      {
        name: "Shop by Sport",
        id: 18,
        items: [
          "Basketball",
          "Running",
          "Soccer",
          "Golf",
          "Tennis",
          "Training & Gym",
        ],
      },
    ],
  },
];

type SubCategories = {
  id: number;
  name: string;
};

type Category = {
  id: number;
  name: string;
  subCategories: [];
};

export default function Header() {
  // const [categories, setCategories] = useState([]);
  const [model, setModel] = useState<boolean>(false);
  const { setShowSearch } = useAppStore();

  const router = useRouter();

  const { token, setToken } = useAppStore();

  const [showLogout, setShowLogout] = useState(false);
  const userIconRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userIconRef.current &&
        !(userIconRef.current as any).contains(event.target)
      ) {
        setShowLogout(false);
      }
    }
    if (showLogout) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showLogout]);

  function handleOpenBag() {
    if (token) router.push("/bag");
    else setModel(true);
  }
  function handleOpenWishlist() {
    if (token) router.push("/wishlist");
    else setModel(true);
  }
  function handleUserIconClick() {
    if (!token) setModel(true);
    else setShowLogout((v) => !v);
  }

  async function handleLogout() {
    await logoutAction();
    setToken(null);
    setShowLogout(false);
    router.refresh(); // Refresh to update server components
  }

  return (
    <>
      <AuthModel model={model} setModel={setModel} />
      <header className="bg-white fixed w-full flex items-center  z-20 justify-between px-4 sm:px-8 shadow-sm border border-b-1 py-1">
        <Link href="/">
          <img src="/logo.jpg" alt="nicke-logo" className="w-16" />
        </Link>
        <div className="items-center justify-center gap-6 uppercase  font-semibold hidden lg:flex   text-sm  relative left-16">
          <nav className="flex gap-8 text-sm font-semibold ">
            {categories.map((category) => (
              <div className="group " key={category.id}>
                <span className="hover:border-b-2 border-black cursor-pointer">
                  {category.name}
                </span>
                <div className="hidden group-hover:flex flex-wrap justify-start gap-12    absolute top-10 left-0 bg-white shadow-md border w-full m-auto rounded-md p-6">
                  {category.subCategories.map((sub) => (
                    <div key={sub.id} className="mt-2 font-medium ">
                      {sub.name}
                      <ul className="mt-3 text-[#777] text-sm">
                        {sub.items.map((item, index) => (
                          <li
                            key={index}
                            className="hover:text-black cursor-pointer mt-2 text-xs"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>
        <div className="flex justify-center items-center gap-2 sm:gap-3  ">
          {/* <div className="hidden lg:block relative">
            <MagnifyingGlassMinusIcon className="  absolute top-2 left-3 text-gray-700 text-sm w-4" />
            <input
              type="text"
              className="bg-neutral-100  w-32 rounded-3xl p-1 pl-8 font-semibold"
              placeholder="Search"
              onFocus={() => setShowSearch(true)}
            />
          </div> */}
          <MagnifyingGlassMinusIcon
            className="w-5 sm:w-6 block   cursor-pointer"
            onClick={() => setShowSearch(true)}
          />

          <HeartIcon
            className="w-5 sm:w-6  cursor-pointer"
            onClick={handleOpenWishlist}
          />

          <ShoppingBagIcon
            className="w-4 sm:w-6 cursor-pointer"
            onClick={handleOpenBag}
          />

          <span className="relative" ref={userIconRef}>
            <UserIcon
              className="w-5 sm:w-6 cursor-pointer"
              onClick={handleUserIconClick}
            />
            {token && showLogout && (
              <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-50">
                <button
                  className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </span>
        </div>
      </header>
    </>
  );
}
