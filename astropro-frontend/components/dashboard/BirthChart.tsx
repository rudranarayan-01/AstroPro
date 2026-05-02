// components/dashboard/BirthChart.tsx

import { Dispatch, SetStateAction } from "react";

interface BirthChartProps {
  type: string;
  onTypeChange: Dispatch<SetStateAction<string>>;
}

export default function BirthChart({ type, onTypeChange }: BirthChartProps) {
  return (
    <div className="bg-[#0d0f14]/50 border border-white/[0.05] rounded-[32px] p-8 flex flex-col h-full relative overflow-hidden group">
      <div className="flex items-center justify-between mb-8 relative z-10">
        <h3 className="text-xs font-black tracking-[0.2em] text-white/40 uppercase italic">Birth Chart</h3>
        <div className="flex bg-white/[0.02] p-1 rounded-lg border border-white/[0.05]">
          <button 
            className="px-4 py-1.5 rounded-md text-[10px] font-bold bg-orange-500/10 text-orange-500"
            onClick={() => onTypeChange('North')}
          >
            NORTH INDIAN
          </button>
          <button 
            className="px-4 py-1.5 rounded-md text-[10px] font-bold text-white/30 hover:text-white/60 transition-colors"
            onClick={() => onTypeChange('South')}
          >
            SOUTH INDIAN
          </button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center relative">
        {/* Animated Sacred Geometry Background for Chart */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] scale-150 animate-slow-spin">
             <div className="w-full h-full border border-white rounded-full p-12">
                <div className="w-full h-full border border-dashed border-white rounded-full" />
             </div>
        </div>

        {/* The Kundli Diamond Grid */}
        <div className="relative w-64 h-64 border border-orange-500/20">
          <div className="absolute inset-0 flex">
            <div className="w-full h-full border-r border-orange-500/10" />
            <div className="absolute inset-0 rotate-45 border border-orange-500/30 scale-[0.707]" />
            <div className="absolute inset-0 flex items-center justify-center">
                 <span className="text-[10px] font-bold text-orange-500/80">Ra-Ke</span>
            </div>
            {/* Added Planet Positioning markers */}
            <span className="absolute top-4 left-1/2 -translate-x-1/2 text-[9px] text-white/40">As-Sun</span>
            <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[9px] text-blue-400">Jup</span>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] text-white/40">Mars</span>
          </div>
        </div>
      </div>
    </div>
  );
}