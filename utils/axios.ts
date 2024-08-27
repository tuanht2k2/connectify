import axios from "axios";

// import { API_URL } from "react-native-dotenv";

const API_URL = "http://localhost:8080/api/v1";

export const instance = axios.create({
  baseURL: API_URL || "http://localhost:8080/api/v1",
  timeout: 5000,
  headers: { "X-Custom-Header": "foobar" },
});

export const getApiConfig = () => {
  const jwtToken = localStorage.getItem("jwtToken");
  const config = {
    headers: { Authorization: `Bearer ${jwtToken}` },
  };

  return config;
};
