import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { productContext } from "../utills/Context";
import { nanoid } from "nanoid";

const Create = () => {
  const [products, setProducts] = useContext(productContext);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const navigate = useNavigate();

  const Addproducthandler = (e) => {
    e.preventDefault();

    if (
      title.trim().length < 5 ||
      image.trim().length < 5 ||
      category.trim().length < 5 ||
      price.trim().length < 1 ||
      description.trim().length < 5
    ) {
      alert("Each input must have at least a character.");
      return;
    }

    const product = {
      id: nanoid(),
      title,
      image,
      category,
      price,
      description,
    };

    setProducts([...products, product]);
    localStorage.setItem("products", JSON.stringify([...products, product]));
    navigate("/");
  };

  return (
    <form
      className="flex flex-col items-center p-[5%] w-screen h-screen"
      onSubmit={Addproducthandler}
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
