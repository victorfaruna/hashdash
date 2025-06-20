import Image from "next/image";
import React from "react";

export default function ComingSoon() {
    return (
        <div className="flex flex-col gap-[1rem] items-center justify-center">
            <Image
                src="/svg/coming-soon-3.svg"
                alt=""
                width={200}
                height={200}
            />
            <p className="text-[0.8rem] text-secondary/70 font-thin leading-none">
                We're still working on this... Check back Soon.
            </p>
        </div>
    );
}
