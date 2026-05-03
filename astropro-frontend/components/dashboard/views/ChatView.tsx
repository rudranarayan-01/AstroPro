// components/dashboard/views/ChatView.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { Sparkles, Paperclip, Moon, Hand, Trash2, ArrowUp, History, MessageSquare } from 'lucide-react';

interface Message {
  id: string;
  sender: 'ai' | 'user' | 'astrologer';
  text: string;
  time: string;
}

export default function ChatView({ clientContext }: { clientContext?: any }) {
  // Use client name for the header, fallback to 'Client'
  const clientName = clientContext?.name || "Select a Client";
  
  // State for messages - in a real app, you'd fetch these using clientContext.id
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      sender: 'ai', 
      text: `Namaste ${clientName.split(' ')[0]} 🙏 I can see your Kundli has been loaded. How can I help you today?`, 
      time: '10:31 AM' 
    }
  ]);

  return (
    <div className="flex h-full gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* --- SESSION INFO SIDEBAR (Replaces Expert Sidebar) --- */}
      <div className="w-80 hidden lg:flex flex-col gap-6">
        <div className="bg-[#0d0f14]/80 border border-white/[0.05] rounded-[32px] p-6 flex flex-col h-full">
          <h2 className="text-sm font-black text-white/40 uppercase tracking-[0.2em] mb-6 px-2 italic">Analysis Sessions</h2>
          
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {/* Session History Items */}
            <SessionItem date="May 03, 2026" topic="Career & Saturn Dasha" active />
            <SessionItem date="April 28, 2026" topic="Vastu Kitchen Correction" />
            <SessionItem date="April 15, 2026" topic="Marriage Compatibility" />
          </div>

          {/* Quick Action for Astrologer */}
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
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-white/40 font-black uppercase tracking-widest italic">Viewing Previous Consultation</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] text-white/30 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 relative z-10 custom-scrollbar">
            <div className="text-center">
                <span className="text-[10px] font-black text-white/20 tracking-[0.3em] uppercase">Conversation from {clientContext?.lastActive || 'Session 1'}</span>
            </div>

            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-4 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${msg.sender === 'ai' ? 'bg-orange-500' : 'bg-white/10'}`}>
                   {msg.sender === 'ai' ? <Sparkles size={14} className="text-white"/> : <span className="text-[10px] font-bold">{msg.sender === 'user' ? 'CL' : 'AS'}</span>}
                </div>
                <div className={`p-6 text-sm leading-relaxed ${
                  msg.sender === 'user' 
                  ? 'bg-orange-600 rounded-[24px] rounded-tr-none text-white' 
                  : 'bg-white/[0.03] border border-white/[0.05] rounded-[24px] rounded-tl-none text-white/80'
                }`}>
                    {msg.text}
                    <div className={`mt-4 text-[10px] font-bold ${msg.sender === 'user' ? 'text-white/40 text-right' : 'text-white/20'}`}>
                      {msg.time}
                    </div>
                </div>
              </div>
            ))}
        </div>

        {/* Input Area (Fixed for SAAS) */}
        <div className="p-8 border-t border-white/[0.05] relative z-10 bg-[#0d0f14]">
            <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
                <InputTool icon={<Paperclip size={14}/>} label="Attach Docs" />
                <InputTool icon={<Moon size={14}/>} label="View Kundli" />
                <InputTool icon={<Hand size={14}/>} label="Palm Record" />
                <InputTool icon={<History size={14}/>} label="Full History" />
            </div>
            <div className="relative">
                <textarea 
                    placeholder={`Reply to ${clientName}...`}
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl py-4 pl-6 pr-16 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-orange-500/40 min-h-[80px] resize-none"
                />
                <button className="absolute right-3 bottom-3 w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white hover:bg-orange-700 transition-all">
                    <ArrowUp size={20} />
                </button>
            </div>
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
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.05] text-[10px] font-black text-white/40 uppercase tracking-widest hover:text-white hover:bg-white/[0.05] whitespace-nowrap transition-all">
            {icon} {label}
        </button>
    )
}