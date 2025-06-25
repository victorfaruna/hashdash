"use client";
import React from "react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "@/services/auth";
import { useAuthStore } from "@/store/auth";

export default function Header() {
    const [isConnected, setIsConnected] = React.useState(false);
    const setAuth = useAuthStore((state) => state.setAuth);
    const { setVisible } = useWalletModal();
    const { publicKey, disconnect } = useWallet();

    React.useEffect(() => {
        if (publicKey) {
            setIsConnected(true);
            async function loginUser() {
                await login(publicKey!.toString());
            }
            loginUser();
        } else {
            setIsConnected(false);
            setAuth(false, "", "");
        }
    }, [publicKey]);

    //Connection button........
    const handleConnect = () => {
        if (isConnected) return;
        setVisible(true);
    };

    const handleDisconnect = () => {
        disconnect();
        setAuth(false, "", "");
    };

    const router = useRouter();
    return (
        <header className="h-[80px] w-full flex-shrink-0 flex items-center justify-between px-[var(--main-padding)] border-b border-secondary/10">
            <div className="left flex gap-[1rem]">
                <div className="item border border-[gold]/20 p-[0.3rem] rounded-[0.5rem] flex items-center gap-[1rem]">
                    <div className="ico size-[1.5rem] rounded-sm bg-[gold]/20 flex items-center justify-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-4 text-[gold]"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9.348 14.652a3.75 3.75 0 0 1 0-5.304m5.304 0a3.75 3.75 0 0 1 0 5.304m-7.425 2.121a6.75 6.75 0 0 1 0-9.546m9.546 0a6.75 6.75 0 0 1 0 9.546M5.106 18.894c-3.808-3.807-3.808-9.98 0-13.788m13.788 0c3.808 3.807 3.808 9.98 0 13.788M12 12h.008v.008H12V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                            />
                        </svg>
                    </div>
                    <p className="text-[0.7rem] text-secondary/90">
                        Mog guy (MGGUY) |{" "}
                        <span className="text-accent">market cap: $2,320</span>
                    </p>
                </div>

                <div className="item border border-[hotpink]/20 p-[0.3rem] rounded-[0.5rem] flex items-center gap-[1rem]">
                    <div className="ico size-[1.5rem] rounded-sm bg-[hotgold]/20 flex items-center justify-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-4 text-[hotpink]"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9.348 14.652a3.75 3.75 0 0 1 0-5.304m5.304 0a3.75 3.75 0 0 1 0 5.304m-7.425 2.121a6.75 6.75 0 0 1 0-9.546m9.546 0a6.75 6.75 0 0 1 0 9.546M5.106 18.894c-3.808-3.807-3.808-9.98 0-13.788m13.788 0c3.808 3.807 3.808 9.98 0 13.788M12 12h.008v.008H12V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                            />
                        </svg>
                    </div>
                    <p className="text-[0.7rem] text-secondary/90">
                        Thedog.fun (THEDOG) |{" "}
                        <span className="text-accent">market cap: $4,140</span>
                    </p>
                </div>
            </div>
            <div className="right flex gap-[1rem]">
                <button
                    onClick={() => {
                        if (!isConnected) {
                            handleConnect();
                            return;
                        }
                        router.push("/launch");
                    }}
                    className="py-[0.4rem] cursor-pointer px-[1rem] rounded-[0.5rem] bg-gradient-to-t from-accent/10 to-primary border border-accent/15 text-accent"
                >
                    Create new coin
                </button>

                {!isConnected && (
                    <button
                        onClick={handleConnect}
                        className={`py-[0.4rem] cursor-pointer px-[1rem] rounded-[0.5rem] bg-accent text-primary border border-accent/15 flex items-center gap-2`}
                    >
                        Log in
                    </button>
                )}
                {isConnected && (
                    <div className={`dropdown dropdown-end`}>
                        <button
                            tabIndex={0}
                            role="button"
                            className={`py-[0.4rem] cursor-pointer px-[1rem] rounded-[0.5rem] bg-accent text-primary border border-accent/15 flex items-center gap-2`}
                            popoverTarget="popover-1"
                            style={
                                {
                                    anchorName: "--anchor-1",
                                } as React.CSSProperties
                            }
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="2.5"
                                stroke="currentColor"
                                className="size-4"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m21 7.5-2.25-1.313M21 7.5v2.25m0-2.25-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3 2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75 2.25-1.313M12 21.75V19.5m0 2.25-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25"
                                />
                            </svg>

                            {publicKey?.toString().slice(0, 5) +
                                " · · · " +
                                publicKey?.toString().slice(-5)}

                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                stroke="currentColor"
                                className="size-4"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                                />
                            </svg>
                        </button>
                        <ul
                            tabIndex={0}
                            className={`dropdown-content flex flex-col gap-[1rem] items-end bg-primary rounded-[0.5rem] p-[1rem] border border-secondary/30 shadow-lg w-[200px] mt-[0.5rem]  ${
                                !isConnected && "hidden"
                            }`}
                        >
                            <button
                                onClick={() => {
                                    navigator.clipboard
                                        .writeText(
                                            publicKey as unknown as string
                                        )
                                        .then(() =>
                                            alert("Copied to clipboard!")
                                        )
                                        .catch((err) =>
                                            alert("Copy failed: " + err)
                                        );
                                }}
                                className="cursor-pointer"
                            >
                                copy{" "}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="size-4 inline"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5A3.375 3.375 0 0 0 6.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0 0 15 2.25h-1.5a2.251 2.251 0 0 0-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 0 0-9-9Z"
                                    />
                                </svg>
                            </button>
                            <li>
                                <Link
                                    href={`/profile/${publicKey?.toString()}`}
                                >
                                    Profile
                                </Link>
                            </li>

                            <li>
                                <Link href={"/"}>My Wallet</Link>
                            </li>
                            <div className="w-full border-b border-secondary/20"></div>
                            <button
                                onClick={handleDisconnect}
                                className="text-accent-2 cursor-pointer"
                            >
                                Log Out
                            </button>
                        </ul>
                    </div>
                )}
            </div>
        </header>
    );
}
