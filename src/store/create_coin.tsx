import { create } from "zustand";

type CreateCoin = {
    name: string;
    symbol: string;
    description: string;
    website: string;
    x_url: string;
    telegram_url: string;

    setField: (key: any, value: string) => void;
};

export const useCreateCoinStore = create<CreateCoin>((set) => ({
    name: "",
    symbol: "",
    description: "",
    website: "",
    x_url: "",
    telegram_url: "",
    setField: (key, value) => set({ [key]: value }),
}));
