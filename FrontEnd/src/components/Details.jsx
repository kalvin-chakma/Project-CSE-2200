import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { productContext } from "../utills/Context";
import { ThreeDots } from "react-loader-spinner";
import { CiStar } from "react-icons/ci";
import { FaStar } from "react-icons/fa";

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
    gender: "unisex",
    sizes: [],
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
        setEditProduct({
          title: data.title || "",
          category: data.category || "",
          price: data.price || "",
          description: data.description || "",
          image: data.image || "",
          gender: data.gender || "unisex",
          sizes: Array.isArray(data.sizes) ? data.sizes : [],
        });
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
      gender: editProduct.gender,
      sizes: editProduct.sizes,
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
    <div className="max-w-4xl w-full mx-auto p-6">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-shrink-0">
          <div className="relative">
            <img
              className="w-full max-w-md h-80 object-contain rounded-lg"
              src={product.image}
              alt={product.title}
            />
            <button className="absolute top-2 left-2 bg-white rounded-full p-1 shadow-md">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            <button className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
          <div className="flex gap-2 mt-2">
            <img
              className="w-20 h-20 object-cover rounded-lg"
              src={product.image}
              alt={product.title}
            />
            <img
              className="w-20 h-20 object-cover rounded-lg"
              src={product.image}
              alt={product.title}
            />
            <img
              className="w-20 h-20 object-cover rounded-lg"
              src={product.image}
              alt={product.title}
            />
          </div>
        </div>

        <div className="flex-1 items-center justify-between">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">{product.title}</h1>
          <p className="text-xl text-red-600 font-semibold mb-2">Price: ${product.price}</p>
          <div className="mb-2">
            <p className="text-sm text-gray-600">Gender: {product.gender || 'unisex'}</p>
          </div>
          {Array.isArray(product.sizes) && product.sizes.length > 0 && (
            <div className="mb-2">
              <p className="text-sm text-gray-600">Available Sizes</p>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((sz) => (
                  <span key={sz} className="px-3 py-1 bg-gray-200 rounded-full text-xs uppercase">{String(sz)}</span>
                ))}
              </div>
            </div>
          )}
          <div className="mb-4">
            <p className="text-sm text-gray-600">Available Color</p>
            <div className="flex space-x-2 mt-3">
              <button className="w-6 h-6 bg-gray-400 rounded-full"></button>
            </div>
          </div>

          {isEditing ? (
            <form onSubmit={ProductEditHandler} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={editProduct.title}
                  onChange={(e) => setEditProduct({ ...editProduct, title: e.target.value })}
                  className="mt-1 w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <input
                  type="text"
                  id="category"
                  value={editProduct.category}
                  onChange={(e) => setEditProduct({ ...editProduct, category: e.target.value })}
                  className="mt-1 w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Price
                </label>
                <input
                  type="number"
                  id="price"
                  value={editProduct.price}
                  onChange={(e) => setEditProduct({ ...editProduct, price: e.target.value })}
                  className="mt-1 w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-500"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  value={editProduct.description}
                  onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
                  className="mt-1 w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-500"
                  rows="4"
                  required
                />
              </div>
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                  Image URL
                </label>
                <input
                  type="url"
                  id="image"
                  value={editProduct.image}
                  onChange={(e) => setEditProduct({ ...editProduct, image: e.target.value })}
                  className="mt-1 w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="gender">
                  Gender
                </label>
                <select
                  id="gender"
                  value={editProduct.gender}
                  onChange={(e) => setEditProduct({ ...editProduct, gender: e.target.value })}
                  className="mt-1 w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="unisex">Unisex</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <span className="block text-sm font-medium text-gray-700 mb-1">Sizes</span>
                <div className="flex gap-4">
                  {['s','m','xl','xxl'].map((sz) => (
                    <label key={sz} className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={Array.isArray(editProduct.sizes) && editProduct.sizes.includes(sz)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setEditProduct({ ...editProduct, sizes: Array.from(new Set([...(editProduct.sizes||[]), sz])) });
                          } else {
                            setEditProduct({ ...editProduct, sizes: (editProduct.sizes||[]).filter((v) => v !== sz) });
                          }
                        }}
                      />
                      <span className="uppercase">{sz}</span>
                    </label>
                  ))}
                </div>
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
                      onClick={() => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))}
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
                    <div className="flex text-yellow-500">
                      {[...Array(5)].map((_, i) =>
                        i < rev.rating ? <FaStar key={i} /> : <CiStar key={i} />
                      )}
                    </div>
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
  );
};

export default Details;