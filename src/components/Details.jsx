import React, {useContext,useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { productContext } from "../utills/Context";


import axios from "axios";


const Details = () => {
  const [products,setProducts] =useContext(productContext);
  const [product, setProduct] = useState(null);
  const { id } = useParams();
  // useEffect(() => {
  //   const getSingleProduct = async () => {
  //     try {
  //       const { data } = await axios.get(
  //         `https://fakestoreapi.com/products/${id}`
  //       );
  //       setProduct(data);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };
  //   getSingleProduct();
  // }, [id]);

  // useEffect(() => {
  //   if (!product) {
  //     const selectedProduct = products.find(p => p.id === parseInt(id));
  //     setProduct(selectedProduct);
  //   }
  // }, [product, products, id]);
  
  // if (!product) {
  //   return <div>Loading...</div>; // Or handle differently based on your UI needs
  // }
  useEffect(() => {
    const getProduct = async () => {
      try {
        const { data } = await axios.get(`https://fakestoreapi.com/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    if (products.length > 0) {
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
    return <div>Loading...</div>;
  }

  // const ProductDeleteHandler =(id)=>{
  //   const FilterProducts = products.find((p) => p.id === id);
  //   setProduct(FilterProducts);
  //   localStorage.setItem("products",JSON.stringify(FilterProducts));
  // };

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

          <button
           // onClick={ProductDeleteHandler(product.id)}
            className="rounded float-right  text-white bg-red-400 hover:bg-red-300 font-bold py-2 px-4 border-b-4 hover:border-red-300 "
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Details;
