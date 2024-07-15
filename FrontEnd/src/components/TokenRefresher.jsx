import React, { useEffect } from "react";
import { refreshTokens } from "../utills/auth";

const TokenRefresher = () => {
  useEffect(() => {
    const handleStorage = () => {
      refreshTokens();
    };

    const handleClick = () => {
      refreshTokens();
    };

    window.addEventListener("storage", handleStorage);
    document.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("storage", handleStorage);
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return null;
};

export default TokenRefresher;
