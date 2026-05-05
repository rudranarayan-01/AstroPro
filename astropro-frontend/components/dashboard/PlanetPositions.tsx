// components/dashboard/PlanetPositions.tsx
import React from 'react';

// Define the structure of a single planet from your API response
interface Planet {
  name: string;
  sign: string;
  house: number;
  is_retrograde?: boolean; // Matches API potential
}

interface PlanetPositionsProps {
  data?: Planet[]; // Make it optional to prevent crashes if data is missing
}

// Helper for UI colors
const getPlanetColor = (name: string) => {
  const colors: Record<string, string> = {
    Sun: 'bg-orange-500',
    Moon: 'bg-blue-400',
    Mars: 'bg-red-500',
    Mercury: 'bg-emerald-400',
    Jupiter: 'bg-yellow-500',
    Venus: 'bg-pink-400',
    Saturn: 'bg-indigo-400',
    Rahu: 'bg-slate-400',
    Ketu: 'bg-zinc-400',
  };
  return colors[name] || 'bg-white/20';
};

export default function PlanetPositions({ data }: PlanetPositionsProps) {
  // Use API data if available, otherwise fallback to an empty array
  const displayPlanets = data || [];

  return (
    <div className="bg-[#0d0f14]/50 border border-white/[0.05] rounded-[32px] p-8 h-full">
      <h3 className="text-xs font-black tracking-[0.2em] text-white/40 uppercase italic mb-8">
        Planet Positions
      </h3>
      
      <div className="space-y-5">
        {displayPlanets.length > 0 ? (
          displayPlanets.map((p) => (
            <div key={p.name} className="flex items-center justify-between group cursor-default">
              <div className="flex items-center gap-3">
                <div 
                  className={`w-2 h-2 rounded-full ${getPlanetColor(p.name)} shadow-[0_0_8px_rgba(255,255,255,0.1)]`} 
                />
                <span className="text-sm font-bold text-white group-hover:text-orange-500 transition-colors">
                  {p.name}
                </span>
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-[11px] font-medium text-white/40">
                  {p.sign}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-white/[0.05] text-[10px] font-black text-white/60">
                    H{p.house}
                  </span>
                  {p.is_retrograde && (
                    <span className="text-orange-500 font-bold text-[10px]">R</span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-[10px] text-white/20 uppercase tracking-widest text-center py-10">
            No Planetary Data Available
          </p>
        )}
      </div>
    </div>
  );
}