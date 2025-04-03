import { GoogleGenerativeAI } from '@google/generative-ai';
import { storage } from "./storage";

// Initialize the Gemini AI with API key
const API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyA_sDYnM98gU4Rz24onF9rdiFBVusJkNXk';
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

// Domain-specific system prompts for specialized contexts
const SYSTEM_PROMPTS = {
  generalVC: `You are CapitalIQ, a specialized AI assistant for venture capital and private equity professionals. 
  Your expertise covers deal sourcing, due diligence, financial analysis, portfolio management, 
  and exit strategies. Your advice is data-driven, strategic, and takes into account current market conditions. 
  You understand the unique challenges of early-stage investing, growth equity, and buyouts.`,
  
  financialAnalysis: `You are a top-tier financial analyst with expertise in startup and growth-stage company 
  financials. You understand SaaS metrics, marketplace unit economics, consumer growth models, and enterprise 
  sales cycles. Your analysis should focus on cash efficiency, scalability indicators, and profitability paths.`,
  
  marketIntelligence: `You are a market research specialist with deep knowledge of industry trends, competitive 
  landscapes, and emerging technologies. Your analysis incorporates data from trusted sources and highlights 
  actionable insights for investment decision-making.`,
  
  dealFlow: `You are an expert in private market deal sourcing and evaluation. You understand investment 
  theses across sectors, from SaaS to biotech, consumer to climate tech. Your insights prioritize finding 
  asymmetric opportunities and analyzing founder-market fit.`,
  
  portfolioManagement: `You are a portfolio optimization specialist who understands follow-on investment 
  strategies, founder support, and value creation. Your expertise includes operational improvements, 
  strategic partnerships, and preparing companies for successful exits.`,
  
  web3Investing: `You are a Web3 investment analyst specializing in blockchain protocols, tokenomics, 
  decentralized applications, and crypto market dynamics. You understand regulatory considerations, 
  technical architecture, and token-based business models.`,
  
  complianceRisk: `You are a compliance and risk management specialist for investment firms. You understand 
  regulatory requirements, due diligence processes, and risk mitigation strategies across different jurisdictions.`,
  
  excelModeling: `You are a financial modeling expert specializing in Excel and sophisticated financial 
  projections. You understand cap tables, waterfall analyses, and scenario planning for venture investments.`
};

/**
 * Handles a query sent to the Gemini AI
 * @param query Text query from the user
 * @param domain Optional domain to specify expertise area
 * @returns AI response text
 */
export async function handleGeminiQuery(query: string, domain: keyof typeof SYSTEM_PROMPTS = 'generalVC'): Promise<string> {
  try {
    const systemPrompt = SYSTEM_PROMPTS[domain] || SYSTEM_PROMPTS.generalVC;
    
    const prompt = `${systemPrompt}
    
    Answer the following question with focus on investment insights, market analysis, and financial advice.
    
    Question: ${query}`;
      
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Error in Gemini AI query:', error);
    throw new Error('Failed to process query with Gemini AI');
  }
}

/**
 * Gets AI-generated insights for the dashboard
 * @returns Array of insight objects
 */
export async function getAiInsights(): Promise<any[]> {
  try {
    // Generate real-time insights with Gemini using our market intelligence system prompt
    const prompt = `${SYSTEM_PROMPTS.marketIntelligence}
    
    Generate 3 key investment insights for a venture capital firm dashboard. Make sure these are timely,
    relevant to current market conditions, and actionable by investors.
    
    Each insight should include: 
    1. A title (concise but descriptive)
    2. A short description (30-50 words) with specific facts and metrics when possible
    3. A type (either "info" for neutral market information, "warning" for risk factors, or "opportunity" for potential investments)
    4. An optional action that could be taken by the investment team
    
    Format your response as a JSON array with the following structure:
    [
      {
        "id": "1", 
        "type": "info|warning|opportunity",
        "title": "Insight title",
        "description": "Brief description",
        "actionText": "Optional action text",
        "actionLink": "Optional URL or path"
      }
    ]`;
      
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    try {
      const insights = JSON.parse(response);
      return insights;
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      // Fallback to sample insights if parsing fails
      return await storage.getAiInsights();
    }
  } catch (error) {
    console.error('Error getting AI insights:', error);
    // Fallback to sample insights in case of error
    return await storage.getAiInsights();
  }
}

/**
 * Gets market trends analysis from Gemini
 * @param sector Optional sector to analyze
 * @returns Market trends analysis
 */
