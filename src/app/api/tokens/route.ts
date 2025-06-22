import { db } from "@/db/drizzle";
import { tokens } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { body } = await request.json();
        const {
            name,
            symbol,
            description,
            website_url,
            x_url,
            telegram_url,
            creator_wallet_address,
            total_supply,
        } = body;

        //....
        const newToken = await db.insert(tokens).values({
            name: name,
            symbol: symbol,
            image: "",
            description: description,
            website_url: website_url,
            x_url: x_url,
            telegram_url: telegram_url,
            creator_wallet_address: creator_wallet_address,
            total_supply: total_supply,
        });

        return new NextResponse(
            JSON.stringify({
                message: "Token created successfully",
                status: 201,
                data: newToken,
            }),
            { status: 201 }
        );
    } catch (error) {
        return new NextResponse(
            JSON.stringify({
                message: "Error creating token",
                status: 400,
            }),
            { status: 400 }
        );
    }
}
