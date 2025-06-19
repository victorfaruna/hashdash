"use client";
import React, { useRef, useState } from "react";

export default function LiveSearch() {
    return (
        <div className="flex self-end gap-[1rem]">
            <div className="dropdown dropdown-center">
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
                        tabIndex={0}
                        type="text"
                        className="size-full outline-none border-none"
                        placeholder="Search coin..."
                    />
                </div>
                <div
                    tabIndex={0}
                    className={`dropdown-content w-full bg-primary mt-[0.5rem] rounded-[0.5rem] h-[200px] border border-secondary/30`}
                ></div>
            </div>
            <button className="text-accent cursor-pointer bg-gradient-to-t from-accent/1 to-primary border border-secondary/30 rounded-[0.4rem] w-[120px] h-[40px]">
                Search
            </button>
        </div>
    );
}
