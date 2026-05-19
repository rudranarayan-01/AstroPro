// backend/src/controllers/PublicAstrologyController.js
import { getKundliData } from "../services/astrologyService"; // Your existing calculation library

export const getPublicAnalysis = async (req, res) => {
  try {
    const { name, dob, tob, location } = req.body;

    // 1. Data Validation Guard
    if (!name || !dob || !tob || !location) {
      return res.status(400).json({
        success: false,
        message: "Missing mandatory cosmic coordinates: name, dob, tob, and location are required."
      });
    }

    console.log(`📡 Calculating dynamic transient chart for public visitor: ${name}`);

    // 2. Invoke your existing engine calculations dynamically
    const analysisData = await getKundliData({ dob, tob, location });

    // 3. Return payload directly to UI without storing records against an authenticated user_id
    return res.status(200).json({
      success: true,
      meta: {
        name,
        calculatedAt: new Date().toISOString()
      },
      chartData: analysisData // Contains planetary positions, house allocations, dasha vectors
    });

  } catch (error) {
    console.error("❌ Public chart extraction engine failure:", error.message);
    return res.status(500).json({ success: false, message: "Telemetry calculation timed out." });
  }
};