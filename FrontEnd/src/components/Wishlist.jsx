import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Wishlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const baseUrl = "https://project-cse-2200-xi.vercel.app"; // adjust if needed

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        navigate("/LogInPage");
        return;
      }
      const res = await fetch(`${baseUrl}/api/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch wishlist");
      const data = await res.json();
      setItems(data.items || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const removeFromWishlist = async (productId) => {
    try {
      const token = localStorage.getItem("jwtToken");
      const res = await fetch(`${baseUrl}/api/wishlist/remove/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to remove item");
      setItems((prev) => prev.filter((it) => it.product?._id !== productId));
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error)
    return <div className="p-6 text-red-600">Error loading wishlist: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Your Wishlist</h1>
      {items.length === 0 ? (
        <p className="text-gray-600">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map(({ product }) => (
            <div key={product._id} className="bg-white rounded-lg shadow p-4">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-40 object-contain mb-3"
              />
              <h3 className="font-semibold truncate">{product.title}</h3>
              <p className="text-pink-600 font-bold">${product.price}</p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => navigate(`/details/${product._id}`)}
                  className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  View
                </button>
                <button
                  onClick={() => removeFromWishlist(product._id)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;


