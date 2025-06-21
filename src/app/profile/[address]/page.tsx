"use client";
import { fetchUser } from "@/services/user";
import { useQuery } from "@tanstack/react-query";
import Avatar from "boring-avatars";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function ProfilePage() {
    //...
    const { address } = useParams();

    //State...
    const [wallet_address, setWalletAddress] = useState(address as string);

    //Query...
    const { data, refetch, isLoading } = useQuery({
        queryKey: ["fetch_user", wallet_address],
        queryFn: async () => fetchUser(wallet_address),
    });

    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="inner size-full flex h-full">
                <div className="main w-[65%] border-r border-secondary/10">
                    {isLoading ? (
                        <div className="skeleton w-full h-[120px] rounded-0"></div>
                    ) : (
                        <div className="banner w-full h-[120px] bg-gradient-to-r from-accent-2/60 to-primary" />
                    )}
                    <div className="page px-[1rem]">
                        <div className="pfp py-[1rem] h-[90px] flex justify-between items-start">
                            {isLoading ? (
                                <div className="loader skeleton size-[120px] translate-y-[-45%] border-3 border-primary rounded-full"></div>
                            ) : (
                                <Avatar
                                    size={120}
                                    name={wallet_address}
                                    variant="beam"
                                    className="pfp translate-y-[-50%] border-3 border-primary rounded-full"
                                />
                            )}

                            <div className="far-right flex gap-2 items-center">
                                <button className="px-[0.5rem] py-[0.5rem] rounded-[1.5rem] border border-secondary/30 cursor-pointer">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="size-4"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                                        />
                                    </svg>
                                </button>

                                <button className="px-[1rem] py-[0.5rem] rounded-[1.5rem] border border-secondary/30 cursor-pointer">
                                    Edit profile
                                </button>
                            </div>
                        </div>
                        <div>
                            {isLoading ? (
                                <div className="flex flex-col gap-[0.5rem] items-start">
                                    <div className="skeleton w-[200px] h-[12px] rounded-[2px]"></div>
                                    <div className="skeleton w-[150px] h-[14px] rounded-[2px]"></div>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-[0.5rem] items-start">
                                    <p className="text-[1rem] font-semibold">
                                        <span className="font-thin text-secondary/50">
                                            @
                                        </span>{" "}
                                        {data.username}
                                    </p>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard
                                                .writeText(
                                                    data.wallet_address as unknown as string
                                                )
                                                .then(() =>
                                                    alert(
                                                        "Copied to clipboard!"
                                                    )
                                                )
                                                .catch((err) =>
                                                    alert("Copy failed: " + err)
                                                );
                                        }}
                                        className="bg-secondary/15 rounded-[2px] px-[0.8rem] py-[0.2rem] text-[0.7rem] text-secondary/70 cursor-pointer"
                                    >
                                        {data.wallet_address
                                            ?.toString()
                                            .slice(0, 5) +
                                            " · · · " +
                                            data.wallet_address
                                                ?.toString()
                                                .slice(-5)}
                                        {"   "}
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
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="side flex-[1]"></div>
            </div>
        </div>
    );
}
