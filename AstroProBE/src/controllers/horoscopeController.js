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
import axios from 'axios';

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

let dailyCache = {
  date: null,
  data: null
};

export const getDailyTransitData = async (req, res) => {
  try {
    const todayStr = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

    // 1. Check if we already have valid cached data for today
    if (dailyCache.date === todayStr && dailyCache.data) {
      console.log("⚡ Serving Daily Horoscope from internal cache");
      return res.status(200).json({ success: true, ...dailyCache.data });
    }

    console.log("🌐 Cache miss. Requesting raw metrics from Third-Party Cosmic API...");
    
    // 2. Replace this URL and credentials with your preferred third-party provider configuration
    // Example uses a generic external standard structure
    const API_URL = process.env.ASTRO_THIRD_PARTY_URL || 'https://api.astrologyprovider.com/v1/daily';
    const API_KEY = process.env.ASTRO_THIRD_PARTY_KEY;

    // Concurrently fetch or pull data if your provider splits horoscope, rashi, and systems
    const response = await axios.get(API_URL, {
      headers: { 'Authorization': `Bearer ${API_KEY}` }
    });

    // 3. Format the response data to match your clean frontend structure
    // We break it into Today's Overview, Rashi transits, and broad Astrology metrics
    const formattedData = {
      horoscope: response.data.horoscope_predictions, // Format: { aries: '...', taurus: '...' }
      rashiData: response.data.rashi_metrics,         // Moon sign planetary metrics
      astrology: response.data.general_astrology       // Panchang elements, Nakshatra, Rahu Kaal
    };

    // 4. Update memory cache
    dailyCache.date = todayStr;
    dailyCache.data = formattedData;

    return res.status(200).json({ success: true, ...formattedData });

  } catch (error) {
    console.error("❌ Failed to resolve third-party cosmic transit telemetry:", error.message);
    
    // Fallback gracefully: If third-party API is down, send safe static structure so landing page doesn't break
    return res.status(500).json({
      success: false,
      message: "Cosmic telemetry stream currently updating.",
      // Return stale cache if available, otherwise pass empty mocks
      horoscope: dailyCache.data?.horoscope || {},
      rashiData: dailyCache.data?.rashiData || {},
      astrology: dailyCache.data?.astrology || { panchang: "Updating nodes...", nakshatra: "Analyzing coordinates..." }
    });
  }
};