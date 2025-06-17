"use client";
import Image from "next/image";
import React from "react";

const TRENDING_DATA = [
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

export default function Trending() {
    const SCROLL_AMOUNT = 220;
    let scroller = React.useRef<any>(null);

    const handleNext = () => {
        scroller?.current?.scrollBy({
            left: SCROLL_AMOUNT,
            behavior: "smooth",
        });
    };

    const handlePrev = () => {
        scroller?.current?.scrollBy({
            left: -SCROLL_AMOUNT,
            behavior: "smooth",
        });
    };
    return (
        <section className="w-full pl-[var(--main-padding)] flex flex-col gap-[1rem] border-b border-secondary/10 pb-[var(--main-padding)]">
            <div className="heading flex items-center justify-between pr-[var(--main-padding)]">
                <p>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-5 inline text-red-600"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
                        />
                    </svg>{" "}
                    Now Trending
                </p>

                <div className="navigators flex  items-center gap-[1rem]">
                    <button
                        onClick={handlePrev}
                        aria-label="scroll left"
                        className="cursor-pointer border rounded-full border-secondary/20 size-[1.7rem] flex items-center justify-center"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-4 text-accent"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.75 19.5 8.25 12l7.5-7.5"
                            />
                        </svg>
                    </button>
                    <button
                        onClick={handleNext}
                        aria-label="scroll right"
                        className="cursor-pointer border rounded-full border-secondary/20 size-[1.7rem] flex items-center justify-center"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-4 text-accent"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m8.25 4.5 7.5 7.5-7.5 7.5"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="scroller w-full overflow-hidden relative">
                <div
                    className="inner flex w-full whitespace-nowrap gap-[var(--main-padding)] overflow-x-auto no-scrollbar"
                    ref={scroller}
                >
                    {TRENDING_DATA.map((item, index) => (
                        <div
                            style={{ flex: "0 0 auto" }}
                            key={index}
                            className="item w-[400px] rounded-[1rem] bg-tetiary/15 p-[0.8rem] flex flex-col gap-[1rem]"
                        >
                            <div className="top w-full flex gap-[1rem] items-center">
                                <div className="image flex-shrink-0 size-[80px] bg-secondary/40 rounded-[0.8rem] overflow-hidden">
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
                                <p className="text-accent/60">
                                    market cap: $2.1M
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="fader absolute z-[10] w-[150px] h-full right-0 top-0 bg-gradient-to-r from-transparent to-primary"></div>
            </div>
        </section>
    );
}
