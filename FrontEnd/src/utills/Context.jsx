import React, { createContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import API_BASE_URL from "../config/api.js";

// Create a context for products
export const productContext = createContext();

const Context = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/products`
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        // You might want to add some error handling here, e.g., setting an error state
      } finally {
        setProductsLoading(false);
      }
    };

    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    fetchProducts();
  }, []);

  return (
    <productContext.Provider value={[products, setProducts, productsLoading]}>
      {children}
    </productContext.Provider>
  );
};

export default Context;
