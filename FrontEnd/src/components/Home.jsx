import  { useContext, useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { productContext } from "../utills/Context";
import SearchBar from "./SearchBar";
import Footer from "./Footer";
import FilterSidebar from "./FilterSidebar";
import { ThreeDots } from "react-loader-spinner";
import { FaHeart, FaFilter, FaShoppingCart } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API_BASE_URL from "../config/api.js";

const DEFAULT_MAX_PRICE = 1000000;

function Home({ categories, isAuthenticated, selectedCategory, sortOrder }) {
  const [products, , productsLoading] = useContext(productContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [priceRange, setPriceRange] = useState([0, DEFAULT_MAX_PRICE]);
  const [showFilters, setShowFilters] = useState(false);
  const { category } = useParams();
  const navigate = useNavigate();
  const [promotedProducts, setPromotedProducts] = useState([]);
  const [currentPromotedIndex, setCurrentPromotedIndex] = useState(0);

  const maxPrice = useMemo(() => {
    if (!products || products.length === 0) return DEFAULT_MAX_PRICE;
    const prices = products.map((p) => p?.price).filter((p) => typeof p === "number");
    if (prices.length === 0) return DEFAULT_MAX_PRICE;
    return Math.max(1000, Math.ceil(Math.max(...prices) / 1000) * 1000);
  }, [products]);

  // sync the slider's upper bound to real product prices once loaded,
  // unless the user has already moved the slider away from the default
  useEffect(() => {
    setPriceRange((prev) => (prev[1] === DEFAULT_MAX_PRICE ? [prev[0], maxPrice] : prev));
  }, [maxPrice]);

  // filter products
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      if (!products || products.length === 0) {
        setIsLoading(false);
        return;
      }

      let filtered = [...products];

      if (selectedCategories.length > 0) {
        filtered = filtered.filter(
          (product) =>
            product?.category &&
            selectedCategories.includes(product.category.toLowerCase().trim())
        );
      } else if (category || selectedCategory) {
        const filterCategory = (category || selectedCategory)
          .toLowerCase()
          .trim();
        filtered = filtered.filter(
          (product) =>
            product?.category &&
            product.category.toLowerCase().trim() === filterCategory
        );
      }

      if (searchQuery) {
        filtered = filtered.filter(
          (product) =>
            product?.title &&
            product.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      filtered = filtered.filter(
        (product) =>
          product?.price >= priceRange[0] && product.price <= priceRange[1]
      );

      if (selectedGenders.length > 0) {
        filtered = filtered.filter(
          (product) => product?.gender && selectedGenders.includes(product.gender)
        );
      }

      if (selectedSizes.length > 0) {
        filtered = filtered.filter(
          (product) =>
            Array.isArray(product?.sizes) &&
            product.sizes.some((sz) =>
              selectedSizes.includes(String(sz).toLowerCase())
            )
        );
      }

      filtered.sort((a, b) => {
        if (sortOrder === "asc") {
          return a.price - b.price;
        } else {
          return b.price - a.price;
        }
      });

      setFilteredProducts(filtered);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [
    products,
    category,
    selectedCategory,
    searchQuery,
    sortOrder,
    selectedCategories,
    selectedGenders,
    selectedSizes,
    priceRange,
  ]);

  // pick the featured products once when the catalog loads — kept separate
  // from search/filter state so typing a search or moving a filter doesn't
  // reshuffle (and re-key, and glitch the animation of) the featured banner
  useEffect(() => {
    if (!products || products.length === 0) return;
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    setPromotedProducts(shuffled.slice(0, 5));
    setCurrentPromotedIndex(0);
  }, [products]);

  // rotate featured products
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromotedIndex(
        (prevIndex) => (prevIndex + 1) % (promotedProducts.length || 1)
      );
    }, 2500);

    return () => clearInterval(interval);
  }, [promotedProducts]);

  // load favorites from localStorage
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites.filter((f) => f && f._id));
  }, []);

  // fetch wishlist from backend
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) return;
        const res = await fetch(`${API_BASE_URL}/api/wishlist`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          const favs = (data.items || [])
            .map((it) => it.product)
            .filter((p) => p && p._id);
          localStorage.setItem("favorites", JSON.stringify(favs));
          setFavorites(favs);
        }
      } catch (e) {
        // optional: handle error
      }
    };
    fetchWishlist();
  }, []);

  const handleSearchChange = (value) => {
    setSearchQuery(value);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleGenderChange = (gender) => {
    setSelectedGenders((prev) =>
      prev.includes(gender) ? prev.filter((g) => g !== gender) : [...prev, gender]
    );
  };

  const handleSizeChange = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleResetFilters = () => {
    setSelectedCategories([]);
    setSelectedGenders([]);
    setSelectedSizes([]);
    setPriceRange([0, maxPrice]);
    setSearchQuery("");
  };

  const handleAddToFavorites = (product) => {
    if (!isAuthenticated) {
      toast.error("Please log in to add items to your favorites.");
      return;
    }
    const toggle = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        const exists = favorites.some((fav) => fav?._id === product._id);
        if (exists) {
          const res = await fetch(
            `${API_BASE_URL}/api/wishlist/remove/${product._id}`,
            { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
          );
          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(
              errorData.message || "Failed to remove from wishlist"
            );
          }
          toast.success("Removed from wishlist");
          const updated = favorites.filter((f) => f?._id !== product._id);
          setFavorites(updated);
          localStorage.setItem("favorites", JSON.stringify(updated));
        } else {
          const res = await fetch(`${API_BASE_URL}/api/wishlist/add`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ productId: product._id }),
          });
          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || "Failed to add to wishlist");
          }
          toast.success("Added to wishlist");
          const updated = [...favorites, product];
          setFavorites(updated);
          localStorage.setItem("favorites", JSON.stringify(updated));
        }
      } catch (e) {
        toast.error(e.message);
      }
    };
    toggle();
  };

  const isFavorite = (productId) => {
    if (!productId) return false;
    return favorites?.some((fav) => fav?._id === productId);
  };

  const handleProductClick = (productId) => {
    navigate(`/details/${productId}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <ToastContainer />
      <div className="bg-white shadow-md py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <SearchBar
              placeholder="Search for products"
              value={searchQuery}
              onChange={handleSearchChange}
              className="flex-grow max-w-xl py-2 px-4 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="ml-4 p-2 bg-gray-900 text-white rounded-full hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-900 lg:hidden"
              aria-label="Toggle filters"
            >
              <FaFilter />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-gray-900 to-black text-white py-8 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-4">Featured Product</h2>
          {promotedProducts.length > 0 &&
              promotedProducts[currentPromotedIndex] && (
                <div
                  key={promotedProducts[currentPromotedIndex]._id}
                  className="flex items-center"
                >
                  <img
                    src={promotedProducts[currentPromotedIndex].image}
                    alt={promotedProducts[currentPromotedIndex].title}
                    className="w-64 h-64 object-contain rounded-lg shadow-lg mr-8 bg-white p-3 cursor-pointer"
                    onClick={() =>
                      handleProductClick(
                        promotedProducts[currentPromotedIndex].slug ||
                          promotedProducts[currentPromotedIndex]._id
                      )
                    }
                  />
                  <div>
                    <h3 className="text-2xl font-semibold mb-2">
                      {promotedProducts[currentPromotedIndex].title}
                    </h3>
                    <p className="text-xl mb-4">
                      $
                      {promotedProducts[
                        currentPromotedIndex
                      ].price.toFixed(2)}
                    </p>
                    <button
                      onClick={() =>
                        handleProductClick(
                          promotedProducts[currentPromotedIndex].slug ||
                            promotedProducts[currentPromotedIndex]._id
                        )
                      }
                      className="bg-white text-gray-900 px-6 py-2 rounded-full font-semibold hover:bg-gray-200 transition-colors duration-300"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <FilterSidebar
            isOpen={showFilters}
            onClose={() => setShowFilters(false)}
            categories={categories}
            selectedCategories={selectedCategories}
            onCategoryChange={handleCategoryChange}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            minPrice={0}
            maxPrice={maxPrice}
            selectedGenders={selectedGenders}
            onGenderChange={handleGenderChange}
            selectedSizes={selectedSizes}
            onSizeChange={handleSizeChange}
            onReset={handleResetFilters}
          />

          <div className="flex-1 w-full">
            {isLoading || productsLoading ? (
              <div className="flex justify-center items-center h-64">
                <ThreeDots
                  height="80"
                  width="80"
                  radius="9"
                  color="#ec4899"
                  ariaLabel="three-dots-loading"
                  visible={true}
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.length > 0 ? (
                  filteredProducts.filter(Boolean).map((product) => (
                    <div
                      key={product._id || Math.random()}
                      className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col"
                    >
                      <div
                        className="w-full h-48 bg-white flex items-center justify-center p-4 cursor-pointer"
                        onClick={() => handleProductClick(product.slug || product._id)}
                      >
                        <img
                          src={product.image}
                          alt={product.title}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div className="p-4 flex flex-col flex-1">
                        <h3
                          className="text-sm font-semibold text-gray-800 line-clamp-2 cursor-pointer hover:text-black transition-colors duration-300"
                          onClick={() => handleProductClick(product.slug || product._id)}
                        >
                          {product.title}
                        </h3>
                        <span className="text-xs text-gray-500 mt-1">
                          {product.category}
                        </span>
                        <p className="mt-2 text-lg font-bold text-gray-900">
                          ${product.price.toFixed(2)}
                        </p>
                        <div className="mt-auto pt-3 space-y-2">
                          <button
                            onClick={() => handleProductClick(product.slug || product._id)}
                            className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white text-sm font-semibold py-2 rounded transition-colors duration-300"
                          >
                            <FaShoppingCart /> View Details
                          </button>
                          <button
                            onClick={() => handleAddToFavorites(product)}
                            className={`w-full flex items-center justify-center gap-2 text-sm font-medium py-2 rounded border transition-colors duration-300 ${
                              isFavorite(product?._id)
                                ? "border-gray-900 text-gray-900 bg-gray-100"
                                : "border-gray-300 text-gray-600 hover:border-gray-900 hover:text-gray-900"
                            }`}
                          >
                            <FaHeart />{" "}
                            {isFavorite(product?._id)
                              ? "In Wishlist"
                              : "Add to Wishlist"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="col-span-full text-center text-gray-500 text-lg">
                    No products found
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 text-white py-6 mt-auto">
        <Footer />
      </footer>
    </div>
  );
}

export default Home;
