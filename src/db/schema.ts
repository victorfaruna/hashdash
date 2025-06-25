import {
    text,
    boolean,
    pgTable,
    timestamp,
    numeric,
    uuid,
    integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    username: text("username").notNull(),
    wallet_address: text("wallet_address").notNull(),
    is_verified: boolean("is_verified").notNull().default(false),
    created_at: timestamp("created_at").defaultNow(),
});

export const tokens = pgTable("tokens", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    mint_address: text("mint_address"),
    name: text("name").notNull(),
    symbol: text("symbol").notNull(),
    image: text("image"),
    description: text("description").notNull(),
    website_url: text("website_url"),
    x_url: text("x_url"),
    telegram_url: text("telegram_url"),
    creator_wallet_address: text("creator_wallet_address").notNull(),
    total_supply: numeric("total_supply").notNull(),
    market_cap: numeric("market_cap").notNull().default("0"),
    created_at: timestamp("created_at").defaultNow(),
    launched_at: timestamp("launched_at").defaultNow(),
    reply_count: numeric("reply_count").default("0"),
});

export const replies = pgTable("replies", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    content: text("content").notNull(),
    token_id: integer("token_id")
        .notNull()
        .references(() => tokens.id),
    user_id: integer("user_id")
        .notNull()
        .references(() => users.id),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
});

// Define relations
export const tokensRelations = relations(tokens, ({ many, one }) => ({
    replies: many(replies),
    user: one(users, {
        fields: [tokens.creator_wallet_address],
        references: [users.wallet_address],
    }),
}));

export const usersRelations = relations(users, ({ many }) => ({
    replies: many(replies),
    tokens: many(tokens),
}));

export const repliesRelations = relations(replies, ({ one }) => ({
    token: one(tokens, {
        fields: [replies.token_id],
        references: [tokens.id],
    }),
    user: one(users, {
        fields: [replies.user_id],
        references: [users.id],
    }),
}));
