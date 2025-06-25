"use client";
import ProgressIndicator from "@/components/Custom/ProgressIndicator";
import { createToken } from "@/services/token";
import { useAuthStore } from "@/store/auth";
import { useCreateCoinStore } from "@/store/create_coin";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useState, useCallback, useEffect } from "react";

import { useDropzone } from "react-dropzone";

const MyPage = () => {
    const router = useRouter();
    const currentStep: number | string = useSearchParams().get("step") || 1;

    const onDrop = useCallback((acceptedFiles: File[]) => {
        // Do something with the files
        setImage(acceptedFiles[0]);
    }, []);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
    });

    //...
    const wallet_address = useAuthStore((state) => state.wallet_address);
    useEffect(() => {
        if (!wallet_address) {
            router.push("/");
        }
    }, [wallet_address]);

    const [walletAddress, setWalletAddress] = useState(wallet_address);
    useEffect(() => {
        setWalletAddress(wallet_address);
    }, [wallet_address]);

    //Zustand states............
    const coinName = useCreateCoinStore((state) => state.name);
    const coinDescription = useCreateCoinStore((state) => state.description);
    const coinSymbol = useCreateCoinStore((state) => state.symbol);
    const coinWebsite = useCreateCoinStore((state) => state.website_url);
    const coinXUrl = useCreateCoinStore((state) => state.x_url);
    const coinTelegramUrl = useCreateCoinStore((state) => state.telegram_url);
    const coinImage = useCreateCoinStore((state) => state.image);

    const setField = useCreateCoinStore((state) => state.setField);
    const clearFields = useCreateCoinStore((state) => state.clearFields);

    //In page input states......
    const [name, setName] = useState(coinName);
    const [description, setDescription] = useState(coinDescription);
    const [symbol, setSymbol] = useState(coinSymbol);
    const [image, setImage] = useState<File | any>(coinImage);
    const [websiteUrl, setWebsiteUrl] = useState(coinWebsite);
    const [xUrl, setXUrl] = useState(coinXUrl);
    const [telegramUrl, setTelegramUrl] = useState(coinTelegramUrl);
    const [isLoading, setIsLoading] = useState(false);

    //handlers........
    const handleNext = async (event: any) => {
        event.preventDefault();
        if (+currentStep <= 3) {
            setField("name", name);
            setField("symbol", symbol);
            setField("image", image);
            setField("description", description);
            setField("website_url", websiteUrl || "");
            setField("x_url", xUrl || "");
            setField("telegram_url", telegramUrl || "");
            if (+currentStep < 3) router.push(`?step=${+currentStep + 1}`);
        }
        console.log(useCreateCoinStore.getState());

        if (+currentStep == 3) {
            console.log("WALLET: ", walletAddress);
            try {
                setIsLoading(true);
                const result = await createToken({
                    name: coinName,
                    symbol: coinSymbol,
                    image: coinImage ?? image,
                    description: coinDescription,
                    website_url: coinWebsite || "",
                    x_url: coinXUrl || "",
                    telegram_url: coinTelegramUrl || "",
                    creator_wallet_address: wallet_address,
                    total_supply: 1000000000,
                });

                const element = document.getElementById("my_modal_2") as any;
                clearFields();
                setName("");
                setSymbol("");
                setDescription("");
                setImage(undefined);
                setWebsiteUrl("");
                setXUrl("");
                setTelegramUrl("");
                element.showModal();
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handlePrev = (event: any) => {
        event.preventDefault();
        if (+currentStep > 1) {
            router.push(`?step=${+currentStep - 1}`);
        }
    };

    const handleClose = () => {
        clearFields();
        router.push("?step=1");
    };
    return (
        <div className="w-full h-full flex ">
            <div className="p-[var(--main-padding)] inner size-full flex flex-col  gap-[2rem] w-[70%] border-r border-secondary/10">
                <p className="text-[1.2rem] font-bold">Create New Coin ⚡</p>
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
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        placeholder="Name of your coin"
                                        className="size-full outline-none border-none"
                                    />
                                </div>
                            </div>
                            <div className="item flex-[1]">
                                <label htmlFor="">Ticker</label>
                                <div className=" h-[40px] border border-secondary/30 rounded-[0.5rem] px-[1rem]">
                                    <input
                                        value={symbol}
                                        onChange={(e) =>
                                            setSymbol(e.target.value)
                                        }
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
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
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
                                        value={websiteUrl}
                                        onChange={(e) =>
                                            setWebsiteUrl(e.target.value)
                                        }
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
                                        value={xUrl}
                                        onChange={(e) =>
                                            setXUrl(e.target.value)
                                        }
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
                                        value={telegramUrl}
                                        onChange={(e) =>
                                            setTelegramUrl(e.target.value)
                                        }
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
                        id="FileForm"
                        onSubmit={handleNext}
                        action=""
                        className="flex w-[600px] flex-col gap-[1.5rem]"
                    >
                        <div className="item flex-[1]">
                            <label htmlFor="">Upload Image</label>
                            <div
                                {...getRootProps()}
                                className="h-[300px] border gap-5 border-secondary/30 flex flex-col items-center justify-center border-dashed rounded-[0.5rem] px-[1rem] mt-2"
                            >
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
                                    {image && (
                                        <span>
                                            Uploaded{" "}
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                                className="size-4 text-accent inline"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </span>
                                    )}
                                    {!image && "Upload Image"}
                                </div>
                                <input
                                    className="px-[1rem] py-[0.5rem] cursor-pointer rounded-[0.5rem] border border-secondary/30"
                                    type="button"
                                    {...getInputProps()}
                                />
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
                                disabled={isLoading}
                                type="submit"
                                className="self-start px-[3rem] h-[40px] rounded-[0.5rem] bg-secondary/100 text-primary font-medium cursor-pointer"
                            >
                                {isLoading && "Creating..."}
                                {!isLoading && (
                                    <>
                                        <span>Continue</span>{" "}
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
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
            <div className="right p-[var(--main-padding)]">
                <p className="text-[1.2rem] font-bold">Preview</p>
            </div>

            {/* modal */}
            <dialog id="my_modal_2" className="modal">
                <div className="modal-box py-[4rem] text-center bg-primary border border-secondary/10">
                    <h3 className="font-bold text-lg">Congrats🎉</h3>
                    <p className="py-4">Your token was created successfully!</p>
                    <div className="flex gap-[1rem] justify-center">
                        <button className="cursor-pointer py-[0.5rem] px-[1rem] rounded-[0.5rem] border border-secondary/20">
                            View Token{" "}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="size-3 inline"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M8.25 3.75H19.5a.75.75 0 0 1 .75.75v11.25a.75.75 0 0 1-1.5 0V6.31L5.03 20.03a.75.75 0 0 1-1.06-1.06L17.69 5.25H8.25a.75.75 0 0 1 0-1.5Z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                        <button className="cursor-pointer py-[0.5rem] px-[1rem] rounded-[0.5rem] border border-secondary/20">
                            Create Another Token
                        </button>
                    </div>
                </div>
                <form
                    method="dialog"
                    className="modal-backdrop"
                    onSubmit={handleClose}
                >
                    <button onClick={handleClose}>close</button>
                </form>
            </dialog>
        </div>
    );
};

export default function LaunchPage() {
    return (
        <Suspense>
            <MyPage />
        </Suspense>
    );
}
