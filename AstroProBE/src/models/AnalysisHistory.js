// controllers/analysisController.js
import { supabase } from "../config/supabase.js";

export const saveAnalysisRecord = async ({
  astrologer_id,
  client_id,
  analysis_type,
  result_data,
}) => {
  // Ensure the keys here match your Supabase column names exactly
  const { data, error } = await supabase
    .from("analysis_history")
    .insert([
      {
        astrologer_id, // This must be a valid UUID from auth.users
        client_id: client_id || null,
        analysis_type,
        result_data, // This matches your jsonb column
        created_at: new Date().toISOString(),
      },
    ])
    .select();

  if (error) {
    console.error("Supabase Insert Error:", error);
    throw error;
  }
  return data[0];
};

export const getAnalysisHistorybyClient = async (client_id) => {
  const { data, error } = await supabase
    .from("analysis_history")
    .select("*")
    .eq("client_id", client_id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase Fetch Error:", error);
    throw error;
  }
  return data;
};
