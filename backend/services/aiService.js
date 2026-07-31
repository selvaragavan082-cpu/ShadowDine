import { GoogleGenAI } from '@google/genai';

export const generateEmailContent = async (bookingDetails) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const prompt = `Write a polite, warm and professional table reservation confirmation email in Tamil for customer ${bookingDetails.customerName}. 
    Restaurant: ${bookingDetails.restaurantName}, Date: ${bookingDetails.reservationDate}, Time: ${bookingDetails.timeSlot}, Guests: ${bookingDetails.guestsCount}. 
    Mention that this is sent from 'ShadowDine' app.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error('AI Generation Error:', error);
    return `Hello ${bookingDetails.customerName}, your reservation at ${bookingDetails.restaurantName} on ${bookingDetails.reservationDate} at ${bookingDetails.timeSlot} is confirmed! - ShadowDine`;
  }
};