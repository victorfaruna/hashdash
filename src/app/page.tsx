import CoinList from "@/components/CoinList";
import Trending from "@/components/Trending";
import React from "react";
import LiveSearch from "@/components/LiveSearch";

export default function Home() {
    return (
        <div className="bg-primary w-full h-full overflow-y-auto py-[2rem] flex flex-col gap-[2rem]">
            <div className="outer px-[var(--main-padding)]">
                <div className="bg-[url(/images/abstract/abstract-5.webp)] bg-cover bg-center bg-no-repeat rounded-[0.8rem]">
                    <div className="size-full p-[1.5rem] bg-primary/60 flex justify-between">
                        <p className="left text-[2rem] font-[200] text-secondary">
                            Fun & real time data
                            <br />
                            with Hash
                            <span className="text-accent/80">Dash</span>
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
