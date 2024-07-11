import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { productContext } from "../utills/Context";
import Navbar from "./Navbar";

const Details = () => {
  const [products, setProducts] = useContext(productContext);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [editProduct, setEditProduct] = useState({
    title: "",
    category: "",
    price: "",
    description: "",
    image: ""
  });
  const { id } = useParams();
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole");
  const userId = localStorage.getItem("userId");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError("Invalid product ID");
      setLoading(false);
      return;
    }

    const getProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://project-cse-2200.vercel.app/api/products/${id}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch product');
        }
        const data = await response.json();
        setProduct(data);
        setEditProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    getProduct();
  }, [id]);

  const ProductDeleteHandler = async () => {
    try {
      const response = await fetch(`https://project-cse-2200.vercel.app/api/products/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Response Status:", response.status);
        console.error("Response Text:", errorData.message);
        throw new Error(errorData.message || 'Failed to delete product');
      }
      const updatedProducts = products.filter((p) => p._id !== id);
      setProducts(updatedProducts);
      navigate("/");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert('Failed to delete product: ' + error.message);
    }
  };
  
  const ProductEditHandler = async (e) => {
    e.preventDefault();
    const updatedProduct = {
      title: editProduct.title,
      category: editProduct.category,
      price: editProduct.price,
      description: editProduct.description,
      image: editProduct.image
    };
    try {
      const response = await fetch(`https://project-cse-2200.vercel.app/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update product');
      }
      const data = await response.json();
      const updatedProducts = products.map((p) =>
        p._id === id ? data : p
      );
      setProducts(updatedProducts);
      setIsEditing(false);
      setProduct(data);
    } catch (error) {
      console.error("Error updating product:", error);
      alert('Failed to update product: ' + error.message);
    }
  };

  const handleAddToCart = async () => {
    if (!userRole) {
      navigate("/LogInPage");
      return;
    }

    if (userRole !== 'user') {
      alert('Only users can add items to cart');
      return;
    }

    try {
      const response = await fetch(`https://project-cse-2200.vercel.app/api/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          productId: id,
          quantity
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add item to cart');
      }

      alert('Product added to cart successfully');
    } catch (error) {
      console.error("Error adding product to cart:", error);
      alert('Failed to add product to cart: ' + error.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

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
                  <input
                    type="text"
                    value={editProduct.title}
                    onChange={(e) => setEditProduct({...editProduct, title: e.target.value})}
                    className="w-full p-2 border rounded"
                    placeholder="Title"
                  />
                  <input
                    type="text"
                    value={editProduct.category}
                    onChange={(e) => setEditProduct({...editProduct, category: e.target.value})}
                    className="w-full p-2 border rounded"
                    placeholder="Category"
                  />
                  <input
                    type="number"
                    value={editProduct.price}
                    onChange={(e) => setEditProduct({...editProduct, price: e.target.value})}
                    className="w-full p-2 border rounded"
                    placeholder="Price"
                  />
                  <textarea
                    value={editProduct.description}
                    onChange={(e) => setEditProduct({...editProduct, description: e.target.value})}
                    className="w-full p-2 border rounded"
                    placeholder="Description"
                  />
                  <input
                    type="text"
                    value={editProduct.image}
                    onChange={(e) => setEditProduct({...editProduct, image: e.target.value})}
                    className="w-full p-2 border rounded"
                    placeholder="Image URL"
                  />
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
                        onClick={ProductDeleteHandler}
                        className="rounded bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4"
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-start">
                      <div className="flex items-center mb-4">
                        <button
                          onClick={() => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))}
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
