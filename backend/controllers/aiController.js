import { GoogleGenerativeAI } from "@google/generative-ai";

export const askGemini = async (req, res) => {
  try {
    const message = req.body.message || req.body.prompt;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Message or prompt is required' });
    }

    const apiKey = (process.env.GEMINI_API_KEY || process.env.REACT_APP_GEMINI_API_KEY || '').trim();

    if (!apiKey) {
      return res.json({
        success: true,
        reply: "Welcome to ShadowDine! I can help you reserve tables at Taj Gateway Heritage, explore royal feasts, or suggest signature dishes."
      });
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const promptText = `You are ShadowDine AI, a luxury fine dining reservation assistant. Answer politely to: "${message}"`;
      const result = await model.generateContent(promptText);
      const response = await result.response;
      const text = response.text();

      return res.json({
        success: true,
        reply: text
      });
    } catch (error) {
      console.error("Gemini API Error:", error.message);
      // Fallback response instead of 500 error
      return res.json({
        success: true,
        reply: "I am ready to help! You can ask about our special menu, Pasumalai Taj Gateway Heritage, or book a table."
      });
    }
  } catch (error) {
    console.error("AI Controller Error:", error);
    return res.json({
      success: true,
      reply: "Welcome to ShadowDine! I can assist you with dining options and table reservations."
    });
  }
};