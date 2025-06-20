import ComingSoon from "@/components/ComingSoon";
import React from "react";

export default async function ProfilePage({
    params,
}: {
    params: Promise<{ address: string }>;
}) {
    const { address } = await params;
    return (
        <div className="p-[var(--main-padding)] w-full h-full flex items-center justify-center">
            <ComingSoon />
        </div>
    );
}
