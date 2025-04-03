import { users, type User, type InsertUser } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// Sample data for development
const sampleDeals = [
  {
    id: "1",
    companyName: "MedTech Solutions",
    description: "AI-driven diagnostics platform for radiologists",
    sector: "Healthcare",
    sectorColor: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300",
    amount: "$8.5M",
    round: "Series A",
    date: "Apr 18",
    assigneeImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    stage: "screening"
  },
  {
    id: "2",
    companyName: "CloudSecure",
    description: "Enterprise cloud security platform",
    sector: "SaaS",
    sectorColor: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300",
    amount: "$12M",
    round: "Series B",
    date: "Apr 15",
    assigneeImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    stage: "screening"
  },
  {
    id: "3",
    companyName: "FinTrack",
    description: "Personal finance management platform",
    sector: "FinTech",
    sectorColor: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300",
    amount: "$5.2M",
    round: "Seed",
    date: "Apr 10",
    assigneeImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    stage: "screening"
  },
  {
    id: "4",
    companyName: "EcoEnergy",
    description: "Renewable energy storage solutions",
    sector: "CleanTech",
    sectorColor: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300",
    amount: "$15M",
    round: "Series B",
    date: "Apr 8",
    assigneeImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    stage: "due-diligence"
  },
  {
    id: "5",
    companyName: "LogisticsAI",
    description: "AI-powered logistics optimization",
    sector: "Supply Chain",
    sectorColor: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300",
    amount: "$18.5M",
    round: "Series C",
    date: "Apr 5",
    assigneeImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    stage: "due-diligence"
  },
  {
    id: "6",
    companyName: "DataViz",
    description: "Enterprise data visualization platform",
    sector: "SaaS",
    sectorColor: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300",
    amount: "$22M",
    round: "Series B",
    date: "Mar 28",
    assigneeImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    stage: "term-sheet"
  },
  {
    id: "7",
    companyName: "RetailTech",
    description: "Omnichannel retail management platform",
    sector: "Retail",
    sectorColor: "bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300",
    amount: "$18M",
    round: "Series A",
    date: "Mar 22",
    assigneeImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    stage: "closing"
  }
];

const samplePortfolioCompanies = [
  {
    id: "1",
    name: "TechTitan",
    initials: "TT",
    sector: "Enterprise SaaS",
    investment: "$12.5M",
    roi: "+142%",
    roiValue: 142,
    status: "Growing",
    statusColor: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300",
    stage: "Series B"
  },
  {
    id: "2",
    name: "BioHealth",
    initials: "BH",
    sector: "Biotech",
    investment: "$8.3M",
    roi: "+98%",
    roiValue: 98,
    status: "Growing",
    statusColor: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300",
    stage: "Series A"
  },
  {
    id: "3",
    name: "CyberShield",
    initials: "CS",
    sector: "Cybersecurity",
    investment: "$15.8M",
    roi: "+87%",
    roiValue: 87,
    status: "Stable",
    statusColor: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300",
    stage: "Series C"
  },
  {
    id: "4",
    name: "FinPay",
    initials: "FP",
    sector: "FinTech",
    investment: "$9.2M",
    roi: "+76%",
    roiValue: 76,
    status: "Scaling",
    statusColor: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300",
    stage: "Series B"
  }
];

