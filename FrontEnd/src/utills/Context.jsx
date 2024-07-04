import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const productContext = createContext();

const Context = (props) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const storedProducts = JSON.parse(localStorage.getItem("products"));
        if (storedProducts) {
          setProducts(storedProducts);
        } else {
          const response = await axios.get("https://fakestoreapi.com/products");
          setProducts(response.data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <productContext.Provider value={[products, setProducts]}>
      {props.children}
    </productContext.Provider>
  );
};

export default Context;
