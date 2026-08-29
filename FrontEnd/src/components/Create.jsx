import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { productContext } from "../utills/Context";
import Navbar from "./Navbar";
import Sidebar from "./FormElement/Sidebar";
import API_BASE_URL from "../config/api.js";

const Create = ({ addCategory }) => {
  const [products, setProducts] = useContext(productContext);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [gender, setGender] = useState("unisex");
  const [sizes, setSizes] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [brand, setBrand] = useState("");
  const [sku, setSku] = useState("");
  const [status, setStatus] = useState("active");
  const [tagsText, setTagsText] = useState("");
  const [stock, setStock] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [featuresText, setFeaturesText] = useState("");
  const [specifications, setSpecifications] = useState([{ key: "", value: "" }]);
  const navigate = useNavigate();

  const normalizeCategory = (cat) => cat.trim().toLowerCase();

  const updateSpecRow = (index, field, value) => {
    setSpecifications((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  };

  const addSpecRow = () => {
    setSpecifications((prev) => [...prev, { key: "", value: "" }]);
  };

  const removeSpecRow = (index) => {
    setSpecifications((prev) => prev.filter((_, i) => i !== index));
  };

  const addProduct = async () => {
    if (!title || (!image && !imageFile) || !category || !price || !description) {
      alert("Please fill in all fields.");
      return;
    }

    let imageUrl = image;
    const token = localStorage.getItem("jwtToken");
    if (imageFile) {
      const formData = new FormData();
      formData.append('image', imageFile);
      try {
        const uploadRes = await fetch(`${API_BASE_URL}/api/products/upload`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        if (!uploadRes.ok) throw new Error('Image upload failed');
        const { url } = await uploadRes.json();
        imageUrl = url;
      } catch (err) {
        console.error(err);
        alert('Image upload failed');
        return;
      }
    }

    const features = featuresText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const cleanSpecifications = specifications
      .map((row) => ({ key: row.key.trim(), value: row.value.trim() }))
      .filter((row) => row.key && row.value);

    const tags = tagsText
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    const newProduct = {
      title,
      image: imageUrl,
      category: normalizeCategory(category),
      price: Number(price),
      description,
      gender,
      sizes,
      brand: brand.trim() || "Generic",
      sku: sku.trim() || undefined,
      status,
      tags,
      stock: stock === "" ? 0 : Number(stock),
      discountPercentage: discountPercentage === "" ? 0 : Number(discountPercentage),
      features,
      specifications: cleanSpecifications,
    };

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/products`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newProduct),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add product");
      }

      const data = await response.json();
      setProducts([...products, data]);

      addCategory(normalizeCategory(category));

      navigate("/");
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product. Please try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 hide-scrollbar">
      <div className="flex flex-grow overflow-hidden hide-scrollbar">
        <div className="w-1/5 min-w-[200px]">
          <Sidebar />
        </div>
        <div className="w-3/5 overflow-y-auto p-6 hide-scrollbar">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold text-gray-800 flex items-center">
                <span className="mr-2"></span> Post New Product
              </h1>
              <div className="flex ">
                <button
                  type="button"
                  onClick={addProduct}
                  className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600"
                >
                  POST PRODUCT
                </button>
              </div></div>


            <div className="flex gap-6">
              <div className="w-1/2 bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-medium text-gray-700 mb-4">General Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Product Name</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter product name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Brand</label>
                    <input
                      type="text"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter brand name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Description Product</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter product description"
                      rows="4"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Key Features (one per line)
                    </label>
                    <textarea
                      value={featuresText}
                      onChange={(e) => setFeaturesText(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={"Lightweight design\nWater resistant\n2-year warranty"}
                      rows="3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Specifications</label>
                    <div className="space-y-2">
                      {specifications.map((row, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={row.key}
                            onChange={(e) => updateSpecRow(index, "key", e.target.value)}
                            placeholder="Spec name (e.g. Material)"
                            className="w-1/2 p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <input
                            type="text"
                            value={row.value}
                            onChange={(e) => updateSpecRow(index, "value", e.target.value)}
                            placeholder="Value (e.g. Cotton)"
                            className="w-1/2 p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            type="button"
                            onClick={() => removeSpecRow(index)}
                            className="px-2 text-gray-400 hover:text-red-500"
                            aria-label="Remove specification"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addSpecRow}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        + Add specification
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Size</label>
                    <div className="flex space-x-2">
                      {['S', 'M', 'XL', 'XXL'].map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => {
                            if (sizes.includes(sz)) {
                              setSizes(sizes.filter((s) => s !== sz));
                            } else {
                              setSizes([...sizes, sz]);
                            }
                          }}
                          className={`px-3 py-1 rounded-full text-sm ${sizes.includes(sz) ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Gender</label>
                    <div className="flex space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          value="male"
                          checked={gender === "male"}
                          onChange={(e) => setGender(e.target.value)}
                          className="form-radio text-blue-600"
                        />
                        <span className="ml-1 text-sm text-gray-700">Men</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          value="female"
                          checked={gender === "female"}
                          onChange={(e) => setGender(e.target.value)}
                          className="form-radio text-blue-600"
                        />
                        <span className="ml-1 text-sm text-gray-700">Woman</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          value="unisex"
                          checked={gender === "unisex"}
                          onChange={(e) => setGender(e.target.value)}
                          className="form-radio text-blue-600"
                        />
                        <span className="ml-1 text-sm text-gray-700">Unisex</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-lg font-medium text-gray-700 mb-4">Pricing &amp; Inventory</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Selling Price</label>
                        <input
                          type="number"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter product price"
                          required
                        />
                      </div>
                      <div className="flex gap-4">
                        <div className="w-1/2">
                          <label className="block text-sm font-medium text-gray-600 mb-1">Discount %</label>
                          <input
                            type="number"
                            min="0"
                            max="90"
                            value={discountPercentage}
                            onChange={(e) => setDiscountPercentage(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="0"
                          />
                        </div>
                        <div className="w-1/2">
                          <label className="block text-sm font-medium text-gray-600 mb-1">Stock Quantity</label>
                          <input
                            type="number"
                            min="0"
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="0"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Product Category</label>
                        <input
                          type="text"
                          value={category}
                          onChange={(e) => setCategory(normalizeCategory(e.target.value))}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter product category"
                          required
                        />
                      </div>
                      <div className="flex gap-4">
                        <div className="w-1/2">
                          <label className="block text-sm font-medium text-gray-600 mb-1">SKU</label>
                          <input
                            type="text"
                            value={sku}
                            onChange={(e) => setSku(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Auto-generated if left blank"
                          />
                        </div>
                        <div className="w-1/2">
                          <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                          <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="active">Active</option>
                            <option value="draft">Draft</option>
                            <option value="archived">Archived</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Tags (comma-separated)</label>
                        <input
                          type="text"
                          value={tagsText}
                          onChange={(e) => setTagsText(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g. summer, bestseller, new-arrival"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-1/2 bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-medium text-gray-700 mb-4">Upload Image</h2>
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={image || "https://via.placeholder.com/300"}
                      alt="Product Preview"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <button className="absolute top-2 left-2 bg-white rounded-full p-1 shadow-md">
                      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md">
                      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter image URL"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Create;
