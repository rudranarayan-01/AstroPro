import express from "express";
import { createServer } from "http";
import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import { initChatSocket } from "./sockets/ChatSocket.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import horoscopeRoutes from "./routes/horoscopeRoutes.js"
import clientRoutes from "./routes/clientRoutes.js";
import historyRoutes from "./routes/historyRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

dotenv.config();

const app = express();
const server = createServer(app);
initChatSocket(server); // Initialize WebSocket server for real-time chats

// --- Security & Middleware ---
app.use(helmet()); 
app.use(cors({
  origin: "http://localhost:3000", 
  credentials: true
}));
app.use(express.json());

// Rate limiting: 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests, please try again later." },
});
app.use("/api/", limiter);

// --- Routes ---
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/clients', clientRoutes);
app.use('/api/v1/horoscope', horoscopeRoutes);
app.use('/api/v1/history', historyRoutes);
app.use('/api/v1', chatRoutes);

// --- Global Error Handler ---
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
