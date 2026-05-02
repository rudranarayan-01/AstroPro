// components/dashboard/views/KundliView.tsx
"use client";
import React, { Dispatch, SetStateAction, useState } from 'react';
import BirthChart from '../BirthChart';
import PlanetPositions from '../PlanetPositions';
import { Sparkles, Star, TrendingUp, Heart, Wallet, ShieldAlert } from 'lucide-react';

interface KundliViewProps {
  clientData?: any; // You can define a more specific type based on your client data structure
}


export default function KundliView({ clientData }: KundliViewProps) {
  const [chartType, setChartType] = useState('North');

  return (
    <div className="relative min-h-screen animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* --- PREMIUM BACKGROUND LAYER --- */}
      <div className="fixed inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="w-[1200px] h-[1200px] border border-white/[0.03] rounded-full animate-slow-spin opacity-20">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="absolute top-1/2 left-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white/[0.1] to-transparent origin-left" style={{ transform: `rotate(${i * 30}deg)` }} />
          ))}
        </div>
      </div>

      <div className="relative z-10">
        {/* 1. TOP METRICS: THE ESSENTIALS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Lagna', val: 'Mesha', color: 'text-orange-500' },
            { label: 'Rashi', val: 'Mithuna', color: 'text-blue-400' },
            { label: 'Nakshatra', val: 'Punarvasu', color: 'text-emerald-400' },
            { label: 'Sun Sign', val: 'Leo', color: 'text-yellow-500' }
          ].map((item) => (
            <div key={item.label} className="bg-[#0d0f14]/60 backdrop-blur-md border border-white/[0.05] rounded-[20px] p-5">
              <p className="text-[10px] font-black tracking-[0.2em] text-white/30 uppercase mb-1">{item.label}</p>
              <h4 className={`text-lg font-bold ${item.color}`}>{item.val}</h4>
            </div>
          ))}
        </div>

        {/* 2. CORE CHARTS SECTION */}
        <div className="grid grid-cols-12 gap-6 mb-8">
          <div className="col-span-12 lg:col-span-7 bg-[#0d0f14]/40 backdrop-blur-md border border-white/[0.05] rounded-[32px] p-6">
            <BirthChart type={chartType} onTypeChange={setChartType} />
          </div>
          <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
            <PlanetPositions />
            {/* Shani/Sade Sati Status Card */}
            <div className="bg-gradient-to-br from-indigo-500/10 to-transparent border border-indigo-500/20 rounded-[28px] p-6">
               <div className="flex items-center gap-3 mb-4">
                  <ShieldAlert className="text-indigo-400" size={20} />
                  <h3 className="font-bold text-sm text-indigo-100 uppercase tracking-widest">Shani Transit Analysis</h3>
               </div>
               <p className="text-xs text-indigo-200/60 leading-relaxed mb-4">
                 Currently passing through the 11th House. Good for networking and gains, but requires disciplined efforts. No Sade Sati active.
               </p>
               <div className="flex gap-2">
                 <span className="px-3 py-1 bg-indigo-500/20 rounded-full text-[10px] font-bold text-indigo-300">DHAIYA: INACTIVE</span>
                 <span className="px-3 py-1 bg-indigo-500/20 rounded-full text-[10px] font-bold text-indigo-300">SADE SATI: NO</span>
               </div>
            </div>
          </div>
        </div>

        {/* 3. DASHA TIMELINE (MAHADASHA & ANTARDASHA) */}
        <div className="bg-[#0d0f14]/60 backdrop-blur-md border border-white/[0.05] rounded-[32px] p-8 mb-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-black tracking-[0.2em] text-white/40 uppercase">Current Vimshottari Dasha</h3>
            <span className="text-[10px] font-bold text-orange-500 bg-orange-500/10 px-3 py-1 rounded-full uppercase">Active Period</span>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-4 relative">
            {/* Mahadasha Item */}
            <div className="flex-1 w-full bg-white/[0.02] border border-white/[0.05] p-6 rounded-[24px] relative overflow-hidden">
               <div className="absolute top-0 right-0 p-2 opacity-10"><Star size={40}/></div>
               <p className="text-[10px] font-bold text-white/30 uppercase mb-2">Mahadasha</p>
               <h4 className="text-2xl font-black text-white">Jupiter (Guru)</h4>
               <p className="text-xs text-orange-500 font-bold mt-1">2018 — 2034</p>
            </div>
            
            <div className="hidden md:block text-white/10">→</div>

            {/* Antardasha Item */}
            <div className="flex-1 w-full bg-orange-500/5 border border-orange-500/20 p-6 rounded-[24px] relative">
               <p className="text-[10px] font-bold text-orange-500/60 uppercase mb-2">Antardasha</p>
               <h4 className="text-2xl font-black text-white">Saturn (Shani)</h4>
               <p className="text-xs text-white/60 mt-1">Nov 2024 — June 2027</p>
            </div>
          </div>
        </div>

        {/* 4. AI INSIGHTS: LIFE, MARRIAGE, WEALTH */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InsightCard 
            title="Life & Character" 
            icon={<TrendingUp size={18}/>} 
            content="Your chart suggests a strong, independent personality with leadership traits. Focus on self-discipline during this Saturn phase."
            accent="border-emerald-500/20"
            iconColor="text-emerald-400"
          />
          <InsightCard 
            title="Marriage & Love" 
            icon={<Heart size={18}/>} 
            content="7th house lord is well-placed, indicating a supportive partner. However, Venus under Jupiter's aspect suggests a wait until late 2025."
            accent="border-pink-500/20"
            iconColor="text-pink-400"
          />
          <InsightCard 
            title="Wealth & Career" 
            icon={<Wallet size={18}/>} 
            content="The 2nd and 11th houses show significant financial growth through technology or consultancy starting mid-next year."
            accent="border-orange-500/20"
            iconColor="text-orange-400"
          />
        </div>

        {/* 5. AI GENERATED REPORT SUMMARY */}
        <div className="mt-8 bg-gradient-to-r from-orange-500/10 via-transparent to-transparent border border-white/[0.05] rounded-[32px] p-8 overflow-hidden relative">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-orange-500/10 blur-[100px] rounded-full" />
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="text-orange-500" />
            <h3 className="text-lg font-bold text-white tracking-tight">AI Astrologer's Verdict</h3>
          </div>
          <p className="text-sm text-white/60 leading-relaxed max-w-4xl italic">
            "The combination of your Mesha Lagna and current Guru-Shani Dasha marks a 'Preparation Phase'. While immediate results in career may seem slow, the foundation you build now will lead to massive expansion in 2026. Prioritize meditation and avoiding legal disputes until June."
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes slow-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-slow-spin {
          animation: slow-spin 180s linear infinite;
        }
      `}</style>
    </div>
  );
}

function InsightCard({ title, icon, content, accent, iconColor }: any) {
  return (
    <div className={`bg-[#0d0f14]/60 backdrop-blur-md border ${accent} rounded-[32px] p-8 transition-all hover:translate-y-[-4px] hover:bg-white/[0.02]`}>
      <div className={`w-10 h-10 rounded-2xl bg-white/[0.03] flex items-center justify-center ${iconColor} mb-6 border border-white/[0.05]`}>
        {icon}
      </div>
      <h3 className="font-bold text-white mb-3 tracking-tight">{title}</h3>
      <p className="text-xs text-white/40 leading-relaxed">{content}</p>
    </div>
  );
}