// components/dashboard/views/QuickAnalysisResult.tsx
"use client";
import React from 'react';
import { 
  Sparkles, 
  Download, 
  Share2, 
  Printer, 
  RotateCcw, 
  ShieldCheck, 
  Zap,
  Globe
} from 'lucide-react';

interface QuickAnalysisResultProps {
  data: {
    name: string;
    dob: string;
    tob: string;
    pob: string;
    type: 'Kundli' | 'Palm' | 'Vastu';
  };
}

export default function QuickAnalysisResult({ data }: QuickAnalysisResultProps) {
  // If data hasn't loaded yet
  if (!data) return null;

  return (
    <div className="relative animate-in fade-in slide-in-from-right-8 duration-700 pb-20">
      
      {/* Action Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full text-[10px] font-black text-orange-500 uppercase tracking-widest">
              Instant Analysis
            </span>
            <span className="text-white/20 text-[10px] font-bold uppercase tracking-widest italic">
              ID: TEMP-{Math.floor(Math.random() * 10000)}
            </span>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tighter italic">
            {data.type} <span className="text-orange-500">Report</span>
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-3 bg-white/[0.03] border border-white/10 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all">
            <Share2 size={18} />
          </button>
          <button className="p-3 bg-white/[0.03] border border-white/10 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all">
            <Printer size={18} />
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all shadow-xl">
            <Download size={14} /> Download PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        
        {/* Left Column: Input Context & Parameters */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-[#0d0f14]/60 border border-white/[0.05] rounded-[32px] p-8 backdrop-blur-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5">
                <Globe size={100} />
             </div>
             <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.25em] mb-8 italic">Data Parameters</h3>
             
             <div className="space-y-6">
                <ParamRow label="Subject" value={data.name} />
                <ParamRow label="Date" value={data.dob} />
                <ParamRow label="Time" value={data.tob} />
                <ParamRow label="Location" value={data.pob} />
             </div>

             <div className="mt-10 p-4 bg-orange-500/5 border border-orange-500/10 rounded-2xl flex items-center gap-3">
                <ShieldCheck className="text-orange-500" size={18} />
                <p className="text-[10px] text-orange-500/80 font-bold leading-tight">
                    Verified calculations based on 100% accurate ephemeris data.
                </p>
             </div>
          </div>
          
          <button className="w-full py-4 border border-white/10 rounded-2xl text-[10px] font-black text-white/30 uppercase tracking-[0.2em] hover:text-white hover:border-white/20 transition-all flex items-center justify-center gap-2">
            <RotateCcw size={14} /> New Quick Analysis
          </button>
        </div>

        {/* Right Column: The "Magic" AI Result */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          
          {/* Main Insight Hero */}
          <div className="bg-gradient-to-br from-orange-600/20 to-transparent border border-orange-500/20 rounded-[40px] p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 border border-orange-500/5 rounded-full -mr-20 -mt-20 animate-slow-spin" />
            
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="w-10 h-10 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-900/40">
                <Sparkles size={20} className="text-white fill-white/20" />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">AI Executive Summary</h3>
            </div>

            <div className="space-y-6 relative z-10">
              <p className="text-lg text-white/80 leading-relaxed font-medium italic italic">
                "For {data.name}, the {data.type} analysis reveals a high degree of synchronicity. The planetary alignments suggest that immediate action in professional ventures will yield 3x returns within the next lunar cycle..."
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
                <MetricBox label="Stability Score" value="8.4/10" />
                <MetricBox label="Growth Potential" value="High" />
              </div>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="bg-[#0d0f14]/40 border border-white/[0.05] rounded-[32px] p-8">
            <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.25em] mb-8">Technical Breakdown</h3>
            <div className="space-y-8">
               <ReportPoint 
                title="Primary Influence" 
                text="The dominant influence in this session is centered around Saturnian discipline. This is a temporary but powerful transit." 
               />
               <ReportPoint 
                title="Mitigation Advice" 
                text="To balance the excess energy found in the fire quadrant, we recommend metallic accents or focused meditation during dusk." 
               />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// --- Internal UI Components ---

function ParamRow({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex flex-col border-l border-white/5 pl-4 hover:border-orange-500 transition-colors">
      <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">{label}</span>
      <span className="text-md font-bold text-white mt-1">{value || 'Not provided'}</span>
    </div>
  );
}

function MetricBox({ label, value }: { label: string, value: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center">
      <span className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">{label}</span>
      <span className="text-2xl font-black text-white italic">{value}</span>
    </div>
  );
}

function ReportPoint({ title, text }: { title: string, text: string }) {
  return (
    <div className="flex gap-6 group">
        <div className="mt-1">
            <div className="w-4 h-4 rounded-full border border-orange-500/40 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full group-hover:scale-150 transition-transform" />
            </div>
        </div>
        <div>
            <h4 className="text-sm font-bold text-white mb-2">{title}</h4>
            <p className="text-sm text-white/40 leading-relaxed">{text}</p>
        </div>
    </div>
  )
}