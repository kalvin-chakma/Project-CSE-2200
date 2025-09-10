import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { productContext } from "../utills/Context";
import { ThreeDots } from "react-loader-spinner";

const Details = () => {
  const [products, setProducts] = useContext(productContext);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [editProduct, setEditProduct] = useState({
    title: "",
    category: "",
    price: "",
    description: "",
    image: "",
  });
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const response = await fetch(
          "https://project-cse-2200-xi.vercel.app/api/user/role",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setUserRole(data.role);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserRole();
  }, []);

  useEffect(() => {
    if (!id) {
      setError("Invalid product ID");
      setLoading(false);
      return;
    }

    const getProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("jwtToken");
        const response = await fetch(
          `https://project-cse-2200-xi.vercel.app/api/products/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch product");
        }
        const data = await response.json();
        setProduct(data);
        setEditProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    getProduct();
  }, [id]);

  const ProductDeleteHandler = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await fetch(
        `https://project-cse-2200-xi.vercel.app/api/products/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete product");
      }
      const updatedProducts = products.filter((p) => p._id !== id);
      setProducts(updatedProducts);
      navigate("/");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product: " + error.message);
    }
  };

  const ProductEditHandler = async (e) => {
    e.preventDefault();
    const updatedProduct = {
      title: editProduct.title,
      category: editProduct.category,
      price: editProduct.price,
      description: editProduct.description,
      image: editProduct.image,
    };
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await fetch(
        `https://project-cse-2200-xi.vercel.app/api/products/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedProduct),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update product");
      }
      const data = await response.json();
      const updatedProducts = products.map((p) => (p._id === id ? data : p));
      setProducts(updatedProducts);
      setIsEditing(false);
      setProduct(data);
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product: " + error.message);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        navigate("/LogInPage");
        return;
      }

      const response = await fetch(
        `https://project-cse-2200-xi.vercel.app/api/products/${id}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            rating: Number(reviewRating),
            comment: reviewComment,
          }),
        }
      );

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Failed to submit review");
      }

      const updated = await response.json();
      setProduct(updated);
      setProducts((prev) =>
        prev.map((p) => (p._id === updated._id ? updated : p))
      );
      setReviewRating(5);
      setReviewComment("");
    } catch (err) {
      console.error("Error submitting review:", err);
      alert(err.message);
    }
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      navigate("/LogInPage");
      return;
    }

    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch(
        "https://project-cse-2200-xi.vercel.app/api/cart/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId,
            productId: id,
            image: product.image,
            quantity,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await response.json();
      alert("Item added to cart successfully");
      navigate("/CartPage");
    } catch (error) {
      console.error("Error adding product to cart:", error);
      setError(`Failed to add product to cart: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <ThreeDots
          height="80"
          width="80"
          radius="9"
          color="#10B981"
          ariaLabel="three-dots-loading"
          visible={true}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-red-600 text-lg font-semibold">Error: {error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-gray-600 text-lg font-semibold">Product not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-6">
      <div className="container max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Product Image */}
          <div className="flex-shrink-0">
            <img
              className="w-full max-w-md h-80 object-contain rounded-lg"
              src={product.image}
              alt={product.title}
            />
          </div>

          {/* Product Details */}
          <div className="flex-1">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-3">
              {product.title}
            </h1>
            <p className="text-lg text-gray-600 mb-3">
              Category: {product.category}
            </p>
            <p className="text-2xl text-red-600 font-semibold mb-3">
              ${product.price}
            </p>
            {typeof product.averageRating === "number" && (
              <div className="flex items-center text-sm text-gray-600 mb-3">
                <span className="text-yellow-500">
                  {"★".repeat(Math.round(product.averageRating))}
                  {"☆".repeat(5 - Math.round(product.averageRating))}
                </span>
                <span className="ml-2">
                  {product.averageRating.toFixed(1)} / 5 (
                  {product.numReviews || 0} reviews)
                </span>
              </div>
            )}
            <p className="text-gray-700 mb-6">{product.description}</p>

            {/* Edit Form or Action Buttons */}
            {isEditing ? (
              <form onSubmit={ProductEditHandler} className="space-y-4">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={editProduct.title}
                    onChange={(e) =>
                      setEditProduct({ ...editProduct, title: e.target.value })
                    }
                    className="mt-1 w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Category
                  </label>
                  <input
                    type="text"
                    id="category"
                    value={editProduct.category}
                    onChange={(e) =>
                      setEditProduct({ ...editProduct, category: e.target.value })
                    }
                    className="mt-1 w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Price
                  </label>
                  <input
                    type="number"
                    id="price"
                    value={editProduct.price}
                    onChange={(e) =>
                      setEditProduct({ ...editProduct, price: e.target.value })
                    }
                    className="mt-1 w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-500"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={editProduct.description}
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        description: e.target.value,
                      })
                    }
                    className="mt-1 w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-500"
                    rows="4"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="image"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Image URL
                  </label>
                  <input
                    type="url"
                    id="image"
                    value={editProduct.image}
                    onChange={(e) =>
                      setEditProduct({ ...editProduct, image: e.target.value })
                    }
                    className="mt-1 w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4">
                {userRole === "admin" ? (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      Edit
                    </button>
                    <button
                      onClick={ProductDeleteHandler}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      Delete
                    </button>
                  </>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border rounded-md">
                      <button
                        onClick={() =>
                          setQuantity((prev) => (prev > 1 ? prev - 1 : 1))
                        }
                        className="px-3 py-2 bg-gray-200 hover:bg-gray-300 focus:outline-none"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="px-4 py-2 text-gray-800">{quantity}</span>
                      <button
                        onClick={() => setQuantity((prev) => prev + 1)}
                        className="px-3 py-2 bg-gray-200 hover:bg-gray-300 focus:outline-none"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={handleAddToCart}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      Add to Cart
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Reviews</h3>
          <div className="max-h-64 overflow-y-auto space-y-4 pr-2">
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews
                .slice()
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((rev, idx) => (
                  <div
                    key={idx}
                    className="border rounded-lg p-4 bg-gray-50"
                    role="article"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-800">
                        {rev.name || "User"}
                      </span>
                      <span className="text-yellow-600">
                        {"★".repeat(rev.rating)}
                        {"☆".repeat(5 - rev.rating)}
                      </span>
                    </div>
                    <p className="text-gray-700 mt-2">{rev.comment}</p>
                    {rev.createdAt && (
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(rev.createdAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                ))
            ) : (
              <p className="text-gray-500">No reviews yet.</p>
            )}
          </div>

          {/* Add Review Form */}
          {userRole !== "admin" && (
            <form onSubmit={submitReview} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="rating"
                  className="block text-sm font-medium text-gray-700"
                >
                  Your Rating
                </label>
                <select
                  id="rating"
                  value={reviewRating}
                  onChange={(e) => setReviewRating(e.target.value)}
                  className="mt-1 w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value={5}>5 - Excellent</option>
                  <option value={4}>4 - Good</option>
                  <option value={3}>3 - Average</option>
                  <option value={2}>2 - Poor</option>
                  <option value={1}>1 - Terrible</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="comment"
                  className="block text-sm font-medium text-gray-700"
                >
                  Comment
                </label>
                <textarea
                  id="comment"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="mt-1 w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-500"
                  rows="4"
                  placeholder="Share your experience..."
                  required
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Submit Review
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Details;