import {
    createMint,
    getOrCreateAssociatedTokenAccount,
    mintTo,
    getMint,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { web3, BN } from "@project-serum/anchor";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useMemo } from "react";

export const useTokenCreator = () => {
    const { connection } = useConnection();
    const wallet = useWallet();

    const createNewToken = async (
        decimals: number = 9,
        initialSupply: number = 1000000000 // 1 billion tokens
    ) => {
        if (!wallet.publicKey || !wallet.signTransaction) {
            throw new Error("Wallet not connected");
        }

        try {
            // Generate a new keypair for the mint
            const mintKeypair = web3.Keypair.generate();
            const mint = mintKeypair.publicKey;

            console.log("Creating mint:", mint.toString());

            // Create the mint account
            const createMintTx = await createMint(
                connection,
                wallet as any, // AnchorProvider expects this format
                wallet.publicKey, // mint authority
                wallet.publicKey, // freeze authority (you can set this to null if you don't want to freeze)
                decimals,
                mintKeypair
            );

            console.log("Mint created:", createMintTx);

            // Get or create the associated token account for the creator
            const tokenAccount = await getOrCreateAssociatedTokenAccount(
                connection,
                wallet as any,
                mint,
                wallet.publicKey
            );

            console.log(
                "Token account created:",
                tokenAccount.address.toString()
            );

            // Mint initial supply to the creator
            const mintToTx = await mintTo(
                connection,
                wallet as any,
                mint,
                tokenAccount.address,
                wallet.publicKey,
                initialSupply * Math.pow(10, decimals)
            );

            console.log("Initial supply minted:", mintToTx);

            return {
                mint: mint.toString(),
                tokenAccount: tokenAccount.address.toString(),
                createMintTx,
                mintToTx,
                decimals,
                initialSupply,
            };
        } catch (error) {
            console.error("Error creating token:", error);
            throw error;
        }
    };

    const getTokenInfo = async (mintAddress: string) => {
        if (!connection) return null;

        try {
            const mint = new web3.PublicKey(mintAddress);
            const mintInfo = await getMint(connection, mint);

            return {
                mint: mintAddress,
                decimals: mintInfo.decimals,
                supply: mintInfo.supply.toString(),
                mintAuthority: mintInfo.mintAuthority?.toString(),
                freezeAuthority: mintInfo.freezeAuthority?.toString(),
            };
        } catch (error) {
            console.error("Error getting token info:", error);
            return null;
        }
    };

    return {
        createNewToken,
        getTokenInfo,
    };
};
