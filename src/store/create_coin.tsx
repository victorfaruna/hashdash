import { create } from "zustand";

type CreateCoin = {
    name: string;
    symbol: string;
    description: string;
    image?: File | any;
    website_url?: string;
    x_url?: string;
    telegram_url?: string;

    setField: (key: any, value: string) => void;
    clearFields: () => void;
};

export const useCreateCoinStore = create<CreateCoin>((set) => ({
    name: "",
    symbol: "",
    description: "",
    image: undefined,
    website_url: "",
    x_url: "",
    telegram_url: "",
    setField: (key, value) => set({ [key]: value }),
    clearFields: () =>
        set({
            name: "",
            symbol: "",
            description: "",
            image: undefined,
            website_url: "",
            x_url: "",
            telegram_url: "",
        }),
}));
