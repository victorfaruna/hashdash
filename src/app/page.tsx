import CoinList from "@/components/CoinList";
import Header from "@/components/Header";
import Trending from "@/components/Trending";
import React from "react";

export default function Home() {
    return (
        <div className="bg-primary w-full h-full overflow-y-auto py-[2rem] flex flex-col gap-[2rem]">
            <div className="outer px-[var(--main-padding)]">
                <div className="bg-[url(/images/abstract/abstract-1.webp)] bg-cover bg-bottom bg-no-repeat rounded-[0.8rem] overflow-hidden">
                    <div className="size-full p-[1.5rem] bg-primary/80 flex justify-between">
                        <p className="left text-[2rem] font-thin font-poppins text-secondary/90">
                            Fun & real time data
                            <br />
                            with Hash
                            <span className="text-accent/80">Dash</span>
                        </p>
                        <div className="right self-end flex gap-[1rem]">
                            <div className="input-container w-[400px] h-[40px] rounded-[0.5rem] border border-secondary/30 bg-primary/60 flex items-center gap-[0.5rem] pl-[1rem]">
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
                                    type="text"
                                    className="size-full outline-none border-none"
                                    placeholder="Search"
                                />
                            </div>
                            <button className="text-accent cursor-pointer bg-gradient-to-t from-accent/1 to-primary border border-secondary/30 rounded-[0.4rem] w-[120px] h-[40px]">
                                Search
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Trending />
            <CoinList />
        </div>
    );
}
