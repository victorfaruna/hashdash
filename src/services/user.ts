import { AxiosError } from "axios";
import { axiosInstance } from "./api";

export const fetchUser = async (wallet_address: string) => {
    try {
        const request = await axiosInstance.get(
            `/user?wallet_address=${wallet_address}`
        );
        const response = await request.data;
        return response.data;
    } catch (error: Error | AxiosError | any) {
        console.log(error);
        return error?.response?.data?.message || error.message;
    }
};
