import { Program, AnchorProvider, web3, BN } from "@project-serum/anchor";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useMemo } from "react";
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import idl from "../solana/idl.json";
import { HASHDASH_PROGRAM_ID } from "./constants";

// Program ID - you'll need to replace this with your actual deployed program ID
const PROGRAM_ID = HASHDASH_PROGRAM_ID;

export interface HashDashState {
    mint: web3.PublicKey;
    bump: number;
    totalSupply: BN;
    authority: web3.PublicKey;
    feeReceiver: web3.PublicKey;
    buyFeeBps: number;
    sellFeeBps: number;
}

export interface TokenInfo {
    mint: string;
    name: string;
    symbol: string;
    image: string;
    totalSupply: string;
    marketCap: string;
}

export const useAnchorProgram = () => {
    const { connection } = useConnection();
    const wallet = useWallet();

    const provider = useMemo(() => {
        if (!wallet) return null;
        return new AnchorProvider(connection, wallet as any, {
            commitment: "confirmed",
        });
    }, [connection, wallet]);

    const program = useMemo(() => {
        if (!provider) return null;
        return new Program(idl as any, PROGRAM_ID, provider);
    }, [provider]);

    return { program, provider, wallet };
};

export const useHashDashProgram = () => {
    const { program, wallet } = useAnchorProgram();

    const initializeContract = async (
        mint: web3.PublicKey,
        buyFeeBps: number = 500, // 5%
        sellFeeBps: number = 500 // 5%
    ) => {
        if (!program || !wallet.publicKey) {
            throw new Error("Wallet not connected");
        }

        const [statePda] = web3.PublicKey.findProgramAddressSync(
            [Buffer.from("state"), mint.toBuffer()],
            program.programId
        );

        const [treasuryPda] = web3.PublicKey.findProgramAddressSync(
            [Buffer.from("treasury"), mint.toBuffer()],
            program.programId
        );

        const bump = statePda.toBytes()[statePda.toBytes().length - 1];

        try {
            const tx = await program.methods
                .initialize(bump, buyFeeBps, sellFeeBps)
                .accounts({
                    state: statePda,
                    mint: mint,
                    authority: wallet.publicKey,
                    feeReceiver: wallet.publicKey, // You can change this to a different address
                    systemProgram: web3.SystemProgram.programId,
                })
                .rpc();

            return {
                tx,
                statePda: statePda.toString(),
                treasuryPda: treasuryPda.toString(),
            };
        } catch (error) {
            console.error("Initialize error:", error);
            throw error;
        }
    };

    const buyTokens = async (mint: web3.PublicKey, lamports: number) => {
        if (!program || !wallet.publicKey) {
            throw new Error("Wallet not connected");
        }

        const [statePda] = web3.PublicKey.findProgramAddressSync(
            [Buffer.from("state"), mint.toBuffer()],
            program.programId
        );

        const [treasuryPda] = web3.PublicKey.findProgramAddressSync(
            [Buffer.from("treasury"), mint.toBuffer()],
            program.programId
        );

        const buyerAta = await getAssociatedTokenAddress(
            mint,
            wallet.publicKey
        );

        const feeReceiverAta = await getAssociatedTokenAddress(
            mint,
            wallet.publicKey // Fee receiver
        );

        try {
            const tx = await program.methods
                .buy(new BN(lamports))
                .accounts({
                    state: statePda,
                    mint: mint,
                    treasury: treasuryPda,
                    buyer: wallet.publicKey,
                    buyerAta: buyerAta,
                    feeReceiver: wallet.publicKey,
                    feeReceiverAta: feeReceiverAta,
                    tokenProgram: TOKEN_PROGRAM_ID,
                })
                .rpc();

            return { tx };
        } catch (error) {
            console.error("Buy error:", error);
            throw error;
        }
    };

    const sellTokens = async (mint: web3.PublicKey, amount: number) => {
        if (!program || !wallet.publicKey) {
            throw new Error("Wallet not connected");
        }

        const [statePda] = web3.PublicKey.findProgramAddressSync(
            [Buffer.from("state"), mint.toBuffer()],
            program.programId
        );

        const [treasuryPda] = web3.PublicKey.findProgramAddressSync(
            [Buffer.from("treasury"), mint.toBuffer()],
            program.programId
        );

        const buyerAta = await getAssociatedTokenAddress(
            mint,
            wallet.publicKey
        );

        const feeReceiverAta = await getAssociatedTokenAddress(
            mint,
            wallet.publicKey
        );

        try {
            const tx = await program.methods
                .sell(new BN(amount))
                .accounts({
                    state: statePda,
                    mint: mint,
                    treasury: treasuryPda,
                    buyer: wallet.publicKey,
                    buyerAta: buyerAta,
                    feeReceiver: wallet.publicKey,
                    feeReceiverAta: feeReceiverAta,
                    tokenProgram: TOKEN_PROGRAM_ID,
                })
                .rpc();

            return { tx };
        } catch (error) {
            console.error("Sell error:", error);
            throw error;
        }
    };

    const getState = async (
        mint: web3.PublicKey
    ): Promise<HashDashState | null> => {
        if (!program) return null;

        try {
            const [statePda] = web3.PublicKey.findProgramAddressSync(
                [Buffer.from("state"), mint.toBuffer()],
                program.programId
            );

            const state = await program.account.state.fetch(statePda);
            return state as HashDashState;
        } catch (error) {
            console.error("Get state error:", error);
            return null;
        }
    };

    return {
        initializeContract,
        buyTokens,
        sellTokens,
        getState,
        program,
    };
};
