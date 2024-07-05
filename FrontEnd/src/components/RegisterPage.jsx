import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RegisterPageImage from "../assets/RegisterPageImage.jpg";
import Password from "./FormElement/Password";
import ConfirmPassword from "./FormElement/ConfirmPassword";
import EmailAdress from "./FormElement/EmailAdress";
import UserName from "./FormElement/UserName";

function RegisterPage() {
  const [signupInfo, setSignupInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, password } = signupInfo;
    if (!name || !email || !password) {
      return handleError("Name, email, and password are required");
    }
    try {
      const url = "http://localhost:8080/auth/signup";
      console.log('Sending request to:', url);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupInfo),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const { success, message, error } = result;
      if (success) {
        handleSuccess(message);
        setTimeout(() => {
          navigate("/LogInPage");
        }, 1000);
      } else if (error) {
        const details = error?.details[0]?.message;
        handleError(details);
      } else if (!success) {
        handleError(message);
      }
      console.log(result);
    } catch (err) {
      handleError(err.message);
      console.error('Fetch error:', err);
    }
  };

  const handleSuccess = (message) => {
    alert(`Success: ${message}`);
  };

  const handleError = (message) => {
    alert(`Error: ${message}`);
  };

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
              <form className="mt-10 space-y-5" onSubmit={handleSignup}>
                <UserName
                  name="name"
                  value={signupInfo.name}
                  onChange={handleChange}
                />
                <EmailAdress
                  name="email"
                  value={signupInfo.email}
                  onChange={handleChange}
                />
                <Password
                  name="password"
                  value={signupInfo.password}
                  onChange={handleChange}
                />
                <div className="mb-8 flex justify-center">
                  <button
                    type="submit"
                    className="w-4/6 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Register
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
