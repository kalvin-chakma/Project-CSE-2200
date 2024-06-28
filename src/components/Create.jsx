// Create.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Create = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newProduct = {
      title,
      category,
      price,
      description,
      image,
    };

    try {
      const response = await axios.post("https://fakestoreapi.com/products", newProduct);
      console.log("Product created:", response.data);
      navigate("/"); // Navigate to the home page upon successful submission
    } catch (error) {
      console.error("There was an error creating the product!", error);
    }
  };

  return (
    <form
      className="flex flex-col items-center p-[5%] w-screen h-screen"
      onSubmit={handleSubmit}
    >
      <h1 className="text-2xl font-bold mb-5">Add New Product</h1>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="text-2xl bg-zinc-100 rounded p-3 w-1/2 mb-3"
        required
      />
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="text-2xl bg-zinc-100 rounded p-3 w-1/2 mb-3"
        required
      />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="text-2xl bg-zinc-100 rounded p-3 w-1/2 mb-3"
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="text-2xl bg-zinc-100 rounded p-3 w-1/2 mb-3"
        required
      />
      <input
        type="text"
        placeholder="Image URL"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        className="text-2xl bg-zinc-100 rounded p-3 w-1/2 mb-3"
        required
      />
      <button
        type="submit"
        className="mt-4 p-2 bg-blue-500 text-white rounded"
      >
        Submit
      </button>
    </form>
  );
};

export default Create;
