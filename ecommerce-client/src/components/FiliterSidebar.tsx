"use client";

import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const filters = [
  { name: "Category", key: "category", options: ["Men", "Women", "Unisex"] },
  {
    name: "SubCategory",
    key: "subCategory",
    options: ["Shoes", "Clothing", "Accessories"],
  },
  { name: "Color", key: "colors", options: ["Black", "White", "Red", "Blue"] },
  { name: "Size", key: "sizes", options: ["6", "7", "8", "9", "10", "11"] },
  { name: "Rating", key: "rating", options: ["1", "2", "3", "4", "5"] },
];

export default function FilterSidebar({ setShowFilters }) {
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [selectedFilters, setSelectedFilters] = useState<{
    [key: string]: string[];
  }>({});
  const [priceRange, setPriceRange] = useState({ minPrice: "", maxPrice: "" });

  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(selectedFilters).forEach(([key, values]) => {
      if (values.length > 0) params.append(key, values.join(","));
    });
    if (priceRange.minPrice) params.append("minPrice", priceRange.minPrice);
    if (priceRange.maxPrice) params.append("maxPrice", priceRange.maxPrice);

    router.push(`?${params.toString()}`);
  }, [selectedFilters, priceRange, router]);

  const toggleFilter = (filterName: string) => {
    setOpenFilter(openFilter === filterName ? null : filterName);
  };

  const handleFilterSelection = (filterKey: string, option: string) => {
    setSelectedFilters((prev) => {
      const newFilters = { ...prev };
      if (!newFilters[filterKey]) newFilters[filterKey] = [];

      if (newFilters[filterKey].includes(option)) {
        newFilters[filterKey] = newFilters[filterKey].filter(
          (item) => item !== option
        );
      } else {
        newFilters[filterKey].push(option);
      }

      return { ...newFilters };
    });
  };

  console.log(selectedFilters);

  return (
    <div className="w-full p-2 relative">
      {filters.map((filter) => (
        <div key={filter.name} className="border-b pb-2 mb-2">
          <button
            className="flex justify-between items-center w-full text-left font-semibold text-black"
            onClick={() => toggleFilter(filter.name)}
          >
            {filter.name}
            {openFilter === filter.name ? (
              <ChevronUpIcon className="w-5 text-black" />
            ) : (
              <ChevronDownIcon className="w-5 text-black" />
            )}
          </button>

          {openFilter === filter.name && (
            <div className="mt-2 space-y-1">
              {filter.options.map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-2 text-sm text-gray-700"
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                    checked={
                      selectedFilters[filter.key]?.includes(option) || false
                    }
                    onChange={() => handleFilterSelection(filter.key, option)}
                  />
                  {option}
                </label>
              ))}
            </div>
          )}
        </div>
      ))}
      <div className="border-b pb-2 mb-2">
        <h3 className="font-semibold text-black">Price Range</h3>
        <div className="flex gap-2 mt-2">
          <input
            type="number"
            placeholder="Min"
            className="border p-1 w-full"
            value={priceRange.minPrice}
            onChange={(e) =>
              setPriceRange((prev) => ({ ...prev, minPrice: e.target.value }))
            }
          />
          <input
            type="number"
            placeholder="Max"
            className="border p-1 w-full"
            value={priceRange.maxPrice}
            onChange={(e) =>
              setPriceRange((prev) => ({ ...prev, maxPrice: e.target.value }))
            }
          />
        </div>
      </div>
      <div className=" flex  lg:hidden items-center justify-between gap-2  mt-8">
        <button
          className="text-black w-full border rounded-sm p-2 border-[#777] font-medium text-xs "
          onClick={() => setShowFilters(false)}
        >
          Clear
        </button>
        <button
          className="text-white bg-black w-full border rounded-sm p-2 border-[#777] font-medium text-xs "
          onClick={() => setShowFilters(false)}
        >
          Close
        </button>
      </div>
    </div>
  );
}
