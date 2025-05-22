// axiosConfig.js
import axios from "axios";

const baseUrl = import.meta.env.VITE_API_BASE_URI;

const axiosInstance = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

export default axiosInstance;
