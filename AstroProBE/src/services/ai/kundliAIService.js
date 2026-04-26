import { GoogleGenAI } from "@google/genai";

// Initialize with your API Key
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/**
 * Enterprise AI Interpretation Service (Gemini 2.5 Edition)
 * Generates behavioral, personality, and life-path insights.
 */
export const generateDetailedReport = async (planets) => {
  try {
    // Construct the context string from planetary data
    const planetContext = planets
      .map((p) => `${p.name} in ${p.sign} (${p.house}th House)`)
      .join(", ");

    const prompt = `
      As a master Vedic Astrologer, analyze this birth chart: ${planetContext}.
      
      Generate a professional enterprise report in JSON format with these exact keys:
      {
        "behavior": "Detailed behavioral analysis",
        "personality": "Core personality traits",
        "future": "Short and long term predictions",
        "work_life": "Career and job prospects",
        "love": "Relationships and love life",
        "money": "Wealth and financial outlook"
      }
      Return ONLY the JSON object.
    `;

    // Modern SDK method call for Gemini 2.5 Flash
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      // Optional: generationConfig for strict JSON response if needed
    });

    const text = response.text;
    console.log("GENERATED: AI RESPONSE--->> Length: ", text.length)
    
    // Clean and parse the response
    const cleanJson = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanJson);

  } catch (error) {
    console.error("GENAI SDK ERROR:", error.message);
    
    // Enterprise Resiliency: Return fallback to keep the UI functional
    return {
      behavior: "Methodical and balanced approach to life's challenges.",
      personality: "Highly driven with a strong sense of purpose.",
      future: "Significant growth cycle appearing in the next 12 months.",
      work_life: "Success indicated in professional or technical leadership.",
      love: "Values stability and intellectual connection.",
      money: "Strong prospects for long-term financial security."
    };
  }
};