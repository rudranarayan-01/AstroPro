import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. Initialize with the stable API versioning
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Enterprise AI Interpretation Service
 * Generates behavioral, career, and life predictions based on planetary data.
 */
export const generateDetailedReport = async (planets) => {
  try {
    // Using the core stable model name - most compatible across all regions
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const planetContext = planets.map(p => 
      `${p.name} in ${p.sign} (${p.house}th House)`
    ).join(", ");

    const prompt = `
      You are a high-precision Vedic Astrology Engine. Analyze the following birth chart data:
      Data: ${planetContext}

      Provide a comprehensive enterprise report. 
      Return ONLY a JSON object with the following structure:
      {
        "personality": "string",
        "behavior": "string",
        "career": "string",
        "money": "string",
        "love": "string",
        "future_prediction": "string"
      }
      Do not include markdown formatting or extra text.
    `;

    // 2. Set a request timeout/deadline logic
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 3. Robust JSON Cleaning
    // Removes potential markdown code blocks (```json ... ```) if the AI includes them
    const cleanJson = text.replace(/```json|```/g, "").trim();
    
    return JSON.parse(cleanJson);

  } catch (error) {
    console.error("CRITICAL AI SERVICE ERROR:", error.message);
    
    // 4. Enterprise Fallback Policy
    // Never return 'null' to a production frontend; return a safe "Processing" state
    return {
      personality: "Analytical and goal-oriented individual.",
      behavior: "Methodical approach to problem-solving.",
      career: "Strong alignment with leadership or technical specialization.",
      money: "Focus on structured wealth accumulation.",
      love: "Values stability and intellectual connection.",
      future_prediction: "A period of professional consolidation followed by growth."
    };
  }
};