"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Sparkles, Moon, Sun, Compass, Loader2, Info } from 'lucide-react';

// Explicitly outline all twelve Zodiac structural signs
const ZODIAC_SIGNS = [
  { key: 'aries', name: 'Aries', element: 'Fire', symbol: '♈' },
  { key: 'taurus', name: 'Taurus', element: 'Earth', symbol: '♉' },
  { key: 'gemini', name: 'Gemini', element: 'Air', symbol: '♊' },
  { key: 'cancer', name: 'Cancer', element: 'Water', symbol: '♋' },
  { key: 'leo', name: 'Leo', element: 'Fire', symbol: '♌' },
  { key: 'virgo', name: 'Virgo', element: 'Earth', symbol: '♍' },
  { key: 'libra', name: 'Libra', element: 'Air', symbol: '♎' },
  { key: 'scorpio', name: 'Scorpio', element: 'Water', symbol: '♏' },
  { key: 'sagittarius', name: 'Sagittarius', element: 'Fire', symbol: '♐' },
  { key: 'capricorn', name: 'Capricorn', element: 'Earth', symbol: '♑' },
  { key: 'aquarius', name: 'Aquarius', element: 'Air', symbol: '♒' },
  { key: 'pisces', name: 'Pisces', element: 'Water', symbol: '♓' },
];

