// components/dashboard/views/VastuView.tsx
"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Home, ShieldCheck, AlertTriangle, Info, Plus, Trash2, 
  Sparkles, Loader2, Languages, Compass, Flame, Droplets, Wind
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { translations } from '../translation';
import { translateText } from '@/utils/ClientTranslation';

interface RoomInput {
  type: string;
  direction: string;
}

interface VastuViewProps {
  clientData?: any;
}

const ROOM_OPTIONS = [
  { value: "pooja", label: "Pooja Room" },
  { value: "kitchen", label: "Kitchen" },
  { value: "master_bedroom", label: "Master Bedroom" },
  { value: "bedroom", label: "Guest/Children Bedroom" },
  { value: "living", label: "Living Room" },
  { value: "toilet", label: "Toilet / Restroom" },
  { value: "study", label: "Study Room" },
  { value: "dining", label: "Dining Area" },
  { value: "storage", label: "Heavy Storage" }
];

const DIRECTION_OPTIONS = ["NE", "N", "NW", "W", "SW", "S", "SE", "E"];

export default function VastuView({ clientData }: VastuViewProps) {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [lang, setLang] = useState('en');
  
  // Interactive room-building state
  const [rooms, setRooms] = useState<RoomInput[]>([
    { type: 'living', direction: 'N' }
  ]);
  const [newRoomType, setNewRoomType] = useState('pooja');
  const [newRoomDirection, setNewRoomDirection] = useState('NE');

  // Translation state for AI content
  const [translatedReport, setTranslatedReport] = useState<any>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/v1';
  const t = translations[lang] || translations.en;

  // --- 1. Query: Fetch Saved Vastu Session ---
  const { data: vastuData, isLoading: historyLoading } = useQuery({
    queryKey: ['vastuHistory', clientData?.id],
    queryFn: async () => {
      if (!clientData?.id || !token) return null;
      const response = await axios.get(`${BASE_URL}/history?client_id=${clientData.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const historyItem = response.data.history?.find((h: any) => h.analysis_type === 'VASTU');
      return historyItem?.result_data || null;
    },
    enabled: !!clientData?.id && !!token,
    staleTime: 1000 * 60 * 30,
  });

  // --- 2. Mutation: Generate Vastu Analysis ---
  const mutation = useMutation({
    mutationFn: async () => {
      const payload = {
        client_id: clientData.id,
        rooms: rooms
      };
      const response = await axios.post(`${BASE_URL}/horoscope/vastu`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.data;
    },
    onSuccess: (newData: any) => {
      queryClient.setQueryData(['vastuHistory', clientData?.id], newData);
    }
  });

  // --- 3. Dynamic Translation Engine for AI Report ---
  useEffect(() => {
    async function translateVastuReport() {
      if (!vastuData?.detailed_analysis) return;

      if (lang === 'en') {
        setTranslatedReport(vastuData.detailed_analysis);
        return;
      }

      setIsTranslating(true);
      const detail = vastuData.detailed_analysis;

      try {
        const [propertyEvaluation, strengths, criticalDoshas, remedies, energyEnhancers] = await Promise.all([
          translateText(detail.property_evaluation, lang),
          Promise.all((detail.strengths || []).map((s: string) => translateText(s, lang))),
          Promise.all((detail.critical_doshas || []).map(async (d: any) => ({
            room: await translateText(d.room, lang),
            zone: d.zone,
            impact: await translateText(d.impact, lang),
            elemental_clash: await translateText(d.elemental_clash, lang),
          }))),
          Promise.all((detail.remedies || []).map(async (r: any) => ({
            target: await translateText(r.target, lang),
            remedy_title: await translateText(r.remedy_title, lang),
            implementation_steps: await translateText(r.implementation_steps, lang),
          }))),
          Promise.all((detail.energy_enhancers || []).map((e: string) => translateText(e, lang))),
        ]);

        setTranslatedReport({
          property_evaluation: propertyEvaluation,
          strengths,
          critical_doshas: criticalDoshas,
          remedies,
          energy_enhancers: energyEnhancers
        });
      } catch (err) {
        console.error("Vastu runtime translation failed:", err);
        setTranslatedReport(detail); // Fallback to raw English data
      } finally {
        setIsTranslating(false);
      }
    }

    translateVastuReport();
  }, [lang, vastuData]);

  // --- 4. Room List Mutators ---
  const addRoom = () => {
    if (rooms.length >= 10) return; // Cap at 10 items for visual layout safety
    setRooms([...rooms, { type: newRoomType, direction: newRoomDirection }]);
  };

  const removeRoom = (index: number) => {
    setRooms(rooms.filter((_, i) => i !== index));
  };

  const isLoading = historyLoading || mutation.isPending || isTranslating;
  const activeReport = translatedReport || vastuData?.detailed_analysis;

  // Render Element Icons in Grid
  const getElementIcon = (element: string) => {
    const lower = element.toLowerCase();
    if (lower.includes("water")) return <Droplets size={12} className="text-blue-400" />;
    if (lower.includes("fire")) return <Flame size={12} className="text-red-400" />;
    if (lower.includes("air")) return <Wind size={12} className="text-teal-400" />;
    return <Compass size={12} className="text-orange-400" />;
  };

  return (
    <div className="relative min-h-screen pb-20 animate-in fade-in duration-1000">
      
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">Vastu Shastra</h1>
          <p className="text-[10px] tracking-[0.4em] text-orange-500/60 font-bold uppercase">Cosmic Architectural Alignment</p>
        </div>

        <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/5 backdrop-blur-xl">
          <div className="flex gap-1">
            {['en', 'hi', 'or'].map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${lang === l ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/20' : 'text-white/40 hover:text-white/60'}`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="h-6 w-[1px] bg-white/10 mx-2" />
          <Languages size={18} className="text-white/20 mr-2" />
        </div>
      </div>

      {/* LOADING HANDLER */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-40">
          <div className="relative">
            <Loader2 className="text-orange-500 animate-spin" size={64} strokeWidth={1} />
            <Home className="absolute inset-0 m-auto text-orange-500/50 animate-pulse" size={24} />
          </div>
          <p className="mt-8 text-[11px] font-black text-white/40 uppercase tracking-[0.5em] animate-pulse">Calculating Elemental Alignment...</p>
        </div>
      )}

      {/* PLANNER/BUILDER STATE (No Data Returned Yet) */}
      {!vastuData && !isLoading && (
        <div className="grid grid-cols-12 gap-6 items-start">
          {/* Room Configuration Tool */}
          <div className="col-span-12 lg:col-span-5 bg-[#0d0f14]/60 border border-white/[0.05] rounded-[32px] p-8 backdrop-blur-xl">
            <h3 className="text-sm font-black text-white uppercase tracking-wider mb-6 flex items-center gap-2">
              <Plus size={16} className="text-orange-500" /> Construct Layout
            </h3>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div>
                <label className="text-[9px] font-black text-white/30 uppercase tracking-wider mb-2 block">Room Type</label>
                <select 
                  value={newRoomType}
                  onChange={(e) => setNewRoomType(e.target.value)}
                  className="w-full bg-white/5 border border-white/5 p-3 rounded-xl text-xs font-bold text-white focus:border-orange-500/50 focus:outline-none transition-colors"
                >
                  {ROOM_OPTIONS.map(opt => <option key={opt.value} value={opt.value} className="bg-[#0f1115]">{opt.label}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[9px] font-black text-white/30 uppercase tracking-wider mb-2 block">Compass Zone</label>
                <select 
                  value={newRoomDirection}
                  onChange={(e) => setNewRoomDirection(e.target.value)}
                  className="w-full bg-white/5 border border-white/5 p-3 rounded-xl text-xs font-bold text-white focus:border-orange-500/50 focus:outline-none transition-colors"
                >
                  {DIRECTION_OPTIONS.map(dir => <option key={dir} value={dir} className="bg-[#0f1115]">{dir}</option>)}
                </select>
              </div>
            </div>

            <button 
              onClick={addRoom}
              className="w-full py-4 bg-white/5 border border-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all text-white mb-6"
            >
              Add Room Placement
            </button>

            <button 
              onClick={() => mutation.mutate()}
              className="group relative w-full py-5 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all overflow-hidden shadow-lg shadow-orange-900/20"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Sparkles size={14} /> Calculate Elemental Score
              </span>
            </button>
          </div>

          {/* Active Blueprint View */}
          <div className="col-span-12 lg:col-span-7 bg-[#0d0f14]/60 border border-white/[0.05] rounded-[32px] p-8 h-fit min-h-[400px]">
            <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-6 italic">Active Blueprint Layout</h3>
            
            {rooms.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Home size={32} className="text-white/10 mb-4" />
                <p className="text-xs text-white/30 font-bold uppercase tracking-wider">No rooms configured yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                {rooms.map((room, idx) => (
                  <div key={idx} className="flex justify-between items-center p-4 rounded-2xl bg-white/[0.02] border border-white/[0.03] group hover:bg-white/[0.04] transition-all">
                    <div>
                      <h4 className="text-xs font-black text-white uppercase tracking-wider">
                        {ROOM_OPTIONS.find(r => r.value === room.type)?.label || room.type}
                      </h4>
                      <p className="text-[10px] text-orange-500 font-bold uppercase mt-0.5">{room.direction} Zone</p>
                    </div>
                    <button 
                      onClick={() => removeRoom(idx)}
                      className="p-2 bg-red-500/15 text-red-400 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ANALYSIS REPORT DISPLAY STATE */}
      {vastuData && !isLoading && (
        <div className="grid grid-cols-12 gap-6 items-start">
          
          {/* Main Scoring Grid */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            
            <div className="bg-[#0d0f14]/60 border border-white/[0.05] rounded-[32px] p-8 relative overflow-hidden backdrop-blur-xl">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight italic">Property Analysis</h3>
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mt-1">
                    Vastu Evaluation for {clientData?.name || "Residential Layout"}
                  </p>
                </div>
                
                {/* Mathematical Vastu Circular Progress Indicator */}
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="32" cy="32" r="28" className="stroke-white/5" strokeWidth="4" fill="transparent" />
                    <circle 
                      cx="32" cy="32" r="28" 
                      className="stroke-orange-500 transition-all duration-1000" 
                      strokeWidth="4" 
                      fill="transparent" 
                      strokeDasharray={175} 
                      strokeDashoffset={175 - (175 * (vastuData.score || 0)) / 100} 
                    />
                  </svg>
                  <span className="absolute text-xs font-black text-white">{vastuData.score}%</span>
                </div>
              </div>

              {/* Grid System displaying active room element breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {vastuData.elements_breakdown?.map((item: any, i: number) => (
                  <div 
                    key={i} 
                    className={`border p-5 rounded-[24px] relative transition-all ${
                      item.compatibility === "excellent" 
                        ? "border-emerald-500/10 bg-emerald-500/[0.01]" 
                        : item.compatibility === "poor" 
                        ? "border-red-500/10 bg-red-500/[0.01]" 
                        : "border-white/[0.03] bg-white/[0.01]"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">{item.zone} Zone</p>
                      {item.compatibility === "excellent" ? (
                        <ShieldCheck size={14} className="text-emerald-400" />
                      ) : item.compatibility === "poor" ? (
                        <AlertTriangle size={14} className="text-red-400" />
                      ) : (
                        <Info size={14} className="text-white/30" />
                      )}
                    </div>
                    
                    <h4 className="text-xs font-black text-white uppercase tracking-wider mb-2">
                      {ROOM_OPTIONS.find(r => r.value === item.room)?.label || item.room}
                    </h4>

                    <div className="flex gap-1.5 items-center bg-white/5 px-2 py-1 rounded-lg w-fit">
                      {getElementIcon(item.element)}
                      <span className="text-[9px] text-white/50 font-bold uppercase">{item.element.split(" ")[0]}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Diagnostics: General Overview */}
            {activeReport?.property_evaluation && (
              <div className="bg-[#0d0f14]/60 border border-white/[0.05] rounded-[32px] p-8">
                <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-4 italic">Property Diagnostic</h3>
                <p className="text-xs text-white/60 leading-relaxed font-medium">{activeReport.property_evaluation}</p>
              </div>
            )}
          </div>

          {/* COLUMN 2: Remedies & Enhancers */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            
            {/* Dynamic Remedies Panel */}
            {activeReport?.remedies && activeReport.remedies.length > 0 && (
              <div className="bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20 rounded-[32px] p-8">
                <h3 className="font-bold text-white mb-6 flex items-center gap-2 text-sm uppercase tracking-wide">
                  <Info size={16} className="text-orange-500" /> Actionable Remedies
                </h3>
                <div className="space-y-6">
                  {activeReport.remedies.map((remedy: any, i: number) => (
                    <div key={i} className="border-b border-white/5 last:border-0 pb-4 last:pb-0">
                      <span className="text-[8px] font-black bg-orange-500/10 text-orange-400 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        {remedy.target}
                      </span>
                      <h4 className="text-xs font-black text-white mt-2 leading-snug">{remedy.remedy_title}</h4>
                      <p className="text-[11px] text-white/50 leading-relaxed mt-1.5">{remedy.implementation_steps}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* General Energy Enhancers */}
            {activeReport?.energy_enhancers && (
              <div className="bg-[#0d0f14]/60 border border-white/[0.05] rounded-[32px] p-8">
                <h3 className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-4 italic">Zone Enhancers</h3>
                <ul className="space-y-3">
                  {activeReport.energy_enhancers.map((tip: string, i: number) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-white/50 leading-relaxed">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Clear Session / Return to Planner */}
            <div className="flex justify-end pt-2">
              <button 
                onClick={() => {
                  queryClient.setQueryData(['vastuHistory', clientData?.id], null);
                  setTranslatedReport(null);
                }}
                className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-wider text-white/60 transition-all border border-white/5"
              >
                Clear Diagnostics
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}