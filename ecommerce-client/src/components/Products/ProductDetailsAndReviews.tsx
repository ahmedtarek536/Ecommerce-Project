"use client";
import { StarIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { AddReveiwToProduct } from "@/api/productsAPI";
import AuthModel from "../auth/Auth";
import { useAppStore } from "@/store/useAppStore";
export default function ProductDetailsAndReviews({ product }) {
  const [expandedReviews, setExpandedReviews] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [newReview, setNewReview] = useState({ name: "", rating: 5, text: "" });
  const [visibleReviews, setVisibleReviews] = useState(5); // Start with 5 reviews

  // Sort reviews by highest rating
  const sortedReviews = [...product.productReviews].sort(
    (a, b) => b.rating - a.rating
  );

  // Toggle Read More
  const toggleReadMore = (id) => {
    setExpandedReviews((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const { token } = useAppStore();

  // Handle Review Submission (Mock)
  const handleAddReview = async (e) => {
    e.preventDefault();
    const data = await AddReveiwToProduct(
      product.id,
      newReview.rating,
      newReview.text,
      token
    );
    console.log(data);
    setNewReview({ name: "", rating: 5, text: "" });
    setShowModal(false);
  };

  return (
    <>
      <AuthModel model={showAuthModal} setModel={setShowAuthModal} />
      <div className="mt-10 container max-w-4xl mx-auto px-4">
        {/* Product Description */}
        <h5 className="font-bold text-2xl text-black border-b pb-3">
          Product Details
        </h5>
        <div className="mt-4">
          <div
            className="ql-editor text-gray-700 text-base leading-relaxed"
            dangerouslySetInnerHTML={{ __html: product.description }}
          ></div>
        </div>

        {/* Customer Reviews */}
        <div className="mt-12">
          <div className="flex justify-between items-center gap-3 border-b pb-3">
            <h5 className="font-bold text-lg sm:text-2xl text-black">
              Customer Reviews
            </h5>
            <button
              className="bg-black text-white text-xs px-4  py-[6px] sm:font-mono font-meduim sm:text-sm rounded-md  transition-all"
              onClick={() => {
                if (token) setShowModal(true);
                else setShowAuthModal(true);
              }}
            >
              Add Review
            </button>
          </div>

          {sortedReviews.length > 0 ? (
            <>
              <div className="grid sm:grid-cols-2 gap-6 mt-6">
                {sortedReviews.slice(0, visibleReviews).map((review) => (
                  <div
                    key={review.id}
                    className="p-4 border border-gray-100 rounded-lg shadow-sm bg-white transition-all duration-300 hover:shadow-md"
                  >
                    {/* Customer Name & Avatar */}
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 flex items-center justify-center bg-gray-900 text-white text-sm font-semibold rounded-full">
                        {review.customer.firstName[0]}
                        {review.customer.lastName[0]}
                      </div>
                      <p className="font-medium text-black text-sm">
                        {review.customer.firstName} {review.customer.lastName}
                      </p>
                    </div>

                    {/* Star Rating */}
                    <div className="flex items-center gap-1 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          //size={16}
                          className={
                            i < review.rating
                              ? "fill-yellow-400 text-yellow-400 w-5"
                              : "text-gray-300 w-5"
                          }
                        />
                      ))}
                      <span className="text-gray-600 text-sm">
                        ({review.rating}/5)
                      </span>
                    </div>

                    {/* Review Text with Read More */}
                    <p className="text-gray-600 mt-2 text-sm italic">
                      "
                      {expandedReviews[review.id] || review.review.length <= 150
                        ? review.review
                        : review.review.substring(0, 150) + "..."}
                      {review.review.length > 150 && (
                        <span
                          className="text-blue-600 cursor-pointer ml-1"
                          onClick={() => toggleReadMore(review.id)}
                        >
                          {expandedReviews[review.id]
                            ? "Read Less"
                            : "Read More"}
                        </span>
                      )}
                      "
                    </p>
                  </div>
                ))}
              </div>

              {/* Show More Button */}
              {visibleReviews < sortedReviews.length && (
                <div className="flex justify-center mt-6">
                  <button
                    className=" px-4 py-2 rounded-md text-blue-600 transition-all"
                    onClick={() => setVisibleReviews(visibleReviews + 5)}
                  >
                    Show More Reviews
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-500 text-sm mt-4">
              No reviews yet. Be the first to share your experience!
            </p>
          )}
        </div>

        {/* Add Review Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
              <h5 className="font-bold text-xl text-gray-900 mb-4">
                Leave a Review
              </h5>
              <form className="space-y-4" onSubmit={handleAddReview}>
                <select
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-gray-300"
                  value={newReview.rating}
                  onChange={(e) =>
                    setNewReview({
                      ...newReview,
                      rating: parseInt(e.target.value),
                    })
                  }
                  required
                >
                  {[5, 4, 3, 2, 1].map((num) => (
                    <option key={num} value={num}>
                      {num} Stars
                    </option>
                  ))}
                </select>
                <textarea
                  placeholder="Your Review"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-gray-300"
                  rows="3"
                  value={newReview.text}
                  onChange={(e) =>
                    setNewReview({ ...newReview, text: e.target.value })
                  }
                  required
                ></textarea>
                <button
                  type="submit"
                  className="w-full bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-all"
                >
                  Submit Review
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
