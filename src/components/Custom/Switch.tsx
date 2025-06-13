"use client";
import React, { useState } from "react";

export default function Switch() {
    const [checked, setChecked] = useState(false);
    return (
        <button
            onClick={() => setChecked(!checked)}
            className="cursor-pointer w-[48px] h-[24px] rounded-full border border-secondary/40 flex items-center px-[3.2px] overflow-hidden"
        >
            <div
                className={`transition-all duration-[0.1s] ease-in-out thumb size-[16px] bg-secondary rounded-full ${
                    checked ? "translate-x-[24px]" : "translate-x-[0]"
                }`}
            ></div>
        </button>
    );
}
