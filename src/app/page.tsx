import CoinList from "@/components/CoinList";
import Header from "@/components/Header";
import Trending from "@/components/Trending";
import React from "react";

export default function Home() {
    return (
        <div className="bg-primary w-full h-full overflow-y-auto py-[2rem] flex flex-col gap-[2rem]">
            <div className="outer px-[var(--main-padding)]">
                <div className="bg-[url(/images/abstract/abstract-1.webp)] bg-cover bg-bottom bg-no-repeat rounded-[0.8rem] overflow-hidden">
                    <div className="size-full p-[1.5rem] bg-primary/70">
                        <p className="text-[2rem] font-thin font-poppins text-secondary/90">
                            Fun & real time graph
                            <br />
                            with Hash
                            <span className="text-accent/80">Dash</span>
                        </p>
                    </div>
                </div>
            </div>
            <Trending />
            <CoinList />
        </div>
    );
}
