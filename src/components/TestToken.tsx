"use client";
import { VersionedTransaction, Connection, Keypair } from "@solana/web3.js";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useState } from "react";

// Component for creating tokens with connected wallet
export default function TokenCreator() {
    const { publicKey, signTransaction, connected } = useWallet();
    const { connection } = useConnection();
    const [isCreating, setIsCreating] = useState(false);
    const [tokenData, setTokenData] = useState<any>({
        name: "",
        symbol: "",
        description: "",
        image: null,
        twitter: "",
        telegram: "",
        website: "",
        buyAmount: 1,
        slippage: 10,
    });

    async function createTokenWithConnectedWallet() {
        if (!connected || !publicKey || !signTransaction) {
            alert("Please connect your wallet first");
            return;
        }

        setIsCreating(true);

        try {
            // Generate a random keypair for the mint (token)
            const mintKeypair = Keypair.generate();

            // Prepare metadata for IPFS
            const formData = new FormData();
            formData.append("file", tokenData.image);
            formData.append("name", tokenData.name);
            formData.append("symbol", tokenData.symbol);
            formData.append("description", tokenData.description);
            formData.append("twitter", tokenData.twitter);
            formData.append("telegram", tokenData.telegram);
            formData.append("website", tokenData.website);
            formData.append("showName", "true");

            // Upload metadata to IPFS
            const metadataResponse = await fetch("https://pump.fun/api/ipfs", {
                method: "POST",
                body: formData,
            });

            if (!metadataResponse.ok) {
                throw new Error("Failed to upload metadata");
            }

            const metadataResponseJSON = await metadataResponse.json();

            // Get the create transaction from PumpPortal
            const response = await fetch(
                `https://pumpportal.fun/api/trade-local`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        publicKey: publicKey.toBase58(), // Use connected wallet's public key
                        action: "create",
                        tokenMetadata: {
                            name: metadataResponseJSON.metadata.name,
                            symbol: metadataResponseJSON.metadata.symbol,
                            uri: metadataResponseJSON.metadataUri,
                        },
                        mint: mintKeypair.publicKey.toBase58(),
                        denominatedInSol: "true",
                        amount: tokenData.buyAmount,
                        slippage: tokenData.slippage,
                        priorityFee: 0.0005,
                        pool: "pump",
                    }),
                }
            );

            if (response.status === 200) {
                const data = await response.arrayBuffer();
                const tx = VersionedTransaction.deserialize(
                    new Uint8Array(data)
                );

                // Sign with mint keypair first (partial signing)
                tx.sign([mintKeypair]);

                // Then sign with user's wallet
                const signedTx = await signTransaction(tx);

                // Send the transaction
                const signature = await connection.sendTransaction(signedTx);

                console.log("Transaction: https://solscan.io/tx/" + signature);
                alert(`Token created successfully! Signature: ${signature}`);
            } else {
                const errorText = await response.text();
                throw new Error(
                    `Failed to create transaction: ${response.statusText} - ${errorText}`
                );
            }
        } catch (error: Error | any) {
            console.error("Error creating token:", error);
            alert(`Error: ${error.message}`);
        } finally {
            setIsCreating(false);
        }
    }

    const handleImageChange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            setTokenData((prev: any) => ({ ...prev, image: file }));
        }
    };

    if (!connected) {
        return (
            <div className="p-4">
                <h2 className="text-xl font-bold mb-4">Create Token</h2>
                <p>Please connect your wallet to create a token.</p>
            </div>
        );
    }

    return (
        <div className="p-4 max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Create Your Token</h2>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">
                        Token Name
                    </label>
                    <input
                        type="text"
                        value={tokenData.name}
                        onChange={(e) =>
                            setTokenData((prev: any) => ({
                                ...prev,
                                name: e.target.value,
                            }))
                        }
                        className="w-full p-2 border rounded"
                        placeholder="My Awesome Token"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">
                        Symbol
                    </label>
                    <input
                        type="text"
                        value={tokenData.symbol}
                        onChange={(e) =>
                            setTokenData((prev: any) => ({
                                ...prev,
                                symbol: e.target.value,
                            }))
                        }
                        className="w-full p-2 border rounded"
                        placeholder="MAT"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">
                        Description
                    </label>
                    <textarea
                        value={tokenData.description}
                        onChange={(e) =>
                            setTokenData((prev: any) => ({
                                ...prev,
                                description: e.target.value,
                            }))
                        }
                        className="w-full p-2 border rounded"
                        placeholder="Describe your token..."
                        rows={3}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">
                        Token Image
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">
                        Twitter (optional)
                    </label>
                    <input
                        type="url"
                        value={tokenData.twitter}
                        onChange={(e) =>
                            setTokenData((prev: any) => ({
                                ...prev,
                                twitter: e.target.value,
                            }))
                        }
                        className="w-full p-2 border rounded"
                        placeholder="https://twitter.com/yourhandle"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">
                        Initial Buy Amount (SOL)
                    </label>
                    <input
                        type="number"
                        value={tokenData.buyAmount}
                        onChange={(e) =>
                            setTokenData((prev: any) => ({
                                ...prev,
                                buyAmount: parseFloat(e.target.value),
                            }))
                        }
                        className="w-full p-2 border rounded"
                        min="0.1"
                        step="0.1"
                    />
                </div>

                <button
                    onClick={createTokenWithConnectedWallet}
                    disabled={
                        isCreating ||
                        !tokenData.name ||
                        !tokenData.symbol ||
                        !tokenData.image
                    }
                    className="w-full bg-blue-500 text-white p-3 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isCreating ? "Creating Token..." : "Create Token"}
                </button>
            </div>

            <div className="mt-4 text-xs text-gray-600">
                <p>Connected: {publicKey?.toBase58()}</p>
            </div>
        </div>
    );
}
