import { supabase } from "../config/supabase.js";
import { AuditLog } from "../models/AuditLog.js";
import { generateDetailedReport } from "../services/ai/kundliAIService.js";
import { getKundliData } from "../services/astrologyService.js";
import { getInterpretation } from "../services/interpretationService.js";
import { calculateVastuScore } from "../services/vastuService.js";
import { saveAnalysisRecord } from "./analysisController.js";

export const analyzePalm = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Please upload an image" });

    const fileName = `${req.user.id}/${Date.now()}.webp`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("palm-images")
      .upload(fileName, req.file.buffer, { contentType: "image/webp" });

    if (uploadError) throw uploadError;

    const analysisResult = {
      life_line: "Strong and clear",
      fate_line: "Prominent after age 25",
      image_url: fileName,
    };

    // SaaS Persistence: Archive the palm reading
    await saveAnalysisRecord({
      astrologer_id: req.user.id,
      client_id: req.body.client_id, // From frontend if available
      analysis_type: 'PALM',
      input_data: { image_path: fileName },
      result_data: analysisResult
    });

    res.json({ success: true, analysis: analysisResult });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const analyzeVastu = async (req, res) => {
  try {
    const { rooms, client_id } = req.body;
    const result = calculateVastuScore(rooms);

    // SaaS Persistence: Archive Vastu
    await saveAnalysisRecord({
      astrologer_id: req.user.id,
      client_id: client_id,
      analysis_type: 'VASTU',
      input_data: { rooms },
      result_data: result
    });

    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const analyzeKundli = async (req, res) => {
  const { dob, tob, lat, lon, client_id } = req.body;
  const astrologerId = req.user?.id;

  if (!dob || !tob || lat === undefined || lon === undefined) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: dob, tob, lat, and lon are all mandatory.",
    });
  }

  try {
    const data = await getKundliData(dob, tob, lat, lon);
    const interpretedData = getInterpretation(data.planets);
    const aiReport = await generateDetailedReport(interpretedData);

    const finalResult = {
      chart: interpretedData,
      predictions: aiReport,
    };

    // SaaS Persistence: Archive the Kundli session
    // We do this before the response to ensure data integrity
    await saveAnalysisRecord({
      astrologer_id: astrologerId,
      client_id: client_id, // null for Quick Analysis, string for Registered Client
      analysis_type: 'KUNDLI',
      input_data: { dob, tob, lat, lon },
      result_data: finalResult
    });

    await AuditLog.recordAction({
      userId: astrologerId,
      action: "KUNDLI_GENERATE",
      status: "SUCCESS",
      metadata: { dob, lat, lon },
    });

    res.json({
      success: true,
      data: finalResult,
    });
  } catch (error) {
    await AuditLog.recordAction({
      userId: astrologerId,
      action: "KUNDLI_GENERATE",
      status: "FAILURE",
      error: error.message,
    });
    res.status(500).json({ success: false, message: error.message });
  }
};