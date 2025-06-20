import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(request: Request) {
    try {
        const authHeader = request.headers.get("authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return new NextResponse(
                JSON.stringify({
                    message: "Not authorized properly",
                    status: 401,
                }),
                {
                    status: 401,
                }
            );
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return new NextResponse(
                JSON.stringify({
                    message: "Malformed or missing token",
                    status: 401,
                }),
                { status: 401 }
            );
        }
        const { payload } = await jwtVerify(token, SECRET as any);
        return NextResponse.next(); // allow access
    } catch (err) {
        console.log(err);
        return new NextResponse(
            JSON.stringify({ message: "Not authorized", status: 401 }),
            {
                status: 401,
            }
        );
    }
}

export const config = {
    matcher: ["/api/user/:path*"],
};
