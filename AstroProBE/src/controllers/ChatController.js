// src/controllers/chatController.js
import { supabase } from "../config/supabase.js"; // or your direct SQL/ORM instance

export const getChatHistory = async (req, res) => {
  try {
    const { client_id } = req.query;

    if (!client_id) {
      return res.status(400).json({ success: false, error: "Client ID is required" });
    }

    const { data: messages, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("client_id", client_id)
      .order("created_at", { ascending: true });

    if (error) throw error;

    // Map database properties to frontend interface expectations if names differ
    const formattedMessages = (messages || []).map(msg => ({
      id: msg.id,
      sender: msg.sender_type.toLowerCase(), // 'astrologer' | 'client' (mapped to 'user')
      text: msg.message,
      time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));

    return res.status(200).json({
      success: true,
      messages: formattedMessages
    });
  } catch (err) {
    console.error("Failed to fetch chat logs:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
};