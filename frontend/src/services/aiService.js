import { GoogleGenerativeAI } from "@google/generative-ai";

// Use environment variable or direct fallback key for testing
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY || "YOUR_ACTUAL_GEMINI_KEY_HERE";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export const getFoodRecommendation = async (userPreference) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `You are ShadowDine AI. Suggest dishes or answer for: "${userPreference}"`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini AI Exact Error:", error);
    throw error;
  }
};

export const generateContent = async (prompt) => {
  return await getFoodRecommendation(prompt);
};

export const chatWithGemini = async (prompt) => {
  return await getFoodRecommendation(prompt);
};

const aiService = {
  getFoodRecommendation,
  generateContent,
  chatWithGemini,
};

export default aiService;
