import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const wallet_address = searchParams.get("wallet_address") || "";
        //...
        //...
        const result = await db
            .select()
            .from(users)
            .where(eq(users.wallet_address, wallet_address));

        //...
        return new Response(JSON.stringify({ data: result[0], status: 200 }), {
            status: 200,
        });
    } catch (error) {
        console.log(error);
        return new Response(
            JSON.stringify({ message: "User not found", status: 404 }),
            { status: 404 }
        );
    }
}
