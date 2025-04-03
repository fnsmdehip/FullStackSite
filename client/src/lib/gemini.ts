// Client-side Gemini API helper functions

/**
 * Sends a query to the Gemini AI through our backend API
 * @param query The user's query text
 * @returns Promise with the AI response data
 */
export async function queryGeminiAI(query: string): Promise<any> {
  try {
    const response = await fetch('/api/ai/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error querying Gemini AI:', error);
    throw error;
  }
}

/**
 * Analyzes a company profile using Gemini AI
 * @param companyData The company data to analyze
 * @returns Promise with the AI analysis results
 */
export async function analyzeCompany(companyData: any): Promise<any> {
  try {
    const response = await fetch('/api/ai/analyze-company', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ companyData }),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error analyzing company with Gemini AI:', error);
    throw error;
  }
}

/**
 * Gets market trend insights from Gemini AI
 * @param sector Optional sector to filter insights
 * @returns Promise with market trend insights
 */
export async function getMarketTrends(sector?: string): Promise<any> {
  try {
    const url = sector 
      ? `/api/ai/market-trends?sector=${encodeURIComponent(sector)}`
      : '/api/ai/market-trends';
      
    const response = await fetch(url, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting market trends from Gemini AI:', error);
    throw error;
  }
}
