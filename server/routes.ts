import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { 
  handleGeminiQuery, 
  getAiInsights, 
  getMarketTrends, 
  analyzeCompany,
  analyzeFinancialData,
  analyzeCapTable,
  analyzeWeb3Investment,
  generateInvestmentThesis,
  analyzeComplianceRisk
} from "./gemini";

// Authentication and security middleware
function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized - Authentication required" });
  }
  next();
}

// Middleware to sanitize and validate inputs for specific requests
function sanitizeInput(req: Request, res: Response, next: NextFunction) {
  // Simple sanitization for query parameters
  if (req.query) {
    Object.keys(req.query).forEach(key => {
      if (typeof req.query[key] === 'string') {
        // Trim and prevent overly long inputs
        const value = req.query[key] as string;
        if (value.length > 500) {
          req.query[key] = value.substring(0, 500);
        }
      }
    });
  }
  
  // Perform similar sanitization for request body if it's an object
  if (req.body && typeof req.body === 'object') {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        // Trim and prevent overly long inputs for specific fields
        const value = req.body[key] as string;
        if (value.length > 2000) {
          req.body[key] = value.substring(0, 2000);
        }
      }
    });
  }
  
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);
  
  // Apply sanitizeInput middleware to all API routes
  app.use('/api', sanitizeInput);
  
  // Create an API router for protected routes
  const apiRouter = (path: string, handler: (req: Request, res: Response) => void) => {
    return app.use(path, requireAuth, handler);
  };
  
  // Create a standardized error handler for API routes
  const apiErrorHandler = (error: any, operation: string, res: Response) => {
    const errorId = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    console.error(`[ERROR-${errorId}] ${operation}:`, error);
    
    // Don't expose internal error details in production
    const isDev = process.env.NODE_ENV !== 'production';
    res.status(500).json({ 
      message: `Failed to ${operation}`,
      errorId,
      ...(isDev && { details: error.message })
    });
  };
  
  // Dashboard metrics - protected with requireAuth middleware
  app.get("/api/dashboard/metrics", requireAuth, async (req, res) => {
    try {
      // Audit logging for sensitive financial data access
      console.log(`[AUDIT] User ${(req.user as any).username} accessed dashboard metrics at ${new Date().toISOString()}`);
      
      const metrics = {
        aum: { 
          value: "$483.2M", 
          change: "8.2%", 
          isPositive: true 
        },
        activeDeals: { 
          value: "24", 
          change: "3", 
          isPositive: true 
        },
        portfolioCompanies: { 
          value: "18", 
          change: "2", 
          isPositive: true 
        },
        irr: { 
          value: "21.4%", 
          change: "2.3%", 
          isPositive: true 
        },
      };
      
      res.json({ metrics });
    } catch (error) {
      apiErrorHandler(error, "fetch dashboard metrics", res);
    }
  });

  // Deal pipeline - protected route
  app.get("/api/deals/pipeline", requireAuth, async (req, res) => {
    try {
      const stages = await storage.getDealStages();
      res.json({ stages });
    } catch (error) {
      apiErrorHandler(error, "fetch deal pipeline", res);
    }
  });

  // Portfolio companies - protected route
  app.get("/api/portfolio/companies", requireAuth, async (req, res) => {
    try {
      const companies = await storage.getPortfolioCompanies();
      res.json({ companies });
    } catch (error) {
      apiErrorHandler(error, "fetch portfolio companies", res);
    }
  });

  // Portfolio performance - protected route
  app.get("/api/portfolio/performance", requireAuth, async (req, res) => {
    try {
      // Audit logging for sensitive financial data access
      console.log(`[AUDIT] User ${(req.user as any).username} accessed portfolio performance data at ${new Date().toISOString()}`);
      
      const data = [
        { name: "Apr", value: 60, benchmark: 52 },
        { name: "May", value: 75, benchmark: 57 },
        { name: "Jun", value: 55, benchmark: 56 },
        { name: "Jul", value: 80, benchmark: 60 },
        { name: "Aug", value: 85, benchmark: 63 },
        { name: "Sep", value: 70, benchmark: 58 },
        { name: "Oct", value: 90, benchmark: 65 },
        { name: "Nov", value: 65, benchmark: 60 },
        { name: "Dec", value: 75, benchmark: 62 },
        { name: "Jan", value: 82, benchmark: 65 },
        { name: "Feb", value: 78, benchmark: 63 },
        { name: "Mar", value: 88, benchmark: 67 },
      ];
      
      res.json({ data });
    } catch (error) {
      apiErrorHandler(error, "fetch portfolio performance", res);
    }
  });

  // AI insights - protected route
  app.get("/api/ai/insights", requireAuth, async (req, res) => {
    try {
      const insights = await getAiInsights();
      res.json({ insights });
    } catch (error) {
      apiErrorHandler(error, "fetch AI insights", res);
    }
  });

  // Gemini AI query endpoint - protected route with extra validation
  app.post("/api/ai/query", requireAuth, async (req, res) => {
    try {
      const { query } = req.body;
      
      // Input validation
      if (!query) {
        return res.status(400).json({ message: "Query is required" });
      }
      
      // Log AI queries for compliance and security
      console.log(`[AUDIT] AI query by user ${(req.user as any).username}: "${query.substring(0, 50)}${query.length > 50 ? '...' : ''}" at ${new Date().toISOString()}`);
      
      const response = await handleGeminiQuery(query);
      res.json({ response });
    } catch (error) {
      apiErrorHandler(error, "process AI query", res);
    }
  });

  // Market trends - protected route
  app.get("/api/ai/market-trends", requireAuth, async (req, res) => {
    try {
      const sector = req.query.sector as string | undefined;
      
      // Log market data access for compliance
      console.log(`[AUDIT] Market trends requested by ${(req.user as any).username} for sector: ${sector || 'ALL'} at ${new Date().toISOString()}`);
      
      const trends = await getMarketTrends(sector);
      res.json({ trends });
    } catch (error) {
      apiErrorHandler(error, "fetch market trends", res);
    }
  });

  // Company analysis - protected route with input validation
  app.post("/api/ai/analyze-company", requireAuth, async (req, res) => {
    try {
      const { companyData } = req.body;
      
      // Input validation
      if (!companyData) {
        return res.status(400).json({ message: "Company data is required" });
      }
      
      // Log company analysis for compliance and audit
      const companyName = companyData.name || 'Unknown Company';
      console.log(`[AUDIT] Company analysis requested by ${(req.user as any).username} for "${companyName}" at ${new Date().toISOString()}`);
      
      const analysis = await analyzeCompany(companyData);
      res.json({ analysis });
    } catch (error) {
      apiErrorHandler(error, "analyze company", res);
    }
  });

  // Financial data analysis - protected route
  app.post("/api/ai/analyze-financials", requireAuth, async (req, res) => {
    try {
      const { financialData } = req.body;
      
      // Input validation
      if (!financialData) {
        return res.status(400).json({ message: "Financial data is required" });
      }
      
      // Audit logging
      console.log(`[AUDIT] Financial analysis requested by ${(req.user as any).username} at ${new Date().toISOString()}`);
      
      const analysis = await analyzeFinancialData(financialData);
      res.json({ analysis });
    } catch (error) {
      apiErrorHandler(error, "analyze financial data", res);
    }
  });

  // Cap table analysis - protected route
  app.post("/api/ai/analyze-cap-table", requireAuth, async (req, res) => {
    try {
      const { capTableData } = req.body;
      
      // Input validation
      if (!capTableData) {
        return res.status(400).json({ message: "Cap table data is required" });
      }
      
      // Audit logging
      console.log(`[AUDIT] Cap table analysis requested by ${(req.user as any).username} at ${new Date().toISOString()}`);
      
      const analysis = await analyzeCapTable(capTableData);
      res.json({ analysis });
    } catch (error) {
      apiErrorHandler(error, "analyze cap table", res);
    }
  });

  // Web3 investment analysis - protected route
  app.post("/api/ai/analyze-web3", requireAuth, async (req, res) => {
    try {
      const { web3Data } = req.body;
      
      // Input validation
      if (!web3Data) {
        return res.status(400).json({ message: "Web3 project data is required" });
      }
      
      // Audit logging
      const projectName = web3Data.name || 'Unknown Project';
      console.log(`[AUDIT] Web3 investment analysis requested by ${(req.user as any).username} for "${projectName}" at ${new Date().toISOString()}`);
      
      const analysis = await analyzeWeb3Investment(web3Data);
      res.json({ analysis });
    } catch (error) {
      apiErrorHandler(error, "analyze Web3 investment", res);
    }
  });

  // Investment thesis generation - protected route
  app.post("/api/ai/generate-thesis", requireAuth, async (req, res) => {
    try {
      const { companyData } = req.body;
      
      // Input validation
      if (!companyData) {
        return res.status(400).json({ message: "Company data is required" });
      }
      
      // Audit logging
      const companyName = companyData.name || 'Unknown Company';
      console.log(`[AUDIT] Investment thesis generation requested by ${(req.user as any).username} for "${companyName}" at ${new Date().toISOString()}`);
      
      const thesis = await generateInvestmentThesis(companyData);
      res.json({ thesis });
    } catch (error) {
      apiErrorHandler(error, "generate investment thesis", res);
    }
  });

  // Compliance and risk analysis - protected route
  app.post("/api/ai/compliance-risk", requireAuth, async (req, res) => {
    try {
      const { complianceData } = req.body;
      
      // Input validation
      if (!complianceData) {
        return res.status(400).json({ message: "Compliance data is required" });
      }
      
      // Audit logging
      const companyName = complianceData.companyName || 'Unknown Company';
      console.log(`[AUDIT] Compliance risk analysis requested by ${(req.user as any).username} for "${companyName}" at ${new Date().toISOString()}`);
      
      const analysis = await analyzeComplianceRisk(complianceData);
      res.json({ analysis });
    } catch (error) {
      apiErrorHandler(error, "analyze compliance and risk", res);
    }
  });

  // Domain-specific AI query endpoint - protected route
  app.post("/api/ai/domain-query", requireAuth, async (req, res) => {
    try {
      const { query, domain } = req.body;
      
      // Input validation
      if (!query) {
        return res.status(400).json({ message: "Query is required" });
      }
      
      // Log AI queries for compliance and security
      console.log(`[AUDIT] Domain-specific AI query by user ${(req.user as any).username} for domain: ${domain || 'generalVC'}: "${query.substring(0, 50)}${query.length > 50 ? '...' : ''}" at ${new Date().toISOString()}`);
      
      const response = await handleGeminiQuery(query, domain);
      res.json({ response });
    } catch (error) {
      apiErrorHandler(error, "process domain-specific AI query", res);
    }
  });

  // Meeting notes endpoints
  // Get all meeting notes for the authenticated user
  app.get("/api/meeting-notes", requireAuth, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const meetingNotes = await storage.getMeetingNotes(userId);
      
      // Transform aiAnalysis and facialAnalysisResults from strings back to objects
      const transformedNotes = meetingNotes.map(note => ({
        ...note,
        aiAnalysis: note.aiAnalysis ? JSON.parse(note.aiAnalysis) : null,
        facialAnalysisResults: note.facialAnalysisResults ? JSON.parse(note.facialAnalysisResults) : null
      }));
      
      res.json({ meetingNotes: transformedNotes });
    } catch (error) {
      apiErrorHandler(error, "fetch meeting notes", res);
    }
  });

  // Get a specific meeting note
  app.get("/api/meeting-notes/:id", requireAuth, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const noteId = parseInt(req.params.id, 10);
      
      if (isNaN(noteId)) {
        return res.status(400).json({ message: "Invalid meeting note ID" });
      }
      
      const meetingNote = await storage.getMeetingNote(noteId);
      
      if (!meetingNote) {
        return res.status(404).json({ message: "Meeting note not found" });
      }
      
      // Ensure user can only access their own meeting notes
      if (meetingNote.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      // Transform aiAnalysis and facialAnalysisResults from strings back to objects
      const transformedNote = {
        ...meetingNote,
        aiAnalysis: meetingNote.aiAnalysis ? JSON.parse(meetingNote.aiAnalysis) : null,
        facialAnalysisResults: meetingNote.facialAnalysisResults ? JSON.parse(meetingNote.facialAnalysisResults) : null
      };
      
      res.json({ meetingNote: transformedNote });
    } catch (error) {
      apiErrorHandler(error, "fetch meeting note", res);
    }
  });

  // Create a new meeting note
  app.post("/api/meeting-notes", requireAuth, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const meetingNoteData = req.body;
      
      // Validate required fields
      if (!meetingNoteData.companyName) {
        return res.status(400).json({ message: "Company name is required" });
      }
      
      if (!meetingNoteData.meetingType) {
        return res.status(400).json({ message: "Meeting type is required" });
      }
      
      // Set the user ID in the meeting note data
      meetingNoteData.userId = userId;
      
      // Create the meeting note
      const meetingNote = await storage.createMeetingNote(meetingNoteData);
      
      // Transform aiAnalysis and facialAnalysisResults from strings back to objects for response
      const transformedNote = {
        ...meetingNote,
        aiAnalysis: meetingNote.aiAnalysis ? JSON.parse(meetingNote.aiAnalysis) : null,
        facialAnalysisResults: meetingNote.facialAnalysisResults ? JSON.parse(meetingNote.facialAnalysisResults) : null
      };
      
      res.status(201).json({ meetingNote: transformedNote });
    } catch (error) {
      apiErrorHandler(error, "create meeting note", res);
    }
  });

  // Update a meeting note
  app.patch("/api/meeting-notes/:id", requireAuth, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const noteId = parseInt(req.params.id, 10);
      const meetingNoteData = req.body;
      
      if (isNaN(noteId)) {
        return res.status(400).json({ message: "Invalid meeting note ID" });
      }
      
      // Check if the meeting note exists
      const existingNote = await storage.getMeetingNote(noteId);
      
      if (!existingNote) {
        return res.status(404).json({ message: "Meeting note not found" });
      }
      
      // Ensure user can only update their own meeting notes
      if (existingNote.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      // Update the meeting note
      const meetingNote = await storage.updateMeetingNote(noteId, meetingNoteData);
      
      // Transform aiAnalysis and facialAnalysisResults from strings back to objects for response
      const transformedNote = {
        ...meetingNote,
        aiAnalysis: meetingNote.aiAnalysis ? JSON.parse(meetingNote.aiAnalysis) : null,
        facialAnalysisResults: meetingNote.facialAnalysisResults ? JSON.parse(meetingNote.facialAnalysisResults) : null
      };
      
      res.json({ meetingNote: transformedNote });
    } catch (error) {
      apiErrorHandler(error, "update meeting note", res);
    }
  });

  // Delete a meeting note
  app.delete("/api/meeting-notes/:id", requireAuth, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const noteId = parseInt(req.params.id, 10);
      
      if (isNaN(noteId)) {
        return res.status(400).json({ message: "Invalid meeting note ID" });
      }
      
      // Check if the meeting note exists
      const existingNote = await storage.getMeetingNote(noteId);
      
      if (!existingNote) {
        return res.status(404).json({ message: "Meeting note not found" });
      }
      
      // Ensure user can only delete their own meeting notes
      if (existingNote.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      // Delete the meeting note
      await storage.deleteMeetingNote(noteId);
      
      res.status(204).end();
    } catch (error) {
      apiErrorHandler(error, "delete meeting note", res);
    }
  });

  // Video/audio processing and facial analysis endpoints
  app.post("/api/meeting-notes/analyze-recording", requireAuth, async (req, res) => {
    try {
      // This would be implemented with a file upload and analysis in a real system
      // For now, we'll simulate the analysis with Gemini
      const { base64Audio, base64Video, companyName, meetingType } = req.body;
      
      if (!companyName) {
        return res.status(400).json({ message: "Company name is required" });
      }
      
      // Log analysis request
      console.log(`[AUDIT] Meeting recording analysis requested by ${(req.user as any).username} for "${companyName}" at ${new Date().toISOString()}`);
      
      // Simulated analysis result - in a real implementation, this would use actual
      // audio/video data and process with the appropriate APIs
      const analysisResult = {
        transcription: "Simulated transcription of the meeting recording...",
        summary: "Key points from the meeting discussion about investment opportunity.",
        aiAnalysis: {
          keyPoints: [
            "Team has strong technical background",
            "Product demonstrates market fit",
            "Currently generating $500K ARR with 15% month-over-month growth",
            "Seeking $3M in Series A funding"
          ],
          sentimentAnalysis: {
            overall: "positive",
            confidence: 0.85
          },
          truthfulnessAssessment: {
            concerns: [],
            confidenceLevel: "high"
          },
          recommendedActions: [
            "Schedule follow-up meeting",
            "Request customer testimonials",
            "Review financial projections in detail"
          ]
        },
        facialAnalysisResults: {
          attentiveness: 0.92,
          confidence: 0.88,
          nervousness: 0.35,
          potentialDeception: {
            detected: false,
            confidenceScore: 0.95,
            moments: []
          }
        }
      };
      
      res.json({ analysis: analysisResult });
    } catch (error) {
      apiErrorHandler(error, "analyze meeting recording", res);
    }
  });

  app.post("/api/meeting-notes/transcribe", requireAuth, async (req, res) => {
    try {
      // Placeholder for actual audio transcription service
      // In a real implementation, this would use a service like AssemblyAI, Azure Speech, etc.
      
      const { base64Audio } = req.body;
      
      if (!base64Audio) {
        return res.status(400).json({ message: "Audio data is required" });
      }
      
      // This is where you'd call the actual transcription service
      // For now, we'll simulate a response from Gemini AI
      const transcriptionResult = {
        transcription: "Simulated transcription of the audio using speech-to-text API...",
        confidence: 0.92
      };
      
      res.json({ result: transcriptionResult });
    } catch (error) {
      apiErrorHandler(error, "transcribe audio", res);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
