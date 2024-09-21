import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import loginImage from "../assets/loginPageImage.jpg";
import Password from "./FormElement/Password";
import EmailAddress from "./FormElement/EmailAdress";

function LogInPage() {
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = useCallback(async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;
    if (!email || !password) {
      return handleError("Email and password are required");
    }
    setIsLoading(true);
    try {
      const url = "https://project-cse-2200.vercel.app/auth/login";
      console.log("Sending request to:", url);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginInfo),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Full server response:", result);

      const {
        success,
        message,
        accessToken,
        jwtToken,
        refreshToken,
        name,
        role,
        error,
        userId,
      } = result;

      if (success) {
        setLoginSuccess(true);
        setIsLoading(false); // Set loading to false after success
        handleSuccess("Login successful!");

        // Store tokens and user details
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("jwtToken", jwtToken);
        localStorage.setItem("loggedInUser", name);
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userRole", role);
        localStorage.setItem("userId", userId);

        window.dispatchEvent(new Event("storage"));

        // Redirect to the home page based on role
        setTimeout(() => {
          navigate(role === "admin" ? "/Home" : "/Home");
        }, 3000);
      } else if (error) {
        const details = error?.details?.[0]?.message || "An error occurred";
        handleError(details);
      } else if (!success) {
        handleError(message || "Login failed");
      }
    } catch (err) {
      handleError(err.message || "An unexpected error occurred");
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [loginInfo, navigate]);

  const handleSuccess = (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const handleError = (message) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo((prevLoginInfo) => ({
      ...prevLoginInfo,
      [name]: value,
    }));
  };

  const AnimatedButton = React.memo(
    ({ initialText, successText, onClick, isSuccess, isLoading }) => {
      return (
        <button
          className={`w-full px-4 py-2 rounded-md transition-all duration-300 ${
            isSuccess
              ? "bg-green-500 text-white"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={onClick}
          disabled={isLoading || isSuccess}
        >
          {isLoading ? "Loading..." : isSuccess ? successText : initialText}
        </button>
      );
    }
  );

  return (
    <div className="max-w-400px mx-auto h-900px">
      <div className="h-full flex flex-col">
        <div className="w-full px-6 sm:px-10 lg:px-40 m-6 sm:m-10 flex justify-start items-center"></div>
        <div className="flex p-6 flex-col sm:flex-row flex-grow items-center justify-center">
          <div className="w-full h-full sm:w-5/12 flex items-center justify-center rounded-xl shadow-2xl">
            <img
              src={loginImage}
              alt="Login"
              className="object-cover h-full w-full rounded-xl"
            />
          </div>
          <div className="w-full sm:w-5/12 px-6 sm:px-28 py-6 sm:py-12 ml-6 sm:ml-10 flex flex-col relative bg-white">
            <div className="mt-5 flex flex-col justify-between h-full">
              <div>
                <p className="text-lg sm:text-2xl font-semibold">
                  Welcome Back!
                </p>
                <p className="mt-2 font-semibold text-sm sm:text-base opacity-50">
                  Please login to your account
                </p>
                <form
                  className="mt-10 sm:mt-20 space-y-4 sm:space-y-7"
                  onSubmit={handleLogin}
                >
                  <EmailAddress
                    name="email"
                    value={loginInfo.email}
                    onChange={handleChange}
                  />
                  <Password
                    name="password"
                    value={loginInfo.password}
                    onChange={handleChange}
                  />
                  <div className="text-right">
                    <a
                      href="#"
                      className="text-sm font-bold text-indigo-400 hover:text-indigo-700"
                    >
                      Forgot Password?
                    </a>
                  </div>
                  <div className="mt-8 sm:mt-10 flex justify-center">
                    <AnimatedButton
                      initialText="Log In"
                      successText="Login Successful"
                      onClick={handleLogin}
                      isSuccess={loginSuccess}
                      isLoading={isLoading}
                    />
                  </div>
                </form>
              </div>
              <div className="mt-10 sm:mt-14 flex flex-col sm:flex-row justify-between">
                <h3 className="text-xs sm:text-sm font-semibold opacity-50">
                  Don't have an account yet?
                </h3>
                <a
                  href="/RegisterPage"
                  className="mt-2 sm:mt-0 text-xs sm:text-sm font-bold text-indigo-400 hover:text-indigo-700"
                >
                  Create an account
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default LogInPage;
