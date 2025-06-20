import { create } from "zustand";

type AuthStore = {
    isAuth: boolean;
    token: string;
    setAuth: (isAuth: boolean, token: string) => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
    isAuth: false,
    token: "",
    setAuth: (isAuth: boolean, token: string) => set({ isAuth, token }),
}));
