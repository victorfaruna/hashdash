import { AxiosError } from "axios";
import { axiosInstance } from "./api";
import { useAuthStore } from "@/store/auth";

export const login = async (wallet_address: string) => {
    try {
        const response = await axiosInstance.post("/auth", {
            wallet_address,
        });
        useAuthStore.getState().setAuth(true, response.data.token);
        console.log(response.data.wallet_address);
        console.log("Logged in successfully");
        return response.data;
    } catch (error: Error | AxiosError | any) {
        console.log(error);
        return error?.response?.data?.message || error.message;
    }
};
