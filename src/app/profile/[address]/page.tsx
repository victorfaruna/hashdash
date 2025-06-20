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
                    <div className="pfp px-[1rem]">
                        <Avatar
                            size={120}
                            name={address}
                            variant="beam"
                            className="pfp translate-y-[-40%] border-3 border-primary rounded-full"
                        />
                    </div>
                </div>
                <div className="side flex-[1]"></div>
            </div>
        </div>
    );
}
