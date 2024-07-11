// components/CategoryProducts.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const CategoryProducts = () => {
  const [products, setProducts] = useState([]);
  const { category } = useParams();

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      try {
        const response = await axios.get(`https://project-cse-2200.vercel.app/api/products/category/${category}`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products by category:', error);
      }
    };

    fetchProductsByCategory();
  }, [category]);

  return (
    <>
      <Navbar />
      <h1 className="text-3xl font-bold mb-8 text-center">
        Products in {category}
      </h1>
      <div className="w-full h-full flex flex-wrap overflow-x-hidden overflow-y-auto p-5 justify-center">
        {products.length > 0 ? (
          products.map((product) => (
            <Link
              key={product._id}
              to={`/details/${product._id}`}
              className="w-[13%] h-[30vh] bg-white rounded-lg shadow-md m-5 flex-col justify-center items-center"
            >
              <div
                className="w-full h-[80%] bg-cover bg-no-repeat bg-center hover:scale-110"
                style={{ backgroundImage: `url(${product.image})` }}
                alt={product.title}
              ></div>
              <h3 className="p-3 text-sm truncate">{product.title}</h3>
            </Link>
          ))
        ) : (
          <p>No products found in this category</p>
        )}
      </div>
    </>
  );
};

export default CategoryProducts;