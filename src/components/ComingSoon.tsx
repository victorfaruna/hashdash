import React from "react";

export default function ComingSoon() {
    return (
        <div className="flex flex-col gap-[0.5rem] items-center justify-center">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-[7rem] text-secondary/50"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
            </svg>
            <p className="text-[1rem] text-secondary/70">Coming Soon</p>
        </div>
    );
}
