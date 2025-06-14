import React from "react";

export default function Header() {
    return (
        <header className="h-[80px] flex-[1] flex items-center justify-between px-[var(--main-padding)] border-b border-secondary/10">
            <div className="left flex gap-[var(--main-padding)]">
                <div className="item border border-[gold]/20 p-[0.5rem] rounded-[0.5rem] flex items-center gap-[1rem]">
                    <div className="ico size-[1.5rem] rounded-sm bg-[gold]/20 flex items-center justify-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-4 text-[gold]"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9.348 14.652a3.75 3.75 0 0 1 0-5.304m5.304 0a3.75 3.75 0 0 1 0 5.304m-7.425 2.121a6.75 6.75 0 0 1 0-9.546m9.546 0a6.75 6.75 0 0 1 0 9.546M5.106 18.894c-3.808-3.807-3.808-9.98 0-13.788m13.788 0c3.808 3.807 3.808 9.98 0 13.788M12 12h.008v.008H12V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                            />
                        </svg>
                    </div>
                    <p className="text-[0.7rem] text-secondary/90">
                        Mog guy (MGGUY) |{" "}
                        <span className="text-accent">market cap: $2,320</span>
                    </p>
                </div>

                <div className="item border border-[hotpink]/20 p-[0.5rem] rounded-[0.5rem] flex items-center gap-[1rem]">
                    <div className="ico size-[1.5rem] rounded-sm bg-[hotgold]/20 flex items-center justify-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-4 text-[hotpink]"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9.348 14.652a3.75 3.75 0 0 1 0-5.304m5.304 0a3.75 3.75 0 0 1 0 5.304m-7.425 2.121a6.75 6.75 0 0 1 0-9.546m9.546 0a6.75 6.75 0 0 1 0 9.546M5.106 18.894c-3.808-3.807-3.808-9.98 0-13.788m13.788 0c3.808 3.807 3.808 9.98 0 13.788M12 12h.008v.008H12V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                            />
                        </svg>
                    </div>
                    <p className="text-[0.7rem] text-secondary/90">
                        Thedog.fun (THEDOG) |{" "}
                        <span className="text-accent">market cap: $4,140</span>
                    </p>
                </div>
            </div>
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
