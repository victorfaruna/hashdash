import { create } from "zustand";

type AuthStore = {
    isAuth: boolean;
    token: string;
    wallet_address: string;
    setAuth: (isAuth: boolean, token: string, wallet_address: string) => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
    isAuth: false,
    token: "",
    wallet_address: "",
    setAuth: (isAuth: boolean, token: string, wallet_address: string) =>
        set({ isAuth, token, wallet_address }),
}));
