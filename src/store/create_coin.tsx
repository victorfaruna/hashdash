import { create } from "zustand";

const useCreateCoinStore = create((set) => ({
    name: "",
    symbol: "",
    description: "",
    website: "",
    x_url: "",
    telegram_url: "",
}));
