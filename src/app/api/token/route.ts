import { db } from "@/db/drizzle";
import { tokens } from "@/db/schema";
import { createClient } from "@supabase/supabase-js";

import { NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const name = formData.get("name") as string | null;
        const symbol = formData.get("symbol") as string | null;
        let imageUrl = "";
        const imageFile = formData.get("image");
        console.log(imageFile);
        if (imageFile instanceof File && imageFile.name) {
            // Generate a unique filename
            const fileExt = imageFile.name.split(".").pop()?.toLowerCase();
            const fileName = `token-images/${Date.now()}.${fileExt}`;
            const { data, error } = await supabase.storage
                .from("hashdash")
                .upload(fileName, imageFile as File, {
                    cacheControl: "3600",
                    upsert: false,
                });
            if (error) {
                console.log(error);
                return new NextResponse(
                    JSON.stringify({
                        message: "Image upload failed",
                        status: 400,
                    }),
                    { status: 400 }
                );
            }
            // Get public URL...
            const { data: publicUrlData } = await supabase.storage
                .from("hashdash")
                .getPublicUrl(fileName);
            imageUrl = publicUrlData.publicUrl;
            console.log("Image URL:", imageUrl);
        } else {
            console.log("Image not found");
        }
        const description = formData.get("description") as string | null;
        const website_url = formData.get("website_url") as string | null;
        const x_url = formData.get("x_url") as string | null;
        const telegram_url = formData.get("telegram_url") as string | null;
        const creator_wallet_address = formData.get(
            "creator_wallet_address"
        ) as string | null;
        let total_supply = formData.get("total_supply");
        if (typeof total_supply !== "string") {
            total_supply = "0";
        }

        // Ensure required fields are present
        if (
            !name ||
            !symbol ||
            !description ||
            !creator_wallet_address ||
            !total_supply
        ) {
            return new NextResponse(
                JSON.stringify({
                    message: "Missing required fields",
                    status: 400,
                }),
                { status: 400 }
            );
        }

        const newToken = await db.insert(tokens).values({
            name,
            symbol,
            image: imageUrl,
            description,
            website_url,
            x_url,
            telegram_url,
            creator_wallet_address,
            total_supply: total_supply as string,
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
        console.log(error);
        return new NextResponse(
            JSON.stringify({
                message: "Error creating token",
                status: 400,
            }),
            { status: 400 }
        );
    }
}

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
