import { supabase } from "../config/supabase.js";
import { saveAnalysisRecord } from "../models/AnalysisHistory.js";
import { AuditLog } from "../models/AuditLog.js";
import { generateDetailedReport } from "../services/ai/kundliAIService.js";
import { analyzePalmWithAI } from "../services/ai/palmService.js";
import { calculateAdvancedVastuScore, generateVastuReportWithAI } from "../services/ai/vastruService.js";
import { getKundliData } from "../services/astrologyService.js";
import { getInterpretation } from "../services/interpretationService.js";
import { calculateVastuScore } from "../services/vastuService.js";
import { preprocessPalmImage } from "../utils/imagePreprocessor.js";

export const analyzePalm = async (req, res) => {
  try {
    // 1. Core Request & File Validations
    if (!req.file) {
      return res.status(400).json({ success: false, error: "Please upload an image" });
    }
    const clientId = req.body.client_id;
    if (!clientId) {
      return res.status(400).json({ success: false, error: "client_id is required to link this reading." });
    }
    if (!req.file.mimetype.startsWith("image/")) {
      return res.status(400).json({ success: false, error: "Uploaded file must be an image." });
    }

    // 2. Preprocess the image buffer (essential for AI processing and optional upload)
    const sanitizedBuffer = await preprocessPalmImage(req.file.buffer);

    // 3. Initiate the AI Analysis (This is the critical core path)
    const analysisResult = await analyzePalmWithAI(sanitizedBuffer, "image/webp");

    // 4. Isolated Optional Storage Upload Block
    let fileName = null;
    let publicUrl = null;

    try {
      fileName = `${req.user.id}/${Date.now()}.webp`;

      const { data, error } = await supabase.storage
        .from("palm-images")
        .upload(fileName, sanitizedBuffer, { 
          contentType: "image/webp",
          cacheControl: "3600",
          upsert: false
        });

      if (error) {
        // Log the storage error but do not throw it to the parent catch block
        console.warn("Supabase Storage Upload failed (Non-blocking):", error.message);
        fileName = null;
      } else {
        // Only attempt to construct a public URL if the upload succeeded
        const { data: urlData } = supabase.storage
          .from("palm-images")
          .getPublicUrl(fileName);
        
        publicUrl = urlData?.publicUrl || null;
      }
    } catch (storageErr) {
      // Catch any unexpected filesystem, network, or SDK crashes during upload
      console.error("Critical Storage Error bypassed (Non-blocking):", storageErr.message);
      fileName = null;
      publicUrl = null;
    }

    try {
      await saveAnalysisRecord({
        astrologer_id: req.user.id,
        client_id: clientId,
        analysis_type: 'PALM',
        input_data: { 
          image_path: fileName, 
          public_url: publicUrl
        },
        result_data: analysisResult 
      });
    } catch (dbError) {
      console.error("Failed to archive reading to database:", dbError.message);
    }

    // 6. Return success response (with optional publicUrl included if it exists)
    return res.status(200).json({ 
      success: true, 
      imageUrl: publicUrl, // frontend handles null by showing a default visual or skipping image rendering
      analysis: analysisResult 
    });

  } catch (err) {
    console.error("Palm Analysis Controller Error:", err);
    return res.status(500).json({ 
      success: false, 
      error: err.message || "An unexpected error occurred during palm analysis." 
    });
  }
};

export const analyzeVastu = async (req, res) => {
  const { rooms, client_id } = req.body;
  const astrologerId = req.user?.id;
  if (!rooms || !Array.isArray(rooms) || rooms.length === 0) {
    return res.status(400).json({
      success: false,
      message: "At least one room configuration with a defined direction is required for Vastu analysis.",
    });
  }
  try {
    const scoreMetrics = calculateAdvancedVastuScore(rooms);
    const aiReport = await generateVastuReportWithAI(rooms, scoreMetrics);
    const finalVastuResult = {
      score: scoreMetrics.score,
      elements_breakdown: scoreMetrics.roomReports,
      detailed_analysis: aiReport,
    };
    await saveAnalysisRecord({
      astrologer_id: astrologerId,
      client_id: client_id,
      analysis_type: "VASTU",
      input_data: { rooms },
      result_data: finalVastuResult,
    });
    try {
      await AuditLog.recordAction({
        userId: astrologerId,
        action: "VASTU_GENERATE",
        status: "SUCCESS",
        metadata: { 
          total_rooms: rooms.length, 
          calculated_score: scoreMetrics.score 
        },
      });
    } catch (auditErr) {
      console.warn("Audit Log non-blocking failure:", auditErr.message);
    }
    return res.status(200).json({
      success: true,
      data: finalVastuResult,
    });
  } catch (err) {
    console.error("Vastu Controller Error:", err);
    try {
      await AuditLog.recordAction({
        userId: astrologerId,
        action: "VASTU_GENERATE",
        status: "FAILURE",
        error: err.message,
      });
    } catch (auditErr) {
      console.warn("Audit Log failure fallback tracking failed:", auditErr.message);
    }
    return res.status(500).json({
      success: false,
      error: err.message || "An unexpected error occurred during Vastu diagnostics.",
    });
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