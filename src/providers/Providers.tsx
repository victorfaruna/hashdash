"use client";
import React from "react";
import SolanaWallet from "./SolanaWallet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <SolanaWallet>{children}</SolanaWallet>
        </QueryClientProvider>
    );
}
