"use client";
import MediaUploader from "@/components/MediaUploder";
import QuillEditor from "@/components/TextEditor";

import { TrashIcon } from "@heroicons/react/20/solid";
import React, { useEffect, useState } from "react";

interface ProductData {
  name: string;
  description: string;
  price: number;
  categoryId: number;
  subCategoryId: number;
  productVariants: ProductVariant[];
}
interface ProductVariant {
  color: string;
  productImages: ProductImage[];
  sizes: ProductSize[];
}

interface ProductImage {
  imageUrl: string;
}

interface ProductSize {
  name: string;
  quantity: number;
}

interface Category {
  id: number;
  name: string;
}
interface SubCategory {
  id: number;
  name: string;
  categoryId: number;
}

const ProductForm = () => {
  

  const [productData, setProductData] = useState<ProductData>({
    name: "",
    description: "",
    price: 0,
    categoryId: 0,
    subCategoryId: 0,
    productVariants: [
      {
        color: "",
        productImages: [{ imageUrl: "" }],
        sizes: [{ name: "", quantity: 0 }],
      },
    ],
  });
  const [contentTextbox, setContentTextbox] = useState("");
  const [categories, setCategoriers] = useState<Category[]>([]);
  const [subCategories, setSubCategoriers] = useState<SubCategory[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle change in form fields for product and variants
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string,
    variantIndex: number,
    sizeIndex?: number
  ) => {
    const { value } = e.target;

    if (sizeIndex === undefined) {
      const updatedVariants = [...productData.productVariants];
      updatedVariants[variantIndex] = {
        ...updatedVariants[variantIndex],
        [field]: value,
      };
      setProductData({
        ...productData,
        productVariants: updatedVariants,
      });
    } else {
      const updatedVariants = [...productData.productVariants];
      updatedVariants[variantIndex].sizes = [
        ...updatedVariants[variantIndex].sizes.slice(0, sizeIndex),
        {
          ...updatedVariants[variantIndex].sizes[sizeIndex],
          [field]: value,
        },
        ...updatedVariants[variantIndex].sizes.slice(sizeIndex + 1),
      ];
      setProductData({
        ...productData,
        productVariants: updatedVariants,
      });
    }
  };

 
  // Handle adding a new variant
  const addVariant = () => {
    const newVariant = {
      color: "",
      productImages: [{ imageUrl: "" }],
      sizes: [{ name: "", quantity: 0 }],
    };
    setProductData({
      ...productData,
      productVariants: [...productData.productVariants, newVariant],
    });
  };

  // Handle removing a variant (except the first one)
  const removeVariant = (variantIndex: number) => {
    if (variantIndex > 0) {
      const updatedVariants = [...productData.productVariants];
      updatedVariants.splice(variantIndex, 1);
      setProductData({
        ...productData,
        productVariants: updatedVariants,
      });
    }
  };

  // Handle adding a new size to a variant
  const addSize = (variantIndex: number) => {
    const newSize = { name: "", quantity: 0 };
    const updatedVariants = [...productData.productVariants];
    updatedVariants[variantIndex].sizes.push(newSize);
    setProductData({
      ...productData,
      productVariants: updatedVariants,
    });
  };

  // Handle removing a size (except the first one)
  const removeSize = (variantIndex: number, sizeIndex: number) => {
    if (sizeIndex > 0) {
      const updatedVariants = [...productData.productVariants];
      updatedVariants[variantIndex].sizes.splice(sizeIndex, 1);
      setProductData({
        ...productData,
        productVariants: updatedVariants,
      });
    }
  };

  // Handle image URL change for a variant
  const handleImageChange = (value: ProductImage[], variantIndex: number) => {
    const updatedVariants = [...productData.productVariants];
    updatedVariants[variantIndex].productImages = value;
    setProductData({
      ...productData,
      productVariants: updatedVariants,
    });
  };

  // Async function to submit the product data
  const submitProduct = async () => {
    try {
      setLoading(true);
      setError(null); //https://localhost:44352/api/FullProduct

      const response = await fetch(`https://localhost:44352/api/FullProduct`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit the product");
      }

      alert("Product submitted successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function getCategories() {
      const response = await fetch(
        `https://localhost:44352/api/ProductCategories`
      );
      const categories = await response.json();
      setCategoriers(categories.data);
    }
    async function getSubCategories() {
      const response = await fetch(
        `https://localhost:44352/api/ProductSubCategories`
      );
      const subcategories = await response.json();
      setSubCategoriers(subcategories.data);
    }
    getCategories();
    getSubCategories();
  }, []);

  useEffect(
    function () {
      setProductData({ ...productData, description: contentTextbox });
    },
    [contentTextbox]
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Add New Product</h2>
        <p className="mt-2 text-sm text-gray-600">
          Fill in the details below to create a new product.
        </p>
      </div>

      {/* Product Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="product-name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Product Name
            </label>
            <input
              type="text"
              id="product-name"
              value={productData.name}
              onChange={(e) =>
                setProductData({ ...productData, name: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter product name"
            />
          </div>

          <div>
            <label
              htmlFor="product-price"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Price
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                $
              </span>
              <input
                type="number"
                id="product-price"
                value={productData.price}
                onChange={(e) =>
                  setProductData({
                    ...productData,
                    price: parseFloat(e.target.value),
                  })
                }
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="product-description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Product Description
            </label>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <QuillEditor
                setContent={setContentTextbox}
                content={contentTextbox}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="categoryId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category
            </label>
            <select
              id="categoryId"
              value={productData.categoryId}
              onChange={(e) =>
                setProductData({
                  ...productData,
                  categoryId: parseInt(e.target.value),
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value={0}>Select a category</option>
              {categories?.map((category: Category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="subCategoryId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Subcategory
            </label>
            <select
              id="subCategoryId"
              value={productData.subCategoryId}
              onChange={(e) =>
                setProductData({
                  ...productData,
                  subCategoryId: parseInt(e.target.value),
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              disabled={!productData.categoryId}
            >
              <option value={0}>Select a subcategory</option>
              {subCategories?.map((subcategory: SubCategory) =>
                productData.categoryId === subcategory.categoryId ? (
                  <option key={subcategory.id} value={subcategory.id}>
                    {subcategory.name}
                  </option>
                ) : null
              )}
            </select>
          </div>
        </div>
      </div>

      {/* Product Variants */}
      <div className="space-y-6">
        {productData.productVariants.map((variant, variantIndex) => (
          <div
            key={variantIndex}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Variant {variantIndex + 1}
              </h3>
              {variantIndex > 0 && (
                <button
                  type="button"
                  onClick={() => removeVariant(variantIndex)}
                  className="text-red-600 hover:text-red-700 flex items-center gap-1 text-sm font-medium"
                >
                  <TrashIcon className="w-4 h-4" />
                  Remove Variant
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor={`color-${variantIndex}`}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Color
                </label>
                <input
                  type="text"
                  id={`color-${variantIndex}`}
                  value={variant.color}
                  onChange={(e) => handleChange(e, "color", variantIndex)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="e.g., Blue"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Images
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <MediaUploader
                    setImages={handleImageChange}
                    variantIndex={variantIndex}
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Sizes and Stock
                  </label>
                  <button
                    type="button"
                    onClick={() => addSize(variantIndex)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Add Size
                  </button>
                </div>

                <div className="space-y-4">
                  {variant.sizes.map((size, sizeIndex) => (
                    <div key={sizeIndex} className="flex items-center gap-4">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={size.name}
                          onChange={(e) =>
                            handleChange(e, "name", variantIndex, sizeIndex)
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="Size name (e.g., S, M, L)"
                        />
                      </div>
                      <div className="flex-1">
                        <input
                          type="number"
                          value={size.quantity}
                          onChange={(e) =>
                            handleChange(e, "quantity", variantIndex, sizeIndex)
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="Quantity"
                          min="0"
                        />
                      </div>
                      {sizeIndex > 0 && (
                        <button
                          type="button"
                          onClick={() => removeSize(variantIndex, sizeIndex)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addVariant}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:text-gray-700 hover:border-gray-400 transition-colors flex items-center justify-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Another Variant
        </button>
      </div>

      {/* Submit Button */}
      <div className="mt-8">
        <button
          type="button"
          onClick={submitProduct}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Creating Product...
            </div>
          ) : (
            "Create Product"
          )}
        </button>
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductForm;
