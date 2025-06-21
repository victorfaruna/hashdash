import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthStore = {
    isAuth: boolean;
    token: string;
    wallet_address: string;
    setAuth: (isAuth: boolean, token: string, wallet_address: string) => void;
};

export const useAuthStore = create(
    persist<AuthStore>(
        (set) => ({
            isAuth: false,
            token: "",
            wallet_address: "",
            setAuth: (isAuth: boolean, token: string, wallet_address: string) =>
                set({ isAuth, token, wallet_address }),
        }),
        {
            name: "auth-store",
        }
    )
);
