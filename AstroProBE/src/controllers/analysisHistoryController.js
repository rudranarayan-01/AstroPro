import { getAnalysisHistorybyClient } from "../models/AnalysisHistory.js";

export const ClientAnalysisHistory = async (req, res) => {
  try {
    const client_id = req.query.client_id;
    if (!client_id) {
      return res
        .status(400)
        .json({
          success: false,
          message: "client_id query parameter is required",
        });
    }
    const history = await getAnalysisHistorybyClient(client_id);
    res.json({ success: true, history });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getAnalysisHistorybyAstrologer = async (req, res) => {
  try {
    const astrologer_id = req.user.id; // Assuming user is authenticated and ID is available
    const history = await getAnalysisHistorybyAstrologer(astrologer_id);
    res.json({ success: true, history });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
