import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name"),
  role: text("role").default("User"),
  profileImage: text("profile_image"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Deals table
export const deals = pgTable("deals", {
  id: serial("id").primaryKey(),
  companyName: text("company_name").notNull(),
  description: text("description"),
  sector: text("sector"),
  amount: text("amount"),
  round: text("round"),
  status: text("status").notNull(),
  stage: text("stage").notNull(),
  assigneeId: integer("assignee_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Portfolio companies table
export const portfolioCompanies = pgTable("portfolio_companies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  sector: text("sector"),
  investment: text("investment"),
  investmentDate: timestamp("investment_date"),
  stage: text("stage"),
  status: text("status"),
  valueAtInvestment: text("value_at_investment"),
  currentValue: text("current_value"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// AI insights table
export const aiInsights = pgTable("ai_insights", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  actionLink: text("action_link"),
  actionText: text("action_text"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Schemas for validation and type inference
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  role: true,
  profileImage: true,
});

export const insertDealSchema = createInsertSchema(deals);
export const insertPortfolioCompanySchema = createInsertSchema(portfolioCompanies);
export const insertAiInsightSchema = createInsertSchema(aiInsights);

// Type definitions
// Meeting notes schema
export const meetingNotes = pgTable("meeting_notes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  companyName: text("company_name").notNull(),
  meetingDate: timestamp("meeting_date").defaultNow().notNull(),
  meetingType: text("meeting_type").notNull(), // pitch, follow-up, due-diligence, etc.
  participants: text("participants").array(),
  summary: text("summary"),
  transcription: text("transcription"),
  audioUrl: text("audio_url"),
  videoUrl: text("video_url"),
  aiAnalysis: text("ai_analysis"), // Stored as JSON string
  facialAnalysisResults: text("facial_analysis_results"), // Stored as JSON string
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertMeetingNoteSchema = createInsertSchema(meetingNotes, {
  id: undefined,
  createdAt: undefined,
  updatedAt: undefined,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertMeetingNote = z.infer<typeof insertMeetingNoteSchema>;
export type User = typeof users.$inferSelect;
export type Deal = typeof deals.$inferSelect;
export type PortfolioCompany = typeof portfolioCompanies.$inferSelect;
export type AiInsight = typeof aiInsights.$inferSelect;
export type MeetingNote = typeof meetingNotes.$inferSelect;
