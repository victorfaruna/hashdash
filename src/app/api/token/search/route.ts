import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { tokens } from "@/db/schema";
import { ilike, or } from "drizzle-orm";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");

    if (!query) {
        return NextResponse.json(
            {
                message: "Search query is required",
                status: 400,
            },
            { status: 400 }
        );
    }

    try {
        const searchResults = await db.query.tokens.findMany({
            where: or(
                ilike(tokens.name, `%${query}%`),
                ilike(tokens.symbol, `%${query}%`),
                ilike(tokens.description, `%${query}%`)
            ),
            limit: 20,
        });

        return NextResponse.json(
            {
                message: "Search completed successfully",
                status: 200,
                data: searchResults,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Search error:", error);
        return NextResponse.json(
            {
                message: "Error performing search",
                status: 500,
            },
            { status: 500 }
        );
    }
}
