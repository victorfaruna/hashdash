"use client";
import Image from "next/image";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getTokens } from "@/services/token";

type CoinListData = {
    name: string;
    symbol: string;
    image: string;
    description: string;
    reply_count: number;
};

export default function CoinList() {
    const { data: coinListData, isLoading } = useQuery({
        queryKey: ["coin_list"],
        queryFn: async () => await getTokens(),
    });
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
                className="list grid gap-[var(--main-padding)]"
                style={{
                    gridTemplateColumns:
                        "repeat(auto-fill, minmax(400px, 1fr))",
                }}
            >
                {isLoading &&
                    Array.from({ length: 20 }).map((_, i) => (
                        <div
                            style={{ flex: "0 0 auto" }}
                            key={i}
                            className="item w-[400px] skeleton h-[150px] rounded-[1rem] bg-tetiary/7 p-[0.8rem] flex flex-col gap-[1rem]"
                        ></div>
                    ))}
                {!isLoading &&
                    coinListData.map((item: CoinListData, index: number) => (
                        <div
                            style={{ flex: "0 0 auto" }}
                            key={index}
                            className="item w-full rounded-[1rem] bg-secondary/1 border border-secondary/10 p-[0.8rem] flex flex-col gap-[1rem]"
                        >
                            <div className="top w-full flex gap-[1rem] items-center">
                                <div className="image flex-shrink-0 size-[100px] bg-secondary/40 rounded-[0.8rem] overflow-hidden">
                                    <Image
                                        src={`${
                                            item.image
                                                ? item.image
                                                : "/images/coins/coin-1.webp"
                                        }`}
                                        width={100}
                                        className="size-full object-cover"
                                        height={100}
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
                            <div className="border border-secondary/10" />
                            <div className="bottom flex items-center justify-between text-[11] text-secondary/60">
                                <p>replies: {item.reply_count}</p>
                                <p className="text-accent/60">
                                    market cap: $2.1M
                                </p>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}
