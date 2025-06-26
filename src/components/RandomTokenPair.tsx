"use client";
import { getTrendingTokens } from "@/services/token";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

export default function RandomTokenPair() {
    const [randomPair, setRandomPair] = useState<any[]>([]);

    const {
        data: trendingData,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["random"],
        queryFn: async () => await getTrendingTokens(),
    });

    useEffect(() => {
        if (isLoading || isError) {
            return;
        }
        if (
            trendingData &&
            Array.isArray(trendingData) &&
            trendingData.length >= 2
        ) {
            // Function to select two random, distinct items
            const pickRandomPair = () => {
                const indices: any = [];
                while (indices.length < 2) {
                    const idx = Math.floor(Math.random() * trendingData.length);
                    if (!indices.includes(idx)) {
                        indices.push(idx);
                    }
                }
                setRandomPair([
                    trendingData[indices[0]],
                    trendingData[indices[1]],
                ]);
            };

            pickRandomPair(); // pick immediately on mount/data load

            const interval = setInterval(() => {
                pickRandomPair();
            }, 500);

            return () => clearInterval(interval);
        }
    }, [trendingData, isLoading, isError]);
    return (
        <div className="left flex gap-[1rem]">
            {!isLoading &&
                !isError &&
                randomPair.length > 0 &&
                randomPair.map((item: any, index: number) => (
                    <div
                        key={index}
                        className={`item border ${
                            index == 0
                                ? "border-[gold]/20"
                                : "border-accent-2/20"
                        } p-[0.3rem] rounded-[0.5rem] flex items-center gap-[1rem] pr-[0.5rem] animate-pulse`}
                    >
                        <div
                            className={`ico size-[1.5rem] rounded-sm ${
                                index == 0 ? "bg-[gold]/20" : "bg-accent-2/20"
                            } flex items-center justify-center`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className={`size-4 ${
                                    index == 0 ? "text-[gold]" : "text-accent-2"
                                }`}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9.348 14.652a3.75 3.75 0 0 1 0-5.304m5.304 0a3.75 3.75 0 0 1 0 5.304m-7.425 2.121a6.75 6.75 0 0 1 0-9.546m9.546 0a6.75 6.75 0 0 1 0 9.546M5.106 18.894c-3.808-3.807-3.808-9.98 0-13.788m13.788 0c3.808 3.807 3.808 9.98 0 13.788M12 12h.008v.008H12V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                                />
                            </svg>
                        </div>
                        <p className="text-[0.7rem] text-secondary/90">
                            {item.name} ({item.symbol}) |{" "}
                            <span className="text-accent">
                                market cap: ${item.market_cap}
                            </span>
                        </p>
                    </div>
                ))}
        </div>
    );
}
