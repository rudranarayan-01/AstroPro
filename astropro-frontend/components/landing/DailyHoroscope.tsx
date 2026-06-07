"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Sparkles, Moon, Sun, Compass, Loader2, Calendar, Info } from 'lucide-react';

// Premium SVG paths for all 12 Zodiac / Rashi configurations 
// This completely replaces standard text emojis with enterprise-grade vector geometry
const ZODIAC_METADATA: Record<string, { name: string; nativeName: string; element: string; rulingPlanet: string; svgPath: React.ReactNode }> = {
  aries: {
    name: 'Aries', nativeName: 'Mesh', element: 'Fire', rulingPlanet: 'Mars',
    svgPath: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 14a3 3 0 0 1-3-3V4a3 3 0 1 1 6 0v7a3 3 0 0 1-3 3zm0 0v6m-4-3h8" /> // Custom streamlined representation
  },
  taurus: {
    name: 'Taurus', nativeName: 'Vrishabha', element: 'Earth', rulingPlanet: 'Venus',
    svgPath: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 5c-3.313 0-6 2.1-6 4.7c0 2 1.624 3.707 4 4.414V20h4v-5.886c2.376-.707 4-2.414 4-4.414C18 7.1 15.313 5 12 5z M6 7s1-3 6-3 6 3 6 3" />
  },
  gemini: {
    name: 'Gemini', nativeName: 'Mithuna', element: 'Air', rulingPlanet: 'Mercury',
    svgPath: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 20V4h3v16H4zm13-16v16h3V4h-3zM7 8h10M7 16h10" />
  },
  cancer: {
    name: 'Cancer', nativeName: 'Karka', element: 'Water', rulingPlanet: 'Moon',
    svgPath: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8z M8 6h8 M8 18h8" />
  },
  leo: {
    name: 'Leo', nativeName: 'Simha', element: 'Fire', rulingPlanet: 'Sun',
    svgPath: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 0v5c0 1.66-1.34 3-3 3s-3-1.34-3-3" />
  },
  virgo: {
    name: 'Virgo', nativeName: 'Kanya', element: 'Earth', rulingPlanet: 'Mercury',
    svgPath: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 4v12a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V4 M10 4v10 M14 4v10" />
  },
  libra: {
    name: 'Libra', nativeName: 'Tula', element: 'Air', rulingPlanet: 'Venus',
    svgPath: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 19h14M5 15h14M12 4v11m-4-7l4-4 4 4" />
  },
  scorpio: {
    name: 'Scorpio', nativeName: 'Vrishchika', element: 'Water', rulingPlanet: 'Mars',
    svgPath: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 5v10a3 3 0 0 0 3 3h3v-4m0 4h3a3 3 0 0 0 3-3V5M10 5v8M14 5v8 M18 10l2 2-2 2" />
  },
  sagittarius: {
    name: 'Sagittarius', nativeName: 'Dhanu', element: 'Fire', rulingPlanet: 'Jupiter',
    svgPath: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 5l-9 9m9-9h-6m6 0v6M6 18l5-5m-7 1h3v3" />
  },
  capricorn: {
    name: 'Capricorn', nativeName: 'Makara', element: 'Earth', rulingPlanet: 'Saturn',
    svgPath: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18 8a3 3 0 0 0-6 0v8a3 3 0 0 1-6 0v-4" />
  },
  aquarius: {
    name: 'Aquarius', nativeName: 'Kumbha', element: 'Air', rulingPlanet: 'Uranus',
    svgPath: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 8l4-3 4 3 4-3 4 3M4 14l4-3 4 3 4-3 4 3" />
  },
  pisces: {
    name: 'Pisces', nativeName: 'Meena', element: 'Water', rulingPlanet: 'Neptune',
    svgPath: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 12h12M4 5c3 3 3 11 0 14M20 5c-3 3-3 11 0 14" />
  }
};

