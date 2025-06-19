"use client";
import ProgressIndicator from "@/components/Custom/ProgressIndicator";
import { useRouter, useSearchParams } from "next/navigation";
import React, { use, useEffect, useState } from "react";

export default function LaunchPage() {
    const router = useRouter();
    const currentStep: number | string = useSearchParams().get("step") || 1;
    useEffect(() => {
        if (!currentStep) {
            router.push(`?step=1`);
        }
    }, []);
    const handleNext = (event: any) => {
        event.preventDefault();
        if (+currentStep < 4) {
            router.push(`?step=${+currentStep + 1}`);
        }
    };

    const handlePrev = (event: any) => {
        event.preventDefault();
        if (+currentStep > 1) {
            router.push(`?step=${+currentStep - 1}`);
        }
    };
    return (
        <div className="p-[var(--main-padding)] w-full h-full flex items-center justify-center">
            <div className="inner size-full flex flex-col gap-[2rem]">
                <p className="text-[1.5rem] font-bold">Create New Coin ⚡</p>
                <ProgressIndicator
                    progressCount={3}
                    currentProgress={+currentStep}
                />
                {currentStep == 1 && (
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
                )}
                {currentStep == 2 && (
                    <form
                        onSubmit={handleNext}
                        action=""
                        className="flex flex-col gap-[1.5rem] w-[600px]"
                    >
                        <div className="flex gap-[1rem] w-full">
                            <div className="item flex-[1]">
                                <label htmlFor="">Website</label>
                                <div className=" h-[40px] border border-secondary/30 rounded-[0.5rem] px-[1rem]">
                                    <input
                                        type="text"
                                        placeholder="Add website URL"
                                        className="size-full outline-none border-none"
                                    />
                                </div>
                            </div>
                            <div className="item flex-[1]">
                                <label htmlFor="">X (Twitter)</label>
                                <div className=" h-[40px] border border-secondary/30 rounded-[0.5rem] px-[1rem]">
                                    <input
                                        type="text"
                                        placeholder="Add twitter URL"
                                        className="size-full outline-none border-none"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-[1rem] w-full">
                            <div className="item flex-[1]">
                                <label htmlFor="">Telegram</label>
                                <div className=" h-[40px] border border-secondary/30 rounded-[0.5rem] px-[1rem]">
                                    <input
                                        type="text"
                                        placeholder="Add telegram URL"
                                        className="size-full outline-none border-none"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handlePrev}
                                type="submit"
                                className="self-start px-[3rem] h-[40px] rounded-[0.5rem] bg-secondary/100 text-primary font-medium cursor-pointer"
                            >
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
                                        d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
                                    />
                                </svg>{" "}
                                Back
                            </button>
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
                        </div>
                    </form>
                )}
                {currentStep == 3 && (
                    <form
                        onSubmit={handleNext}
                        action=""
                        className="flex flex-col gap-[1.5rem] w-[600px]"
                    >
                        <div className="item flex-[1]">
                            <label htmlFor="">Upload Image</label>
                            <div className=" h-[300px] border gap-5 border-secondary/30 flex flex-col items-center justify-center border-dashed rounded-[0.5rem] px-[1rem] mt-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="size-10"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                                    />
                                </svg>
                                <div className="px-[1rem] py-[0.5rem] cursor-pointer rounded-[0.5rem] border border-secondary/30">
                                    Select Image
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={handlePrev}
                                type="submit"
                                className="self-start px-[3rem] h-[40px] rounded-[0.5rem] bg-secondary/100 text-primary font-medium cursor-pointer"
                            >
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
                                        d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
                                    />
                                </svg>{" "}
                                Back
                            </button>
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
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
