import axios from "axios";

const api = axios.create({
  // baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000",
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// automatically attach bearer token to each request if available
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;