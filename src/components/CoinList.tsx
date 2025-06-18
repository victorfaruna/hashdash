import Image from "next/image";
import React from "react";
import Switch from "./Custom/Switch";

export default function CoinList() {
    const COIN_LIST_DATA = [
        {
            name: "Ashpunk",
            symbol: "ASH",
            image: "/images/coins/coin-1.webp",
            price: 10000,
            volume: 10000,
            change: 100,
        },
        {
            name: "Streamy",
            symbol: "STR",
            image: "/images/coins/coin-2.webp",
            price: 10000,
            volume: 10000,
            change: 100,
        },
        {
            name: "Voltrom Is Back",
            symbol: "VOLT",
            image: "/images/coins/coin-3.webp",
            price: 10000,
            volume: 10000,
            change: 100,
        },
        {
            name: "Dello",
            symbol: "DLO",
            image: "/images/coins/coin-4.webp",
            price: 10000,
            volume: 10000,
            change: 100,
        },
        {
            name: "Ashpunk",
            symbol: "ASH",
            image: "/images/coins/coin-1.webp",
            price: 10000,
            volume: 10000,
            change: 100,
        },
        {
            name: "Streamy",
            symbol: "STR",
            image: "/images/coins/coin-2.webp",
            price: 10000,
            volume: 10000,
            change: 100,
        },
        {
            name: "Voltrom Is Back",
            symbol: "VOLT",
            image: "/images/coins/coin-3.webp",
            price: 10000,
            volume: 10000,
            change: 100,
        },
        {
            name: "Dello",
            symbol: "DLO",
            image: "/images/coins/coin-4.webp",
            price: 10000,
            volume: 10000,
            change: 100,
        },
        {
            name: "Ashpunk",
            symbol: "ASH",
            image: "/images/coins/coin-1.webp",
            price: 10000,
            volume: 10000,
            change: 100,
        },
        {
            name: "Streamy",
            symbol: "STR",
            image: "/images/coins/coin-2.webp",
            price: 10000,
            volume: 10000,
            change: 100,
        },
        {
            name: "Voltrom Is Back",
            symbol: "VOLT",
            image: "/images/coins/coin-3.webp",
            price: 10000,
            volume: 10000,
            change: 100,
        },
        {
            name: "Dello",
            symbol: "DLO",
            image: "/images/coins/coin-4.webp",
            price: 10000,
            volume: 10000,
            change: 100,
        },
        {
            name: "Ashpunk",
            symbol: "ASH",
            image: "/images/coins/coin-1.webp",
            price: 10000,
            volume: 10000,
            change: 100,
        },
        {
            name: "Streamy",
            symbol: "STR",
            image: "/images/coins/coin-2.webp",
            price: 10000,
            volume: 10000,
            change: 100,
        },
        {
            name: "Voltrom Is Back",
            symbol: "VOLT",
            image: "/images/coins/coin-3.webp",
            price: 10000,
            volume: 10000,
            change: 100,
        },
        {
            name: "Dello",
            symbol: "DLO",
            image: "/images/coins/coin-4.webp",
            price: 10000,
            volume: 10000,
            change: 100,
        },
    ];
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
                {COIN_LIST_DATA.map((item, index) => (
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
                                    Dev sells on stream, falls out if chair,
                                    trenches take over
                                </p>
                            </div>
                        </div>
                        <div className="border border-secondary/10" />
                        <div className="bottom flex items-center justify-between text-[11] text-secondary/60">
                            <p>replies: 543</p>
                            <p className="text-accent/60">market cap: $2.1M</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
