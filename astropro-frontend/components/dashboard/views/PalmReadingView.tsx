"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Hand, Activity, Heart, Brain, Zap, Languages, CheckCircle2,
  Loader2, Sparkles, UploadCloud, Sun, Moon, Info, ShieldAlert
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Palm } from '../translation';
import { translateText } from '@/utils/ClientTranslation';

interface PalmReadingViewProps {
  clientData?: any;
}

export default function PalmReadingView({ clientData }: PalmReadingViewProps) {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [lang, setLang] = useState('en');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  
  // Interactive feature: Active mount highlighted card state
  const [focusedMount, setFocusedMount] = useState<string | null>(null);

  // Translation State for dynamic AI content
  const [translatedAnalysis, setTranslatedAnalysis] = useState<any>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/v1';
  const t = Palm[lang] || Palm.en;

  // --- 1. Query: Fetch Saved Palm Reading ---
  const { data: rawPalmData, isLoading: historyLoading } = useQuery({
    queryKey: ['palmHistory', clientData?.id],
    queryFn: async () => {
      if (!clientData?.id || !token) return null;
      const response = await axios.get(`${BASE_URL}/history?client_id=${clientData.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const historyItem = response.data.history?.find((h: any) => h.analysis_type === 'PALM');
      return historyItem?.result_data || null;
    },
    enabled: !!clientData?.id && !!token,
    staleTime: 1000 * 60 * 30, // Cache for 30 minutes
  });

  // --- 2. Mutation: Generate Palm Reading ---
  const mutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('palm_image', file);
      formData.append('client_id', clientData.id);

      const response = await axios.post(`${BASE_URL}/horoscope/palm-read`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data.analysis;
    },
    onSuccess: (newData: any) => {
      queryClient.setQueryData(['palmHistory', clientData?.id], newData);
      setSelectedFile(null);
    }
  });

  // --- 3. Translation Effect for AI Output ---
  useEffect(() => {
    async function translatePalmContent() {
      if (!rawPalmData) return;

      if (lang === 'en') {
        setTranslatedAnalysis(rawPalmData);
        return;
      }

      setIsTranslating(true);
      try {
        const [lifeLine, heartLine, headLine, fateLine, mountsAnalysis, overallVerdict] = await Promise.all([
          translateText(rawPalmData.life_line, lang),
          translateText(rawPalmData.heart_line, lang),
          translateText(rawPalmData.head_line, lang),
          translateText(rawPalmData.fate_line, lang),
          translateText(rawPalmData.mounts_analysis, lang),
          translateText(rawPalmData.overall_verdict, lang),
        ]);

        setTranslatedAnalysis({
          life_line: lifeLine,
          heart_line: heartLine,
          head_line: headLine,
          fate_line: fateLine,
          mounts_analysis: mountsAnalysis,
          overall_verdict: overallVerdict
        });
      } catch (err) {
        console.error("Palm translation failed, running fallback content:", err);
        setTranslatedAnalysis(rawPalmData);
      } finally {
        setIsTranslating(false);
      }
    }

    translatePalmContent();
  }, [lang, rawPalmData]);

  // --- 4. Drag and Drop File Handlers ---
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        setSelectedFile(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const triggerUpload = () => {
    if (selectedFile) {
      mutation.mutate(selectedFile);
    }
  };

  // --- 5. Helper: Calculate Line Score from text ---
  const calculateLineScore = (text: string = "", defaultVal = 70) => {
    if (!text) return defaultVal;
    const lower = text.toLowerCase();
    if (lower.includes("strong") || lower.includes("excellent") || lower.includes("deep") || lower.includes("vital")) return 90;
    if (lower.includes("moderate") || lower.includes("average") || lower.includes("clear") || lower.includes("steady")) return 75;
    if (lower.includes("faint") || lower.includes("weak") || lower.includes("break") || lower.includes("chain")) return 50;
    return defaultVal;
  };

  const isLoading = historyLoading || mutation.isPending || isTranslating;
  const activePalm = translatedAnalysis || rawPalmData;

  const dynamicLines = activePalm ? [
    { name: 'Life Line', icon: Activity, score: calculateLineScore(rawPalmData?.life_line, 80), color: 'text-emerald-400', desc: activePalm.life_line },
    { name: 'Heart Line', icon: Heart, score: calculateLineScore(rawPalmData?.heart_line, 72), color: 'text-red-400', desc: activePalm.heart_line },
    { name: 'Head Line', icon: Brain, score: calculateLineScore(rawPalmData?.head_line, 91), color: 'text-blue-400', desc: activePalm.head_line },
    { name: 'Fate Line', icon: Zap, score: calculateLineScore(rawPalmData?.fate_line, 64), color: 'text-orange-500', desc: activePalm.fate_line },
  ] : [];

  return (
    <div className="relative min-h-screen pb-20 animate-in fade-in duration-1000">
      {/* BACKGROUND DECORATIVE ELEMENTS */}
      <div className="fixed inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="w-[1400px] h-[1400px] border border-orange-500/[0.02] rounded-full animate-slow-spin opacity-30" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-10">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">{t.palmTitle || "Palm Analysis"}</h1>
            <p className="text-[10px] tracking-[0.4em] text-orange-500/60 font-bold uppercase">
              {t.subTitle || "Samudrika Shastra Interpretations"}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/5 backdrop-blur-xl">
            <div className="flex gap-1">
              {['en', 'hi', 'or'].map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${
                    lang === l 
                      ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/20' 
                      : 'text-white/40 hover:text-white/60'
                  }`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <div className="h-6 w-[1px] bg-white/10 mx-2" />
            <Languages size={18} className="text-white/20 mr-2" />
          </div>
        </div>

        {/* LOADING SCREEN */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-40">
            <div className="relative">
              <Loader2 className="text-orange-500 animate-spin" size={64} strokeWidth={1} />
              <Activity className="absolute inset-0 m-auto text-orange-500/50 animate-pulse" size={24} />
            </div>
            <p className="mt-8 text-[11px] font-black text-white/40 uppercase tracking-[0.5em] animate-pulse">
              {t.decodingPalm || "Decoding Dermal Ridges..."}
            </p>
          </div>
        )}

        {/* EMPTY STATE - SECURE MULTIPART FILE UPLOAD ZONE */}
        {!activePalm && !isLoading && (
          <div className="flex flex-col items-center justify-center py-20 max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <Sparkles className="text-orange-500 mx-auto mb-4 animate-pulse" size={36} />
              <h2 className="text-2xl font-black text-white tracking-tight uppercase italic">
                {t.palmTitle || "Vedic Palm Analysis"}
              </h2>
              <p className="text-xs text-white/40 mt-1 uppercase tracking-wider">
                {t.uploadPalm || "Upload clear photo of active hand palm"}
              </p>
            </div>

            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`w-full aspect-[16/10] flex flex-col items-center justify-center border-2 border-dashed rounded-[40px] p-8 transition-all ${
                dragActive 
                  ? 'border-orange-500 bg-orange-500/[0.03]' 
                  : 'border-white/10 bg-[#0d0f14]/40 hover:border-white/20'
              }`}
            >
              <input 
                type="file" 
                id="palm-upload" 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange} 
              />
              
              {!selectedFile ? (
                <label htmlFor="palm-upload" className="flex flex-col items-center cursor-pointer group text-center">
                  <div className="w-16 h-16 rounded-[24px] bg-white/5 border border-white/5 flex items-center justify-center text-white/30 mb-4 group-hover:text-orange-500 group-hover:border-orange-500/20 transition-all">
                    <UploadCloud size={28} />
                  </div>
                  <span className="text-sm font-bold text-white mb-1">
                    {t.dragDrop || "Drag and drop file here"}
                  </span>
                  <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
                    {t.orClick || "or click to browse local files"}
                  </span>
                </label>
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 rounded-[24px] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 mx-auto">
                    <CheckCircle2 size={28} />
                  </div>
                  <span className="block text-sm font-bold text-white mb-1 max-w-xs truncate mx-auto">{selectedFile.name}</span>
                  <span className="block text-[10px] text-white/30 uppercase tracking-widest font-bold mb-6">
                    Ready for analysis
                  </span>
                  
                  <div className="flex gap-3 justify-center">
                    <button 
                      onClick={() => setSelectedFile(null)}
                      className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all"
                    >
                      Clear
                    </button>
                    <button 
                      onClick={triggerUpload}
                      className="px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-lg shadow-orange-900/25"
                    >
                      {t.analyzeBtn || "Analyze Palm"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ACTIVE ANALYSIS DATA STATE */}
        {activePalm && !isLoading && (
          <div className="grid grid-cols-12 gap-6 items-start">
            
            {/* COLUMN 1: Visual Palm Mapping Dashboard */}
            <div className="col-span-12 lg:col-span-5 bg-[#0d0f14]/60 border border-white/[0.05] rounded-[32px] p-6 md:p-8 flex flex-col items-center relative overflow-hidden backdrop-blur-xl h-fit">
              <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
                <div className="w-full h-full border border-white rounded-full animate-slow-spin scale-150" />
              </div>
              
              <div className="w-full flex justify-between items-start mb-8 z-10">
                <h3 className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase italic">
                  {t.surfaceMapping || "Surface Mapping"}
                </h3>
                <span className="px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full text-[10px] font-bold text-orange-500 uppercase">
                  {t.activeHand || "Active Profile"}
                </span>
              </div>
              
              {/* Responsive Container for Hand SVG with Scaled Absolute Placements */}
              <div className="relative w-full max-w-[320px] aspect-square flex items-center justify-center">
                <Hand size={320} strokeWidth={0.5} className="text-white/10 w-full h-full" />
                
                {/* Mount Interactive Hotspots */}
                <MountPoint 
                  top="16%" 
                  left="42%" 
                  color="bg-orange-500" 
                  label={t.mountJupiter || "Jupiter Mount"} 
                  onHover={() => setFocusedMount("Jupiter")}
                />
                <MountPoint 
                  top="13%" 
                  left="54%" 
                  color="bg-blue-500" 
                  label={t.mountSaturn || "Saturn Mount"} 
                  onHover={() => setFocusedMount("Saturn")}
                />
                <MountPoint 
                  top="17%" 
                  left="68%" 
                  color="bg-yellow-500" 
                  label={t.mountSun || "Sun Mount"} 
                  onHover={() => setFocusedMount("Sun")}
                />
                <MountPoint 
                  top="45%" 
                  left="30%" 
                  color="bg-pink-500" 
                  label={t.mountVenus || "Venus Mount"} 
                  onHover={() => setFocusedMount("Venus")}
                />
                <MountPoint 
                  top="60%" 
                  left="75%" 
                  color="bg-indigo-400" 
                  label={t.mountMoon || "Moon Mount"} 
                  onHover={() => setFocusedMount("Moon")}
                />
              </div>

              {/* Dynamic Helper Info Box */}
              <div className="w-full mt-8 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-start gap-3 min-h-[76px] transition-all">
                <Info size={16} className="text-orange-500 shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <h4 className="text-[10px] font-black text-white uppercase tracking-wider">
                    {focusedMount ? `${focusedMount} Mount Focused` : "Interactive Hotspots"}
                  </h4>
                  <p className="text-[10px] text-white/40 leading-relaxed mt-1">
                    {focusedMount === "Jupiter" && (t.mountStatusAmbition || "Associated with power, dynamic ambition, and leadership.")}
                    {focusedMount === "Saturn" && (t.mountStatusWisdom || "Indicates mental discipline, wisdom, and professional responsibility.")}
                    {focusedMount === "Sun" && (t.mountStatusStrong || "Associated with public success, brilliance, and executive authority.")}
                    {focusedMount === "Venus" && (t.mountStatusEnergy || "Represents physical vitality, aesthetic tastes, and emotional passion.")}
                    {focusedMount === "Moon" && (t.mountStatusCreative || "Represents subconscious strength, vivid imagination, and intuitive faculties.")}
                    {!focusedMount && "Hover or tap on the illuminated hotspots across the hand model to examine specific mounts."}
                  </p>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-4 w-full">
                <MountBadge icon={<Sun size={12}/>} label={t.mountSun || "Mount of Sun"} status={t.mountStatusStrong || "Strong"} />
                <MountBadge icon={<Moon size={12}/>} label={t.mountMoon || "Mount of Moon"} status={t.mountStatusCreative || "Creative"} />
              </div>
            </div>

            {/* COLUMN 2: Analysis Details & AI Readings */}
            <div className="col-span-12 lg:col-span-7 space-y-6">
              
              {/* Dynamic Line Intensity Metric Area */}
              <div className="bg-[#0d0f14]/60 border border-white/[0.05] rounded-[32px] p-6 md:p-8">
                <h3 className="text-[10px] font-black tracking-[0.2em] text-white/20 uppercase mb-8 italic">
                  {t.lineIntensity || "Line Intensity Analysis"}
                </h3>
                <div className="space-y-8">
                  {dynamicLines.map((line) => (
                    <div key={line.name} className="group">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl bg-white/5 ${line.color}`}>
                            <line.icon size={16} />
                          </div>
                          <span className="text-sm font-bold text-white tracking-wide">{line.name}</span>
                        </div>
                        <span className={`text-xs font-black ${line.color}`}>{line.score}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 bg-current ${line.color} shadow-[0_0_10px_rgba(255,255,255,0.1)]`} 
                          style={{ width: `${line.score}%` }} 
                        />
                      </div>
                      <p className="mt-3 text-[11px] text-white/50 leading-relaxed group-hover:text-white/80 transition-colors">
                        {line.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Mounts Deep Analysis */}
              {activePalm.mounts_analysis && (
                <div className="bg-[#0d0f14]/60 border border-white/[0.05] rounded-[32px] p-6 md:p-8">
                  <h3 className="text-[10px] font-black tracking-[0.2em] text-white/20 uppercase mb-4 italic">
                    {t.mountVenus || "Mount Prominences"}
                  </h3>
                  <p className="text-xs text-white/60 leading-relaxed font-medium">
                    {activePalm.mounts_analysis}
                  </p>
                </div>
              )}

              {/* Overall Vedic Prediction/Verdict */}
              <div className="bg-gradient-to-r from-blue-500/5 to-transparent border border-white/[0.05] rounded-[32px] p-6 md:p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Sparkles size={80} className="text-blue-400" />
                </div>
                <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4 italic">
                  {t.astrologerVerdict || "Astrologer's Verdict"}
                </h3>
                <p className="text-xs text-white/80 leading-relaxed font-serif italic relative z-10">
                  "{activePalm.overall_verdict}"
                </p>
              </div>

              {/* Action: Clear current and analyze fresh */}
              <div className="flex justify-end pt-2">
                <button 
                  onClick={() => {
                    queryClient.setQueryData(['palmHistory', clientData?.id], null);
                    setTranslatedAnalysis(null);
                    setSelectedFile(null);
                  }}
                  className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-wider text-white/60 transition-all border border-white/5"
                >
                  {t.analyzeNew || "Analyze New Palm"}
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Sub-Component: Mapped absolute hotspot coordinate point
interface MountPointProps {
  top: string;
  left: string;
  color: string;
  label: string;
  onHover: () => void;
}

function MountPoint({ top, left, color, label, onHover }: MountPointProps) {
  return (
    <div 
      className="absolute group z-20 cursor-help" 
      style={{ top, left }}
      onMouseEnter={onHover}
      onTouchStart={onHover}
    >
      <div className={`w-3.5 h-3.5 ${color} rounded-full blur-[2px] animate-pulse`} />
      <span className="absolute left-1/2 -translate-x-1/2 -top-6 text-[8px] font-black text-white/80 bg-black/80 px-2 py-0.5 rounded-md border border-white/10 uppercase opacity-0 group-hover:opacity-100 transition-all pointer-events-none whitespace-nowrap">
        {label}
      </span>
    </div>
  );
}

// Sub-Component: Informative mount metrics badge
interface MountBadgeProps {
  icon: React.ReactNode;
  label: string;
  status: string;
}

function MountBadge({ icon, label, status }: MountBadgeProps) {
  return (
    <div className="flex items-center gap-3 bg-white/[0.02] border border-white/[0.05] p-3 rounded-2xl w-full">
      <div className="text-orange-500 shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-[8px] font-black text-white/20 uppercase tracking-tighter truncate">{label}</p>
        <p className="text-[10px] font-bold text-white/70 truncate">{status}</p>
      </div>
    </div>
  );
}