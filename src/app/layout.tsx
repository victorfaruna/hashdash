import type { Metadata } from "next";
import { Orbitron, Poppins } from "next/font/google";
import "./globals.css";
import Drawer from "@/components/Drawer";
import Header from "@/components/Header";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-poppins",
});

const orbitron = Orbitron({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-orbitron",
});

export const metadata: Metadata = {
    title: "HashDash | Launch Memecoins on Solana",
    description: "",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${poppins.variable} ${orbitron.variable} flex [--main-padding:2rem] w-screen overflow-x-hidden `}
            >
                <div className="flex-shrink-0">
                    <Drawer />
                </div>
                <div className="flex-[1] overflow-x-hidden h-screen overflow-hidden">
                    <Header />
                    {children}
                </div>
            </body>
        </html>
    );
}
