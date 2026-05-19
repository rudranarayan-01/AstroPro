"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { Moon, Sparkles, Compass, Clock, MapPin, ArrowRight, Loader2, RefreshCw } from 'lucide-react';

interface ChartResponse {
  meta: { name: string; calculatedAt: string };
  chartData: any; // Match your backend response schema
}

export default function PublicAstrologyPortal() {
  // Input form state
  const [formData, setFormData] = useState({ name: '', dob: '', tob: '', location: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chartResult, setChartResult] = useState<ChartResponse | null>(null);

  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/v1';

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenerateChart = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${BASE_URL}/astrology/calculate-public`, formData);
      if (response.data.success) {
        setChartResult(response.data);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to align telemetry grids. Check inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080a] text-white/80 relative flex flex-col justify-between overflow-hidden selection:bg-orange-500/30 selection:text-orange-200">
      {/* Background Sacred Geometric Glow Maps */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-6 py-20 flex-1 w-full relative z-10 flex flex-col items-center justify-center">
        
        {!chartResult ? (
          /* --- STAGE 1: ENTRY FORM PORTAL --- */
          <div className="w-full max-w-lg bg-[#0d0f14]/80 border border-white/[0.05] rounded-[32px] p-8 backdrop-blur-md relative">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-12 h-12 bg-orange-600/10 border border-orange-500/20 rounded-2xl flex items-center justify-center text-orange-500 mb-4 shadow-xl">
                <Moon size={22} className="fill-orange-500/20" />
              </div>
              <h1 className="text-2xl font-black text-white uppercase tracking-wider italic">
                Astro<span className="text-orange-500 font-medium">PRO</span> Telemetry
              </h1>
              <p className="text-white/40 text-xs mt-2 max-w-xs leading-relaxed">
                Input your spatial birth metrics below to calculate instant planetary layouts securely. No account required.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-xs font-semibold text-red-400 tracking-wide uppercase">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleGenerateChart} className="space-y-5">
              <div>
                <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-2 pl-1">Target Name</label>
                <div className="relative">
                  <input required type="text" name="name" value={formData.name} onChange={handleFormChange} placeholder="e.g. Balaram Sahu" className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl py-3.5 px-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-orange-500/40 transition-colors" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-2 pl-1 flex items-center gap-1"><Compass size={10}/> Date of Birth</label>
                  <input required type="date" name="dob" value={formData.dob} onChange={handleFormChange} className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl py-3.5 px-4 text-sm text-white focus:outline-none focus:border-orange-500/40 transition-colors scheme-dark" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-2 pl-1 flex items-center gap-1"><Clock size={10}/> Exact Time</label>
                  <input required type="time" name="tob" value={formData.tob} onChange={handleFormChange} className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl py-3.5 px-4 text-sm text-white focus:outline-none focus:border-orange-500/40 transition-colors scheme-dark" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-2 pl-1 flex items-center gap-1"><MapPin size={10}/> City & Country of Birth</label>
                <input required type="text" name="location" value={formData.location} onChange={handleFormChange} placeholder="e.g. Bhubaneswar, India" className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl py-3.5 px-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-orange-500/40 transition-colors" />
              </div>

              <button type="submit" disabled={loading} className="w-full mt-4 py-4 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-600/50 rounded-xl font-bold text-white tracking-wider flex items-center justify-center gap-2 transition-all group shadow-lg shadow-orange-600/10">
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Aligning Cosmic Nodes...
                  </>
                ) : (
                  <>
                    Calculate Chart Layout <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* --- STAGE 2: KUNDLI RENDERING PORTAL (LIVE VIEW) --- */
          <div className="w-full space-y-8 animate-in fade-in duration-500">
            {/* Context Breadcrumb Ribbon */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0d0f14]/60 border border-white/[0.05] rounded-2xl p-4 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-600 text-white font-black rounded-xl flex items-center justify-center text-sm shadow-md">
                  {chartResult.meta.name[0].toUpperCase()}
                </div>
                <div>
                  <h2 className="text-white font-bold text-base">{chartResult.meta.name}'s Cosmic Manifest</h2>
                  <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mt-0.5">Session Type: Public Transient Layout</p>
                </div>
              </div>
              <button onClick={() => setChartResult(null)} className="flex items-center gap-1.5 px-4 py-2 bg-white/[0.02] border border-white/[0.05] text-xs font-bold text-white/60 hover:text-white rounded-xl transition-all">
                <RefreshCw size={12} /> Compute Different Coordinates
              </button>
            </div>

            {/* Dashboard Content Grids */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Chart Container Window */}
              <div className="lg:col-span-2 bg-[#0d0f14]/80 border border-white/[0.05] rounded-[32px] p-6 relative flex flex-col items-center justify-center min-h-[400px]">
                {/* Embedded Sacred Grid Animation */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.01] flex items-center justify-center">
                  <div className="w-[80%] h-[80%] border border-white rounded-full animate-slow-spin" />
                </div>
                
                {/* YOUR CHART DRAWING SYSTEM COMPONENT GOES HERE */}
                <div className="w-full max-w-[450px] aspect-square border border-white/10 rounded-2xl relative flex items-center justify-center p-8 bg-black/20">
                  <span className="text-[10px] font-black tracking-[0.2em] text-white/20 uppercase">
                    [ Interactive Astro Chart Matrix Graphic ]
                  </span>
                  {/* Print custom variables: chartResult.chartData */}
                </div>
              </div>

              {/* Right Column: Key Diagnostic Cards */}
              <div className="space-y-6">
                {/* Card 1: Rising Sign Summary */}
                <div className="bg-[#0d0f14]/80 border border-white/[0.05] rounded-[24px] p-6">
                  <h3 className="text-[10px] font-black text-orange-500 uppercase tracking-widest flex items-center gap-1.5 mb-3">
                    <Sparkles size={12}/> Ascendant Manifest
                  </h3>
                  <p className="text-white text-lg font-bold">Leo (Simha Lagna)</p>
                  <p className="text-white/40 text-xs mt-2 leading-relaxed">
                    The core alignment matrix represents powerful leadership qualities driven by Solar energy architectures. High resonance in 1st house grids.
                  </p>
                </div>

                {/* Card 2: Strategic CTA Hook to Capture Leads */}
                <div className="bg-gradient-to-br from-orange-600/10 to-transparent border border-orange-500/20 rounded-[24px] p-6 relative overflow-hidden">
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-orange-600/10 rounded-full blur-2xl" />
                  <h3 className="text-white font-black text-sm uppercase tracking-wide">Want Full In-Depth Analysis?</h3>
                  <p className="text-white/50 text-xs mt-2 leading-relaxed">
                    Connect directly with verified planetary experts via real-time encrypted workspaces for deep transit diagnostics.
                  </p>
                  <button className="mt-5 w-full py-3 bg-orange-600 hover:bg-orange-700 text-xs font-bold text-white rounded-xl transition-all shadow-md">
                    Connect with an Astrologer
                  </button>
                </div>

              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
}