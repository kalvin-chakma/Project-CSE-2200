import React, { useContext, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { productContext } from "../utills/Context";
import SearchBar from "./SearchBar";
import Navbar from "./Navbar";

function Home() {
  const [products] = useContext(productContext);
  const [searchQuery, setSearchQuery] = useState("");
  const { category } = useParams();

  const handleSearchChange = (value) => {
    setSearchQuery(value);
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory = !category || product.category === category;
    return matchesSearch && matchesCategory;
  });

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
      <div className="w-full h-full flex flex-wrap overflow-x-hidden overflow-y-auto p-5 justify-center">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Link
              key={product._id}
              to={`/details/${product._id}`}
              className="w-[13%] h-[30vh] bg-white rounded-lg shadow-md m-5 flex-col justify-center items-center"
            >
              <div
                className="w-full h-[80%] bg-cover bg-no-repeat bg-center hover:scale-110"
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
