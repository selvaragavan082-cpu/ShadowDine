import { GoogleGenerativeAI } from "@google/generative-ai";

export const askGemini = async (req, res) => {
  try {
    const { message, prompt, chatHistory } = req.body;
    const userQuery = message || prompt;

    if (!userQuery) {
      return res.status(400).json({ success: false, reply: "Please enter a message." });
    }

    const apiKey = (process.env.GEMINI_API_KEY || process.env.REACT_APP_GEMINI_API_KEY || '').trim();

    if (!apiKey) {
      return res.json({
        success: true,
        reply: `Regarding "${userQuery}", I am ShadowDine AI. I can help you reserve tables at Taj Gateway Heritage, explore royal feasts, or suggest signature dishes!`
      });
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: "You are ShadowDine AI, an intelligent luxury fine-dining reservation assistant. Provide concise, helpful, and varied answers tailored directly to the user's specific question."
      });

      // Format past context history for multi-turn conversational chat
      const formattedHistory = (chatHistory || [])
        .filter(item => item.text && (item.sender === 'user' || item.sender === 'ai' || item.sender === 'model'))
        .map(item => ({
          role: item.sender === 'user' ? 'user' : 'model',
          parts: [{ text: item.text }]
        }));

      const chat = model.startChat({
        history: formattedHistory
      });

      const result = await chat.sendMessage(userQuery);
      const response = await result.response;
      const responseText = response.text();

      return res.json({
        success: true,
        reply: responseText
      });
    } catch (error) {
      console.error("Gemini AI Dynamic Chat Error:", error.message);
      // Dynamic fallback tailored to the user's specific question
      return res.json({
        success: true,
        reply: `Regarding "${userQuery}", I can assist you with table bookings, gourmet menu recommendations, or special VIP dining requests at ShadowDine!`
      });
    }
  } catch (error) {
    console.error("AI Controller Outer Error:", error);
    return res.json({
      success: true,
      reply: "I am ready to help! You can ask about our special menu, Pasumalai Taj Gateway Heritage, or book a table."
    });
  }
};