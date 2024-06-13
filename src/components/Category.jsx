import React from "react";

const Category = () => {
  return (
    <div className="w-screen h-screen ">
      <div className="py-5 w-[15%] bg-red-200 h-full flex flex-col items-center">
        <a
          href="/create"
          className="rounded float-right  text-white bg-blue-400 hover:bg-blue-300 font-bold py-2 px-4 border-b-4 hover:border-blue-300 "
        >
          Add new Movie
        </a>

        <div className="w-[80%] mt-5">
          <h1 className="text-2xl font-semibold mb-3 ">Category</h1>
          <ul>
            <li className="h-[40px] mb-3 p-2 bg-orange-400">cat</li>
            <li className="h-[40px] mb-3 p-2 bg-orange-400">cat</li>
            <li className="h-[40px] mb-3 p-2 bg-orange-400">cat</li>
            <li className="h-[40px] mb-3 p-2 bg-orange-400">cat</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Category;
