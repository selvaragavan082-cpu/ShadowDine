import { GoogleGenerativeAI } from "@google/generative-ai";

// Generated Gemini API Key
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY || "PASTE_YOUR_COPIED_GEMINI_KEY_HERE";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export const getFoodRecommendation = async (userPreference) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `You are an AI assistant for ShadowDine restaurant. Answer the user nicely: "${userPreference}"`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error details:", error);
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
