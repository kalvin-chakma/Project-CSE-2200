import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { productContext } from "../utills/Context";
import axios from "axios";
import Navbar from "./Navbar";

const Details = () => {
  const [products, setProducts] = useContext(productContext);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1); // Counter for quantity
  const [isEditing, setIsEditing] = useState(false); // State for edit mode
  const [editProduct, setEditProduct] = useState({
    title: "",
    category: "",
    price: "",
    description: "",
    image: "",
  });
  const { id } = useParams();
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole"); // Get the user's role from localStorage

  useEffect(() => {
    const getProduct = async () => {
      try {
        const { data } = await axios.get(
          `https://fakestoreapi.com/products/${id}`
        );
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    if (products && products.length > 0) {
      const selectedProduct = products.find((p) => p.id === parseInt(id));
      if (selectedProduct) {
        setProduct(selectedProduct);
      } else {
        getProduct();
      }
    } else {
      getProduct();
    }
  }, [id, products]);

  useEffect(() => {
    if (product) {
      setEditProduct({
        title: product.title,
        category: product.category,
        price: product.price,
        description: product.description,
        image: product.image,
      });
    }
  }, [product]);

  if (!product) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
        <div className="text-center text-2xl">Loading...</div>
      </div>
    );
  }

  const ProductDeleteHandler = async (id) => {
    try {
      await axios.delete(`https://fakestoreapi.com/products/${id}`);
      const updatedProducts = products.filter((p) => p.id !== id);
      setProducts(updatedProducts);
      localStorage.setItem("products", JSON.stringify(updatedProducts));
      navigate("/");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const ProductEditHandler = async (e) => {
    e.preventDefault();
    const updatedProduct = {
      ...product,
      title: editProduct.title,
      category: editProduct.category,
      price: editProduct.price,
      description: editProduct.description,
      image: editProduct.image,
    };

    try {
      const { data } = await axios.put(
        `https://fakestoreapi.com/products/${id}`,
        updatedProduct
      );
      const updatedProducts = products.map((p) => (p.id === id ? data : p));
      setProducts(updatedProducts);
      localStorage.setItem("products", JSON.stringify(updatedProducts));
      setIsEditing(false);
      setProduct(data);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleAddToCart = () => {
    // Implement add to cart logic here
    console.log("Added to cart:", product, "Quantity:", quantity);
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center h-screen">
        <div className="container w-3/5 mr-10% p-10 flex items-center justify-center">
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
              {isEditing ? (
                <form onSubmit={ProductEditHandler} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={editProduct.title}
                      onChange={(e) =>
                        setEditProduct({
                          ...editProduct,
                          title: e.target.value,
                        })
                      }
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={editProduct.category}
                      onChange={(e) =>
                        setEditProduct({
                          ...editProduct,
                          category: e.target.value,
                        })
                      }
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Price
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={editProduct.price}
                      onChange={(e) =>
                        setEditProduct({
                          ...editProduct,
                          price: e.target.value,
                        })
                      }
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={editProduct.description}
                      onChange={(e) =>
                        setEditProduct({
                          ...editProduct,
                          description: e.target.value,
                        })
                      }
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Image URL
                    </label>
                    <input
                      type="text"
                      name="image"
                      value={editProduct.image}
                      onChange={(e) =>
                        setEditProduct({
                          ...editProduct,
                          image: e.target.value,
                        })
                      }
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    />
                  </div>
                  <div className="flex space-x-4">
                    <button
                      type="submit"
                      className="rounded bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="rounded bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex space-x-4">
                  {userRole === "admin" ? (
                    <>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="rounded bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => ProductDeleteHandler(product.id)}
                        className="rounded bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4"
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-start">
                      <div className="flex items-center mb-4">
                        <button
                          onClick={() =>
                            setQuantity((prev) => (prev > 1 ? prev - 1 : 1))
                          }
                          className="rounded-l bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4"
                        >
                          -
                        </button>
                        <span className="bg-white text-black font-bold py-2 px-4">
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQuantity((prev) => prev + 1)}
                          className="rounded-r bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={handleAddToCart}
                        className="rounded bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4"
                      >
                        Add to Cart
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Details;
