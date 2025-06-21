import { useAuthStore } from "@/store/auth";
import axios from "axios";
export const API_URL = "http://localhost:3000/api/";

export const axiosInstance = axios.create({
    baseURL: API_URL,
});

axiosInstance.interceptors.request.use(
    (config) => {
        // Try to get token from localStorage
        const token =
            useAuthStore.getState().token || localStorage.getItem("token");

        console.log("token: " + token);
        if (token) {
            config.headers = config.headers || {};
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
