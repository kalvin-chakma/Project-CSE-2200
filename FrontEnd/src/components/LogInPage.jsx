import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import loginImage from "../assets/loginPageImage.jpg";
import Password from "./FormElement/Password";
import EmailAddress from "./FormElement/EmailAdress";
import withResponsiveWrapper from './withResponsiveWrapper';
import ErrorBoundary from './ErrorBoundary';

function LogInPage({ isMobile, isTablet, isDesktop }) {
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

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

      if (!isMounted.current) return;

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
        handleSuccess("Login successful!");
        console.log("Access Token:", accessToken);
        console.log("Refresh Token:", refreshToken);
        console.log("JWT Token:", jwtToken);
        console.log("User ID:", userId);
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("jwtToken", jwtToken);
        localStorage.setItem("loggedInUser", name);
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userRole", role);
        localStorage.setItem("userId", userId);

        window.dispatchEvent(new Event("storage"));

        setTimeout(() => {
          if (isMounted.current) {
            navigate(role === "admin" ? "/Home" : "/Home");
          }
        }, 3000);
      } else if (error) {
        const details = error?.details?.[0]?.message || "An error occurred";
        handleError(details);
      } else if (!success) {
        handleError(message || "Login failed");
      }
    } catch (err) {
      if (isMounted.current) {
        handleError(err.message || "An unexpected error occurred");
        console.error("Fetch error:", err);
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [loginInfo, navigate]);

  const handleSuccess = useCallback((message) => {
    if (isMounted.current) {
      toast.success(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }, []);

  const handleError = useCallback((message) => {
    if (isMounted.current) {
      toast.error(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setLoginInfo((prevLoginInfo) => ({
      ...prevLoginInfo,
      [name]: value,
    }));
  }, []);

  const AnimatedButton = React.memo(({ initialText, successText, onClick, isSuccess, isLoading }) => {
    return (
      <button
        className={`w-full px-4 py-2 rounded-md transition-all duration-300 ${
          isSuccess
            ? 'bg-green-500 text-white'
            : 'bg-indigo-600 text-white hover:bg-indigo-700'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={onClick}
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : isSuccess ? successText : initialText}
      </button>
    );
  });

  return (
    <ErrorBoundary>
      <div className={`max-w-400px mx-auto ${isMobile ? 'h-auto' : 'h-900px'}`}>
        <div className="h-full flex flex-col">
          <div className="w-full px-6 sm:px-10 lg:px-40 m-6 sm:m-10 flex justify-start items-center">
            {/* Add any header content here if needed */}
          </div>
          <div className={`flex p-6 ${isMobile ? 'flex-col' : 'flex-row'} flex-grow items-center justify-center`}>
            {!isMobile && (
              <div className="w-full h-full sm:w-5/12 flex items-center justify-center rounded-xl shadow-2xl">
                <img
                  src={loginImage}
                  alt="Login"
                  className="object-cover h-full w-full rounded-xl"
                />
              </div>
            )}
            <div className={`w-full ${isMobile ? 'mt-6' : 'sm:w-5/12 ml-6 sm:ml-10'} px-6 sm:px-28 py-6 sm:py-12 flex flex-col relative bg-white`}>
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
    </ErrorBoundary>
  );
}

export default withResponsiveWrapper(LogInPage);
