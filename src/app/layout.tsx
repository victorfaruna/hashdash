import type { Metadata } from "next";
import { Montserrat, Orbitron, Poppins, Roboto_Flex } from "next/font/google";
import "./globals.css";
import Drawer from "@/components/Drawer";
import Header from "@/components/Header";
import NextTopLoader from "nextjs-toploader";
import Providers from "@/providers/Providers";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-poppins",
});

const edu = Roboto_Flex({
    weight: ["300", "400", "500", "600", "700"],
    subsets: ["latin"],
    variable: "--font-edu",
});

const montserrat = Montserrat({
    subsets: ["latin"],
    weight: ["200", "300", "400", "500", "600", "700"],
    variable: "--font-montserrat",
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
            <Providers>
                <body
                    className={`${poppins.variable} ${orbitron.variable} ${montserrat.variable} ${edu.variable} flex [--main-padding:2rem] w-screen overflow-x-hidden `}
                >
                    <NextTopLoader
                        color="#fff"
                        height={1}
                        shadow={false}
                        showSpinner={false}
                    />
                    <div className="flex-shrink-0">
                        <Drawer />
                    </div>
                    <div className="flex-[1] flex flex-col overflow-x-hidden h-screen overflow-hidden">
                        <Header />
                        {children}
                    </div>
                </body>
            </Providers>
        </html>
    );
}