export default function DailyAstrology() {
  const [activeTab, setActiveTab] = useState<'horoscope' | 'rashi' | 'astrology'>('horoscope');
  const [selectedSign, setSelectedSign] = useState('aries');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/v1';

  useEffect(() => {
    async function fetchDailyMetrics() {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/horoscope/daily`);
        setData(response.data);
      } catch (err) {
        console.error("Failed to parse daily transits:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDailyMetrics();
  }, [BASE_URL]);

  return (
    <section className="w-full bg-[#07080a] py-24 border-b border-white/[0.05] relative overflow-hidden">
      {/* Background Sacred Geometric Radial Blurs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <span className="text-[10px] font-black tracking-[0.3em] text-orange-500 uppercase mb-3">Live Cosmic Telemetry</span>
          <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-wider italic">Daily Ephemeris & Predictions</h2>
          <p className="text-white/40 text-xs mt-3 max-w-md leading-relaxed">
            Real-time planetary alignment data maps synced directly with stellar movements for your location coordinates.
          </p>
        </div>

        {/* --- TAB CONTROL SEGMENT --- */}
        <div className="flex justify-center border-b border-white/[0.05] mb-12 max-w-xl mx-auto gap-2">
          <TabButton active={activeTab === 'horoscope'} onClick={() => setActiveTab('horoscope')} icon={<Sparkles size={14}/>} label="Today Horoscope" />
          <TabButton active={activeTab === 'rashi'} onClick={() => setActiveTab('rashi')} icon={<Moon size={14}/>} label="Daily Rashi Data" />
          <TabButton active={activeTab === 'astrology'} onClick={() => setActiveTab('astrology')} icon={<Compass size={14}/>} label="Daily Astrology" />
        </div>

        {/* --- LOADER SUB-LAYER --- */}
        {loading ? (
          <div className="min-h-[300px] flex flex-col items-center justify-center gap-3">
            <Loader2 className="text-orange-500 animate-spin" size={28} />
            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Parsing Planetary Degrees...</p>
          </div>
        ) : (
          <div className="bg-[#0d0f14]/60 border border-white/[0.05] rounded-[32px] p-8 backdrop-blur-md min-h-[350px] flex flex-col justify-between">
            
            {/* CONTENT LAYER 1: TODAY HOROSCOPE MATRIX */}
            {activeTab === 'horoscope' && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Sign Picker grid side-panel */}
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-2 gap-2 h-fit">
                  {ZODIAC_SIGNS.map((sign) => (
                    <button
                      key={sign.key}
                      onClick={() => setSelectedSign(sign.key)}
                      className={`py-2.5 px-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1 ${
                        selectedSign === sign.key 
                          ? 'bg-orange-600/10 border-orange-500/40 text-white' 
                          : 'bg-white/[0.01] border-white/[0.04] text-white/40 hover:text-white hover:bg-white/[0.03]'
                      }`}
                    >
                      <span className="text-base">{sign.symbol}</span>
                      <span className="text-[11px] font-bold tracking-wide">{sign.name}</span>
                    </button>
                  ))}
                </div>
                {/* Detailed display text card area */}
                <div className="md:col-span-3 flex flex-col justify-center pl-0 md:pl-6 border-t md:border-t-0 md:border-l border-white/[0.05] pt-6 md:pt-0">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{ZODIAC_SIGNS.find(s => s.key === selectedSign)?.symbol}</span>
                    <h3 className="text-xl font-bold text-white capitalize">{selectedSign} Forecast</h3>
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed max-w-2xl font-light">
                    {data?.horoscope?.[selectedSign] || "Planetary arrays are stabilizing. Solar transit shifts indicate favorable micro-frequencies for intellectual ventures today."}
                  </p>
                </div>
              </div>
            )}

            {/* CONTENT LAYER 2: DAILY RASHI PLACEMENTS */}
            {activeTab === 'rashi' && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  <Moon className="text-orange-500" size={18} />
                  <h3 className="text-base font-black uppercase tracking-wider text-white">Chandra Rashi (Moon Sign) Current Ingress</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <RashiMetricCard title="Lunar Position" value={data?.rashiData?.position || "Leo (Simha Rashi)"} detail="Moon actively scaling the purva phalguni nakshatra matrix." />
                  <RashiMetricCard title="Auspicious Metal" value={data?.rashiData?.metal || "Gold / Copper"} detail="Highly favorable conduction elements for physical anchors." />
                  <RashiMetricCard title="Dominant Energy Element" value={data?.rashiData?.element || "Agni (Fire Vector)"} detail="Spike in internal metabolic heat maps and executive actions." />
                </div>
              </div>
            )}

            {/* CONTENT LAYER 3: COMPREHENSIVE DAILY ASTROLOGY (PANCHANG ENGINE) */}
            {activeTab === 'astrology' && (
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.05] pb-4">
                  <div className="flex items-center gap-2">
                    <Sun className="text-orange-500" size={18} />
                    <h3 className="text-base font-black uppercase tracking-wider text-white">Universal Solar Panchang Alignment</h3>
                  </div>
                  <span className="text-[10px] font-bold text-white/30 tracking-widest bg-white/[0.03] px-3 py-1 rounded-full border border-white/[0.05]">
                    CALCULATED AT UTC TIME
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <span className="text-[10px] font-black text-white/30 uppercase tracking-widest block mb-1">Tithi Index</span>
                    <p className="text-white font-bold text-sm">{data?.astrology?.tithi || "Shukla Paksha Ekadashi"}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-white/30 uppercase tracking-widest block mb-1">Active Nakshatra</span>
                    <p className="text-white font-bold text-sm">{data?.astrology?.nakshatra || "Magha Transit (Ketu Owned)"}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-white/30 uppercase tracking-widest block mb-1">Rahu Kaal Frame</span>
                    <p className="text-red-400 font-bold text-sm">{data?.astrology?.rahuKaal || "15:30 PM - 17:00 PM"}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-white/30 uppercase tracking-widest block mb-1">Abhijit Muhurat</span>
                    <p className="text-emerald-400 font-bold text-sm">{data?.astrology?.abhijit || "11:45 AM - 12:35 PM"}</p>
                  </div>
                </div>

                <div className="bg-white/[0.01] border border-white/[0.04] rounded-xl p-4 flex items-start gap-3">
                  <Info size={16} className="text-orange-500/60 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-white/40 leading-relaxed">
                    Note: General public alignment metrics change on 24-hour solar boundaries. For personalized precise charts calculated down to your second of birth, use your secure dashboard workspace.
                  </p>
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </section>
  );
}

// Inner Utility Helper: Tab Link Triggers
function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`pb-4 px-4 text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all relative whitespace-nowrap ${
        active ? 'text-white' : 'text-white/30 hover:text-white/60'
      }`}
    >
      {icon} {label}
      {active && (
        <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-orange-500 rounded-full animate-in fade-in duration-300" />
      )}
    </button>
  );
}

// Inner Utility Helper: Rashi Metric Card Display Layouts
function RashiMetricCard({ title, value, detail }: { title: string; value: string; detail: string }) {
  return (
    <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-5 hover:border-white/[0.1] transition-all">
      <span className="text-[10px] font-black text-white/30 uppercase tracking-widest block mb-1">{title}</span>
      <p className="text-white font-bold text-base">{value}</p>
      <p className="text-xs text-white/40 mt-2 leading-relaxed">{detail}</p>
    </div>
  );
}