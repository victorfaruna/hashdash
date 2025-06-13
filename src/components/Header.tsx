import React from "react";

export default function Header() {
    return (
        <header className="h-[80px] flex-[1] flex items-center justify-between px-[var(--main-padding)] border-b border-secondary/10">
            <div className="left"></div>
            <div className="right flex gap-[1rem]">
                <button className="py-[0.4rem] cursor-pointer px-[1rem] rounded-[0.5rem] bg-gradient-to-t from-accent/10 to-primary border border-accent/15 text-accent">
                    Create new coin
                </button>
                <button className="py-[0.4rem] cursor-pointer px-[1rem] rounded-[0.5rem] bg-accent text-primary border border-accent/15">
                    Log in
                </button>
            </div>
        </header>
    );
}
