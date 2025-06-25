import { db } from "@/db/drizzle";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const tokens = await db.query.tokens.findMany({
            orderBy: (token, { desc }) => [desc(token.id)],
        });

        return new NextResponse(
            JSON.stringify({
                message: "Tokens retrieved successfully",
                status: 200,
                data: tokens,
            }),
            { status: 200 }
        );
    } catch (error) {
        return new NextResponse(
            JSON.stringify({
                message: "Error retrieving tokens",
                status: 400,
            }),
            { status: 400 }
        );
    }
}
