"use client";
import React from "react";

export default function ProgressIndicator({
    progressCount,
    currentProgress,
}: {
    currentProgress: number;
    progressCount: number;
}) {
    const [progress, setProgress] = React.useState(0);
    return (
        <div className="flex items-center">
            {Array.from({ length: progressCount }, (_, i) => (
                <div className="flex items-center" key={i}>
                    <div
                        className={`size-[24px] rounded-full border flex items-center justify-center ${
                            i + 1 <= currentProgress
                                ? "border-accent text-accent"
                                : "border-secondary/30"
                        }`}
                    >
                        {i + 1}
                    </div>
                    <div
                        className={`w-[200px] h-0 dash border-b   ${
                            i + 1 < currentProgress
                                ? "border-accent"
                                : "border-secondary/30"
                        } ${i + 1 === progressCount && "hidden"}`}
                    ></div>
                </div>
            ))}
        </div>
    );
}
