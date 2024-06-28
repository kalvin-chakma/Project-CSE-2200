import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const Details = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const getSingleProduct = async () => {
      try {
        const { data } = await axios.get(
          `https://fakestoreapi.com/products/${id}`
        );
        setProduct(data);
      } catch (error) {
        console.error(error);
      }
    };
    getSingleProduct();
  }, [id]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-[70%] flex h-full justify-between m-auto p-[10%]">
      <img
        className="object-contain h-[80%] w-[40%]"
        src={product.image}
        alt={product.title}
      />
      <div className="content w-[50%]">
        <h1 className="text-4xl">{product.title}</h1>
        <h3 className="text-zinc-400 my-5">{product.category}</h3>
        <h2 className="text-red-300">$ {product.price}</h2>
        <p>{product.description}</p>
        <div className="mt-10 flex justify-end">
          <Link
            to="#"
            className="rounded float-right  text-white bg-blue-400 hover:bg-blue-300 font-bold py-2 px-4 border-b-4 hover:border-blue-300 mr-5"
          >
            Edit
          </Link>

          <Link
            to="#"
            className="rounded float-right  text-white bg-red-400 hover:bg-red-300 font-bold py-2 px-4 border-b-4 hover:border-red-300 "
          >
            Delete
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Details;
