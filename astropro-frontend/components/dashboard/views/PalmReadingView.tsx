// components/dashboard/views/PalmReadingView.tsx
"use client";
import React from 'react';
import { Hand, Activity, Heart, Brain, Zap, Shield, Sun, Moon } from 'lucide-react';

const lines = [
  { name: 'Life Line', icon: Activity, score: 85, color: 'text-emerald-400', desc: 'Robust physical health and longevity.' },
  { name: 'Heart Line', icon: Heart, score: 72, color: 'text-red-400', desc: 'Emotional stability with deep empathy.' },
  { name: 'Head Line', icon: Brain, score: 91, color: 'text-blue-400', desc: 'Superior intellectual and analytical focus.' },
  { name: 'Fate Line', icon: Zap, score: 64, color: 'text-orange-500', desc: 'Self-made career with significant shifts.' },
];

export default function PalmReadingView({ clientData }: { clientData?: any }) {
  return (
    <div className="grid grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* Hand Mapping Visual */}
      <div className="col-span-12 lg:col-span-5 bg-[#0d0f14]/60 border border-white/[0.05] rounded-[32px] p-8 flex flex-col items-center relative overflow-hidden backdrop-blur-xl">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
          <div className="w-full h-full border border-white rounded-full animate-slow-spin scale-150" />
        </div>
        
        <div className="w-full flex justify-between items-start mb-12">
           <h3 className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase italic">Surface Mapping</h3>
           <span className="px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full text-[10px] font-bold text-orange-500 uppercase">Right Active</span>
        </div>
        
        <div className="relative">
          <Hand size={320} strokeWidth={0.5} className="text-white/10" />
          {/* Mount Hotspots */}
          <MountPoint top="15%" left="50%" color="bg-orange-500" label="Jupiter" />
          <MountPoint top="25%" left="30%" color="bg-blue-500" label="Saturn" />
          <MountPoint top="40%" left="75%" color="bg-pink-500" label="Venus" />
        </div>
        
        <div className="mt-12 grid grid-cols-2 gap-4 w-full">
           <MountBadge icon={<Sun size={12}/>} label="Mount of Sun" status="Strong" />
           <MountBadge icon={<Moon size={12}/>} label="Mount of Moon" status="Creative" />
        </div>
      </div>

      {/* Analysis Details */}
      <div className="col-span-12 lg:col-span-7 space-y-6">
        <div className="bg-[#0d0f14]/60 border border-white/[0.05] rounded-[32px] p-8">
          <h3 className="text-[10px] font-black tracking-[0.2em] text-white/20 uppercase mb-8 italic">Line Intensity Analysis</h3>
          <div className="space-y-8">
            {lines.map((line) => (
              <div key={line.name} className="group">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl bg-white/5 ${line.color}`}>
                        <line.icon size={16} />
                    </div>
                    <span className="text-sm font-bold text-white tracking-wide">{line.name}</span>
                  </div>
                  <span className={`text-xs font-black ${line.color}`}>{line.score}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 bg-current ${line.color} shadow-[0_0_10px_rgba(255,255,255,0.1)]`} 
                    style={{ width: `${line.score}%` }} 
                  />
                </div>
                <p className="mt-3 text-[11px] text-white/40 leading-relaxed group-hover:text-white/60 transition-colors">
                    {line.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Prediction Summary Card */}
        <div className="bg-gradient-to-r from-blue-500/5 to-transparent border border-white/[0.05] rounded-[32px] p-8">
             <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4 italic">Astrologer's Verdict</h3>
             <p className="text-xs text-white/60 leading-relaxed">
               "Palm shows strong 'Simian-like' tendencies in mental focus. Success is indicated in intellectual pursuits. Career transitions are likely around age 32 due to a break in the Fate Line."
             </p>
        </div>
      </div>
    </div>
  );
}

function MountPoint({ top, left, color, label }: any) {
    return (
        <div className="absolute group" style={{ top, left }}>
            <div className={`w-3 h-3 ${color} rounded-full blur-sm animate-pulse cursor-help`} />
            <span className="absolute left-1/2 -translate-x-1/2 -top-6 text-[8px] font-black text-white/40 uppercase opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {label}
            </span>
        </div>
    );
}

function MountBadge({ icon, label, status }: any) {
    return (
        <div className="flex items-center gap-3 bg-white/[0.02] border border-white/[0.05] p-3 rounded-2xl">
            <div className="text-orange-500">{icon}</div>
            <div>
                <p className="text-[8px] font-black text-white/20 uppercase tracking-tighter">{label}</p>
                <p className="text-[10px] font-bold text-white/70">{status}</p>
            </div>
        </div>
    );
}