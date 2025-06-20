import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { config } from "dotenv";

config({ path: ".env" });

export async function POST(req: NextRequest) {
    const { wallet_address }: { wallet_address: string } = await req.json();

    if (!wallet_address) {
        return new NextResponse(
            JSON.stringify({
                message: "Wallet address is required",
                status: 400,
            }),
            { status: 400 }
        );
    }

    //check for user account.......
    const result = await db
        .select()
        .from(users)
        .where(eq(users.wallet_address, wallet_address));
    if (result.length > 0) {
        const token = jwt.sign({ wallet_address }, process.env.JWT_SECRET!, {
            expiresIn: "30d",
        });
        return new NextResponse(
            JSON.stringify({
                wallet_address,
                token,
                message: "User logged in",
                status: 200,
            }),
            { status: 200 }
        );
    }

    //create new user account.......
    const newUser = await db.insert(users).values({
        wallet_address,
    });
    if (!newUser) {
        return new NextResponse(
            JSON.stringify({ message: "User not found", status: 404 }),
            { status: 404 }
        );
    }

    //log new use in.......
    const token = jwt.sign({ wallet_address }, process.env.JWT_SECRET!, {
        expiresIn: "30d",
    });
    return new NextResponse(
        JSON.stringify({
            wallet_address,
            token,
            message: "User created then logged in",
            status: 201,
        }),
        { status: 201 }
    );
}
