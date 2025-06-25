import { Connection, PublicKey, Transaction, Signer } from "@solana/web3.js";
import { Program, AnchorProvider, web3, BN, Idl } from "@project-serum/anchor";
import idl from "./idl.json";
import { WalletContextState } from "@solana/wallet-adapter-react";

// Replace with your deployed program ID
const PROGRAM_ID = new PublicKey(
    "FYRqhAz3FAeFTGUxCyE1ZnkEd68EA8BhHNavUbShLrBU"
);

// Utility to get Anchor provider from wallet adapter
export function getProvider(
    connection: Connection,
    wallet: WalletContextState
) {
    return new AnchorProvider(connection, wallet as any, {
        preflightCommitment: "processed",
    });
}

// Utility to get Program instance
export function getProgram(connection: Connection, wallet: WalletContextState) {
    const provider = getProvider(connection, wallet);
    return new Program(idl as Idl, PROGRAM_ID, provider);
}

// Example: Call initialize instruction
export async function initialize({
    connection,
    wallet,
    accounts,
    name,
    symbol,
    decimals,
    totalSupply,
    signers = [],
}: {
    connection: Connection;
    wallet: WalletContextState;
    accounts: {
        authority: PublicKey;
        state: PublicKey;
        tokenMint: PublicKey;
        mintAuthority: PublicKey;
        tokenVault: PublicKey;
        tokenVaultAuthority: PublicKey;
        solVault: PublicKey;
        systemProgram: PublicKey;
        tokenProgram: PublicKey;
        associatedTokenProgram: PublicKey;
        rent: PublicKey;
    };
    name: string;
    symbol: string;
    decimals: number;
    totalSupply: BN | null;
    signers?: Signer[];
}) {
    const program = getProgram(connection, wallet);
    return await program.methods
        .initialize(name, symbol, decimals, totalSupply)
        .accounts(accounts)
        .signers(signers)
        .rpc();
}

// Example: Call buy instruction
export async function buy({
    connection,
    wallet,
    accounts,
    solAmount,
    minTokensOut,
}: {
    connection: Connection;
    wallet: WalletContextState;
    accounts: {
        state: PublicKey;
        tokenMint: PublicKey;
        userTokenAccount: PublicKey;
        user: PublicKey;
        tokenVault: PublicKey;
        mintAuthority: PublicKey;
        tokenVaultAuthority: PublicKey;
        solVault: PublicKey;
        systemProgram: PublicKey;
        tokenProgram: PublicKey;
    };
    solAmount: BN;
    minTokensOut: BN;
}) {
    const program = getProgram(connection, wallet);
    return await program.methods
        .buy(solAmount, minTokensOut)
        .accounts(accounts)
        .rpc();
}

// Example: Call sell instruction
export async function sell({
    connection,
    wallet,
    accounts,
    tokenAmount,
    minSolOut,
}: {
    connection: Connection;
    wallet: WalletContextState;
    accounts: {
        state: PublicKey;
        tokenMint: PublicKey;
        userTokenAccount: PublicKey;
        user: PublicKey;
        tokenVault: PublicKey;
        solVault: PublicKey;
        systemProgram: PublicKey;
        tokenProgram: PublicKey;
    };
    tokenAmount: BN;
    minSolOut: BN;
}) {
    const program = getProgram(connection, wallet);
    return await program.methods
        .sell(tokenAmount, minSolOut)
        .accounts(accounts)
        .rpc();
}

// Example: Call withdraw instruction
export async function withdraw({
    connection,
    wallet,
    accounts,
    amount,
}: {
    connection: Connection;
    wallet: WalletContextState;
    accounts: {
        state: PublicKey;
        solVault: PublicKey;
        destination: PublicKey;
        authority: PublicKey;
        systemProgram: PublicKey;
    };
    amount: BN;
}) {
    const program = getProgram(connection, wallet);
    return await program.methods.withdraw(amount).accounts(accounts).rpc();
}

/*
USAGE EXAMPLE (React):

import React from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { buy } from "./contractClient";
import { PublicKey } from "@solana/web3.js";
import { BN } from "@project-serum/anchor";

const BuyButton = () => {
    const { connection } = useConnection();
    const wallet = useWallet();

    const handleBuy = async () => {
        if (!wallet.publicKey) return;
        // You must derive or fetch these account addresses appropriately
        const accounts = {
            state: new PublicKey("STATE_PUBKEY"),
            tokenMint: new PublicKey("TOKEN_MINT_PUBKEY"),
            userTokenAccount: new PublicKey("USER_TOKEN_ACCOUNT_PUBKEY"),
            user: wallet.publicKey,
            tokenVault: new PublicKey("TOKEN_VAULT_PUBKEY"),
            mintAuthority: new PublicKey("MINT_AUTHORITY_PUBKEY"),
            tokenVaultAuthority: new PublicKey("TOKEN_VAULT_AUTHORITY_PUBKEY"),
            solVault: new PublicKey("SOL_VAULT_PUBKEY"),
            systemProgram: new PublicKey("11111111111111111111111111111111"),
            tokenProgram: new PublicKey("TOKEN_PROGRAM_PUBKEY"),
        };
        const solAmount = new BN(10000000); // 0.01 SOL (in lamports)
        const minTokensOut = new BN(1); // Minimum tokens expected
        try {
            const txSig = await buy({
                connection,
                wallet,
                accounts,
                solAmount,
                minTokensOut,
            });
            console.log("Buy transaction signature:", txSig);
        } catch (e) {
            console.error("Buy failed:", e);
        }
    };

    return <button onClick={handleBuy}>Buy</button>;
};

export default BuyButton;
*/
