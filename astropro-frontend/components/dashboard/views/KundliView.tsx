"use client";
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import BirthChart from '../BirthChart';
import PlanetPositions from '../PlanetPositions';
import { Sparkles, Star, TrendingUp, Heart, Wallet, ShieldAlert, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext'; // Assuming you have this for the token

interface KundliViewProps {
  clientData?: any; 
}

export default function KundliView({ clientData }: KundliViewProps) {
  const { token } = useAuth();
  const [chartType, setChartType] = useState('North');
  
  // Logic States
  const [loading, setLoading] = useState(false);
  const [kundliData, setKundliData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/v1';

  // 1. Check if Kundli exists in history
  const checkExistingHistory = useCallback(async () => {
    if (!clientData?.id || !token) return;
    
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/history?client_id=${clientData.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Look specifically for KUNDLI type in the history array
      const existingKundli = response.data.data.find((h: any) => h.analysis_type === 'KUNDLI');
      
      if (existingKundli) {
        setKundliData(existingKundli.result_data);
      }
    } catch (err) {
      console.error("History fetch failed", err);
    } finally {
      setLoading(false);
    }
  }, [clientData?.id, token, BASE_URL]);

  useEffect(() => {
    checkExistingHistory();
  }, [checkExistingHistory]);

  // 2. Generate New Kundli
  const handleGenerateKundli = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);

    try {
      const payload = {
        client_id: clientData.id,
        dob: clientData.dob,
        tob: clientData.tob,
        pob: clientData.pob,
        lat: clientData.lat,
        lon: clientData.lon,
        tz: clientData.tz || 5.5
      };

      const response = await axios.post(`${BASE_URL}/horoscope/kundli`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setKundliData(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to generate cosmic alignment.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to get specific planet data
  const getPlanet = (name: string) => kundliData?.chart?.find((p: any) => p.name === name) || {};

  return (
    <div className="relative min-h-screen animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Background and UI stay exactly the same */}
      <div className="fixed inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="w-[1200px] h-[1200px] border border-white/[0.03] rounded-full animate-slow-spin opacity-20">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="absolute top-1/2 left-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white/[0.1] to-transparent origin-left" style={{ transform: `rotate(${i * 30}deg)` }} />
          ))}
        </div>
      </div>

      <div className="relative z-10">
        
        {/* GENERATE OVERLAY IF NO DATA */}
        {!kundliData && !loading && (
          <div className="flex flex-col items-center justify-center py-20 bg-[#0d0f14]/40 border border-white/5 rounded-[40px] mb-8 backdrop-blur-md">
             <Sparkles className="text-orange-500 mb-4 animate-pulse" size={40} />
             <h2 className="text-xl font-black text-white uppercase italic tracking-tighter mb-2">Kundli Not Generated</h2>
             <p className="text-white/40 text-xs mb-6">Initialize the celestial alignment for {clientData?.name || 'this client'}</p>
             <button 
              onClick={handleGenerateKundli}
              className="px-8 py-4 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl active:scale-95"
             >
               Generate Birth Chart
             </button>
             {error && <p className="text-red-400 text-[10px] mt-4 uppercase font-bold tracking-widest">{error}</p>}
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="text-orange-500 animate-spin mb-4" size={32} />
            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Calculating Planetary Degrees...</p>
          </div>
        )}

        {/* DATA VIEW (Conditioned on kundliData existence) */}
        {kundliData && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Lagna', val: 'Mesha', color: 'text-orange-500' }, // Logic for Lagna can be added to response if needed
                { label: 'Rashi', val: getPlanet('Moon').sign || '...', color: 'text-blue-400' },
                { label: 'Nakshatra', val: 'Punarvasu', color: 'text-emerald-400' },
                { label: 'Sun Sign', val: getPlanet('Sun').sign || '...', color: 'text-yellow-500' }
              ].map((item) => (
                <div key={item.label} className="bg-[#0d0f14]/60 backdrop-blur-md border border-white/[0.05] rounded-[20px] p-5">
                  <p className="text-[10px] font-black tracking-[0.2em] text-white/30 uppercase mb-1">{item.label}</p>
                  <h4 className={`text-lg font-bold ${item.color}`}>{item.val}</h4>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-12 gap-6 mb-8">
              <div className="col-span-12 lg:col-span-7 bg-[#0d0f14]/40 backdrop-blur-md border border-white/[0.05] rounded-[32px] p-6">
                <BirthChart type={chartType} onTypeChange={setChartType} />
              </div>
              <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
                <PlanetPositions data={kundliData.chart} />
                <div className="bg-gradient-to-br from-indigo-500/10 to-transparent border border-indigo-500/20 rounded-[28px] p-6">
                   <div className="flex items-center gap-3 mb-4">
                      <ShieldAlert className="text-indigo-400" size={20} />
                      <h3 className="font-bold text-sm text-indigo-100 uppercase tracking-widest">Transit Analysis</h3>
                   </div>
                   <p className="text-xs text-indigo-200/60 leading-relaxed mb-4">
                      {getPlanet('Saturn').interpretation?.combined_insight || "Saturn analysis pending..."}
                   </p>
                </div>
              </div>
            </div>

            <div className="bg-[#0d0f14]/60 backdrop-blur-md border border-white/[0.05] rounded-[32px] p-8 mb-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm font-black tracking-[0.2em] text-white/40 uppercase">Current Vimshottari Dasha</h3>
                <span className="text-[10px] font-bold text-orange-500 bg-orange-500/10 px-3 py-1 rounded-full uppercase">Active Period</span>
              </div>
              <div className="flex flex-col md:flex-row items-center gap-4 relative">
                <div className="flex-1 w-full bg-white/[0.02] border border-white/[0.05] p-6 rounded-[24px] relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-2 opacity-10"><Star size={40}/></div>
                   <p className="text-[10px] font-bold text-white/30 uppercase mb-2">Mahadasha</p>
                   <h4 className="text-2xl font-black text-white">Jupiter (Guru)</h4>
                   <p className="text-xs text-orange-500 font-bold mt-1">Active Cycle</p>
                </div>
                <div className="hidden md:block text-white/10">→</div>
                <div className="flex-1 w-full bg-orange-500/5 border border-orange-500/20 p-6 rounded-[24px] relative">
                   <p className="text-[10px] font-bold text-orange-500/60 uppercase mb-2">Antardasha</p>
                   <h4 className="text-2xl font-black text-white">Saturn (Shani)</h4>
                   <p className="text-xs text-white/60 mt-1">Current Sub-period</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InsightCard 
                title="Life & Character" 
                icon={<TrendingUp size={18}/>} 
                content={kundliData.predictions?.personality}
                accent="border-emerald-500/20"
                iconColor="text-emerald-400"
              />
              <InsightCard 
                title="Marriage & Love" 
                icon={<Heart size={18}/>} 
                content={kundliData.predictions?.love}
                accent="border-pink-500/20"
                iconColor="text-pink-400"
              />
              <InsightCard 
                title="Wealth & Career" 
                icon={<Wallet size={18}/>} 
                content={kundliData.predictions?.work_life}
                accent="border-orange-500/20"
                iconColor="text-orange-400"
              />
            </div>

            <div className="mt-8 bg-gradient-to-r from-orange-500/10 via-transparent to-transparent border border-white/[0.05] rounded-[32px] p-8 overflow-hidden relative">
              <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-orange-500/10 blur-[100px] rounded-full" />
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="text-orange-500" />
                <h3 className="text-lg font-bold text-white tracking-tight">AI Astrologer's Verdict</h3>
              </div>
              <p className="text-sm text-white/60 leading-relaxed max-w-4xl italic">
                "{kundliData.predictions?.behavior}"
              </p>
            </div>
          </>
        )}
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
      <p className="text-xs text-white/40 leading-relaxed line-clamp-4">{content}</p>
    </div>
  );
}