// Home.jsx
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { productContext } from "../utills/Context";
import Loading from "./Loading";
import SearchBar from "./SearchBar";

function Home() {
  const [products] = useContext(productContext);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (value) => {
    setSearchQuery(value);
  };

  // Check if products is null or undefined before filtering
  const filteredProducts = products
    ? products.filter((product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <>
      <div className="justify-center items-center flex">
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
              key={product.id}
              to={`/details/${product.id}`}
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
