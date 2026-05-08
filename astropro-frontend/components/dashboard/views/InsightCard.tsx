// components/dashboard/InsightCard.tsx
import React, { ReactNode } from 'react';

interface InsightCardProps {
  title: string;
  icon: ReactNode;
  content: string;
  accent: string;
  iconColor: string;
}

export default function InsightCard({ title, icon, content, accent, iconColor }: InsightCardProps) {
  return (
    <div className={`group bg-[#0d0f14]/80 backdrop-blur-md border ${accent} rounded-[40px] p-10 transition-all duration-300 hover:translate-y-[-4px] hover:bg-white/[0.02]`}>
      <div className={`w-14 h-14 rounded-[20px] bg-white/[0.03] flex items-center justify-center ${iconColor} mb-8 border border-white/[0.05] group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="font-black text-xs text-white/30 uppercase tracking-[0.2em] mb-4">{title}</h3>
      <p className="text-[13px] text-white/60 leading-relaxed font-medium">{content || 'No placements recorded.'}</p>
    </div>
  );
}