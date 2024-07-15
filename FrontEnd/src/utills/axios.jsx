import axios from "axios";
import { refreshTokens } from "./utils/auth";

const instance = axios.create({
  baseURL: "https://project-cse-2200.vercel.app/",
});

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      await refreshTokens();
      return instance(originalRequest);
    }
    return Promise.reject(error);
  }
);

export default instance;
