import CoinList from "@/components/CoinList";
import Trending from "@/components/Trending";
import React from "react";
import LiveSearch from "@/components/LiveSearch";

export default function Home() {
    return (
        <div className="bg-primary w-full h-full overflow-y-auto py-[2rem] flex flex-col gap-[2rem]">
            <div className="outer px-[var(--main-padding)]">
                <div className="bg-[url(/images/abstract/abstract-2.webp)] bg-cover bg-center bg-no-repeat rounded-[0.8rem]">
                    <div className="size-full p-[1.5rem] bg-gradient-to-r from-accent-2/60 to-primary/80 flex justify-between rounded-[0.8rem]">
                        <p className="left text-[1.5rem] font-[100] text-white">
                            Fun & real time data
                            <br />
                            with{" "}
                            <span className="font-bold">
                                Hash
                                <span className="text-accent/80">Dash</span>
                            </span>
                        </p>
                        <LiveSearch />
                    </div>
                </div>
            </div>
            <Trending />
            <CoinList />
        </div>
    );
}
