// src/sockets/chatSocket.js
import { Server } from "socket.io";
import { createClient } from "@supabase/supabase-js";
import { saveAnalysisRecord } from "../models/AnalysisHistory.js";

// Active connections map: userId -> socketInstance
const activeConnections = new Map();

// Initialize Supabase backend client
// Ensure SUPABASE_URL and SUPABASE_ANON_KEY are defined in your backend .env file
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("🚨 [Socket Init] Missing SUPABASE_URL or SUPABASE_ANON_KEY in backend .env!");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const initChatSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // JWT Authentication Middleware for Sockets using Supabase Client API
  io.use(async (socket, next) => {
    let token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization;

    if (!token) {
      console.warn("🔌 [Socket Auth] Connection rejected: Token is missing.");
      return next(new Error("Authentication error: Token missing"));
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7).trim();
    }

    try {
      // Ask Supabase directly to verify the JWT and retrieve the user context
      // This handles ES256 / RS256 / HS256 automatically and checks expiration
      const { data: { user }, error } = await supabase.auth.getUser(token);

      if (error || !user) {
        throw new Error(error?.message || "Invalid Supabase session");
      }

      // Map the verified user properties to the socket instance
      socket.user = {
        id: user.id,
        role: user.role || "authenticated",
        email: user.email,
      };

      console.log(`✅ [Socket Auth] Verified user: ${socket.user.id} (${socket.user.role})`);
      next();
    } catch (err) {
      console.error("❌ [Socket Auth Error] Supabase validation failed:");
      console.error(`   - Message: ${err.message}`);
      return next(new Error(`Authentication error: ${err.message}`));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.user.id;
    const userRole = socket.user.role;

    activeConnections.set(userId, socket);
    console.log(
      `⚡ User connected: ${userId} (${userRole}) via Socket ID: ${socket.id}`,
    );

    // Join a room based on the client_id to keep conversations private
    socket.on("join_room", ({ client_id }) => {
      socket.join(client_id);
      console.log(`👤 Socket ${socket.id} joined Chat Room: ${client_id}`);
    });

    // Handle incoming messages
    socket.on("send_message", async (payload) => {
      const { client_id, message } = payload;

      if (!message || message.trim() === "") return;

      const messageData = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        client_id,
        sender_type: userRole,
        sender_id: userId,
        message: message.trim(),
        created_at: new Date().toISOString(),
      };

      // Broadcast immediately to the room (Real-time latency path)
      io.to(client_id).emit("receive_message", messageData);

      // Async DB Persistence (Non-blocking backup path)
      try {
        await saveAnalysisRecord({
          clientId: client_id,
          senderId: userId,
          senderType: userRole,
          message: message.trim()
        });
        console.log(
          `💾 Archived message from ${userId} under room ${client_id}`,
        );
      } catch (dbError) {
        console.error(
          "⚠️ Database failed to archive real-time message:",
          dbError.message,
        );
      }
    });

    socket.on("disconnect", () => {
      activeConnections.delete(userId);
      console.log(`🔌 User disconnected: ${userId}`);
    });
  });

  return io;
};