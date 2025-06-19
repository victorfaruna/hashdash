import {
    integer,
    text,
    boolean,
    pgTable,
    timestamp,
    numeric,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: integer("id").primaryKey(),
    wallet_address: text("wallet_address").notNull(),
    is_verified: boolean("is_verified").notNull(),
    created_at: timestamp("created_at").defaultNow(),
});

export const tokens = pgTable("tokens", {
    id: integer("id").primaryKey(),
    mint_address: text("mint_address").notNull(),
    name: text("name").notNull(),
    symbol: text("symbol").notNull(),
    image: text("image").notNull(),
    description: text("description").notNull(),
    creator_wallet_address: text("creator_wallet_address").notNull(),
    total_supply: numeric("total_supply").notNull(),
    created_at: timestamp("created_at").defaultNow(),
    launched_at: timestamp("launched_at"),
});
