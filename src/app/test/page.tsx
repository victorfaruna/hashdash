"use client";
import React, { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
    initialize,
    buy,
    sell,
    withdraw,
} from "@/services/contract/contractClient";
import { PublicKey, Keypair, Transaction } from "@solana/web3.js";
import { BN } from "@project-serum/anchor";
import {
    getAssociatedTokenAddress,
    createAssociatedTokenAccountInstruction,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

const pubkeyInput = (val: string) =>
    val ? new PublicKey(val) : PublicKey.default;

const PROGRAM_ID = new PublicKey(
    "FYRqhAz3FAeFTGUxCyE1ZnkEd68EA8BhHNavUbShLrBU"
);

// Helper component for inputs with tooltips
const InputWithTooltip = ({
    placeholder,
    value,
    onChange,
    tooltip,
    type = "text",
}: {
    placeholder: string;
    value: string | number;
    onChange: (value: string) => void;
    tooltip: string;
    type?: string;
}) => (
    <div style={{ width: "100%", marginBottom: 8 }}>
        <input
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            type={type}
            title={tooltip}
            style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ddd",
                borderRadius: 4,
            }}
        />
        <div style={{ fontSize: "12px", color: "#666", marginTop: 2 }}>
            {tooltip}
        </div>
    </div>
);

