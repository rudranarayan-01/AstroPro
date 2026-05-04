// controllers/analysisController.js
import { supabase } from "../config/supabase.js";

export const saveAnalysisRecord = async ({ astrologer_id, client_id, analysis_type, input_data, result_data }) => {
  const { data, error } = await supabase
    .from('analysis_history')
    .insert([{
      astrologer_id,
      client_id: client_id || null, // Optional for quick analysis
      analysis_type,
      input_data,
      result_data,
      created_at: new Date().toISOString()
    }])
    .select();

  if (error) throw error;
  return data[0];
};