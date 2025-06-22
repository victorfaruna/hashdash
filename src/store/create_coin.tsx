import { create } from "zustand";

type CreateCoin = {
    name: string;
    symbol: string;
    description: string;
    website_url: string;
    x_url: string;
    telegram_url: string;

    setField: (key: any, value: string) => void;
};

export const useCreateCoinStore = create<CreateCoin>((set) => ({
    name: "",
    symbol: "",
    description: "",
    website_url: "",
    x_url: "",
    telegram_url: "",
    setField: (key, value) => set({ [key]: value }),
}));
