import { Server } from "socket.io";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto"; // 👈 Native Node.js module to generate UUIDs
import { saveChatMessage } from "../controllers/ChatController.js";

// Active connections map: userId -> socketInstance
const activeConnections = new Map();

// Initialize Supabase backend client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "🚨 [Socket Init] Missing SUPABASE_URL or SUPABASE_ANON_KEY in backend .env!",
  );
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
      socket.handshake.auth?.token || socket.handshake.headers?.authorization;

    if (!token) {
      console.warn("🔌 [Socket Auth] Connection rejected: Token is missing.");
      return next(new Error("Authentication error: Token missing"));
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7).trim();
    }

    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser(token);

      if (error || !user) {
        throw new Error(error?.message || "Invalid Supabase session");
      }

      socket.user = {
        id: user.id,
        role: user.role || "authenticated",
        email: user.email,
      };

      console.log(
        `✅ [Socket Auth] Verified user: ${socket.user.id} (${socket.user.role})`,
      );
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

      const messageId = crypto.randomUUID();

      // 1. Map the generic Supabase 'authenticated' role to your DB allowed types
      // Change 'ASTROLOGER' / 'CLIENT' to lowercase if your DB uses lowercase constraints!
      let senderType = "CLIENT";
      if (userRole === "authenticated" || userRole === "astrologer") {
        senderType = "ASTROLOGER";
      }

      // 2. This structure is emitted to the frontend UI
      const messageData = {
        id: messageId,
        client_id,
        sender_type: senderType, // 👈 Send the mapped role to the UI
        sender_id: userId,
        message: message.trim(),
        created_at: new Date().toISOString(),
      };

      // Broadcast immediately to the room
      io.to(client_id).emit("receive_message", messageData);

      // Async DB Persistence
      try {
        await saveChatMessage({
          id: messageId,
          clientId: client_id,
          senderId: userId,
          senderType: senderType, // 👈 Pass the mapped role ('ASTROLOGER') to the DB helper
          message: message.trim(),
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
