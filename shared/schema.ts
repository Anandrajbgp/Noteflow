import { sql } from "drizzle-orm";
import { pgTable, text, varchar, serial, boolean, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Notes table
export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  color: text("color"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertNoteSchema = createInsertSchema(notes).omit({
  id: true,
  createdAt: true,
});

export type InsertNote = z.infer<typeof insertNoteSchema>;
export type Note = typeof notes.$inferSelect;

// Task Lists table
export const taskLists = pgTable("task_lists", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  sortOrder: serial("sort_order"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTaskListSchema = createInsertSchema(taskLists).omit({
  id: true,
  sortOrder: true,
  createdAt: true,
});

export type InsertTaskList = z.infer<typeof insertTaskListSchema>;
export type TaskList = typeof taskLists.$inferSelect;

// Tasks table
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  frequency: text("frequency").notNull(),
  completed: boolean("completed").default(false).notNull(),
  date: text("date"),
  time: text("time"),
  reminderOffset: text("reminder_offset"),
  listId: integer("list_id"),
  listOrder: integer("list_order").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const updateTaskListSchema = createInsertSchema(taskLists).pick({
  name: true,
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  listOrder: true,
  createdAt: true,
});

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Task = typeof tasks.$inferSelect;
