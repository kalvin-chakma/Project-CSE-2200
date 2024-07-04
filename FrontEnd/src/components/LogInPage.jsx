import React from "react";
import loginImage from "../assets/loginPageImage.jpg";
import Password from "./FormElement/Password";
import EmailAdress from "./FormElement/EmailAdress";

function LogInPage() {
  return (
    <div className="h-screen flex flex-col">
      <div className="w-full px-40 m-10 flex justify-start items-center"></div>
      <div className="flex flex-row flex-grow items-center justify-center">
        <div className="h-5/6 w-5/12 flex items-center justify-center shadow-2xl">
          <img
            src={loginImage}
            alt="Login"
            className="object-cover h-full w-full rounded-xl"
          />
        </div>
        <div className="h-5/6 w-5/12 px-28 py-12 ml-10 flex flex-col rounded-3xl relative bg-white ">
          <div className="mt-5 flex flex-col justify-between h-full">
            <div>
              <p className="text-2xl font-semibold">Welcome Back!</p>
              <p className="mt-2 font-semibold opacity-50">
                Please login to your account
              </p>
              <form className="mt-20 space-y-7">
                <EmailAdress />
                <Password />
                <div className="text-right">
                  <a
                    href="#"
                    className="text-sm font-bold text-indigo-400 hover:text-indigo-700"
                  >
                    Forgot Password?
                  </a>
                </div>
                <div className="mt-10 flex justify-center">
                  <button
                    type="submit"
                    className="w-4/6 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Log In
                  </button>
                </div>
              </form>
            </div>
            <div className="mt-14 flex justify-between">
              <h3 className="text-sm font-semibold opacity-50">
                Don't have an account yet?
              </h3>
              <a
                href="/RegisterPage"
                className="text-sm font-bold text-indigo-400 hover:text-indigo-700"
              >
                Create an account
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LogInPage;
