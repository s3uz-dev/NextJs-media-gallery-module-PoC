import { sqliteTable } from "drizzle-orm/sqlite-core";
import { text, integer, } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

const timestamps = {
  updated_at: text("updated_at")
    .$defaultFn(() => new Date().toISOString()),
  created_at: text("created_at")
    .$defaultFn(() => new Date().toISOString())
    .notNull(),
  deleted_at: text("deleted_at"),
};


export const mediaLibraryTable = sqliteTable("media_library", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  url: text("url").notNull(),
  name: text("name").notNull(),
  type: text("type", { length: 50 }).notNull(),
  provider: text("provider", { length: 50 }), // 'cloudinary', 'vimeo', etc.
  width: integer("width"),
  height: integer("height"),
  duration: integer("duration"), // Solo para videos
  ...timestamps,
});