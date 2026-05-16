import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const GeminiService = {
  /**
   * Summarize an API's purpose and key features based on its description.
   */
  async summarizeAPI(description: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide a concise, 2-sentence technical summary of the following API description. Focus on its unique value proposition for developers: "${description}"`,
    });
    return response.text;
  },

  /**
   * Recommend APIs based on a user's project goal.
   */
  async getRecommendations(projectGoal: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Acts as a senior API architect. Based on the user's project goal: "${projectGoal}", suggest 3 types of APIs they should look for. Provide only the category names as a JSON array of strings.`,
      config: {
        responseMimeType: "application/json",
      }
    });
    
    try {
      return JSON.parse(response.text || "[]");
    } catch (e) {
      return [];
    }
  },

  /**
   * Generate code snippets for a given API endpoint.
   */
  async generateCodeSnippet(endpoint: string, method: string, language: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Generate a production-ready code snippet in ${language} to call the following endpoint: ${method} ${endpoint}. Include necessary imports and basic error handling. Return ONLY the code block.`,
    });
    return response.text;
  },

  /**
   * Analyze an API response for anomalies or potential bugs.
   */
  async analyzeResponse(responseData: any) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this JSON API response for any logical inconsistencies, security risks (like leaked PII), or implementation tips: ${JSON.stringify(responseData)}`,
    });
    return response.text;
  }
};
