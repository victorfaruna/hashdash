"use client";
import ProgressIndicator from "@/components/Custom/ProgressIndicator";
import React from "react";

export default function LaunchPage() {
    const handleNext = (event: any) => {
        event.preventDefault();
        console.log("next");
    };
    return (
        <div className="p-[var(--main-padding)] w-full h-full flex items-center justify-center">
            <div className="inner size-full flex flex-col gap-[2rem]">
                <p className="text-[1.5rem] font-bold">Create New Coin ⚡</p>
                <ProgressIndicator progressCount={4} currentProgress={1} />
                <form
                    onSubmit={handleNext}
                    action=""
                    className="flex flex-col gap-[1.5rem] w-[600px]"
                >
                    <div className="flex gap-[1rem] w-full">
                        <div className="item flex-[1]">
                            <label htmlFor="">Coin Name</label>
                            <div className=" h-[40px] border border-secondary/30 rounded-[0.5rem] px-[1rem]">
                                <input
                                    type="text"
                                    placeholder="Name of your coin"
                                    className="size-full outline-none border-none"
                                />
                            </div>
                        </div>
                        <div className="item flex-[1]">
                            <label htmlFor="">Ticker</label>
                            <div className=" h-[40px] border border-secondary/30 rounded-[0.5rem] px-[1rem]">
                                <input
                                    type="text"
                                    placeholder="Coin ticker e.g SOL"
                                    className="size-full outline-none border-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="item flex-[1]">
                        <label htmlFor="">Description</label>
                        <div className=" h-[200px] border border-secondary/30 rounded-[0.5rem] p-[1rem]">
                            <textarea
                                placeholder="Write a short description"
                                className="size-full outline-none border-none"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="self-start px-[3rem] h-[40px] rounded-[0.5rem] bg-secondary/100 text-primary font-medium cursor-pointer"
                    >
                        Continue{" "}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            className="size-5 inline"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                            />
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    );
}
