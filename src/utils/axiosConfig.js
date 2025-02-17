import axios from "axios";

const axiosInstance = axios.create({
  headers: { "Content-Type": "application/json" },
});

// Adicionar o token do cookie nas requisições
axiosInstance.interceptors.request.use((config) => {
  const token = document.cookie
    .split("; ")
    .find(row => row.startsWith("token="))
    ?.split("=")[1];

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosInstance;