const sampleAiInsights = [
  {
    id: "1",
    type: "info",
    title: "Market Trend Detected",
    description: "Growing investment opportunity in AI-powered healthcare diagnostics. 3 companies in your screening match this pattern.",
    actionLink: "#",
    actionText: "View Analysis"
  },
  {
    id: "2",
    type: "warning",
    title: "Risk Alert",
    description: "Potential regulatory changes affecting fintech portfolio companies. New compliance requirements expected in Q3.",
    actionLink: "#",
    actionText: "View Details"
  },
  {
    id: "3",
    type: "opportunity",
    title: "Opportunity Identified",
    description: "DataViz (in term sheet stage) has potential strategic partnership with portfolio company TechVision.",
    actionLink: "#",
    actionText: "Connect Teams"
  }
];

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getDealStages(): Promise<any[]>;
  getPortfolioCompanies(): Promise<any[]>;
  getAiInsights(): Promise<any[]>;
  
  // Meeting notes methods
  getMeetingNotes(userId: number): Promise<any[]>;
  getMeetingNote(id: number): Promise<any | undefined>;
  createMeetingNote(meetingNote: any): Promise<any>;
  updateMeetingNote(id: number, meetingNote: any): Promise<any | undefined>;
  deleteMeetingNote(id: number): Promise<boolean>;
  
  sessionStore: any; // Using any type for sessionStore to avoid TypeScript errors
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private meetingNotes: Map<number, any>;
  currentId: number;
  meetingNoteId: number;
  sessionStore: any; // Using any type for sessionStore to avoid TypeScript errors

  constructor() {
    this.users = new Map();
    this.meetingNotes = new Map();
    this.currentId = 1;
    this.meetingNoteId = 1;
    
    // Create a demo user for testing
    this.createUser({
      username: "demo",
      // This is "Password123!" properly hashed with salt - do not change
      password: "a7b5402457a695de5b00d107e03841df38e4b5fa2e5dba4de9cdb64fcfc2f42fff1c3b7a37458c3c10b747804d6ad4232a1771c52ea9c14a4514f7fb1d420b00.7e9bde1d6fe5ee25597e32f8b6485764",
      name: "Demo User",
      role: "Partner",
      profileImage: null
    }).then(user => {
      console.log("[STORAGE] Demo user created with ID:", user.id);
      
      // Create some sample meeting notes for the demo user
      this.createMeetingNote({
        userId: user.id,
        companyName: "Quantum AI Technologies",
        meetingType: "pitch",
        meetingDate: new Date("2025-03-28T14:30:00"),
        participants: ["John Smith (CEO)", "Sarah Johnson (CTO)", "Mark Davis (Investor)"],
        summary: "Initial pitch for their quantum computing-based AI solution. Promising technology with solid team background.",
        transcription: "Partial transcription of the meeting...",
        aiAnalysis: {
          keyPoints: [
            "Quantum computing approach shows 30% efficiency gains",
            "Team has strong technical background but limited business experience",
            "Currently pre-revenue with $2M in seed funding",
            "6-month runway remaining"
          ],
          sentimentAnalysis: {
            overall: "positive",
            confidence: 0.78
          },
          truthfulnessAssessment: {
            concerns: ["Financial projections seem overly optimistic"],
            confidenceLevel: "medium"
          },
          recommendedActions: [
            "Schedule technical due diligence",
            "Verify market size claims",
            "Request detailed financial model"
          ]
        }
      });
    }).catch(err => {
      console.error("[STORAGE] Error creating demo user:", err);
    });
    
    // Optimized session store for low-resource environments like basic tier droplets
    this.sessionStore = new MemoryStore({
      checkPeriod: 3600000, // Clean expired sessions every hour instead of daily
      max: 100, // Limit max sessions to 100 (adjust based on expected user load)
      ttl: 14400000, // 4 hour TTL to match our auth session timeout
      stale: true // Remove stale sessions aggressively
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const timestamp = new Date();
    
    // Ensure proper typing for null values to match User type
    const user: User = { 
      id,
      username: insertUser.username,
      password: insertUser.password,
      name: insertUser.name || null,
      role: insertUser.role || null,
      profileImage: insertUser.profileImage || null,
      createdAt: timestamp
    };
    
    this.users.set(id, user);
    return user;
  }

  async getDealStages(): Promise<any[]> {
    // Group deals by stage
    const stagesMap: {
      [key: string]: {
        id: string;
        name: string;
        deals: any[];
      }
    } = {
      screening: {
        id: "screening",
        name: "Screening",
        deals: []
      },
      "due-diligence": {
        id: "due-diligence",
        name: "Due Diligence",
        deals: []
      },
      "term-sheet": {
        id: "term-sheet",
        name: "Term Sheet",
        deals: []
      },
      closing: {
        id: "closing",
        name: "Closing",
        deals: []
      }
    };

    // Populate stages with deals
    sampleDeals.forEach(deal => {
      const stage = deal.stage as keyof typeof stagesMap;
      if (stagesMap[stage]) {
        stagesMap[stage].deals.push(deal);
      }
    });

    return Object.values(stagesMap);
  }

  async getPortfolioCompanies(): Promise<any[]> {
    return samplePortfolioCompanies;
  }

  async getAiInsights(): Promise<any[]> {
    return sampleAiInsights;
  }

  // Meeting notes implementation
  async getMeetingNotes(userId: number): Promise<any[]> {
    return Array.from(this.meetingNotes.values())
      .filter(note => note.userId === userId)
      .sort((a, b) => new Date(b.meetingDate).getTime() - new Date(a.meetingDate).getTime());
  }

  async getMeetingNote(id: number): Promise<any | undefined> {
    return this.meetingNotes.get(id);
  }

  async createMeetingNote(meetingNote: any): Promise<any> {
    const id = this.meetingNoteId++;
    const timestamp = new Date();
    
    // Process complex objects like aiAnalysis and facialAnalysisResults
    // to ensure they're stored properly
    const processedNote = {
      id,
      ...meetingNote,
      aiAnalysis: typeof meetingNote.aiAnalysis === 'object' 
        ? JSON.stringify(meetingNote.aiAnalysis) 
        : meetingNote.aiAnalysis,
      facialAnalysisResults: typeof meetingNote.facialAnalysisResults === 'object'
        ? JSON.stringify(meetingNote.facialAnalysisResults)
        : meetingNote.facialAnalysisResults,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    
    this.meetingNotes.set(id, processedNote);
    return processedNote;
  }

  async updateMeetingNote(id: number, meetingNote: any): Promise<any | undefined> {
    const existingNote = this.meetingNotes.get(id);
    
    if (!existingNote) {
      return undefined;
    }
    
    // Process complex objects like aiAnalysis and facialAnalysisResults
    const processedNote = {
      ...existingNote,
      ...meetingNote,
      aiAnalysis: typeof meetingNote.aiAnalysis === 'object' 
        ? JSON.stringify(meetingNote.aiAnalysis) 
        : (meetingNote.aiAnalysis || existingNote.aiAnalysis),
      facialAnalysisResults: typeof meetingNote.facialAnalysisResults === 'object'
        ? JSON.stringify(meetingNote.facialAnalysisResults)
        : (meetingNote.facialAnalysisResults || existingNote.facialAnalysisResults),
      updatedAt: new Date()
    };
    
    this.meetingNotes.set(id, processedNote);
    return processedNote;
  }

  async deleteMeetingNote(id: number): Promise<boolean> {
    return this.meetingNotes.delete(id);
  }
}

export const storage = new MemStorage();
