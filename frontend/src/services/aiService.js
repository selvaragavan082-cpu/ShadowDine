import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.REACT_APP_GEMINI_API_KEY || '';

export const generateContent = async (prompt) => {
  try {
    if (!apiKey) {
      const err = new Error("REACT_APP_GEMINI_API_KEY is not defined in environment variables.");
      console.error(err);
      throw err;
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const chatWithGemini = async (prompt) => {
  return await generateContent(prompt);
};

const aiService = {
  generateContent,
  chatWithGemini,
};

export default aiService;
