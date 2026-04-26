import { supabase } from "../config/supabase.js";
import { AuditLog } from "../models/AuditLog.js";
import { generateDetailedReport } from "../services/ai/kundliAIService.js";
import { getKundliData } from "../services/astrologyService.js";
import { getInterpretation } from "../services/interpretationService.js";
import { calculateVastuScore } from "../services/vastuService.js";

export const analyzePalm = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ error: "Please upload an image" });

    // 1. Upload to Supabase Storage for audit/history
    const fileName = `${req.user.id}/${Date.now()}.webp`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("palm-images")
      .upload(fileName, req.file.buffer, { contentType: "image/webp" });

    if (uploadError) throw uploadError;

    // 2. Placeholder for AI processing (e.g., Gemini Vision or OpenCV)
    const analysis = {
      life_line: "Strong and clear",
      fate_line: "Prominent after age 25",
      image_url: fileName,
    };

    res.json({ success: true, analysis });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const analyzeVastu = async (req, res) => {
  const { rooms } = req.body; // Array of objects: { type, direction }
  const result = calculateVastuScore(rooms);
  res.json({ success: true, ...result });
};

export const analyzeKundli = async (req, res) => {
  const { dob, tob, lat, lon } = req.body;
  const userId = req.user?.id;

  // Enterprise Guard: Check for missing fields immediately
  if (!dob || !tob || lat === undefined || lon === undefined) {
    return res.status(400).json({
      success: false,
      message:
        "Missing required fields: dob, tob, lat, and lon are all mandatory.",
    });
  }

  try {
    const data = await getKundliData(dob, tob, lat, lon);
    if (data) {
      console.log("GENERATED: Analyze Kundli");
    }
    const interpretedData = getInterpretation(data.planets);
    console.log("GENERATED-->> Interpreted");

    const aiReport = await generateDetailedReport(interpretedData);

    await AuditLog.recordAction({
      userId,
      action: "KUNDLI_GENERATE",
      status: "SUCCESS",
      metadata: { dob, lat, lon },
    });

    res.json({
      success: true,
      data: {
        chart: interpretedData,
        predictions: aiReport,
      },
    });
  } catch (error) {
    await AuditLog.recordAction({
      userId,
      action: "KUNDLI_GENERATE",
      status: "FAILURE",
      error: error.message,
    });

    res.status(500).json({ success: false, message: error.message });
  }
};
