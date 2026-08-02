import { GoogleGenAI } from '@google/genai';

export const askGemini = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ success: false, message: 'Prompt is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : '';

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: 'GEMINI_API_KEY is missing from environment variables on Render. Please add GEMINI_API_KEY under Environment Variables in your Render Dashboard.'
      });
    }

    // Initialize Gemini AI Client
    const ai = new GoogleGenAI({ apiKey });

    let responseText = '';

    try {
      // Try gemini-2.5-flash first
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction: "You are ShadowDine AI, an intelligent restaurant reservation and food recommendation assistant."
        }
      });
      responseText = response.text;
    } catch (modelErr) {
      console.warn('⚠️ gemini-2.5-flash failed, attempting gemini-1.5-flash fallback:', modelErr.message);
      // Fallback to gemini-1.5-flash
      const fallbackResponse = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: prompt
      });
      responseText = fallbackResponse.text;
    }

    res.status(200).json({
      success: true,
      reply: responseText
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