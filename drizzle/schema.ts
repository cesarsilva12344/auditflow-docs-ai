import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  passwordHash: varchar("passwordHash", { length: 255 }),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  canUseAi: int("canUseAi").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const projects = mysqlTable("projects", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  clientName: varchar("clientName", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const prompts = mysqlTable("prompts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 120 }).notNull(),
  systemInstruction: text("systemInstruction").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const meetingMinutes = mysqlTable("meetingMinutes", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  projectId: int("projectId"),
  promptId: int("promptId"),
  mode: mysqlEnum("mode", ["manual", "ai"]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  clientName: varchar("clientName", { length: 255 }).notNull(),
  projectName: varchar("projectName", { length: 255 }).notNull(),
  meetingDate: varchar("meetingDate", { length: 32 }).notNull(),
  ownerName: varchar("ownerName", { length: 255 }).notNull(),
  objective: text("objective").notNull(),
  transcript: text("transcript"),
  guidance: text("guidance"),
  content: text("content").notNull(),
  status: mysqlEnum("status", ["draft", "generated", "reviewed"]).default("draft").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const adminCredentials = mysqlTable("adminCredentials", {
  id: int("id").autoincrement().primaryKey(),
  username: varchar("username", { length: 80 }).notNull().unique(),
  passwordHash: varchar("passwordHash", { length: 255 }).notNull(),
  mustChangePassword: int("mustChangePassword").notNull().default(1),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const adminSettings = mysqlTable("adminSettings", {
  id: int("id").autoincrement().primaryKey(),
  provider: varchar("provider", { length: 80 }).notNull().default("qwen"),
  baseUrl: varchar("baseUrl", { length: 500 }).notNull(),
  model: varchar("model", { length: 120 }).notNull().default("qwen-plus"),
  encryptedApiKey: text("encryptedApiKey").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const aiRuns = mysqlTable("aiRuns", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  meetingMinuteId: int("meetingMinuteId"),
  promptId: int("promptId"),
  inputText: text("inputText").notNull(),
  outputText: text("outputText").notNull(),
  model: varchar("model", { length: 120 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Project = typeof projects.$inferSelect;
export type Prompt = typeof prompts.$inferSelect;
export type MeetingMinute = typeof meetingMinutes.$inferSelect;
export type AiRun = typeof aiRuns.$inferSelect;
export type AdminCredential = typeof adminCredentials.$inferSelect;
export type AdminSetting = typeof adminSettings.$inferSelect;
