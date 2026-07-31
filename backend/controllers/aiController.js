import { GoogleGenAI } from '@google/genai';

export const askGemini = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ success: false, message: 'Prompt is required' });
    }

    // Initialize Gemini AI Client
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // Generate response using gemini-2.5-flash
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are ShadowDine AI, an intelligent restaurant reservation and food recommendation assistant."
      }
    });

    res.status(200).json({
      success: true,
      reply: response.text
    });

  } catch (error) {
    console.error('❌ Gemini AI Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate response from Gemini AI',
      error: error.message
    });
  }
};