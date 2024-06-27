import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

export const productContext = createContext();

const Context = (props) => {
  const [products, setProducts] = useState(() => {
    const localData = localStorage.getItem("products");
    return localData ? JSON.parse(localData) : null;
  });

  const getProducts = async () => {
    try {
      const response = await axios.get("https://fakestoreapi.com/products");
      setProducts(response.data);
      localStorage.setItem("products", JSON.stringify(response.data));
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    if (!products) {
      getProducts();
    }
  }, [products]);

  return (
    <productContext.Provider value={[products, setProducts]}>
      {props.children}
    </productContext.Provider>
  );
};

export default Context;
