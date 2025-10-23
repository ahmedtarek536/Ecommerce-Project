"use client";
import { useEffect, useState } from "react";
import { GetSuggestionProducts } from "@/api/productsAPI";
import {
  MagnifyingGlassMinusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useAppStore } from "@/store/useAppStore";
import { useRouter } from "next/navigation";
import { useSearch } from "@/hooks/SearchProivder";

const popularItems: string[] = [
  "air max",
  "air force",
  "jorden",
  "shoose",
  "nike shoose",
  "football",
  "base ball shoose",
];

export default function SearchModel() {
  const { showSearch, setShowSearch } = useAppStore();
  const [query, setQuery] = useState("");
  const { setQuery: setSearchQuery } = useAppStore();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const router = useRouter();
  const { setSearchQuery: SetSearchQuery } = useSearch();

  // Fetch Suggestions
  const handleSuggestion = async (q: string) => {
    setQuery(q);
    if (q.length > 2) {
      const results = await GetSuggestionProducts(q);
      setSuggestions(results || []);
    } else {
      setSuggestions([]);
    }
  };

  // Search Products
  const handleSearch = async (searchItem: string) => {
    console.log("Searching for:", searchItem);
    const searchQuery = searchItem ? searchItem : query;
    if (!searchQuery) return;
    //  const results = await SearchProducts(searchQuery);
    setSearchQuery(searchQuery);
    SetSearchQuery(searchQuery);
    //setSuggestions([]);

    router.push("/products?search=" + searchQuery);
    setShowSearch(false);
  };

  useEffect(
    function () {
      if (query == "") setSearchQuery("");
    },
    [query]
  );
  if (!showSearch) return null;

  return (
    <div className=" bg-white w-full h-full  fixed top-0 left-0 px-6 z-50 ">
      <div className="flex items-center gap-2 mt-4 sm:w-[80%] m-auto">
        {/* Search Input */}
        <div style={{ position: "relative" }} className="w-full ">
          <MagnifyingGlassMinusIcon
            className="w-5 absolute top-3 left-3 cursor-pointer"
            onClick={handleSearch}
          />
          {query.length ? (
            <XMarkIcon
              className="w-5 absolute top-3 right-3 cursor-pointer"
              onClick={() => {
                setQuery("");
                SetSearchQuery("");
              }}
            />
          ) : null}
          <input
            type="text"
            value={query}
            onChange={(e) => handleSuggestion(e.target.value)}
            placeholder="Search"
            style={{
              width: "100%",
              border: "1px solid #ccc",
              //borderRadius: "5px px-6",
            }}
            className="rounded-full px-10 py-2 outline-none placeholder:text-[#777] font-medium"
          />
        </div>

        {/* Search Button */}
        <button
          className="font-semibold  text-lg"
          onClick={() => setShowSearch(false)}
        >
          Cancel
        </button>

        {/* Products Grid */}
      </div>
      <div className="sm:w-[80%] m-auto">
        <h3 className=" font-medium p-2 mt-8">
          {suggestions.length > 0 ? "Top Suggestion" : "Popular Search Terms"}
        </h3>
        {/* Suggestions Dropdown */}
        {suggestions.length == 0 && (
          <div className=" p-4 py-3 cursor-pointer gap-4   flex flex-wrap">
            {popularItems.map((item) => (
              <span
                key={item}
                className="bg-[#eee] rounded-full p-2 py-1 text-sm cursor-pointer "
                onClick={() => {
                  setQuery(item);
                  //setSuggestions([]);
                  handleSearch(item);
                }}
              >
                {item}
              </span>
            ))}
          </div>
        )}
        {suggestions.length > 0 && query.length > 0 && (
          <ul
            style={{
              position: "relative",
              width: "100%",

              marginTop: "5px",
              listStyle: "none",
              padding: "0",
              zIndex: 10,
            }}
            className="mt-6 h-full max-h-[500px] overflow-y-auto search"
          >
            {suggestions.map((s, index) => (
              <>
                <li
                  key={index}
                  onClick={() => {
                    setQuery(s);
                    setSuggestions([]);
                    handleSearch(s);
                  }}
                  className="hover:bg-gray-100 p-4 py-3 cursor-pointer border-b border-[#eee]"
                >
                  {s}
                </li>
              </>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
