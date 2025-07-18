import axios from "axios";

// Dynamically set base URL based on current frontend host
const BASE_URL =
  import.meta.env.VITE_BASE_URL ||
  (window.location.hostname === "localhost"
    ? "http://localhost:8000/api/v1"
    : `http://${window.location.hostname}:8000/api/v1`);

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // enable if you're using cookie-based auth
});

export * from "./auth";

