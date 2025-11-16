import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BACKEND_URL ?? "https://aiary-cproject-render-backend.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
