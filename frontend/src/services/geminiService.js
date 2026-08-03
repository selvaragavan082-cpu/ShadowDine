import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.REACT_APP_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

/**
 * Helper service to query Gemini AI for dish recommendations or culinary chat
 * @param {string} prompt User prompt or query
 * @returns {Promise<string>} AI text response
 */
export const getGeminiRecommendation = async (prompt) => {
  try {
    if (!apiKey) {
      console.warn("Gemini API key is not set in REACT_APP_GEMINI_API_KEY environment variable.");
    }
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error invoking Gemini AI service:", error);
    throw error;
  }
};

const geminiService = {
  getGeminiRecommendation,
};

export default geminiService;
