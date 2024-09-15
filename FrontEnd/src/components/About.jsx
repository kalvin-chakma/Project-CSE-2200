import React from "react";
import AboutUsImage from "../assets/about.jpg";
import ImageSwiper from "./FormElement/ImageSwiper";

const About = () => {
  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <div className="flex flex-col lg:flex-row w-[80%] max-w-screen-x overflow-hidden justify-between">
        <div className=" lg:w-[50%] flex items-y-center justify-center shadow-xl rounded-md p-2s">
          {/* <img
            src={AboutUsImage}
            alt="About Us"
            className="object-cover w-full h-full rounded-md shadow-xl"
            style={{ maxHeight: "65vh", maxWidth: "100%" }}
          /> */}
          <ImageSwiper />
        </div>
        <div className="lg:w-[30%] p-8 ml-[5%] mt-20">
          <h1 className="text-6xl font-bold mb-6 text-gray-800">About Us</h1>
          <p className="text-2xl font-semibold mb-4 text-gray-700">
            Welcome to EdoKan!
          </p>
          <p className="text-lg mb-4 text-justify text-gray-600">
            At EdoKan, we believe in enhancing lives through exceptional
            products and a superior shopping experience.
          </p>
          <p className="text-lg text-justify text-gray-600 mt-15">
            Our mission is simple: to offer a diverse range of top-notch
            products that cater to babies, men, and women, ensuring that you
            find exactly what you need for every occasion. From baby essentials
            to fashion-forward apparel and stylish accessories, EdoKan is your
            one-stop shop for quality and convenience.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
