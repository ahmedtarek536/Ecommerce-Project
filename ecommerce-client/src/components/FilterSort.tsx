"use client";

import { useState } from "react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface FilterSortProps {
  onFilterChange: (filters: any) => void;
  categories: string[];
  subCategories: string[];
  colors: string[];
  sizes: string[];
  isOpen: boolean;
  onClose: () => void;
}

const colorMap: { [key: string]: string } = {
  Red: "#FF0000",
  Blue: "#0000FF",
  Black: "#000000",
  White: "#FFFFFF",
  Green: "#00FF00",
  Yellow: "#FFFF00",
  Purple: "#800080",
  Pink: "#FFC0CB",
  Orange: "#FFA500",
  Brown: "#A52A2A",
  Gray: "#808080",
  Navy: "#000080",
  Beige: "#F5F5DC",
  Maroon: "#800000",
  Teal: "#008080",

  "Light Blue": "#ADD8E6",
  "Dark Blue": "#00008B",
  "Light Green": "#90EE90",
  "Dark Green": "#006400",
  "Light Red": "#FFB6C1",
  "Dark Red": "#8B0000",
  "Light Yellow": "#FFFFE0",
  "Dark Yellow": "#BDB76B",
  "Light Purple": "#E6E6FA",
  "Dark Purple": "#4B0082",
  "Light Pink": "#FFB6C1",
  "Dark Pink": "#FF1493",
  "Light Orange": "#FFA07A",
  "Dark Orange": "#FF8C00",
  "Light Brown": "#DEB887",
  "Dark Brown": "#654321",

  Coral: "#FF7F50",
  Mint: "#98FF98",
  Lavender: "#E6E6FA",
  Turquoise: "#40E0D0",
  Gold: "#FFD700",
  Silver: "#C0C0C0",
  Bronze: "#CD7F32",
  Khaki: "#F0E68C",
  Olive: "#808000",
  Burgundy: "#800020",
  Indigo: "#4B0082",
  Violet: "#8A2BE2",
  Magenta: "#FF00FF",
  Cyan: "#00FFFF",
  Lime: "#32CD32",

  Ivory: "#FFFFF0",
  Cream: "#FFFDD0",
  Tan: "#D2B48C",
  Charcoal: "#36454F",
  Slate: "#708090",
  Ash: "#B2BEB5",
  Stone: "#8B8B8B",
  Sand: "#C2B280",
  Taupe: "#483C32",
  Mauve: "#E0B0FF",

  // Spring Colors
  Sage: "#BCB88A",
  Peach: "#FFDAB9",
  Rose: "#FFE4E1",
  Lilac: "#C8A2C8",
  "Mint Green": "#98FF98",
  "Sky Blue": "#87CEEB",
  Buttercup: "#F3E5AB",
  "Lavender Blue": "#E6E6FA",
  "Pale Pink": "#FFC0CB",
  "Spring Green": "#00FF7F",

  // Summer Colors
  Sunshine: "#FFD700",
  "Ocean Blue": "#0077BE",
  "Tropical Green": "#00FF7F",
  "Sunset Orange": "#FF7F50",
  "Beach Sand": "#F5DEB3",
  "Pool Blue": "#00CED1",
  Watermelon: "#FF6B6B",
  Lemon: "#FFF44F",
  Mango: "#FFA500",
  "Sea Foam": "#98FF98",

  // Fall Colors
  Rust: "#B7410E",
  Mustard: "#FFDB58",
  Terracotta: "#E2725B",
  "Forest Green": "#228B22",
  Cinnamon: "#D2691E",
  Amber: "#FFBF00",
  Chestnut: "#954535",
  Pumpkin: "#FF7518",
  Crimson: "#DC143C",
  "Deep Purple": "#4B0082",

  // Winter Colors
  "Ice Blue": "#ADD8E6",
  "Snow White": "#FFFAFA",
  Frost: "#E1F5FE",
  Evergreen: "#006400",
  Cranberry: "#9B0000",
  "Silver Gray": "#C0C0C0",
  "Midnight Blue": "#191970",
  Plum: "#8E4585",
  Emerald: "#50C878",
  Ruby: "#E0115F",

  // Metallic Colors
  "Rose Gold": "#B76E79",
  Copper: "#B87333",
  Brass: "#B5A642",
  Champagne: "#F7E7CE",
  Pearl: "#F0EAD6",
  Platinum: "#E5E4E2",
  Gunmetal: "#2C3539",
  "Antique Gold": "#CFB53B",
  "Brushed Nickel": "#73706F",

  // Pastel Colors
  "Pastel Blue": "#AEC6CF",
  "Pastel Pink": "#FFB6C1",
  "Pastel Green": "#98FB98",
  "Pastel Yellow": "#FFFFB5",
  "Pastel Purple": "#E6E6FA",
  "Pastel Orange": "#FFB347",
  "Pastel Red": "#FF6961",
  "Pastel Mint": "#98FF98",
  "Pastel Lavender": "#E6E6FA",
  "Pastel Peach": "#FFDAB9",
};

