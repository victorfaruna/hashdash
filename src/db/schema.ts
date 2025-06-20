import {
    text,
    boolean,
    pgTable,
    timestamp,
    numeric,
    uuid,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    wallet_address: text("wallet_address").notNull(),
    is_verified: boolean("is_verified").notNull().default(false),
    created_at: timestamp("created_at").defaultNow(),
});

export const tokens = pgTable("tokens", {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
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
