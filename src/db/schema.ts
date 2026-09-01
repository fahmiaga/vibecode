import { mysqlTable, text, integer } from "drizzle-orm/mysql2";

export const users = mysqlTable("users", {
  id: integer("id").primaryKey({ mode: "auto" }).autoincrement(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: integer("created_at").defaultNow(),
});