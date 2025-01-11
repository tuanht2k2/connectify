import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const ApiInstance = axios.create({
  baseURL:
    process.env.EXPO_PUBLIC_BASE_URL?.replace(/['";]/g, "") ||
    "http://localhost:8080/api/v1/",
  timeout: 10000,
  headers: {
    "X-Custom-Header": "foobar",
  },
});

export const FptAiApiInstance = axios.create({
  baseURL:
    process.env.EXPO_PUBLIC_FPT_AI_BASE_URL?.replace(/['";]/g, "") ||
    "http://localhost:8080/api/v1/",
  timeout: 30000,
  headers: {
    "X-Custom-Header": "foobar",
    api_key: process.env.EXPO_PUBLIC_FPT_AI_API_KEY,
  },
});

export const getApiConfig = async () => {
  const token = await AsyncStorage.getItem("token");
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  return config;
};

export const apiService = {
  post: async (url: string, body: any, handleError?: (error?: any) => void) => {
    const config = await getApiConfig();
    try {
      const response = await ApiInstance.post(url, body, config);
      return response.data;
    } catch (error) {
      handleError?.(error);
      throw error;
    }
  },

  get: async (
    url: string,
    params?: any,
    handleError?: (error?: any) => void
  ) => {
    const config = await getApiConfig();
    try {
      const response = await ApiInstance.get(url, { ...config, params });
      return response.data;
    } catch (error) {
      handleError?.(error);
      throw error;
    }
  },

  put: async (url: string, body: any, handleError?: (error?: any) => void) => {
    const config = await getApiConfig();
    try {
      const response = await ApiInstance.put(url, body, config);
      return response.data;
    } catch (error) {
      handleError?.(error);
      throw error;
    }
  },

  delete: async (
    url: string,
    params?: any,
    handleError?: (error?: any) => void
  ) => {
    const config = await getApiConfig();
    try {
      const response = await ApiInstance.delete(url, { ...config, params });
      return response.data;
    } catch (error) {
      handleError?.(error);
      throw error;
    }
  },

  postForm: async (
    url: string,
    formData: FormData,
    handleError?: (error?: any) => void
  ) => {
    const config = await getApiConfig();
    try {
      const response = await ApiInstance.post(url, formData, config);
      return response.data;
    } catch (error) {
      handleError?.(error);
      throw error;
    }
  },

  putForm: async (
    url: string,
    formData: FormData,
    handleError?: (error?: any) => void
  ) => {
    const config = await getApiConfig();
    try {
      const response = await ApiInstance.put(url, formData, config);
      return response.data;
    } catch (error) {
      handleError?.(error);
      throw error;
    }
  },
};
