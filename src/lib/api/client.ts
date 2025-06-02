import axios from "axios";
const baseUrl = "http://localhost:8080/api";

export const apiClient = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add JWT token to headers if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // or sessionStorage, as appropriate
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
