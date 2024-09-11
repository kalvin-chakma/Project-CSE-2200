import React from "react";
import AboutUsImage from "../assets/about.jpg";

const About = () => {
  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <div className="flex flex-col lg:flex-row w-[80%] max-w-screen-x overflow-hidden">
        <div className=" lg:w-2/3 flex items-center justify-center rounded-md p-5">
          <img
            src={AboutUsImage}
            alt="About Us"
            className="object-cover w-full h-full rounded-md shadow-xl"
            style={{ maxHeight: "65vh", maxWidth: "100%" }}
          />
        </div>
        <div className="lg:w-1/3 p-8 ml-[5%] ">
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
