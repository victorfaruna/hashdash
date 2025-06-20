import Avatar from "boring-avatars";
import React from "react";

export default async function ProfilePage({
    params,
}: {
    params: Promise<{ address: string }>;
}) {
    const { address } = await params;
    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="inner size-full flex h-full">
                <div className="main w-[65%] border-r border-secondary/10">
                    <div className="banner w-full h-[120px] bg-gradient-to-r from-accent-2/60 to-primary" />
                    <div className="pfp px-[1rem] py-[1rem] flex justify-between items-start">
                        <Avatar
                            size={120}
                            name={address}
                            variant="beam"
                            className="pfp translate-y-[-45%] border-3 border-primary rounded-full"
                        />

                        <div className="far-right flex gap-2 items-center">
                            <button className="px-[0.5rem] py-[0.5rem] rounded-[1.5rem] border border-secondary/30 cursor-pointer">
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
                                        d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                                    />
                                </svg>
                            </button>

                            <button className="px-[1rem] py-[0.5rem] rounded-[1.5rem] border border-secondary/30 cursor-pointer">
                                Edit profile
                            </button>
                        </div>
                    </div>
                </div>
                <div className="side flex-[1]"></div>
            </div>
        </div>
    );
}
