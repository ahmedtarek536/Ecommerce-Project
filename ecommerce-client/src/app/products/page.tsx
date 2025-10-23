"use client";
import { useState, useEffect, useCallback } from "react";
import { searchAndFilterProducts } from "@/api/productsAPI";
import FilterSort from "@/components/FilterSort";
import ProductSort from "@/components/ProductSort";
import ProductCard from "@/components/Products/ProductCard";
import { FunnelIcon } from "@heroicons/react/24/outline";
import { useSearchParams } from "next/navigation";
import { useSearch } from "@/hooks/SearchProivder";

// Mock data for filter options - replace with actual data from your API
const mockCategories = ["Clothing", "Shoes", "Accessories"];
const mockSubCategories = ["T-Shirts", "Jeans", "Dresses", "Sneakers", "Boots"];
const mockColors = ["Red", "Blue", "Black", "White", "Green"];
const mockSizes = ["XS", "S", "M", "L", "XL"];

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentSort, setCurrentSort] = useState("newest");
  const [currentFilters, setCurrentFilters] = useState<any>({});
  const { searchQuery } = useSearch();

  const handleFilterChange = useCallback(
    async (filters: any) => {
      setLoading(true);
      setError("");
      setCurrentFilters(filters);

      try {
        const response = await searchAndFilterProducts({
          ...filters,
          sortBy: currentSort,
          minPrice: filters.minPrice ? parseFloat(filters.minPrice) : undefined,
          maxPrice: filters.maxPrice ? parseFloat(filters.maxPrice) : undefined,
          searchQuery: searchQuery || undefined,
        });

        if (response.success) {
          setProducts(response.data || []);
        } else {
          setError(response.message || "Failed to fetch products");
          setProducts([]);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("An error occurred while fetching products");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    },
    [currentSort, searchQuery]
  );

  const handleSortChange = useCallback(
    async (sortBy: string) => {
      setCurrentSort(sortBy);
      // Re-fetch products with new sort and current filters
      await handleFilterChange(currentFilters);
    },
    [currentFilters, handleFilterChange]
  );

  useEffect(() => {
    const collectionId = searchParams?.get("collection");
    const initialFilters = {
      category: [],
      subCategory: [],
      colors: [],
      sizes: [],
      minPrice: "",
      maxPrice: "",
      rating: [],
      collections: collectionId ? [parseInt(collectionId)] : [],
    };

    handleFilterChange(initialFilters);
  }, [searchParams, handleFilterChange]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar with Sort and Filter Toggle */}
      <div className="sticky top-0 z-8  pt-6 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <FunnelIcon className="w-5 h-5" />
                Filters
              </button>
              <ProductSort
                onSortChange={handleSortChange}
                currentSort={currentSort}
              />
            </div>
            <div className="text-sm text-gray-500">
              {searchParams?.get("search")}
              {products.length} Products Found
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-1">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-72 flex-shrink-0">
            <FilterSort
              onFilterChange={handleFilterChange}
              categories={mockCategories}
              subCategories={mockSubCategories}
              colors={mockColors}
              sizes={mockSizes}
              isOpen={isFilterOpen}
              onClose={() => setIsFilterOpen(false)}
            />
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : error ? (
              <div className="text-red-600 text-center">{error}</div>
            ) : products.length === 0 ? (
              <div className="text-center text-gray-600">No products found</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product: any) => (
                  <ProductCard
                    key={`${product.id}-${
                      product.productVariants?.[0]?.id || 0
                    }`}
                    product={product}
                    productVariantId={product.productVariants?.[0]?.id || 0}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
