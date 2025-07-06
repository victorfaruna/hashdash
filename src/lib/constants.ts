import { web3 } from "@project-serum/anchor";

// HashDash Program Configuration
export const HASHDASH_PROGRAM_ID = new web3.PublicKey(
    "FYRqhAz3FAeFTGUxCyE1ZnkEd68EA8BhHNavUbShLrBU"
);

// Network Configuration
export const NETWORK = "devnet"; // or "devnet", "testnet"

// Default Fee Configuration (in basis points - 100 = 1%)
export const DEFAULT_BUY_FEE_BPS = 500; // 5%
export const DEFAULT_SELL_FEE_BPS = 500; // 5%

// RPC Endpoints
export const RPC_ENDPOINTS = {
    "mainnet-beta": "https://api.mainnet-beta.solana.com",
    devnet: "https://api.devnet.solana.com",
    testnet: "https://api.testnet.solana.com",
};

// Token Configuration
export const LAMPORTS_PER_SOL = 1000000000;
export const MIN_SOL_AMOUNT = 0.01;
export const MIN_TOKEN_AMOUNT = 1;