export async function getMarketTrends(sector?: string): Promise<any> {
  try {
    let basePrompt = `${SYSTEM_PROMPTS.marketIntelligence}
    
    Analyze current market trends for venture capital investments`;
    
    if (sector) {
      basePrompt += ` in the ${sector} sector`;
    }
    
    const prompt = `${basePrompt}. 
    Provide detailed insights on:
    1. Growth areas and projected market size for next 5 years
    2. Key risk factors in current economic conditions
    3. Emerging opportunities and undervalued areas
    4. Investment patterns from top VCs
    5. Regulatory changes impacting investments
    
    Format your response with clear sections for each area.
    Include specific metrics, statistics, and recent market developments.
    Cite examples of recent deals or market shifts when relevant.`;
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    
    return {
      analysis: response.text(),
      sector: sector || 'All sectors',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error getting market trends:', error);
    throw new Error('Failed to get market trends analysis');
  }
}

/**
 * Analyzes a company profile using Gemini
 * @param companyData Company data to analyze
 * @returns Analysis results
 */
export async function analyzeCompany(companyData: any): Promise<any> {
  try {
    const prompt = `${SYSTEM_PROMPTS.dealFlow}
    
    Analyze this company profile for investment potential:
      Company: ${companyData.name}
      Sector: ${companyData.sector}
      Description: ${companyData.description}
      Stage: ${companyData.stage}
      
      Provide detailed insights on:
      1. Growth potential and addressable market size
      2. Market positioning and competitive landscape
      3. Potential competitive advantages and moats
      4. Key risk factors (market, technology, execution, financial)
      5. Valuation considerations with comparable companies
      6. Exit opportunities and potential acquirers
      7. Recommended investment approach (terms, size, follow-on strategy)
      
      Be specific about metrics where possible and include recent market context.
      Compare this opportunity to similar companies in the space.
      Highlight potential red flags and unique advantages.`;
      
    const result = await model.generateContent(prompt);
    const response = result.response;
    
    return {
      companyName: companyData.name,
      analysis: response.text(),
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error analyzing company:', error);
    throw new Error('Failed to analyze company with Gemini AI');
  }
}

/**
 * Analyzes financial data from uploaded spreadsheets
 * @param financialData The financial data to analyze
 * @returns Analysis of the financial data
 */
export async function analyzeFinancialData(financialData: any): Promise<any> {
  try {
    const prompt = `${SYSTEM_PROMPTS.financialAnalysis}
    
    Analyze this financial data for investment insights:
      Revenue Growth: ${financialData.revenueGrowth}
      Gross Margin: ${financialData.grossMargin}
      Customer Acquisition Cost: ${financialData.cac}
      Customer Lifetime Value: ${financialData.ltv}
      Burn Rate: ${financialData.burnRate}
      Runway: ${financialData.runway}
      
      Provide detailed financial analysis on:
      1. Financial health indicators and red flags
      2. Efficiency of capital deployment
      3. Unit economics analysis
      4. Comparison to industry benchmarks
      5. Suggestions for improvement
      6. Potential impact on valuation
      7. Recommendations for next funding round
      
      Include specific recommendations on what metrics need improvement.
      Compare to industry benchmarks for companies at similar stage and sector.
      Highlight impressive metrics and concerning indicators.`;
      
    const result = await model.generateContent(prompt);
    const response = result.response;
    
    return {
      analysis: response.text(),
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error analyzing financial data:', error);
    throw new Error('Failed to analyze financial data with Gemini AI');
  }
}

/**
 * Analyzes a cap table for investment insights
 * @param capTableData The cap table data to analyze
 * @returns Analysis of the cap table
 */
export async function analyzeCapTable(capTableData: any): Promise<any> {
  try {
    // Construct a detailed prompt based on the cap table data
    const prompt = `${SYSTEM_PROMPTS.excelModeling}
    
    Analyze this cap table data for a venture-backed company:
      Pre-money Valuation: ${capTableData.preMoneyValuation}
      Post-money Valuation: ${capTableData.postMoneyValuation}
      Round Size: ${capTableData.roundSize}
      Investor Share: ${capTableData.investorShare}%
      Founder Share: ${capTableData.founderShare}%
      Employee Pool: ${capTableData.employeePool}%
      Previous Investors: ${capTableData.previousInvestors}%
      
      Provide detailed cap table analysis on:
      1. Ownership distribution and potential concerns
      2. Dilution impact on founders and early investors
      3. Recommendations for employee option pool
      4. Potential issues for future funding rounds
      5. Comparison to industry standards
      6. Suggestions for optimal cap table structure
      7. Impact on founder control and board composition
      
      Include numeric calculations to support your analysis.
      Compare to industry standards for companies at this stage.
      Identify specific issues that may impact future fundraising.`;
      
    const result = await model.generateContent(prompt);
    const response = result.response;
    
    return {
      analysis: response.text(),
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error analyzing cap table:', error);
    throw new Error('Failed to analyze cap table with Gemini AI');
  }
}

/**
 * Analyzes Web3/blockchain investments
 * @param web3Data Data about the blockchain project
 * @returns Analysis of the Web3 investment opportunity
 */
export async function analyzeWeb3Investment(web3Data: any): Promise<any> {
  try {
    const prompt = `${SYSTEM_PROMPTS.web3Investing}
    
    Analyze this Web3/blockchain investment opportunity:
      Project Name: ${web3Data.name}
      Blockchain: ${web3Data.blockchain}
      Token Type: ${web3Data.tokenType}
      Category: ${web3Data.category}
      Team Background: ${web3Data.team}
      Funding History: ${web3Data.fundingHistory}
      
      Provide detailed Web3-specific analysis on:
      1. Technology innovation and potential market impact
      2. Tokenomics analysis and distribution concerns
      3. Regulatory compliance and risks
      4. Competitive landscape in the blockchain space
      5. Team capability for execution
      6. Community engagement and traction metrics
      7. Security considerations and audit history
      8. Liquidity and exit potential for investors
      9. Recommendations for investment terms
      
      Include specific technical assessments of the blockchain infrastructure.
      Compare to successful Web3 projects with similar models.
      Outline regulatory considerations specific to this token/blockchain type.`;
      
    const result = await model.generateContent(prompt);
    const response = result.response;
    
    return {
      projectName: web3Data.name,
      analysis: response.text(),
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error analyzing Web3 investment:', error);
    throw new Error('Failed to analyze Web3 investment with Gemini AI');
  }
}

/**
 * Generates an investment thesis for potential portfolio companies
 * @param companyData Basic company information
 * @returns Generated investment thesis
 */
export async function generateInvestmentThesis(companyData: any): Promise<any> {
  try {
    const prompt = `${SYSTEM_PROMPTS.dealFlow}
    
    Generate a comprehensive investment thesis for this potential portfolio company:
      Company: ${companyData.name}
      Sector: ${companyData.sector}
      Stage: ${companyData.stage}
      Raising: ${companyData.raising}
      Last Valuation: ${companyData.lastValuation}
      
      Create a detailed investment thesis including:
      1. Executive summary (3-4 sentences)
      2. Company overview and value proposition
      3. Market opportunity and TAM analysis
      4. Competitive landscape and differentiation
      5. Team assessment
      6. Financial projections summary
      7. Key risks and mitigations
      8. Investment recommendation with terms
      9. Expected returns and exit scenarios
      
      Structure the response in a professional format appropriate for an investment committee.
      Include specific metrics and comparables wherever possible.
      Provide concrete examples of potential exit scenarios with multiples.`;
      
    const result = await model.generateContent(prompt);
    const response = result.response;
    
    return {
      companyName: companyData.name,
      thesis: response.text(),
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error generating investment thesis:', error);
    throw new Error('Failed to generate investment thesis with Gemini AI');
  }
}

/**
 * Analyzes compliance and risk factors for an investment
 * @param complianceData Data about investment compliance factors
 * @returns Analysis of compliance and risk considerations
 */
export async function analyzeComplianceRisk(complianceData: any): Promise<any> {
  try {
    const prompt = `${SYSTEM_PROMPTS.complianceRisk}
    
    Analyze compliance and risk factors for this investment opportunity:
      Company: ${complianceData.companyName}
      Jurisdiction: ${complianceData.jurisdiction}
      Deal Structure: ${complianceData.dealStructure}
      Investor Type: ${complianceData.investorType}
      Regulated Industry: ${complianceData.isRegulatedIndustry ? 'Yes' : 'No'}
      Foreign Investment: ${complianceData.isForeignInvestment ? 'Yes' : 'No'}
      
      Provide a thorough compliance and risk assessment including:
      1. Regulatory requirements for this investment type and jurisdiction
      2. Key compliance documentation needed
      3. Potential regulatory risks and mitigation strategies 
      4. Due diligence requirements specific to this deal type
      5. Reporting obligations post-investment
      6. Tax considerations and structuring recommendations
      7. Governance best practices
      
      Structure your analysis by risk category and severity.
      Highlight must-have compliance steps versus nice-to-have measures.
      Include recent regulatory developments that may impact this investment.`;
      
    const result = await model.generateContent(prompt);
    const response = result.response;
    
    return {
      companyName: complianceData.companyName,
      analysis: response.text(),
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error analyzing compliance and risk:', error);
    throw new Error('Failed to analyze compliance and risk with Gemini AI');
  }
}
