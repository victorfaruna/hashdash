"use client";
import Image from "next/image";
import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTokens } from "@/services/token";

type CoinListData = {
    name: string;
    symbol: string;
    image: string;
    description: string;
    reply_count: number;
    market_cap: number;
};

export default function CoinList() {
    const [coinListData, setCoinListData] = React.useState<any[]>([]);

    //fetch data............
    const {
        data: coinListDataRaw,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["coin_list"],
        queryFn: async () => await getTokens(),
    });

    // Shuffle logic...
    function shuffleArray<T>(array: T[]): T[] {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    useEffect(() => {
        if (!coinListDataRaw) {
            setCoinListData([]);
            return;
        }
        // Shuffle immediately on data load
        setCoinListData(shuffleArray(coinListDataRaw));

        // Set up interval to reshuffle every 1 second
        const interval = setInterval(() => {
            setCoinListData(shuffleArray(coinListDataRaw));
        }, 2000);

        return () => clearInterval(interval);
    }, [coinListDataRaw]);

    return (
        <div className="px-[var(--main-padding)] w-full flex flex-col gap-[var(--main-padding)]">
            <div className="heading">
                <div className="left flex gap-[2rem] items-center">
                    <div className="div flex items-center gap-[1rem]">
                        {/* <Switch /> */}
                        <input
                            type="checkbox"
                            defaultChecked={false}
                            className="toggle"
                        />
                        <p>Show Animations</p>
                    </div>
                    <div className="div flex items-center gap-[1rem]">
                        {/* <Switch /> */}
                        <input
                            type="checkbox"
                            defaultChecked={false}
                            className="toggle"
                        />
                        <p>Include NSFW</p>
                    </div>
                </div>
                <div className="right"></div>
            </div>
            <div
                className="list grid gap-[1rem]"
                style={{
                    gridTemplateColumns:
                        "repeat(auto-fill, minmax(330px, 1fr))",
                }}
            >
                {(isLoading || isError) &&
                    Array.from({ length: 20 }).map((_, i) => (
                        <div
                            style={{ flex: "0 0 auto" }}
                            key={i}
                            className="item w-full flex gap-[1rem] p-[0.8rem] gap-[1rem]"
                        >
                            <div className="skeleton size-[90px] rounded-[0.8rem]"></div>
                            <div className="flex flex-col gap-[0.5rem]">
                                <p className="skeleton w-[170px] h-[15px]"></p>
                                <p className="skeleton w-[130px] h-[15px]"></p>
                                <p className="skeleton w-[100px] h-[10px]"></p>
                            </div>
                        </div>
                    ))}
                {!isLoading &&
                    !isError &&
                    coinListData.map((item: CoinListData, index: number) => (
                        <div
                            style={{ flex: "0 0 auto" }}
                            key={index}
                            className="item w-full rounded-[1rem] bg-secondary/1 border border-secondary/10 p-[0.8rem] flex flex-col gap-[1rem]"
                        >
                            <div className="top w-full flex gap-[1rem] items-center">
                                <div className="image flex-shrink-0 size-[90px] bg-secondary/40 rounded-[0.8rem] overflow-hidden">
                                    <Image
                                        src={`${
                                            item.image
                                                ? item.image
                                                : "/images/coins/coin-1.webp"
                                        }`}
                                        width={90}
                                        className="size-full object-cover"
                                        height={90}
                                        alt=""
                                    />
                                </div>
                                <div className="info w-full overflow-hidden h-full flex flex-col justify-start gap-[0.3rem] ">
                                    <p className="text-[15px] text-wrap">
                                        {item.name} ({item.symbol})
                                    </p>
                                    <p className=" desc text-[0.7rem] text-secondary/70 text-wrap">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                            <div className="border-b border-secondary/10" />
                            <div className="bottom flex items-center justify-between text-[11px] text-secondary/60">
                                <p>replies: {item.reply_count}</p>
                                <p className="text-accent/60">
                                    market cap: ${item.market_cap}
                                </p>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}
