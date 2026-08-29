import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { productContext } from "../utills/Context";
import { ThreeDots } from "react-loader-spinner";
import { CiStar } from "react-icons/ci";
import {
  FaStar,
  FaHeart,
  FaRegHeart,
  FaShoppingCart,
  FaCheckCircle,
} from "react-icons/fa";
import { toast } from "react-toastify";
import API_BASE_URL from "../config/api.js";

const StarRating = ({ rating, size = "text-base" }) => (
  <div className={`flex text-yellow-500 ${size}`}>
    {[...Array(5)].map((_, i) =>
      i < Math.round(rating || 0) ? <FaStar key={i} /> : <CiStar key={i} />,
    )}
  </div>
);

const Details = () => {
  const [products, setProducts] = useContext(productContext);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editProduct, setEditProduct] = useState({
    title: "",
    brand: "",
    sku: "",
    status: "active",
    tagsText: "",
    category: "",
    price: "",
    discountPercentage: "",
    stock: "",
    description: "",
    image: "",
    imagesText: "",
    featuresText: "",
    specifications: [{ key: "", value: "" }],
    gender: "unisex",
    sizes: [],
  });
  const { slug } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (token) {
          setIsAuthenticated(true);
          const response = await fetch(`${API_BASE_URL}/api/user/role`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.ok) {
            const data = await response.json();
            setUserRole(data.role);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserRole();
  }, []);

  // Check wishlist status once we know the real product _id (not the slug)
  useEffect(() => {
    const checkWishlistStatus = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token || !product?._id) return;

        const response = await fetch(`${API_BASE_URL}/api/wishlist`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          const inWishlist = (data.items || []).some(
            (item) => item.product?._id === product._id,
          );
          setIsInWishlist(inWishlist);
        }
      } catch (error) {
        console.error("Error checking wishlist status:", error);
      }
    };

    checkWishlistStatus();
  }, [product?._id]);

  useEffect(() => {
    if (!slug) {
      setError("Invalid product URL");
      setLoading(false);
      return;
    }

    const getProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("jwtToken");
        const response = await fetch(`${API_BASE_URL}/api/products/${slug}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch product");
        }
        const data = await response.json();
        setProduct(data);
        setActiveImageIndex(0);
        setSelectedSize(
          Array.isArray(data.sizes) && data.sizes.length > 0
            ? data.sizes[0]
            : null,
        );
        setEditProduct({
          title: data.title || "",
          brand: data.brand || "",
          sku: data.sku || "",
          status: data.status || "active",
          tagsText: Array.isArray(data.tags) ? data.tags.join(", ") : "",
          category: data.category || "",
          price: data.price ?? "",
          discountPercentage: data.discountPercentage ?? 0,
          stock: data.stock ?? 0,
          description: data.description || "",
          image: data.image || "",
          imagesText: Array.isArray(data.images) ? data.images.join("\n") : "",
          featuresText: Array.isArray(data.features)
            ? data.features.join("\n")
            : "",
          specifications:
            Array.isArray(data.specifications) && data.specifications.length > 0
              ? data.specifications
              : [{ key: "", value: "" }],
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
  }, [slug]);

  const ProductDeleteHandler = async () => {
    if (!product?._id) return;
    if (!window.confirm("Delete this product? This cannot be undone.")) return;
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await fetch(
        `${API_BASE_URL}/api/products/${product._id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete product");
      }
      const updatedProducts = products.filter((p) => p._id !== product._id);
      setProducts(updatedProducts);
      navigate("/");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product: " + error.message);
    }
  };

  const updateEditSpecRow = (index, field, value) => {
    setEditProduct((prev) => ({
      ...prev,
      specifications: prev.specifications.map((row, i) =>
        i === index ? { ...row, [field]: value } : row,
      ),
    }));
  };

  const addEditSpecRow = () => {
    setEditProduct((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { key: "", value: "" }],
    }));
  };

  const removeEditSpecRow = (index) => {
    setEditProduct((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index),
    }));
  };

  const ProductEditHandler = async (e) => {
    e.preventDefault();
    if (!product?._id) return;

    const images = editProduct.imagesText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    const features = editProduct.featuresText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    const specifications = editProduct.specifications
      .map((row) => ({ key: row.key.trim(), value: row.value.trim() }))
      .filter((row) => row.key && row.value);
    const tags = editProduct.tagsText
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    const updatedProduct = {
      title: editProduct.title,
      brand: editProduct.brand,
      sku: editProduct.sku,
      status: editProduct.status,
      tags,
      category: editProduct.category,
      price: Number(editProduct.price),
      discountPercentage: Number(editProduct.discountPercentage) || 0,
      stock: Number(editProduct.stock) || 0,
      description: editProduct.description,
      image: editProduct.image,
      images,
      features,
      specifications,
      gender: editProduct.gender,
      sizes: editProduct.sizes,
    };
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await fetch(
        `${API_BASE_URL}/api/products/${product._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedProduct),
        },
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update product");
      }
      const data = await response.json();
      const updatedProducts = products.map((p) =>
        p._id === data._id ? data : p,
      );
      setProducts(updatedProducts);
      setIsEditing(false);
      setProduct(data);
      if (data.slug && data.slug !== slug) {
        navigate(`/details/${data.slug}`, { replace: true });
      }
      toast.success("Product updated");
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
      if (!product?._id) return;

      const response = await fetch(
        `${API_BASE_URL}/api/products/${product._id}/reviews`,
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
        },
      );

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Failed to submit review");
      }

      const updated = await response.json();
      setProduct(updated);
      setProducts((prev) =>
        prev.map((p) => (p._id === updated._id ? updated : p)),
      );
      setReviewRating(5);
      setReviewComment("");
      toast.success("Review submitted");
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
    if (!product?._id) return;

    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch(`${API_BASE_URL}/api/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          productId: product._id,
          image: product.image,
          quantity,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await response.json();
      toast.success("Item added to cart");
      navigate("/CartPage");
    } catch (error) {
      console.error("Error adding product to cart:", error);
      toast.error(`Failed to add product to cart: ${error.message}`);
    }
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to add items to your wishlist.");
      navigate("/LogInPage");
      return;
    }
    if (!product?._id) return;

    try {
      const token = localStorage.getItem("jwtToken");

      if (isInWishlist) {
        const response = await fetch(
          `${API_BASE_URL}/api/wishlist/remove/${product._id}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || "Failed to remove from wishlist",
          );
        }

        setIsInWishlist(false);
        toast.success("Removed from wishlist");
      } else {
        const response = await fetch(`${API_BASE_URL}/api/wishlist/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId: product._id }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || "Failed to add to wishlist");
        }

        setIsInWishlist(true);
        toast.success("Added to wishlist");
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <ThreeDots
          height="80"
          width="80"
          radius="9"
          color="#111827"
          ariaLabel="three-dots-loading"
          visible={true}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-red-600 text-lg font-semibold">Error: {error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-600 text-lg font-semibold">Product not found</p>
      </div>
    );
  }

  const galleryImages =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : [product.image];
  const discount = Number(product.discountPercentage) || 0;
  const originalPrice =
    discount > 0 ? product.price / (1 - discount / 100) : null;
  const inStock = (product.stock ?? 0) > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2 flex-wrap">
          <Link to="/" className="hover:text-gray-900">
            Home
          </Link>
          <span>/</span>
          <Link
            to={`/category/${product.category}`}
            className="capitalize hover:text-gray-900"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-gray-800 truncate max-w-xs">
            {product.title}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Image gallery */}
          <div>
            <div className="relative bg-white border border-gray-200 rounded-lg aspect-square flex items-center justify-center overflow-hidden">
              <img
                src={galleryImages[activeImageIndex]}
                alt={product.title}
                className="max-w-full max-h-full object-contain"
              />
              <button
                onClick={handleWishlistToggle}
                className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:scale-105 transition-transform"
                aria-label={
                  isInWishlist ? "Remove from wishlist" : "Add to wishlist"
                }
              >
                {isInWishlist ? (
                  <FaHeart className="text-gray-900" />
                ) : (
                  <FaRegHeart className="text-gray-600" />
                )}
              </button>
              {discount > 0 && (
                <span className="absolute top-3 left-3 bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded">
                  -{discount}%
                </span>
              )}
            </div>
            {galleryImages.length > 1 && (
              <div className="flex gap-3 mt-3">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-16 sm:w-20 sm:h-20 border rounded-lg overflow-hidden shrink-0 ${
                      idx === activeImageIndex
                        ? "border-gray-900 ring-2 ring-gray-900"
                        : "border-gray-200"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.title} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                {product.brand && (
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
                    {product.brand}
                  </p>
                )}
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {product.title}
                </h1>
                {product.sku && (
                  <p className="text-xs text-gray-400 mt-1">SKU: {product.sku}</p>
                )}
              </div>
              {userRole === "admin" && (
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => setIsEditing((v) => !v)}
                    className="px-3 py-1.5 text-sm bg-gray-900 text-white rounded-md hover:bg-black"
                  >
                    {isEditing ? "Cancel" : "Edit"}
                  </button>
                  <button
                    onClick={ProductDeleteHandler}
                    className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>

            {userRole === "admin" && product.status && product.status !== "active" && (
              <span className="inline-block mt-2 text-xs font-semibold uppercase tracking-wide bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                {product.status}
              </span>
            )}

            <div className="flex items-center gap-2 mt-3">
              <StarRating rating={product.averageRating} />
              <a
                href="#reviews"
                className="text-sm text-gray-500 hover:text-gray-900"
              >
                {product.averageRating
                  ? product.averageRating.toFixed(1)
                  : "No ratings"}{" "}
                ({product.numReviews || 0} reviews)
              </a>
            </div>

            <div className="mt-4 flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl font-bold text-gray-900">
                ${Number(product.price).toFixed(2)}
              </span>
              {originalPrice && (
                <>
                  <span className="text-lg text-gray-400 line-through">
                    ${originalPrice.toFixed(2)}
                  </span>
                  <span className="text-sm font-semibold text-green-600">
                    Save {discount}%
                  </span>
                </>
              )}
            </div>

            <div className="mt-3">
              {inStock ? (
                <span className="inline-flex items-center gap-1 text-sm font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
                  <FaCheckCircle /> In Stock{" "}
                  {product.stock ? `(${product.stock} available)` : ""}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-sm font-medium text-red-700 bg-red-50 px-2.5 py-1 rounded-full">
                  Out of Stock
                </span>
              )}
            </div>

            {Array.isArray(product.specifications) &&
              product.specifications.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">
                    Key Specifications
                  </h3>
                  <div className="border border-gray-200 rounded-lg divide-y divide-gray-100">
                    {product.specifications.map((spec, i) => (
                      <div key={i} className="flex px-3 py-2 text-sm">
                        <span className="w-1/2 text-gray-500">{spec.key}</span>
                        <span className="w-1/2 text-gray-900 font-medium">
                          {spec.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            <div className="mt-4 flex gap-2 flex-wrap">
              <span className="text-xs px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full capitalize">
                {product.category}
              </span>
              <span className="text-xs px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full capitalize">
                {product.gender || "unisex"}
              </span>
              {Array.isArray(product.tags) &&
                product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-1 bg-gray-50 border border-gray-200 text-gray-500 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
            </div>

            {Array.isArray(product.sizes) && product.sizes.length > 0 && (
              <div className="mt-5">
                <p className="text-sm font-medium text-gray-700 mb-2">Size</p>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-4 py-1.5 rounded-md border text-sm uppercase transition-colors ${
                        selectedSize === sz
                          ? "bg-gray-900 text-white border-gray-900"
                          : "bg-white text-gray-700 border-gray-300 hover:border-gray-900"
                      }`}
                    >
                      {String(sz)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {userRole !== "admin" && (
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <div className="flex items-center border border-gray-300 rounded-md w-fit">
                  <button
                    onClick={() =>
                      setQuantity((prev) => (prev > 1 ? prev - 1 : 1))
                    }
                    className="px-3 py-2 hover:bg-gray-100 focus:outline-none"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-gray-800">{quantity}</span>
                  <button
                    onClick={() => setQuantity((prev) => prev + 1)}
                    className="px-3 py-2 hover:bg-gray-100 focus:outline-none"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={!inStock}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-900 text-white font-semibold rounded-md hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <FaShoppingCart /> {inStock ? "Add to Cart" : "Out of Stock"}
                </button>
                <button
                  onClick={handleWishlistToggle}
                  className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-md border font-semibold transition-colors ${
                    isInWishlist
                      ? "border-gray-900 text-gray-900 bg-gray-100"
                      : "border-gray-300 text-gray-700 hover:border-gray-900"
                  }`}
                >
                  {isInWishlist ? <FaHeart /> : <FaRegHeart />}
                  {isInWishlist ? "In Wishlist" : "Wishlist"}
                </button>
              </div>
            )}

            {Array.isArray(product.features) && product.features.length > 0 && (
              <div className="mt-8">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  Key Features
                </h3>
                <ul className="space-y-1.5">
                  {product.features.map((f, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-gray-600"
                    >
                      <FaCheckCircle className="text-gray-400 mt-0.5 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Admin edit form */}
        {isEditing && userRole === "admin" && (
          <form
            onSubmit={ProductEditHandler}
            className="mt-10 bg-white border border-gray-200 rounded-lg p-6 space-y-4"
          >
            <h3 className="text-lg font-semibold text-gray-900">
              Edit Product
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={editProduct.title}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, title: e.target.value })
                  }
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brand
                </label>
                <input
                  type="text"
                  value={editProduct.brand}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, brand: e.target.value })
                  }
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SKU
                </label>
                <input
                  type="text"
                  value={editProduct.sku}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, sku: e.target.value })
                  }
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={editProduct.status}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, status: e.target.value })
                  }
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:outline-none"
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={editProduct.tagsText}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, tagsText: e.target.value })
                  }
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:outline-none"
                  placeholder="e.g. summer, bestseller, new-arrival"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={editProduct.category}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, category: e.target.value })
                  }
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={editProduct.price}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, price: e.target.value })
                  }
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount %
                </label>
                <input
                  type="number"
                  min="0"
                  max="90"
                  value={editProduct.discountPercentage}
                  onChange={(e) =>
                    setEditProduct({
                      ...editProduct,
                      discountPercentage: e.target.value,
                    })
                  }
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  min="0"
                  value={editProduct.stock}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, stock: e.target.value })
                  }
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  value={editProduct.gender}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, gender: e.target.value })
                  }
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:outline-none"
                >
                  <option value="unisex">Unisex</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Main Image URL
                </label>
                <input
                  type="url"
                  value={editProduct.image}
                  onChange={(e) =>
                    setEditProduct({ ...editProduct, image: e.target.value })
                  }
                  className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gallery Image URLs (one per line)
              </label>
              <textarea
                value={editProduct.imagesText}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, imagesText: e.target.value })
                }
                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:outline-none"
                rows="3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={editProduct.description}
                onChange={(e) =>
                  setEditProduct({
                    ...editProduct,
                    description: e.target.value,
                  })
                }
                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:outline-none"
                rows="4"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Key Features (one per line)
              </label>
              <textarea
                value={editProduct.featuresText}
                onChange={(e) =>
                  setEditProduct({
                    ...editProduct,
                    featuresText: e.target.value,
                  })
                }
                className="w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:outline-none"
                rows="3"
              />
            </div>

            <div>
              <span className="block text-sm font-medium text-gray-700 mb-1">
                Specifications
              </span>
              <div className="space-y-2">
                {editProduct.specifications.map((row, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={row.key}
                      onChange={(e) =>
                        updateEditSpecRow(index, "key", e.target.value)
                      }
                      placeholder="Spec name"
                      className="w-1/2 p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={row.value}
                      onChange={(e) =>
                        updateEditSpecRow(index, "value", e.target.value)
                      }
                      placeholder="Value"
                      className="w-1/2 p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-900 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => removeEditSpecRow(index)}
                      className="px-2 text-gray-400 hover:text-red-500"
                    >
                      &times;
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addEditSpecRow}
                  className="text-sm text-gray-700 hover:text-black font-medium underline"
                >
                  + Add specification
                </button>
              </div>
            </div>

            <div>
              <span className="block text-sm font-medium text-gray-700 mb-1">
                Sizes
              </span>
              <div className="flex gap-4">
                {["s", "m", "xl", "xxl"].map((sz) => (
                  <label key={sz} className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={
                        Array.isArray(editProduct.sizes) &&
                        editProduct.sizes.includes(sz)
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setEditProduct({
                            ...editProduct,
                            sizes: Array.from(
                              new Set([...(editProduct.sizes || []), sz]),
                            ),
                          });
                        } else {
                          setEditProduct({
                            ...editProduct,
                            sizes: (editProduct.sizes || []).filter(
                              (v) => v !== sz,
                            ),
                          });
                        }
                      }}
                    />
                    <span className="uppercase">{sz}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-gray-900 text-white rounded-md hover:bg-black focus:outline-none"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Product Details */}
        <div className="mt-12 max-w-3xl">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Product Details</h2>
          <p className="text-gray-600 leading-relaxed whitespace-pre-line">
            {product.description}
          </p>
        </div>

        {/* Reviews */}
        <div id="reviews" className="mt-12 max-w-3xl">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Reviews</h2>
          <div className="flex items-center gap-2 mb-6">
            <StarRating rating={product.averageRating} />
            <span className="text-sm text-gray-500">
              {product.averageRating
                ? product.averageRating.toFixed(1)
                : "No ratings yet"}{" "}
              based on {product.numReviews || 0} review
              {product.numReviews === 1 ? "" : "s"}
            </span>
          </div>

          <div className="space-y-4">
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews
                .slice()
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((rev, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-200 rounded-lg p-4 bg-white"
                    role="article"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-800">
                        {rev.name || "User"}
                      </span>
                      <StarRating rating={rev.rating} size="text-sm" />
                    </div>
                    <p className="text-gray-700 mt-2 text-sm">{rev.comment}</p>
                    {rev.createdAt && (
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ))
            ) : (
              <p className="text-gray-500">
                No reviews yet. Be the first to review this product.
              </p>
            )}
          </div>

          {userRole !== "admin" && (
            <form
              onSubmit={submitReview}
              className=" space-y-4 bg-white  rounded-lg"
            >
              <h3 className="text-sm font-semibold text-gray-900">
                Write a review
              </h3>
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
                  className="mt-1 w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:outline-none"
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
                  className="mt-1 w-full p-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:outline-none"
                  rows="4"
                  placeholder="Share your experience..."
                  required
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-black focus:outline-none"
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
