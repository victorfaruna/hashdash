import { AxiosError } from "axios";
import { axiosInstance } from "./api";
import { useAuthStore } from "@/store/auth";

export const login = async (wallet_address: string) => {
    try {
        const request = await axiosInstance.post("/auth", {
            wallet_address,
        });
        const response = request.data;
        const token = response.token;
        useAuthStore.getState().setAuth(true, token, wallet_address);
        localStorage.setItem("token", token);
        console.log("Logged in successfully");
        return response.data;
    } catch (error: Error | AxiosError | any) {
        console.log(error);
        return error?.response?.data?.message || error.message;
    }
};
