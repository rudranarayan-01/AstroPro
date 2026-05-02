// components/dashboard/views/ChatView.tsx
"use client";
import React, { useState } from 'react';
import { Sparkles, Paperclip, Send, Moon, Hand, Trash2, ArrowUp } from 'lucide-react';

export default function ChatView() {
  const [activeExpert, setActiveExpert] = useState('Jyotish AI');

  return (
    <div className="flex h-[calc(100vh-180px)] gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* --- EXPERT SIDEBAR --- */}
      <div className="w-80 flex flex-col gap-6">
        <div className="bg-[#0d0f14]/80 border border-white/[0.05] rounded-[32px] p-6 flex flex-col h-full">
          <h2 className="text-lg font-bold text-white mb-6 px-2">Consultations</h2>
          
          {/* Toggle Switch */}
          <div className="flex p-1 bg-white/[0.03] rounded-2xl border border-white/[0.05] mb-8">
            <button className="flex-1 py-2 text-[10px] font-black uppercase tracking-widest bg-orange-500 text-white rounded-xl shadow-lg shadow-orange-900/20">AI Astrologer</button>
            <button className="flex-1 py-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors">Live Expert</button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            <p className="text-[10px] font-bold text-white/20 tracking-widest px-2 uppercase">AI Mode</p>
            <ExpertCard 
              name="Jyotish AI" 
              desc="GPT-4o • Vedic specialist" 
              status="Always available" 
              active={activeExpert === 'Jyotish AI'} 
              onClick={() => setActiveExpert('Jyotish AI')}
              isAI
            />
            
            <p className="text-[10px] font-bold text-white/20 tracking-widest px-2 pt-4 uppercase">Live Experts</p>
            <ExpertCard name="Pt. Sharma" desc="Vedic • KP • 20 yrs" price="₹99/min" rating="4.9" active={activeExpert === 'Pt. Sharma'} onClick={() => setActiveExpert('Pt. Sharma')} />
            <ExpertCard name="Rekha Kaul" desc="Tarot • Numerology" price="₹79/min" rating="4.7" active={activeExpert === 'Rekha Kaul'} onClick={() => setActiveExpert('Rekha Kaul')} />
            <ExpertCard name="Anand Mishra" desc="Vastu • Prashna" status="Offline • Available 6 PM" active={activeExpert === 'Anand Mishra'} onClick={() => setActiveExpert('Anand Mishra')} />
          </div>
        </div>
      </div>

      {/* --- CHAT WINDOW --- */}
      <div className="flex-1 flex flex-col bg-[#0d0f14]/80 border border-white/[0.05] rounded-[32px] overflow-hidden relative">
        
        {/* Astrology Wheel Background Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.02] flex items-center justify-center">
            <div className="w-[600px] h-[600px] border border-white rounded-full animate-slow-spin" />
        </div>

        {/* Header */}
        <div className="p-6 border-b border-white/[0.05] flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center border border-orange-500/20">
              <Sparkles className="text-orange-500 w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white">Jyotish AI</h3>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-xs text-emerald-500/80 font-medium">Online • Vedic astrology specialist</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-orange-500/10 border border-orange-500/20 px-4 py-1.5 rounded-xl text-[10px] font-black text-orange-500 tracking-widest uppercase">
              Free • 10 msgs/day
            </div>
            <button className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] text-white/30 hover:text-white transition-colors"><Trash2 size={18}/></button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 relative z-10 custom-scrollbar">
            {/* Kundli Availability Banner */}
            <div className="bg-orange-500/5 border border-orange-500/10 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Moon className="text-orange-500 w-4 h-4" />
                    <span className="text-xs text-white/60">Your Kundli is available — share it with the astrologer for personalised advice</span>
                </div>
                <button className="text-[10px] font-black uppercase text-orange-500 tracking-widest hover:underline">Share Kundli</button>
            </div>

            <div className="text-center">
                <span className="text-[10px] font-black text-white/20 tracking-[0.3em] uppercase">Context Loaded — Mesha Lagna</span>
            </div>

            {/* AI Message */}
            <div className="flex gap-4 max-w-[80%]">
                <div className="w-8 h-8 rounded-full bg-orange-500 flex-shrink-0 flex items-center justify-center"><Sparkles size={14} className="text-white"/></div>
                <div className="bg-white/[0.03] border border-white/[0.05] rounded-[24px] rounded-tl-none p-6 text-sm leading-relaxed text-white/80">
                    Namaste Priya 🙏<br /><br />
                    I can see your Kundli has been loaded. You have Mesha Lagna with the Sun in the 1st house. How can I help you today?
                    <div className="mt-4 text-[10px] font-bold text-white/20">10:31 AM</div>
                </div>
            </div>

            {/* User Message */}
            <div className="flex gap-4 max-w-[80%] ml-auto flex-row-reverse">
                <div className="w-8 h-8 rounded-full bg-white/[0.05] flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white/40">PR</div>
                <div className="bg-orange-600 rounded-[24px] rounded-tr-none p-6 text-sm leading-relaxed text-white font-medium shadow-lg shadow-orange-900/20">
                    Can you tell me what my Saturn Dasha means for my professional life?
                    <div className="mt-4 text-[10px] font-bold text-white/40 text-right">10:32 AM</div>
                </div>
            </div>

            {/* Suggestion Chips */}
            <div className="flex flex-wrap gap-2 pt-4">
                {['When will challenges ease?', 'Saturn remedies', 'Job change in 2025?', 'Gaja Kesari Yoga'].map(chip => (
                    <button key={chip} className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-[11px] font-bold text-white/60 hover:border-orange-500/50 hover:text-white transition-all">
                        {chip}
                    </button>
                ))}
            </div>
        </div>

        {/* Input Area */}
        <div className="p-8 border-t border-white/[0.05] relative z-10 bg-[#0d0f14]">
            <div className="flex gap-2 mb-4">
                <InputTool icon={<Paperclip size={14}/>} label="Attach" />
                <InputTool icon={<Moon size={14}/>} label="Share Kundli" />
                <InputTool icon={<Hand size={14}/>} label="Palm Reading" />
            </div>
            <div className="relative">
                <textarea 
                    placeholder="Ask about your chart, Dasha, remedies, compatibility..."
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl py-4 pl-6 pr-16 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-orange-500/40 min-h-[60px] resize-none"
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

function ExpertCard({ name, desc, status, price, rating, active, onClick, isAI }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full p-4 rounded-2xl border text-left transition-all ${active ? 'bg-orange-500/10 border-orange-500/30 ring-1 ring-orange-500/20' : 'bg-transparent border-transparent hover:bg-white/[0.02]'}`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold ${isAI ? 'bg-orange-500 text-white' : 'bg-white/[0.05] text-white/40'}`}>
          {isAI ? <Sparkles size={20}/> : name.split(' ').map((n:any) => n[0]).join('')}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-0.5">
            <h4 className={`font-bold text-sm truncate ${active ? 'text-orange-500' : 'text-white'}`}>{name}</h4>
            {rating && <span className="text-[10px] font-bold text-orange-500">★ {rating}</span>}
          </div>
          <p className="text-[11px] text-white/40 truncate mb-1">{desc}</p>
          {status && <p className={`text-[10px] font-bold ${status.includes('Online') || status.includes('available') ? 'text-emerald-500/70' : 'text-white/20'}`}>{status}</p>}
          {price && <p className="text-[10px] font-black text-orange-500/60 uppercase tracking-widest">{price}</p>}
        </div>
      </div>
    </button>
  );
}

function InputTool({ icon, label }: any) {
    return (
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.05] text-[10px] font-black text-white/40 uppercase tracking-widest hover:text-white hover:bg-white/[0.05] transition-all">
            {icon} {label}
        </button>
    )
}