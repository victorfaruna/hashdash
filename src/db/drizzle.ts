import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

config({ path: ".env" }); // or .env.local

export const db = drizzle({
    schema: schema,
    connection: process.env.DATABASE_URL!,
});
