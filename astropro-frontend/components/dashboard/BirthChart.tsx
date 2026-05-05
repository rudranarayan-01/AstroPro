// components/dashboard/BirthChart.tsx
"use client";

import { Dispatch, SetStateAction } from "react";

interface BirthChartProps {
  type: string;
  onTypeChange: React.Dispatch<React.SetStateAction<string>>;
  chart?: any[]; // Added to accept planetary data for rendering
}

export default function BirthChart({ type, onTypeChange, chart }: BirthChartProps) {
  const isNorth = type === 'North';

  return (
    <div className="bg-[#0d0f14]/50 border border-white/[0.05] rounded-[32px] p-8 flex flex-col h-full relative overflow-hidden group">
      {/* Header & Toggles */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        <h3 className="text-xs font-black tracking-[0.2em] text-white/40 uppercase italic">
          {isNorth ? "North Indian Chart" : "South Indian Chart"}
        </h3>
        <div className="flex bg-white/[0.02] p-1 rounded-xl border border-white/[0.05] backdrop-blur-md">
          <button 
            className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all duration-300 ${
              isNorth 
              ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' 
              : 'text-white/30 hover:text-white/60'
            }`}
            onClick={() => onTypeChange('North')}
          >
            NORTH
          </button>
          <button 
            className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all duration-300 ${
              !isNorth 
              ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' 
              : 'text-white/30 hover:text-white/60'
            }`}
            onClick={() => onTypeChange('South')}
          >
            SOUTH
          </button>
        </div>
      </div>

      {/* Chart Visualizer */}
      <div className="flex-1 flex items-center justify-center relative min-h-[300px]">
        {/* Decorative Background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] scale-125 animate-slow-spin pointer-events-none">
          <div className="w-full h-full border border-white rounded-full p-12">
            <div className="w-full h-full border border-dashed border-white rounded-full" />
          </div>
        </div>

        {/* NORTH INDIAN STYLE (Diamond Grid) */}
        {isNorth ? (
          <div className="relative w-72 h-72 border border-orange-500/30 bg-orange-500/[0.02] rotate-0 transition-all duration-700 animate-in zoom-in-95">
            {/* Inner Diamond */}
            <div className="absolute inset-0 rotate-45 border border-orange-500/30 scale-[0.707]" />
            {/* Cross Lines */}
            <div className="absolute top-0 left-0 w-full h-full">
               <div className="absolute top-1/2 left-0 w-full h-[1px] bg-orange-500/20" />
               <div className="absolute left-1/2 top-0 h-full w-[1px] bg-orange-500/20" />
            </div>
            
            {/* Placeholder Planet Positions */}
            <div className="absolute inset-0 flex items-center justify-center">
               <span className="text-[10px] font-black text-orange-500">AS</span>
            </div>
            <span className="absolute top-6 left-1/2 -translate-x-1/2 text-[9px] text-white/40 font-bold uppercase">Sun</span>
            <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[9px] text-blue-400 font-bold uppercase">Jup</span>
            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[9px] text-emerald-400 font-bold uppercase">Ven</span>
          </div>
        ) : (
          /* SOUTH INDIAN STYLE (Square Grid) */
          <div className="grid grid-cols-4 grid-rows-4 w-72 h-72 border-2 border-orange-500/30 bg-orange-500/[0.02] transition-all duration-700 animate-in fade-in slide-in-from-right-4">
            {[...Array(16)].map((_, i) => {
              // Create the hollow square look characteristic of South Indian charts
              const isCenter = i === 5 || i === 6 || i === 9 || i === 10;
              return (
                <div 
                  key={i} 
                  className={`border border-orange-500/10 flex items-center justify-center p-1 ${
                    isCenter ? 'bg-transparent border-none' : 'hover:bg-orange-500/5'
                  }`}
                >
                  {!isCenter && i === 0 && <span className="text-[9px] text-orange-500 font-black">AS</span>}
                  {i === 2 && <span className="text-[9px] text-white/40">MOO</span>}
                </div>
              );
            })}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-[10px] font-black text-white/10 uppercase tracking-widest">South Chart</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-6 text-center">
        <p className="text-[9px] text-white/20 uppercase tracking-tighter">
          Calculated using Vedic Lahiri Ayanamsa
        </p>
      </div>
    </div>
  );
}