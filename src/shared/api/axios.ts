import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://aiary-cproject-render-backend.onrender.com/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
