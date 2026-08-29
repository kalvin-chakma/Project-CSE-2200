// API Configuration
// Use the local backend automatically when running `npm run dev`, and the
// deployed backend in a production build — avoids ever having to hand-edit
// this file (and risk shipping a localhost URL in a real deploy).
const API_BASE_URL = import.meta.env.DEV
  ? "http://localhost:8080"
  : "https://project-cse-2200.vercel.app";
export default API_BASE_URL;