export default function FilterSort({
  onFilterChange,
  categories,
  subCategories,
  colors,
  sizes,
  isOpen,
  onClose,
}: FilterSortProps) {
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    category: [] as string[],
    subCategory: [] as string[],
    colors: [] as string[],
    sizes: [] as string[],
    minPrice: "",
    maxPrice: "",
    rating: [] as number[],
  });

  const toggleFilter = (filterName: string) => {
    setOpenFilter(openFilter === filterName ? null : filterName);
  };

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleCheckboxChange = (key: string, value: string | number) => {
    const currentValues = filters[key as keyof typeof filters] as (
      | string
      | number
    )[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    handleFilterChange(key, newValues);
  };

  const clearFilters = () => {
    const clearedFilters = {
      category: [] as string[],
      subCategory: [] as string[],
      colors: [] as string[],
      sizes: [] as string[],
      minPrice: "",
      maxPrice: "",
      rating: [] as number[],
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <>
      {/* Mobile/Tablet Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity lg:hidden ${
          isOpen ? "opacity-100 z-40" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Filter Panel */}
      <div
        className={`fixed lg:static top-0 right-0 h-full w-[300px] bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-5 ${
          isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
            <div className="flex items-center gap-2">
              {/* <button
                onClick={clearFilters}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Clear all
              </button> */}
              <button
                onClick={onClose}
                className="lg:hidden p-1 hover:bg-gray-100 rounded-full"
              >
                <XMarkIcon className="w-6 h-6 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Filter Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Categories */}
            <div>
              <button
                onClick={() => toggleFilter("Categories")}
                className="w-full flex items-center justify-between text-sm font-medium text-gray-800 mb-3"
              >
                Categories
                {openFilter === "Categories" ? (
                  <ChevronUpIcon className="w-5 h-5" />
                ) : (
                  <ChevronDownIcon className="w-5 h-5" />
                )}
              </button>
              {openFilter === "Categories" && (
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.category.includes(category)}
                        onChange={() =>
                          handleCheckboxChange("category", category)
                        }
                        className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-600">
                        {category}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Sub Categories */}
            <div>
              <button
                onClick={() => toggleFilter("SubCategories")}
                className="w-full flex items-center justify-between text-sm font-medium text-gray-800 mb-3"
              >
                Sub Categories
                {openFilter === "SubCategories" ? (
                  <ChevronUpIcon className="w-5 h-5" />
                ) : (
                  <ChevronDownIcon className="w-5 h-5" />
                )}
              </button>
              {openFilter === "SubCategories" && (
                <div className="space-y-2">
                  {subCategories.map((subCategory) => (
                    <label key={subCategory} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.subCategory.includes(subCategory)}
                        onChange={() =>
                          handleCheckboxChange("subCategory", subCategory)
                        }
                        className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-600">
                        {subCategory}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Colors */}
            <div>
              <button
                onClick={() => toggleFilter("Colors")}
                className="w-full flex items-center justify-between text-sm font-medium text-gray-800 mb-3"
              >
                Colors
                {openFilter === "Colors" ? (
                  <ChevronUpIcon className="w-5 h-5" />
                ) : (
                  <ChevronDownIcon className="w-5 h-5" />
                )}
              </button>
              {openFilter === "Colors" && (
                <div className="flex flex-wrap gap-3">
                  {colors.map((color) => (
                    <div key={color} className="flex flex-col items-center">
                      <button
                        onClick={() => handleCheckboxChange("colors", color)}
                        className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                          filters.colors.includes(color)
                            ? "border-black scale-110 shadow-md"
                            : "border-gray-200 hover:scale-105"
                        }`}
                        style={{ backgroundColor: colorMap[color] || color }}
                        title={color}
                      />
                      <span className="text-xs text-gray-600 mt-1">
                        {color}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sizes */}
            <div>
              <button
                onClick={() => toggleFilter("Sizes")}
                className="w-full flex items-center justify-between text-sm font-medium text-gray-800 mb-3"
              >
                Sizes
                {openFilter === "Sizes" ? (
                  <ChevronUpIcon className="w-5 h-5" />
                ) : (
                  <ChevronDownIcon className="w-5 h-5" />
                )}
              </button>
              {openFilter === "Sizes" && (
                <div className="flex flex-wrap gap-2">
                  {[
                    "XXS",
                    "XS",
                    "S",
                    "M",
                    "L",
                    "XL",
                    "XXL",
                    "3XL",
                    "4XL",
                    "5XL",
                  ].map((size) => (
                    <button
                      key={size}
                      onClick={() => handleCheckboxChange("sizes", size)}
                      className={`px-3 py-1 rounded-md text-sm ${
                        filters.sizes.includes(size)
                          ? "bg-black text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Rating */}
            <div>
              <button
                onClick={() => toggleFilter("Rating")}
                className="w-full flex items-center justify-between text-sm font-medium text-gray-800 mb-3"
              >
                Rating
                {openFilter === "Rating" ? (
                  <ChevronUpIcon className="w-5 h-5" />
                ) : (
                  <ChevronDownIcon className="w-5 h-5" />
                )}
              </button>
              {openFilter === "Rating" && (
                <div className="flex flex-wrap gap-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => handleCheckboxChange("rating", rating)}
                      className={`px-3 py-1 rounded-md text-sm ${
                        filters.rating.includes(rating)
                          ? "bg-black text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {rating}★ & Up
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Price Range */}
            <div>
              <button
                onClick={() => toggleFilter("Price")}
                className="w-full flex items-center justify-between text-sm font-medium text-gray-800 mb-3"
              >
                Price Range
                {openFilter === "Price" ? (
                  <ChevronUpIcon className="w-5 h-5" />
                ) : (
                  <ChevronDownIcon className="w-5 h-5" />
                )}
              </button>
              {openFilter === "Price" && (
                <div className="px-2">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="10"
                    value={filters.maxPrice || 0}
                    onChange={(e) =>
                      handleFilterChange("maxPrice", e.target.value)
                    }
                    className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                  />
                  <div className="flex justify-between mt-2 text-sm text-gray-600">
                    <span>$0</span>
                    <span>${filters.maxPrice || 0}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Action Buttons */}
          <div className="lg:hidden p-4 border-t border-gray-200">
            <div className="flex gap-4">
              <button
                onClick={clearFilters}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Clear
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-900"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
