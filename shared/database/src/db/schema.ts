import { serial, text, pgTable } from "drizzle-orm/pg-core";

export const userSchema = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username"),
  email: text("email"),
  passwordHash: text("password_hash"),
  avatarUrl: text("avatar_url"),
  pepper: text("pepper"),
});