const TestContract = () => {
    const { connection } = useConnection();
    const wallet = useWallet();
    const [loading, setLoading] = useState<string>("");

    // State for inputs and results
    const [initArgs, setInitArgs] = useState({
        state: "",
        tokenMint: "",
        name: "Test Token",
        symbol: "TEST",
        decimals: 9,
        totalSupply: "1000000000",
    });
    const [mintKeypair, setMintKeypair] = useState<Keypair | null>(null);
    const [buyArgs, setBuyArgs] = useState({
        state: "",
        userTokenAccount: "",
        solAmount: "100000000", // 0.1 SOL
        minTokensOut: "1",
    });
    const [sellArgs, setSellArgs] = useState({
        state: "",
        userTokenAccount: "",
        tokenAmount: "1000000", // 1 token with 6 decimals
        minSolOut: "90000000", // 0.09 SOL (10% slippage from 0.1)
    });
    const [withdrawArgs, setWithdrawArgs] = useState({
        state: "",
        destination: "",
        amount: "10000000", // 0.01 SOL
    });
    const [result, setResult] = useState<string>("");
    const [error, setError] = useState<string>("");

    // Set state field to PDA
    const autofillStatePDA = async () => {
        const [pda] = await PublicKey.findProgramAddress(
            [Buffer.from("state")],
            PROGRAM_ID
        );
        setInitArgs((prev) => ({ ...prev, state: pda.toString() }));
    };

    // Generate mint keypair
    const generateMintKeypair = () => {
        const kp = Keypair.generate();
        setMintKeypair(kp);
        setInitArgs((prev) => ({
            ...prev,
            tokenMint: kp.publicKey.toString(),
        }));
    };

    // Handlers
    const handleInitialize = async () => {
        setResult("");
        setError("");
        setLoading("initialize");
        try {
            if (!wallet.publicKey) throw new Error("Wallet not connected");
            if (!wallet.signTransaction)
                throw new Error("Wallet does not support signing");
            if (!mintKeypair)
                throw new Error(
                    "Token mint Keypair not generated! Click 'Generate Mint Keypair' first."
                );

            // Derive all PDAs with their seeds and bumps
            const [statePDA] = await PublicKey.findProgramAddress(
                [Buffer.from("state")],
                PROGRAM_ID
            );
            const [mintAuthorityPDA] = await PublicKey.findProgramAddress(
                [Buffer.from("mint_authority")],
                PROGRAM_ID
            );
            const [tokenVaultAuthorityPDA, tokenVaultAuthorityBump] =
                await PublicKey.findProgramAddress(
                    [Buffer.from("token_vault_authority")],
                    PROGRAM_ID
                );
            const [solVaultPDA] = await PublicKey.findProgramAddress(
                [Buffer.from("sol_vault")],
                PROGRAM_ID
            );

            // Derive the token vault ATA
            const tokenVaultPDA = await getAssociatedTokenAddress(
                mintKeypair.publicKey,
                tokenVaultAuthorityPDA,
                true // allowOwnerOffCurve
            );

            // Create the ATA instruction
            const createVaultIx = createAssociatedTokenAccountInstruction(
                wallet.publicKey, // payer
                tokenVaultPDA, // ata
                tokenVaultAuthorityPDA, // owner
                mintKeypair.publicKey, // mint
                TOKEN_PROGRAM_ID,
                ASSOCIATED_TOKEN_PROGRAM_ID
            );

            // Get the program instance
            const program = (
                await import("@/services/contract/contractClient")
            ).getProgram(connection, wallet);

            // Prepare the initialize instruction
            const initializeIx = await program.methods
                .initialize(
                    initArgs.name,
                    initArgs.symbol,
                    Number(initArgs.decimals),
                    initArgs.totalSupply ? new BN(initArgs.totalSupply) : null
                )
                .accounts({
                    authority: wallet.publicKey,
                    state: statePDA,
                    tokenMint: mintKeypair.publicKey,
                    mintAuthority: mintAuthorityPDA,
                    tokenVault: tokenVaultPDA,
                    tokenVaultAuthority: tokenVaultAuthorityPDA,
                    solVault: solVaultPDA,
                    systemProgram: new PublicKey(
                        "11111111111111111111111111111111"
                    ),
                    tokenProgram: new PublicKey(
                        "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
                    ),
                    associatedTokenProgram: new PublicKey(
                        "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
                    ),
                    rent: new PublicKey(
                        "SysvarRent111111111111111111111111111111111"
                    ),
                })
                .signers([mintKeypair])
                .instruction();

            // Build the transaction
            const tx = new Transaction();
            tx.add(createVaultIx);
            tx.add(initializeIx);

            // Get the latest blockhash
            const { blockhash } = await connection.getLatestBlockhash();
            tx.recentBlockhash = blockhash;
            tx.feePayer = wallet.publicKey;

            // Partially sign with the mint keypair
            tx.partialSign(mintKeypair);

            // Let the wallet sign
            const signedTx = await wallet.signTransaction(tx);

            // Send the raw transaction
            const txSig = await connection.sendRawTransaction(
                signedTx.serialize(),
                { skipPreflight: false }
            );

            // Wait for transaction confirmation
            const confirmation = await connection.confirmTransaction(
                txSig,
                "confirmed"
            );
            if (confirmation.value.err) {
                throw new Error("Transaction failed to confirm");
            }

            setResult(
                `✅ Initialize successful!\nTransaction: ${txSig}\nState: ${statePDA.toString()}\nMint: ${mintKeypair.publicKey.toString()}\nToken Vault: ${tokenVaultPDA.toString()}`
            );
        } catch (e: any) {
            if (e.logs) {
                setError(
                    `Transaction failed: ${e.message}\nLogs:\n${e.logs.join(
                        "\n"
                    )}`
                );
            } else {
                setError(e.message || e.toString());
            }
        } finally {
            setLoading("");
        }
    };
    const handleBuy = async () => {
        setResult("");
        setError("");
        setLoading("buy");
        try {
            if (!wallet.publicKey) throw new Error("Wallet not connected");
            if (!wallet.signTransaction)
                throw new Error("Wallet does not support signing");
            if (!mintKeypair && !buyArgs.state) {
                throw new Error(
                    "Please provide either the state address or initialize first"
                );
            }

            const tokenMint = mintKeypair
                ? mintKeypair.publicKey
                : new PublicKey(buyArgs.state);

            // Derive all PDAs with their seeds and bumps
            const [statePDA] = await PublicKey.findProgramAddress(
                [Buffer.from("state")],
                PROGRAM_ID
            );
            const [mintAuthorityPDA] = await PublicKey.findProgramAddress(
                [Buffer.from("mint_authority")],
                PROGRAM_ID
            );
            const [tokenVaultAuthorityPDA] = await PublicKey.findProgramAddress(
                [Buffer.from("token_vault_authority")],
                PROGRAM_ID
            );
            const [solVaultPDA] = await PublicKey.findProgramAddress(
                [Buffer.from("sol_vault")],
                PROGRAM_ID
            );

            // Get or create user's token account
            let userTokenAccount: PublicKey;
            if (buyArgs.userTokenAccount) {
                userTokenAccount = new PublicKey(buyArgs.userTokenAccount);
            } else {
                userTokenAccount = await getAssociatedTokenAddress(
                    tokenMint,
                    wallet.publicKey
                );
                // Create ATA if it doesn't exist
                try {
                    const createAtaIx = createAssociatedTokenAccountInstruction(
                        wallet.publicKey,
                        userTokenAccount,
                        wallet.publicKey,
                        tokenMint,
                        TOKEN_PROGRAM_ID,
                        ASSOCIATED_TOKEN_PROGRAM_ID
                    );
                    const tx = new Transaction().add(createAtaIx);
                    const { blockhash } = await connection.getLatestBlockhash();
                    tx.recentBlockhash = blockhash;
                    tx.feePayer = wallet.publicKey;
                    const signedTx = await wallet.signTransaction(tx);
                    await connection.sendRawTransaction(signedTx.serialize());
                    await connection.confirmTransaction(
                        await connection.sendRawTransaction(
                            signedTx.serialize()
                        ),
                        "confirmed"
                    );
                } catch (e: any) {
                    // Ignore error if account already exists
                    if (!e.message.includes("already in use")) {
                        throw e;
                    }
                }
            }

            // Derive the token vault ATA
            const tokenVaultPDA = await getAssociatedTokenAddress(
                tokenMint,
                tokenVaultAuthorityPDA,
                true // allowOwnerOffCurve
            );

            const tx = await buy({
                connection,
                wallet,
                accounts: {
                    state: statePDA,
                    tokenMint: tokenMint,
                    userTokenAccount: userTokenAccount,
                    user: wallet.publicKey,
                    tokenVault: tokenVaultPDA,
                    mintAuthority: mintAuthorityPDA,
                    tokenVaultAuthority: tokenVaultAuthorityPDA,
                    solVault: solVaultPDA,
                    systemProgram: new PublicKey(
                        "11111111111111111111111111111111"
                    ),
                    tokenProgram: new PublicKey(
                        "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
                    ),
                },
                solAmount: new BN(buyArgs.solAmount),
                minTokensOut: new BN(buyArgs.minTokensOut),
            });

            const confirmation = await connection.confirmTransaction(
                tx,
                "confirmed"
            );
            if (confirmation.value.err) {
                throw new Error("Transaction failed to confirm");
            }

            setResult(
                `✅ Buy successful!\nTransaction: ${tx}\nSOL Amount: ${
                    Number(buyArgs.solAmount) / 1e9
                } SOL\nMin Tokens: ${
                    buyArgs.minTokensOut
                }\nToken Account: ${userTokenAccount.toString()}`
            );
        } catch (e: any) {
            if (e.logs) {
                setError(
                    `Transaction failed: ${e.message}\nLogs:\n${e.logs.join(
                        "\n"
                    )}`
                );
            } else {
                setError(e.message || e.toString());
            }
        } finally {
            setLoading("");
        }
    };
    const handleSell = async () => {
        setResult("");
        setError("");
        setLoading("sell");
        try {
            if (!wallet.publicKey) throw new Error("Wallet not connected");
            if (!wallet.signTransaction)
                throw new Error("Wallet does not support signing");
            if (!mintKeypair && !sellArgs.state) {
                throw new Error(
                    "Please provide either the state address or initialize first"
                );
            }

            const tokenMint = mintKeypair
                ? mintKeypair.publicKey
                : new PublicKey(sellArgs.state);

            // Derive all PDAs with their seeds and bumps
            const [statePDA] = await PublicKey.findProgramAddress(
                [Buffer.from("state")],
                PROGRAM_ID
            );
            const [tokenVaultAuthorityPDA] = await PublicKey.findProgramAddress(
                [Buffer.from("token_vault_authority")],
                PROGRAM_ID
            );
            const [solVaultPDA] = await PublicKey.findProgramAddress(
                [Buffer.from("sol_vault")],
                PROGRAM_ID
            );

            // Get or create user's token account
            let userTokenAccount: PublicKey;
            if (sellArgs.userTokenAccount) {
                userTokenAccount = new PublicKey(sellArgs.userTokenAccount);
            } else {
                userTokenAccount = await getAssociatedTokenAddress(
                    tokenMint,
                    wallet.publicKey
                );
                // Create ATA if it doesn't exist
                try {
                    const createAtaIx = createAssociatedTokenAccountInstruction(
                        wallet.publicKey,
                        userTokenAccount,
                        wallet.publicKey,
                        tokenMint,
                        TOKEN_PROGRAM_ID,
                        ASSOCIATED_TOKEN_PROGRAM_ID
                    );
                    const tx = new Transaction().add(createAtaIx);
                    const { blockhash } = await connection.getLatestBlockhash();
                    tx.recentBlockhash = blockhash;
                    tx.feePayer = wallet.publicKey;
                    const signedTx = await wallet.signTransaction(tx);
                    await connection.sendRawTransaction(signedTx.serialize());
                    await connection.confirmTransaction(
                        await connection.sendRawTransaction(
                            signedTx.serialize()
                        ),
                        "confirmed"
                    );
                } catch (e: any) {
                    // Ignore error if account already exists
                    if (!e.message.includes("already in use")) {
                        throw e;
                    }
                }
            }

            // Derive the token vault ATA
            const tokenVaultPDA = await getAssociatedTokenAddress(
                tokenMint,
                tokenVaultAuthorityPDA,
                true // allowOwnerOffCurve
            );

            const tx = await sell({
                connection,
                wallet,
                accounts: {
                    state: statePDA,
                    tokenMint: tokenMint,
                    userTokenAccount: userTokenAccount,
                    user: wallet.publicKey,
                    tokenVault: tokenVaultPDA,
                    solVault: solVaultPDA,
                    systemProgram: new PublicKey(
                        "11111111111111111111111111111111"
                    ),
                    tokenProgram: new PublicKey(
                        "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
                    ),
                },
                tokenAmount: new BN(sellArgs.tokenAmount),
                minSolOut: new BN(sellArgs.minSolOut),
            });

            const confirmation = await connection.confirmTransaction(
                tx,
                "confirmed"
            );
            if (confirmation.value.err) {
                throw new Error("Transaction failed to confirm");
            }

            setResult(
                `✅ Sell successful!\nTransaction: ${tx}\nToken Amount: ${
                    sellArgs.tokenAmount
                }\nMin SOL: ${
                    Number(sellArgs.minSolOut) / 1e9
                } SOL\nToken Account: ${userTokenAccount.toString()}`
            );
        } catch (e: any) {
            if (e.logs) {
                setError(
                    `Transaction failed: ${e.message}\nLogs:\n${e.logs.join(
                        "\n"
                    )}`
                );
            } else {
                setError(e.message || e.toString());
            }
        } finally {
            setLoading("");
        }
    };
    const handleWithdraw = async () => {
        setResult("");
        setError("");
        setLoading("withdraw");
        try {
            if (!wallet.publicKey) throw new Error("Wallet not connected");
            if (!wallet.signTransaction)
                throw new Error("Wallet does not support signing");
            if (!withdrawArgs.state) {
                throw new Error("Please provide the state address");
            }
            if (!withdrawArgs.destination) {
                throw new Error("Please provide the destination address");
            }

            // Derive PDAs
            const [statePDA] = await PublicKey.findProgramAddress(
                [Buffer.from("state")],
                PROGRAM_ID
            );
            const [solVaultPDA] = await PublicKey.findProgramAddress(
                [Buffer.from("sol_vault")],
                PROGRAM_ID
            );

            const tx = await withdraw({
                connection,
                wallet,
                accounts: {
                    state: statePDA,
                    solVault: solVaultPDA,
                    destination: new PublicKey(withdrawArgs.destination),
                    authority: wallet.publicKey,
                    systemProgram: new PublicKey(
                        "11111111111111111111111111111111"
                    ),
                },
                amount: new BN(withdrawArgs.amount),
            });

            const confirmation = await connection.confirmTransaction(
                tx,
                "confirmed"
            );
            if (confirmation.value.err) {
                throw new Error("Transaction failed to confirm");
            }

            setResult(
                `✅ Withdraw successful!\nTransaction: ${tx}\nAmount: ${
                    Number(withdrawArgs.amount) / 1e9
                } SOL\nDestination: ${withdrawArgs.destination}`
            );
        } catch (e: any) {
            if (e.logs) {
                setError(
                    `Transaction failed: ${e.message}\nLogs:\n${e.logs.join(
                        "\n"
                    )}`
                );
            } else {
                setError(e.message || e.toString());
            }
        } finally {
            setLoading("");
        }
    };

    // Helper function for button text
    const getButtonText = (operation: string) => {
        if (loading === operation) {
            return "Processing...";
        }
        return operation.charAt(0).toUpperCase() + operation.slice(1);
    };

    // UI
    return (
        <div
            style={{
                maxWidth: 800,
                margin: "40px auto",
                overflowY: "auto",
                padding: 24,
                border: "1px solid #eee",
                borderRadius: 12,
                background: "#fafbfc",
            }}
        >
            <h2>Contract Test UI</h2>

            <section style={{ marginBottom: 32 }}>
                <h3>Initialize</h3>
                <div style={{ display: "grid", gap: 16 }}>
                    <div>
                        <InputWithTooltip
                            placeholder="State"
                            value={initArgs.state}
                            onChange={(val) =>
                                setInitArgs((a) => ({ ...a, state: val }))
                            }
                            tooltip="State account address that will be created"
                        />
                        <button
                            style={{
                                marginTop: 8,
                                padding: "4px 8px",
                                fontSize: "0.9em",
                                backgroundColor: "#f0f0f0",
                                border: "1px solid #ddd",
                                borderRadius: 4,
                                cursor: "pointer",
                            }}
                            onClick={autofillStatePDA}
                        >
                            Autofill State PDA
                        </button>
                        <div
                            style={{
                                fontSize: "0.9em",
                                color: "#666",
                                marginTop: 4,
                            }}
                        >
                            Click the button above to autofill the state field
                            with the correct PDA
                        </div>
                    </div>
                    <InputWithTooltip
                        placeholder="Name"
                        value={initArgs.name}
                        onChange={(val) =>
                            setInitArgs((a) => ({ ...a, name: val }))
                        }
                        tooltip="Token name (e.g., 'Test Token')"
                    />
                    <InputWithTooltip
                        placeholder="Symbol"
                        value={initArgs.symbol}
                        onChange={(val) =>
                            setInitArgs((a) => ({ ...a, symbol: val }))
                        }
                        tooltip="Token symbol (e.g., 'TEST')"
                    />
                    <InputWithTooltip
                        placeholder="Decimals"
                        value={initArgs.decimals}
                        onChange={(val) =>
                            setInitArgs((a) => ({
                                ...a,
                                decimals: Number(val),
                            }))
                        }
                        tooltip="Token decimals (usually 6 or 9)"
                        type="number"
                    />
                    <InputWithTooltip
                        placeholder="Total Supply"
                        value={initArgs.totalSupply}
                        onChange={(val) =>
                            setInitArgs((a) => ({ ...a, totalSupply: val }))
                        }
                        tooltip="Total supply in base units (e.g., 1000000000 for 1B tokens)"
                    />
                    <button
                        style={{
                            marginTop: 16,
                            padding: "8px 16px",
                            backgroundColor: "#fff",
                            cursor: "pointer",
                        }}
                        onClick={generateMintKeypair}
                    >
                        Generate Mint Keypair
                    </button>
                    {!mintKeypair && (
                        <div style={{ color: "#b00", fontSize: "0.95em" }}>
                            You must generate a mint keypair before
                            initializing.
                        </div>
                    )}
                </div>
                <button
                    style={{
                        marginTop: 16,
                        padding: "8px 16px",
                        position: "relative",
                        backgroundColor:
                            loading === "initialize" ? "#e0e0e0" : "#fff",
                        cursor:
                            loading === "initialize"
                                ? "not-allowed"
                                : "pointer",
                    }}
                    onClick={handleInitialize}
                    disabled={!wallet.publicKey || loading === "initialize"}
                >
                    {getButtonText("initialize")}
                    {loading === "initialize" && (
                        <div
                            style={{
                                marginLeft: 8,
                                display: "inline-block",
                                animation: "spin 1s linear infinite",
                            }}
                        >
                            ⟳
                        </div>
                    )}
                </button>
            </section>

            <section style={{ marginBottom: 32 }}>
                <h3>Buy</h3>
                <div style={{ display: "grid", gap: 16 }}>
                    <div>
                        <InputWithTooltip
                            placeholder="State"
                            value={buyArgs.state}
                            onChange={(val) =>
                                setBuyArgs((a) => ({ ...a, state: val }))
                            }
                            tooltip="State account address from initialization"
                        />
                        <button
                            style={{
                                marginTop: 8,
                                padding: "4px 8px",
                                fontSize: "0.9em",
                                backgroundColor: "#f0f0f0",
                                border: "1px solid #ddd",
                                borderRadius: 4,
                                cursor: "pointer",
                            }}
                            onClick={async () => {
                                const [pda] =
                                    await PublicKey.findProgramAddress(
                                        [Buffer.from("state")],
                                        PROGRAM_ID
                                    );
                                setBuyArgs((prev) => ({
                                    ...prev,
                                    state: pda.toString(),
                                }));
                            }}
                        >
                            Autofill State PDA
                        </button>
                    </div>
                    <InputWithTooltip
                        placeholder="User Token Account"
                        value={buyArgs.userTokenAccount}
                        onChange={(val) =>
                            setBuyArgs((a) => ({ ...a, userTokenAccount: val }))
                        }
                        tooltip="Your token account to receive purchased tokens (must be an Associated Token Account)"
                    />
                    <InputWithTooltip
                        placeholder="SOL Amount (lamports)"
                        value={buyArgs.solAmount}
                        onChange={(val) =>
                            setBuyArgs((a) => ({ ...a, solAmount: val }))
                        }
                        tooltip="Amount of SOL to spend in lamports (1 SOL = 1000000000 lamports)"
                    />
                    <InputWithTooltip
                        placeholder="Min Tokens Out"
                        value={buyArgs.minTokensOut}
                        onChange={(val) =>
                            setBuyArgs((a) => ({ ...a, minTokensOut: val }))
                        }
                        tooltip="Minimum tokens to receive (slippage protection)"
                    />
                </div>
                <button
                    style={{
                        marginTop: 16,
                        padding: "8px 16px",
                        backgroundColor: loading === "buy" ? "#e0e0e0" : "#fff",
                        cursor: loading === "buy" ? "not-allowed" : "pointer",
                    }}
                    onClick={handleBuy}
                    disabled={!wallet.publicKey || loading === "buy"}
                >
                    {getButtonText("buy")}
                    {loading === "buy" && (
                        <div
                            style={{
                                marginLeft: 8,
                                display: "inline-block",
                                animation: "spin 1s linear infinite",
                            }}
                        >
                            ⟳
                        </div>
                    )}
                </button>
            </section>

            <section style={{ marginBottom: 32 }}>
                <h3>Sell</h3>
                <div style={{ display: "grid", gap: 16 }}>
                    <div>
                        <InputWithTooltip
                            placeholder="State"
                            value={sellArgs.state}
                            onChange={(val) =>
                                setSellArgs((a) => ({ ...a, state: val }))
                            }
                            tooltip="State account address from initialization"
                        />
                        <button
                            style={{
                                marginTop: 8,
                                padding: "4px 8px",
                                fontSize: "0.9em",
                                backgroundColor: "#f0f0f0",
                                border: "1px solid #ddd",
                                borderRadius: 4,
                                cursor: "pointer",
                            }}
                            onClick={async () => {
                                const [pda] =
                                    await PublicKey.findProgramAddress(
                                        [Buffer.from("state")],
                                        PROGRAM_ID
                                    );
                                setSellArgs((prev) => ({
                                    ...prev,
                                    state: pda.toString(),
                                }));
                            }}
                        >
                            Autofill State PDA
                        </button>
                    </div>
                    <InputWithTooltip
                        placeholder="User Token Account"
                        value={sellArgs.userTokenAccount}
                        onChange={(val) =>
                            setSellArgs((a) => ({
                                ...a,
                                userTokenAccount: val,
                            }))
                        }
                        tooltip="Your token account to sell from (must be an Associated Token Account)"
                    />
                    <InputWithTooltip
                        placeholder="Token Amount"
                        value={sellArgs.tokenAmount}
                        onChange={(val) =>
                            setSellArgs((a) => ({ ...a, tokenAmount: val }))
                        }
                        tooltip="Amount of tokens to sell in base units"
                    />
                    <InputWithTooltip
                        placeholder="Min SOL Out"
                        value={sellArgs.minSolOut}
                        onChange={(val) =>
                            setSellArgs((a) => ({ ...a, minSolOut: val }))
                        }
                        tooltip="Minimum SOL to receive in lamports (slippage protection)"
                    />
                </div>
                <button
                    style={{
                        marginTop: 16,
                        padding: "8px 16px",
                        backgroundColor:
                            loading === "sell" ? "#e0e0e0" : "#fff",
                        cursor: loading === "sell" ? "not-allowed" : "pointer",
                    }}
                    onClick={handleSell}
                    disabled={!wallet.publicKey || loading === "sell"}
                >
                    {getButtonText("sell")}
                    {loading === "sell" && (
                        <div
                            style={{
                                marginLeft: 8,
                                display: "inline-block",
                                animation: "spin 1s linear infinite",
                            }}
                        >
                            ⟳
                        </div>
                    )}
                </button>
            </section>

            <section style={{ marginBottom: 32 }}>
                <h3>Withdraw</h3>
                <div style={{ display: "grid", gap: 16 }}>
                    <InputWithTooltip
                        placeholder="State"
                        value={withdrawArgs.state}
                        onChange={(val) =>
                            setWithdrawArgs((a) => ({ ...a, state: val }))
                        }
                        tooltip="State account address"
                    />
                    <InputWithTooltip
                        placeholder="Destination"
                        value={withdrawArgs.destination}
                        onChange={(val) =>
                            setWithdrawArgs((a) => ({ ...a, destination: val }))
                        }
                        tooltip="Address to receive the withdrawn SOL"
                    />
                    <InputWithTooltip
                        placeholder="Amount (lamports)"
                        value={withdrawArgs.amount}
                        onChange={(val) =>
                            setWithdrawArgs((a) => ({ ...a, amount: val }))
                        }
                        tooltip="Amount of SOL to withdraw in lamports"
                    />
                </div>
                <button
                    style={{
                        marginTop: 16,
                        padding: "8px 16px",
                        backgroundColor:
                            loading === "withdraw" ? "#e0e0e0" : "#fff",
                        cursor:
                            loading === "withdraw" ? "not-allowed" : "pointer",
                    }}
                    onClick={handleWithdraw}
                    disabled={!wallet.publicKey || loading === "withdraw"}
                >
                    {getButtonText("withdraw")}
                    {loading === "withdraw" && (
                        <div
                            style={{
                                marginLeft: 8,
                                display: "inline-block",
                                animation: "spin 1s linear infinite",
                            }}
                        >
                            ⟳
                        </div>
                    )}
                </button>
            </section>

            {/* Add loading animation keyframes */}
            <style jsx>{`
                @keyframes spin {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }
            `}</style>

            {(result || error || loading) && (
                <div
                    style={{
                        marginTop: 24,
                        padding: 12,
                        borderRadius: 8,
                        background: error
                            ? "#ffeaea"
                            : loading
                            ? "#fff3cd"
                            : "#eaffea",
                        color: error ? "#b00" : loading ? "#856404" : "#070",
                        whiteSpace: "pre-wrap",
                    }}
                >
                    {loading && !error && !result && (
                        <div>
                            <b>Processing:</b> Please wait while your
                            transaction is being processed...
                        </div>
                    )}
                    {result && (
                        <div>
                            <b>Result:</b> {result}
                        </div>
                    )}
                    {error && (
                        <div>
                            <b>Error:</b> {error}
                        </div>
                    )}
                </div>
            )}

            {!wallet.publicKey && (
                <div
                    style={{
                        marginTop: 24,
                        padding: 12,
                        background: "#fff3cd",
                        borderRadius: 8,
                    }}
                >
                    Please connect your wallet to interact with the contract.
                </div>
            )}
        </div>
    );
};

export default function TestPage() {
    return <TestContract />;
}
