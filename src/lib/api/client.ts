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

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log("Request Interceptor: Token:", token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});