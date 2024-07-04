import React from "react";
import RegisterPageImage from "../assets/RegisterPageImage.jpg";
import Password from "./FormElement/Password";
import ConfirmPassword from "./FormElement/ConfirmPassword";
import EmailAdress from "./FormElement/EmailAdress";
import UserName from "./FormElement/UserName";

function RegisterPage() {
  return (
    <div className="h-screen flex flex-col">
      <div className="w-full px-40 mt-10 flex justify-start items-center"></div>
      <div className="flex flex-row flex-grow items-center justify-center">
        <div className="h-5/6 w-10/12 p-5 flex flex-row justify-between rounded-3xl relative shadow-2xl bg-white">
          <div className="w-2/3">
            <img
              src={RegisterPageImage}
              alt="Register Page"
              className="object-cover h-full w-full rounded-l-3xl"
            />
          </div>
          <div className="w-2/5 flex flex-col justify-between p-10">
            <div>
              <p className="text-2xl font-semibold">Register Now!</p>
              <p className="mt-2 font-semibold opacity-50">
                Please Register to create your account
              </p>
              <form className="mt-10 space-y-5">
                <UserName />
                <EmailAdress />
                <Password />
                <ConfirmPassword />
              </form>
            </div>
            <div className="mb-8 flex justify-center">
              <button
                type="submit"
                className="w-4/6 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
