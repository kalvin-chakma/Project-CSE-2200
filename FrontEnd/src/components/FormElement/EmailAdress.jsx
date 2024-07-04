import React from "react";

function EmailAdress() {
  return (
    <div>
      <label
        className="block text-sm font-semibold text-gray-700"
        htmlFor="username"
      >
        Email Address
      </label>
      <input
        type="text"
        placeholder="Enter your Email"
        id="username"
        className="mt-1 block w-full px-3 py-2 border border-gray-400 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
    </div>
  );
}

export default EmailAdress;
