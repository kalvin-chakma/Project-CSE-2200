import React, { useContext, useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { productContext } from "../utills/Context";
import Loading from "./Loading";
import SearchBar from "./SearchBar";
import Navbar from "./Navbar";

function Home() {
  const [products] = useContext(productContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const { category } = useParams();
  const navigate = useNavigate();

  // Helper function to normalize category names
  const normalizeCategory = (cat) => cat.trim().toLowerCase();

  useEffect(() => {
    const uniqueCategories = Array.from(new Set(products.map(product => normalizeCategory(product.category))));
    setCategories(uniqueCategories);

    if (category) {
      setFilteredProducts(products.filter(product => 
        normalizeCategory(product.category) === normalizeCategory(category)
      ));
    } else {
      setFilteredProducts(products);
    }
  }, [products, category]);

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    const searchFiltered = products.filter((product) =>
      product.title.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredProducts(searchFiltered);
    navigate("/"); // Reset to home when searching
  };

  const handleCategoryClick = (selectedCategory) => {
    setSearchQuery(""); // Reset search query when changing category
    if (selectedCategory === "all") {
      navigate("/");
    } else {
      navigate(`/category/${normalizeCategory(selectedCategory)}`);
    }
  };

  const buttonClass = (cat) => `
    mx-2 px-4 py-2 rounded
    ${normalizeCategory(cat) === normalizeCategory(category || 'all') ? 'bg-blue-700' : 'bg-blue-500'} 
    text-white hover:bg-blue-600
    transition-all duration-300 ease-in-out
    transform hover:scale-105
    focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50
  `;

  return (
    <>
      <Navbar />
      <div className="justify-center items-center flex mt-4">
        <SearchBar
          placeholder="Search for products"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      <div className="flex justify-center mt-4 flex-wrap">
        <button
          onClick={() => handleCategoryClick("all")}
          className={buttonClass('all')}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            className={buttonClass(cat)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)} {/* Capitalize first letter */}
          </button>
        ))}
      </div>
      <div className="w-full h-full flex flex-wrap overflow-x-hidden overflow-y-auto p-5 justify-center">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Link
              key={product._id}
              to={`/details/${product._id}`}
              className="w-[13%] h-[30vh] bg-white rounded-lg shadow-md m-5 flex-col justify-center items-center transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              <div
                className="w-full h-[80%] bg-cover bg-no-repeat bg-center hover:scale-110 transition-all duration-300 ease-in-out"
                style={{ backgroundImage: `url(${product.image})` }}
                alt={product.title}
              ></div>
              <h3 className="p-3 text-sm truncate">{product.title}</h3>
            </Link>
          ))
        ) : (
          <p>No products found</p>
        )}
      </div>
    </>
  );
}

export default Home;