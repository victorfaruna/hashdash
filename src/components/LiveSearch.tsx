"use client";
import { searchTokens } from "@/services/token";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

export default function LiveSearch() {
    const [search, setSearch] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [searchResults, setSearchResults] = useState<any>([]);
    const router = useRouter();

    useEffect(() => {
        async function searchCoins() {
            try {
                setIsLoading(true);
                if (search.length > 0) {
                    const results = await searchTokens(search);
                    setSearchResults(results);
                } else {
                    setSearchResults([]);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        }
        searchCoins();
    }, [search]);
    return (
        <div className="flex self-end gap-[1rem]">
            <div className="dropdown dropdown-center">
                <div className="input-container w-[400px] h-[38px] rounded-[0.5rem] border border-secondary/30 bg-primary/80 flex items-center gap-[0.5rem] pl-[1rem]">
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
                            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                        />
                    </svg>

                    <input
                        tabIndex={0}
                        onChange={(e) => setSearch(e.target.value)}
                        type="text"
                        className="size-full outline-none border-none"
                        placeholder="Search coin..."
                    />
                </div>
                <div
                    tabIndex={0}
                    className={`dropdown-content overflow-y-auto w-full flex flex-col gap-[1rem] bg-primary mt-[0.5rem] p-[1rem] rounded-[0.5rem] max-h-[500px] border border-secondary/30`}
                >
                    {isLoading &&
                        Array.from({ length: 5 }).map((_, i) => (
                            <div
                                style={{ flex: "0 0 auto" }}
                                key={i}
                                className="item w-full flex p-[0.4rem] gap-[0.5rem]"
                            >
                                <div className="skeleton size-[50px] rounded-[0.5rem]"></div>
                                <div className="flex flex-col gap-[0.5rem] pt-1">
                                    <p className="skeleton w-[100px] h-[10px]"></p>
                                    <p className="skeleton w-[70px] rounded-1 h-[10px]"></p>
                                </div>
                            </div>
                        ))}
                    {!isLoading && searchResults.length === 0 && "No results"}
                    {!isLoading &&
                        searchResults.length > 0 &&
                        searchResults.map((item: any, index: number) => (
                            <div
                                onClick={() =>
                                    router.push(`/coin/${item.mint_address}`)
                                }
                                style={{ flex: "0 0 auto" }}
                                key={index}
                                className="item w-full flex p-[0.4rem] gap-[0.5rem] cursor-pointer"
                            >
                                <div className="size-[50px] rounded-[0.5rem] overflow-hidden bg-secondary/40">
                                    <Image
                                        className="size-full object-cover"
                                        src={item.image}
                                        width={50}
                                        height={50}
                                        alt=""
                                    />
                                </div>
                                <div className="flex flex-col gap-[0.5rem] pt-[0.1rem]">
                                    <p className="">{item.name}</p>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
            <button className="text-accent cursor-pointer bg-gradient-to-t from-accent/10 to-primary border border-secondary/30 rounded-[0.4rem] w-[120px] h-[38px]">
                Search
            </button>
        </div>
    );
}
