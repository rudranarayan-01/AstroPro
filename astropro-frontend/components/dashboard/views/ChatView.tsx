"use client";

import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';
import { 
  Sparkles, Paperclip, Moon, Hand, Trash2, ArrowUp, 
  History, MessageSquare, Loader2, Wifi, WifiOff 
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface Message {
  id: string;
  sender: 'ai' | 'user' | 'astrologer';
  text: string;
  time: string;
}

interface ChatViewProps {
  clientContext?: {
    id: string;
    name: string;
    lastActive?: string;
  };
}

export default function ChatView({ clientContext }: ChatViewProps) {
  const { token, user } = useAuth(); // Contains authenticated user's ID and role
  const clientName = clientContext?.name || "Select a Client";
  const clientId = clientContext?.id;

  const [messages, setMessages] = useState<Message[]>([]);
  const [typedMessage, setTypedMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [socketError, setSocketError] = useState<string | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/v1';
  const SOCKET_URL = BASE_URL.replace(/\/api\/v1\/?$/, "");

  // --- 1. Load Initial History via HTTP REST ---
  useEffect(() => {
    async function loadHistory() {
      if (!clientId || !token) return;
      try {
        setLoadingHistory(true);
        const response = await axios.get(`${BASE_URL}/chat/history?client_id=${clientId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Populate messages from database archive. If empty, apply welcome message.
        if (response.data.messages && response.data.messages.length > 0) {
          setMessages(response.data.messages);
        } else {
          setMessages([
            { 
              id: 'welcome', 
              sender: 'ai', 
              text: `Namaste ${clientName.split(' ')[0]} 🙏 Your Kundli has been loaded securely. Ask your diagnostic questions below.`, 
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
            }
          ]);
        }
      } catch (err: any) {
        console.error("History fetch failure:", err);
        setSocketError("Could not retrieve past session logs.");
      } finally {
        setLoadingHistory(false);
      }
    }

    loadHistory();
  }, [clientId, token, clientName, BASE_URL]);

  // --- 2. Live Socket Connection & Listeners ---
  useEffect(() => {
    console.log("🔑 Checking token in ChatView:", token ? "Token Exists ✅" : "Token is EMPTY ❌");
    if (!token || !clientId) return;

    // Establish persistent WebSocket handshake
    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket"]
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
      setSocketError(null);
      // Synchronize client room
      socket.emit("join_room", { client_id: clientId });
    });

    socket.on("connect_error", (err) => {
      console.warn("Live chat connection dropped:", err.message);
      setIsConnected(false);
      setSocketError("Reconnecting to live channel...");
    });

    // Handle real-time incoming messages
    socket.on("receive_message", (incomingMsg: any) => {
      // Standardize incoming real-time backend types to match history schemas:
      // "ASTROLOGER" -> "astrologer" | "CLIENT" -> "user"
      let parsedSender: 'ai' | 'user' | 'astrologer' = 'user';
      if (incomingMsg.sender_type === 'ASTROLOGER' || incomingMsg.sender_type === 'astrologer') {
        parsedSender = 'astrologer';
      }

      const formatted: Message = {
        id: incomingMsg.id,
        sender: parsedSender,
        text: incomingMsg.message,
        time: new Date(incomingMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => {
        if (prev.some(m => m.id === formatted.id)) return prev;
        return [...prev, formatted];
      });
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, [clientId, token, BASE_URL]);

  // --- 3. Manage Scrolling ---
  const scrollContainerToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollContainerToBottom();
  }, [messages]);

  // --- 4. Send Controller ---
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim() || !socketRef.current || !isConnected || !clientId) return;

    // Send payload to standard WebSocket room pipeline
    socketRef.current.emit("send_message", {
      client_id: clientId,
      message: typedMessage.trim()
    });

    setTypedMessage("");
  };

  return (
    <div className="flex h-full gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* --- SESSION INFO SIDEBAR --- */}
      <div className="w-80 hidden lg:flex flex-col gap-6">
        <div className="bg-[#0d0f14]/80 border border-white/[0.05] rounded-[32px] p-6 flex flex-col h-full">
          <h2 className="text-sm font-black text-white/40 uppercase tracking-[0.2em] mb-6 px-2 italic">Analysis Sessions</h2>
          
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            <SessionItem date="May 03, 2026" topic="Career & Saturn Dasha" active />
            <SessionItem date="April 28, 2026" topic="Vastu Kitchen Correction" />
            <SessionItem date="April 15, 2026" topic="Marriage Compatibility" />
          </div>

          <button className="mt-6 w-full py-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl text-[10px] font-black text-orange-500 uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all">
            Start New Session
          </button>
        </div>
      </div>

      {/* --- FOCUSED CHAT WINDOW --- */}
      <div className="flex-1 flex flex-col bg-[#0d0f14]/80 border border-white/[0.05] rounded-[32px] overflow-hidden relative">
        
        {/* Astrology Wheel Background Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.02] flex items-center justify-center">
          <div className="w-[600px] h-[600px] border border-white rounded-full animate-slow-spin" />
        </div>

        {/* Header: Client Context */}
        <div className="p-6 border-b border-white/[0.05] flex items-center justify-between relative z-10 bg-[#0d0f14]/40 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center text-white font-black shadow-lg">
              {clientName[0]}
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">{clientName}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                {isConnected ? (
                  <span className="text-[9px] text-emerald-400 font-black uppercase tracking-widest flex items-center gap-1">
                    <Wifi size={10} /> Live Workspace Active
                  </span>
                ) : (
                  <span className="text-[9px] text-red-400 font-black uppercase tracking-widest flex items-center gap-1">
                    <WifiOff size={10} /> Live Feed Reconnecting
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] text-white/30 hover:text-red-500 transition-colors">
              <Trash2 size={18}/>
            </button>
          </div>
        </div>

        {/* Warning Indicator Overlay */}
        {socketError && (
          <div className="bg-red-500/15 border-b border-red-500/20 px-8 py-2.5 text-[9px] text-red-400 font-black uppercase tracking-widest relative z-20">
            {socketError}
          </div>
        )}

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 relative z-10 custom-scrollbar">
          <div className="text-center">
            <span className="text-[10px] font-black text-white/20 tracking-[0.3em] uppercase">
              Conversation from {clientContext?.lastActive || 'Session 1'}
            </span>
          </div>

          {loadingHistory ? (
            <div className="h-full flex flex-col items-center justify-center gap-3">
              <Loader2 className="text-orange-500 animate-spin" size={24} />
              <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">Loading History Archive...</p>
            </div>
          ) : (
            messages.map((msg) => {
              // 1. WhatsApp Alignment Rule:
              // Astrologer (Me) always goes RIGHT.
              // Clients ("user") and AI systems go LEFT.
              const isMe = msg.sender === 'astrologer';
              const isAi = msg.sender === 'ai';
              
              return (
                <div 
                  key={msg.id} 
                  className={`flex gap-4 max-w-[85%] ${isMe ? 'ml-auto flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${isAi ? 'bg-orange-500' : 'bg-white/10'}`}>
                    {isAi ? (
                      <Sparkles size={14} className="text-white"/>
                    ) : (
                      <span className="text-[10px] font-bold">
                        {isMe ? 'AS' : 'CL'}
                      </span>
                    )}
                  </div>
                  <div className={`p-6 text-sm leading-relaxed ${
                    isMe 
                      ? 'bg-orange-600 rounded-[24px] rounded-tr-none text-white' 
                      : 'bg-white/[0.03] border border-white/[0.05] rounded-[24px] rounded-tl-none text-white/80'
                  }`}>
                    {msg.text}
                    <div className={`mt-4 text-[10px] font-bold ${isMe ? 'text-white/40 text-right' : 'text-white/20'}`}>
                      {msg.time}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messageEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-8 border-t border-white/[0.05] relative z-10 bg-[#0d0f14]">
          <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
            <InputTool icon={<Paperclip size={14}/>} label="Attach Docs" />
            <InputTool icon={<Moon size={14}/>} label="View Kundli" />
            <InputTool icon={<Hand size={14}/>} label="Palm Record" />
            <InputTool icon={<History size={14}/>} label="Full History" />
          </div>
          
          <form onSubmit={handleSendMessage} className="relative">
            <textarea 
              placeholder={isConnected ? `Reply to ${clientName}...` : "Connecting to active server room..."}
              value={typedMessage}
              onChange={(e) => setTypedMessage(e.target.value)}
              disabled={!isConnected || !clientId}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl py-4 pl-6 pr-16 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-orange-500/40 min-h-[80px] resize-none disabled:opacity-50"
            />
            <button 
              type="submit"
              disabled={!isConnected || !typedMessage.trim()}
              className="absolute right-3 bottom-3 w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white hover:bg-orange-700 disabled:opacity-35 transition-all"
            >
              <ArrowUp size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function SessionItem({ date, topic, active = false }: { date: string, topic: string, active?: boolean }) {
  return (
    <button className={`w-full p-4 rounded-2xl border text-left transition-all ${active ? 'bg-orange-500/10 border-orange-500/30 ring-1 ring-orange-500/20' : 'bg-transparent border-transparent hover:bg-white/[0.02]'}`}>
      <p className={`text-[9px] font-black uppercase tracking-widest ${active ? 'text-orange-500' : 'text-white/20'}`}>{date}</p>
      <h4 className={`text-xs font-bold mt-1 ${active ? 'text-white' : 'text-white/60'}`}>{topic}</h4>
    </button>
  );
}

function InputTool({ icon, label }: any) {
  return (
    <button type="button" className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.05] text-[10px] font-black text-white/40 uppercase tracking-widest hover:text-white hover:bg-white/[0.05] whitespace-nowrap transition-all">
      {icon} {label}
    </button>
  );
}