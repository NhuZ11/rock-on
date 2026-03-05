import { json, serial, text, timestamp, boolean } from "drizzle-orm/pg-core";
export const tableName = "dummmy";

export const attributes = {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  avatar: text("avatar"),
  password: text("password"),
  deviceTokens: json("deviceTokens"),
  infos: json("infos"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
};