export default function DailyAstrology() {
  const [activeTab, setActiveTab] = useState<'horoscope' | 'rashi' | 'astrology'>('horoscope');
  const [selectedSign, setSelectedSign] = useState('aries');
  const [loading, setLoading] = useState(true);
  const [astroData, setAstroData] = useState<any>(null);

  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/v1';
  const formattedToday = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  useEffect(() => {
    async function fetchCosmicData() {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/horoscope/daily`);
        if (response.data.success) {
          setAstroData(response.data);
        }
      } catch (err) {
        console.error("Frontend failed to catch planetary stream:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCosmicData();
  }, [BASE_URL]);

  return (
    <section className="w-full bg-[#07080a] py-24 border-b border-white/[0.05] relative overflow-hidden">
      {/* Structural Ambient Glow Background Map */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-orange-600/[0.02] rounded-full blur-[140px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Top Control Block & Branding */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.06] pb-8 mb-12">
          <div>
            <div className="flex items-center gap-2 text-orange-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">
              <Sparkles size={12} /> Live Ephemeris Engine
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wider italic">
              Daily Transit Diagnostics
            </h2>
          </div>
          <div className="flex items-center gap-4">
            {/* System Tab Trigger Blocks */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-1 flex gap-1">
              <HeaderTab active={activeTab === 'horoscope'} onClick={() => setActiveTab('horoscope')} label="Daily Prediction" />
              <HeaderTab active={activeTab === 'rashi'} onClick={() => setActiveTab('rashi')} label="Rashi Vectors" />
              <HeaderTab active={activeTab === 'astrology'} onClick={() => setActiveTab('astrology')} label="Vedic Panchang" />
            </div>
          </div>
        </div>

        {/* --- MAIN DISPLAY CONTROLLER STAGE --- */}
        {loading ? (
          <div className="min-h-[420px] flex flex-col items-center justify-center gap-3 bg-white/[0.01] border border-white/[0.04] rounded-3xl">
            <Loader2 className="text-orange-500 animate-spin" size={24} />
            <span className="text-[9px] font-black tracking-widest text-white/20 uppercase">Syncing Celestial Node Parameters...</span>
          </div>
        ) : (
          <div className="min-h-[420px] transition-all duration-300">
            
            {/* 1. HOROSCOPE TAB: HIGH END ASTROLOGY ARCHITECTURE SPLIT */}
            {activeTab === 'horoscope' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Matrix: Premium 12 Button Layout */}
                <div className="lg:col-span-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2.5 max-h-[450px] overflow-y-auto pr-1 custom-scrollbar">
                  {Object.entries(ZODIAC_METADATA).map(([key, value]) => {
                    const isSelected = selectedSign === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setSelectedSign(key)}
                        className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between gap-4 group ${
                          isSelected 
                            ? 'bg-gradient-to-br from-orange-600/10 to-orange-600/[0.02] border-orange-500/40 text-white shadow-lg shadow-orange-600/[0.02]' 
                            : 'bg-white/[0.01] border-white/[0.05] text-white/40 hover:text-white/80 hover:bg-white/[0.02] hover:border-white/[0.1]'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <svg className={`w-6 h-6 fill-none stroke-current transition-colors ${isSelected ? 'text-orange-500' : 'text-white/30 group-hover:text-white/60'}`} viewBox="0 0 24 24">
                            {value.svgPath}
                          </svg>
                          <span className="text-[9px] font-medium opacity-40 px-1.5 py-0.5 bg-white/[0.03] rounded border border-white/[0.05]">
                            {value.element}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-xs font-black tracking-wide text-white/90 uppercase">{value.name}</h4>
                          <span className="text-[10px] text-white/30 font-medium block">{value.nativeName} Rashi</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Right Forecast Details Pane */}
                <div className="lg:col-span-8 bg-[#0d0f14]/80 border border-white/[0.05] rounded-[28px] p-6 md:p-8 backdrop-blur-md relative overflow-hidden min-h-[380px] flex flex-col justify-between">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none text-white">
                    <svg className="w-48 h-48 fill-none stroke-current" viewBox="0 0 24 24">
                      {ZODIAC_METADATA[selectedSign]?.svgPath}
                    </svg>
                  </div>
                  
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.05] pb-5 mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-600/10 rounded-xl border border-orange-500/20 flex items-center justify-center text-orange-500">
                          <svg className="w-6 h-6 fill-none stroke-current" viewBox="0 0 24 24">
                            {ZODIAC_METADATA[selectedSign]?.svgPath}
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-white uppercase tracking-wide">
                            {ZODIAC_METADATA[selectedSign]?.name} <span className="text-orange-500 font-normal">/ {ZODIAC_METADATA[selectedSign]?.nativeName}</span>
                          </h3>
                          <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mt-0.5">
                            Ruling Overlord: {ZODIAC_METADATA[selectedSign]?.rulingPlanet}
                          </p>
                        </div>
                      </div>
                      <div className="text-right text-white/30 text-xs font-bold bg-white/[0.02] border border-white/[0.05] px-4 py-2 rounded-xl">
                        {formattedToday}
                      </div>
                    </div>
                    
                    <p className="text-sm text-white/70 leading-relaxed font-light bg-black/20 p-6 rounded-2xl border border-white/[0.02]">
                      {astroData?.horoscope?.[selectedSign] || "Cosmic coordinates are updating for this sign element sequence. Real-time parameters will mount immediately."}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center gap-2 text-[11px] text-white/30 font-semibold uppercase tracking-wider">
                    <Info size={12} className="text-orange-500/50" /> System State: Synchronized with Sidereal Zodiac Ephemeris.
                  </div>
                </div>

              </div>
            )}

            {/* 2. RASHI DATA TAB MODULE */}
            {activeTab === 'rashi' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-300">
                <MetricDisplayCard title="Chandra Rashi Ingress" value={astroData?.rashiData?.position} subtitle="Active Moon Sign Navigation Coordinate" icon={<Moon size={16} />} />
                <MetricDisplayCard title="Elemental Conductivity" value={astroData?.rashiData?.element} subtitle="Dominant biological energetic vector frequency" icon={<Sparkles size={16} />} />
                <MetricDisplayCard title="Harmonizing Metal" value={astroData?.rashiData?.metal} subtitle="Optimal material grounding structure anchor" icon={<Sun size={16} />} />
              </div>
            )}

            {/* 3. VEDIC PANCHANG TAB MODULE */}
            {activeTab === 'astrology' && (
              <div className="bg-[#0d0f14]/80 border border-white/[0.05] rounded-[28px] p-6 md:p-8 backdrop-blur-md animate-in fade-in duration-300">
                <div className="flex items-center gap-2 border-b border-white/[0.05] pb-4 mb-6">
                  <Compass className="text-orange-500" size={18} />
                  <h3 className="text-sm font-black uppercase tracking-wider text-white">Traditional Vedic Panchang Matrices</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <PanchangGridItem label="Tithi (Lunar Metric)" value={astroData?.astrology?.tithi} description="Current phase alignment index." />
                  <PanchangGridItem label="Active Nakshatra" value={astroData?.astrology?.nakshatra} description="Lunar mansion tracking quadrant." />
                  <PanchangGridItem label="Rahu Kaal Intercept" value={astroData?.astrology?.rahuKaal} description="Geometric phase of high resistance." isAlert />
                  <PanchangGridItem label="Abhijit Muhurat" value={astroData?.astrology?.abhijit} description="Peak configuration window." isSuccess />
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </section>
  );
}

// Inner Functional Helper: Sub-Navigation Header Buttons
function HeaderTab({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${
        active 
          ? 'bg-orange-600 text-white shadow-md' 
          : 'text-white/40 hover:text-white'
      }`}
    >
      {label}
    </button>
  );
}

// Inner Functional Helper: Rashi Metric Card Layouts
function MetricDisplayCard({ title, value, subtitle, icon }: { title: string; value: string; subtitle: string; icon: React.ReactNode }) {
  return (
    <div className="bg-[#0d0f14]/80 border border-white/[0.05] rounded-2xl p-6 relative overflow-hidden group hover:border-white/[0.1] transition-all">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">{title}</span>
        <div className="text-orange-500/40 group-hover:text-orange-500 transition-colors">{icon}</div>
      </div>
      <p className="text-white text-base font-black tracking-wide uppercase">{value || "Analyzing..."}</p>
      <p className="text-xs text-white/40 mt-2 leading-relaxed">{subtitle}</p>
    </div>
  );
}

// Inner Functional Helper: Minimal Panchang Grid Metric Cells
function PanchangGridItem({ label, value, description, isAlert, isSuccess }: { label: string; value: string; description: string; isAlert?: boolean; isSuccess?: boolean }) {
  return (
    <div className="bg-white/[0.01] border border-white/[0.04] p-5 rounded-xl">
      <span className="text-[9px] font-black text-white/30 uppercase tracking-widest block mb-1">{label}</span>
      <p className={`font-bold text-sm tracking-wide ${isAlert ? 'text-red-400' : isSuccess ? 'text-emerald-400' : 'text-white'}`}>
        {value || "Processing..."}
      </p>
      <p className="text-xs text-white/40 mt-1.5 font-light">{description}</p>
    </div>
  );
}