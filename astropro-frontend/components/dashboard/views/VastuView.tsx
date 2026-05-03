// components/dashboard/views/VastuView.tsx
"use client";
import React from 'react';
import { Home, ShieldCheck, AlertTriangle, Info } from 'lucide-react';

export default function VastuView({ clientData }: { clientData?: any }) {
  const clientName = clientData?.name || "Client";

  const zones = [
    { zone: 'North East', status: 'Positive', impact: 'Wealth & Health', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { zone: 'South West', status: 'Correction', impact: 'Stability', color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { zone: 'North West', status: 'Positive', impact: 'Support', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { zone: 'South East', status: 'Warning', impact: 'Cash Flow', color: 'text-red-400', bg: 'bg-red-500/10' },
    { zone: 'Center', status: 'Clear', impact: 'Peace', color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { zone: 'North', status: 'Positive', impact: 'Opportunities', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  ];

  return (
    <div className="grid grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Vastu Grid Map */}
      <div className="col-span-12 lg:col-span-8 bg-[#0d0f14]/60 border border-white/[0.05] rounded-[32px] p-8 relative overflow-hidden backdrop-blur-xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight italic">Property Analysis</h3>
            <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mt-1">Archive: Residential Layout for {clientName}</p>
          </div>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-white/40 uppercase">Flat 402</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
          {zones.map((d) => (
            <div key={d.zone} className={`border border-white/[0.05] p-6 rounded-[24px] transition-all hover:border-white/10 ${d.bg}`}>
              <div className="flex justify-between items-start mb-3">
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">{d.zone}</p>
                {d.status === 'Positive' ? <ShieldCheck size={14} className={d.color}/> : <AlertTriangle size={14} className={d.color}/>}
              </div>
              <h4 className={`text-lg font-bold mb-1 ${d.color}`}>{d.status}</h4>
              <p className="text-xs text-white/60 leading-tight">{d.impact}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Sidebar: Remedies & Notes */}
      <div className="col-span-12 lg:col-span-4 space-y-6">
        <div className="bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20 rounded-[32px] p-8">
          <h3 className="font-bold text-white mb-6 flex items-center gap-2">
            <Info size={18} className="text-orange-500"/> Expert Remedies
          </h3>
          <ul className="space-y-6 text-sm">
            <RemedyItem text="Place a brass lion in the South Zone to enhance confidence." />
            <RemedyItem text="Avoid heavy furniture in the North East corner." />
            <RemedyItem text="Use green shades in the North to trigger new career opportunities." />
          </ul>
        </div>

        <div className="bg-[#0d0f14]/60 border border-white/[0.05] rounded-[32px] p-8">
          <h3 className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-4 italic">Astrologer's Private Note</h3>
          <p className="text-xs text-white/50 leading-relaxed italic">
            "Client mentioned health issues in Jan 2026. Advised shifting the bedroom from SE to SW. Re-evaluate in next session."
          </p>
        </div>
      </div>
    </div>
  );
}

function RemedyItem({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-3 group">
      <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0 group-hover:scale-150 transition-transform" />
      <span className="text-white/60 leading-relaxed text-xs">{text}</span>
    </li>
  );
}