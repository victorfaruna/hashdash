import { AxiosError } from "axios";
import { axiosInstance } from "./api";

export type CreateCoin = {
    name: any;
    symbol: string;
    image?: File | any;
    description: string;
    website_url?: string;
    x_url?: string;
    telegram_url?: string;
    creator_wallet_address: string;
    total_supply?: number | Blob | any;
};

export const createToken = async ({
    name,
    symbol,
    image,
    description,
    website_url,
    x_url,
    telegram_url,
    creator_wallet_address,
    total_supply,
}: CreateCoin) => {
    try {
        console.log("createToken received image:", image);
        console.log("Image type:", typeof image, image instanceof File);
        const formData = new FormData();
        formData.append("name", name);
        formData.append("symbol", symbol);
        if (image instanceof File) {
            formData.append("image", image);
        }
        formData.append("description", description);
        formData.append("website_url", website_url || "");
        formData.append("x_url", x_url || "");
        formData.append("telegram_url", telegram_url || "");
        formData.append("creator_wallet_address", creator_wallet_address);
        formData.append("total_supply", total_supply);

        const request = await axiosInstance.post("/token", formData);
        const response = request.data;
        return response.data;
    } catch (error: Error | AxiosError | any) {
        console.log(error);
        throw new Error(error?.response?.data?.message || error.message);
    }
};

export const getTrendingTokens = async () => {
    try {
        const request = await axiosInstance.get("/token/trending");
        const response = request.data;
        return response.data;
    } catch (error: Error | AxiosError | any) {
        console.log(error);
        throw new Error(error?.response?.data?.message || error.message);
    }
};

export const getTokens = async () => {
    try {
        const request = await axiosInstance.get("/token");
        const response = request.data;
        return response.data;
    } catch (error: Error | AxiosError | any) {
        console.log(error);
        throw new Error(error?.response?.data?.message || error.message);
    }
};
