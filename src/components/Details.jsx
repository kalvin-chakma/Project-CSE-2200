import React, { useContext, useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { productContext } from "../utills/Context";
import axios from "axios";

const Details = () => {
  const [products, setProducts] = useContext(productContext);
  const [product, setProduct] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getProduct = async () => {
      try {
        const { data } = await axios.get(`https://fakestoreapi.com/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    if (products && products.length > 0) {
      const selectedProduct = products.find((p) => p.id === id);
      if (selectedProduct) {
        setProduct(selectedProduct);
      } else {
        getProduct();
      }
    } else {
      getProduct();
    }
  }, [id, products]);

  if (!product) {
    return <div className="text-center text-2xl mt-20">Loading...</div>;
  }

  const ProductDeleteHandler = (id) => {
    const updatedProducts = products.filter((p) => p.id !== id);
    setProducts(updatedProducts);
    localStorage.setItem("products", JSON.stringify(updatedProducts));
    navigate('/');
  };

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center">
        <img
          className="object-contain h-96 w-96"
          src={product.image}
          alt={product.title}
        />
        <div className="ml-10">
          <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
          <h3 className="text-xl text-gray-500 mb-4">{product.category}</h3>
          <h2 className="text-2xl text-red-500 mb-4">$ {product.price}</h2>
          <p className="text-lg mb-8">{product.description}</p>
          <div className="flex space-x-4">
            <Link
              to="#"
              className="rounded bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4"
            >
              Edit
            </Link>
            <button
              onClick={() => ProductDeleteHandler(product.id)}
              className="rounded bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
