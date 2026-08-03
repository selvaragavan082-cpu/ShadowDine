import axios from 'axios';

export const askGemini = async (req, res) => {
  try {
    const { message, prompt } = req.body;
    const userQuery = message || prompt;

    if (!userQuery) {
      return res.status(400).json({ success: false, reply: "Please enter a message." });
    }

    const apiKey = (process.env.GEMINI_API_KEY || process.env.REACT_APP_GEMINI_API_KEY || '').trim();

    if (!apiKey) {
      return res.json({
        success: true,
        reply: "ShadowDine AI system initialized! Ask me about fine dining, tables, or special menus."
      });
    }

    // Direct Gemini REST API Call to avoid SDK method mismatch errors
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      const response = await axios.post(url, {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `You are ShadowDine AI, a friendly fine dining assistant for ShadowDine restaurant platform. Respond directly, natural, dynamically, and concisely in English or Tanglish according to the user message: "${userQuery}"`
              }
            ]
          }
        ]
      });

      const replyText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (replyText) {
        return res.json({ success: true, reply: replyText });
      } else {
        return res.json({
          success: true,
          reply: `Taj Gateway Heritage and top fine dining options are available for booking near you at ShadowDine!`
        });
      }
    } catch (apiErr) {
      console.error("Gemini Direct API Error Details:", apiErr?.response?.data || apiErr.message);
      return res.json({
        success: true,
        reply: "We have exclusive fine dining options like Taj Gateway Heritage in Pasumalai, Madurai available for table reservations."
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