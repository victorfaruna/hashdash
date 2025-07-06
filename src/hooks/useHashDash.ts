import { useState } from "react";
import { useHashDashProgram } from "@/lib/anchor";
import { web3 } from "@project-serum/anchor";
import { useWallet } from "@solana/wallet-adapter-react";

export const useHashDash = () => {
    const { initializeContract, buyTokens, sellTokens, getState } =
        useHashDashProgram();
    const { publicKey } = useWallet();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createToken = async (
        mintAddress: string,
        buyFeeBps: number = 500,
        sellFeeBps: number = 500
    ) => {
        if (!publicKey) {
            setError("Wallet not connected");
            return null;
        }

        setIsLoading(true);
        setError(null);

        try {
            const mint = new web3.PublicKey(mintAddress);
            const result = await initializeContract(
                mint,
                buyFeeBps,
                sellFeeBps
            );

            return {
                success: true,
                transaction: result.tx,
                stateAddress: result.statePda,
                treasuryAddress: result.treasuryPda,
            };
        } catch (err: any) {
            setError(err.message || "Failed to create token");
            return { success: false, error: err.message };
        } finally {
            setIsLoading(false);
        }
    };

    const buyToken = async (mintAddress: string, solAmount: number) => {
        if (!publicKey) {
            setError("Wallet not connected");
            return null;
        }

        setIsLoading(true);
        setError(null);

        try {
            const mint = new web3.PublicKey(mintAddress);
            const lamports = solAmount * web3.LAMPORTS_PER_SOL;
            const result = await buyTokens(mint, lamports);

            return {
                success: true,
                transaction: result.tx,
            };
        } catch (err: any) {
            setError(err.message || "Failed to buy tokens");
            return { success: false, error: err.message };
        } finally {
            setIsLoading(false);
        }
    };

    const sellToken = async (mintAddress: string, tokenAmount: number) => {
        if (!publicKey) {
            setError("Wallet not connected");
            return null;
        }

        setIsLoading(true);
        setError(null);

        try {
            const mint = new web3.PublicKey(mintAddress);
            const result = await sellTokens(mint, tokenAmount);

            return {
                success: true,
                transaction: result.tx,
            };
        } catch (err: any) {
            setError(err.message || "Failed to sell tokens");
            return { success: false, error: err.message };
        } finally {
            setIsLoading(false);
        }
    };

    const getTokenState = async (mintAddress: string) => {
        if (!publicKey) {
            setError("Wallet not connected");
            return null;
        }

        setIsLoading(true);
        setError(null);

        try {
            const mint = new web3.PublicKey(mintAddress);
            const state = await getState(mint);

            if (!state) {
                setError("Token state not found");
                return null;
            }

            return {
                success: true,
                state: {
                    mint: state.mint.toString(),
                    totalSupply: state.totalSupply.toString(),
                    authority: state.authority.toString(),
                    feeReceiver: state.feeReceiver.toString(),
                    buyFeeBps: state.buyFeeBps,
                    sellFeeBps: state.sellFeeBps,
                },
            };
        } catch (err: any) {
            setError(err.message || "Failed to get token state");
            return { success: false, error: err.message };
        } finally {
            setIsLoading(false);
        }
    };

    return {
        createToken,
        buyToken,
        sellToken,
        getTokenState,
        isLoading,
        error,
        clearError: () => setError(null),
    };
};
