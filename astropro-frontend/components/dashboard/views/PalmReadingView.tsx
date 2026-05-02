// components/dashboard/views/PalmReadingView.tsx
import { Hand, Activity, Heart, Brain, Zap } from 'lucide-react';

const lines = [
  { name: 'Life Line', icon: Activity, score: 85, color: 'text-emerald-400', desc: 'Vitality and life energy are exceptionally high.' },
  { name: 'Heart Line', icon: Heart, score: 72, color: 'text-red-400', desc: 'Deep emotional connections and empathy.' },
  { name: 'Head Line', icon: Brain, score: 91, color: 'text-blue-400', desc: 'Strong analytical skills and mental focus.' },
  { name: 'Fate Line', icon: Zap, score: 64, color: 'text-orange-500', desc: 'Career path shows major transitions ahead.' },
];

export default function PalmReadingView() {
  return (
    <div className="grid grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* Visual Hand Mapping */}
      <div className="col-span-12 lg:col-span-5 bg-[#0d0f14]/50 border border-white/[0.05] rounded-[32px] p-8 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] scale-125 pointer-events-none">
          <div className="w-full h-full border border-white rounded-full animate-slow-spin" />
        </div>
        
        <h3 className="text-xs font-black tracking-[0.2em] text-white/40 uppercase mb-12 self-start italic">Hand Mapping Analysis</h3>
        
        <div className="relative group">
          <Hand size={280} strokeWidth={0.5} className="text-white/10 transition-colors group-hover:text-white/20" />
          {/* Neon hotspots representing mounts */}
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-4 h-4 bg-orange-500/20 rounded-full blur-md animate-pulse" />
          <div className="absolute bottom-20 left-1/4 w-3 h-3 bg-blue-500/20 rounded-full blur-md animate-pulse delay-700" />
        </div>
        
        <p className="mt-8 text-[10px] font-bold text-white/30 tracking-widest text-center uppercase">Right Hand (Active) Selected</p>
      </div>

      {/* Analysis Details */}
      <div className="col-span-12 lg:col-span-7 space-y-6">
        <div className="bg-[#0d0f14]/50 border border-white/[0.05] rounded-[32px] p-8">
          <h3 className="text-xs font-black tracking-[0.2em] text-white/40 uppercase mb-8 italic">Line Intensity & Health</h3>
          <div className="space-y-8">
            {lines.map((line) => (
              <div key={line.name}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <line.icon size={18} className={line.color} />
                    <span className="text-sm font-bold text-white tracking-wide">{line.name}</span>
                  </div>
                  <span className={`text-xs font-black ${line.color}`}>{line.score}%</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 bg-current ${line.color}`} 
                    style={{ width: `${line.score}%` }} 
                  />
                </div>
                <p className="mt-2 text-[11px] text-white/40 leading-relaxed">{line.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}