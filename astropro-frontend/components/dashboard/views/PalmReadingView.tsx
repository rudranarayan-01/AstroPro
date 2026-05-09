// components/dashboard/views/PalmReadingView.tsx
"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Hand, Activity, Heart, Brain, Zap, Shield, Sun, Moon, 
  Loader2, Sparkles, UploadCloud, CheckCircle2 
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface PalmReadingViewProps {
  clientData?: any;
}

export default function PalmReadingView({ clientData }: PalmReadingViewProps) {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/v1';

  // --- 1. Fetch Palm History ---
  const { data: palmData, isLoading: historyLoading } = useQuery({
    queryKey: ['palmHistory', clientData?.id],
    queryFn: async () => {
      if (!clientData?.id || !token) return null;
      const response = await axios.get(`${BASE_URL}/history?client_id=${clientData.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Find the specific palm reading archival entry
      const historyItem = response.data.history?.find((h: any) => h.analysis_type === 'PALM');
      return historyItem?.result_data || null;
    },
    enabled: !!clientData?.id && !!token,
    staleTime: 1000 * 60 * 30, // 30 minutes cache
  });

  // --- 2. Mutation for Analyzing Palm Image ---
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
      return response.data.analysis; // Structured object returned from controller
    },
    onSuccess: (newData: any) => {
      queryClient.setQueryData(['palmHistory', clientData?.id], newData);
    }
  });

  // --- 3. Drag and Drop File Handlers ---
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

  // --- 4. Helper to determine UI score based on AI reading quality ---
  const calculateLineScore = (text: string = "", defaultVal = 70) => {
    if (!text) return defaultVal;
    const lower = text.toLowerCase();
    if (lower.includes("strong") || lower.includes("excellent") || lower.includes("deep") || lower.includes("vital")) return 90;
    if (lower.includes("moderate") || lower.includes("average") || lower.includes("clear")) return 75;
    if (lower.includes("faint") || lower.includes("weak") || lower.includes("break") || lower.includes("chain")) return 50;
    return defaultVal;
  };

  const isLoading = historyLoading || mutation.isPending;

  // Render variables mapped to real API output fields
  const dynamicLines = palmData ? [
    { 
      name: 'Life Line', 
      icon: Activity, 
      score: calculateLineScore(palmData.life_line, 80), 
      color: 'text-emerald-400', 
      desc: palmData.life_line 
    },
    { 
      name: 'Heart Line', 
      icon: Heart, 
      score: calculateLineScore(palmData.heart_line, 75), 
      color: 'text-red-400', 
      desc: palmData.heart_line 
    },
    { 
      name: 'Head Line', 
      icon: Brain, 
      score: calculateLineScore(palmData.head_line, 85), 
      color: 'text-blue-400', 
      desc: palmData.head_line 
    },
    { 
      name: 'Fate Line', 
      icon: Zap, 
      score: calculateLineScore(palmData.fate_line, 60), 
      color: 'text-orange-500', 
      desc: palmData.fate_line || 'Fate line is absent or faintly visible.' 
    },
  ] : [];

  return (
    <div className="relative min-h-screen pb-20">
      {/* BACKGROUND GRAPHIC */}
      <div className="fixed inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="w-[1400px] h-[1400px] border border-blue-500/[0.02] rounded-full animate-slow-spin opacity-30" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-10">
        
        {/* LOADING STATE */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-40">
            <div className="relative">
              <Loader2 className="text-orange-500 animate-spin" size={64} strokeWidth={1} />
              <Activity className="absolute inset-0 m-auto text-orange-500/50 animate-pulse" size={24} />
            </div>
            <p className="mt-8 text-[11px] font-black text-white/40 uppercase tracking-[0.5em] animate-pulse">
              Analyzing Dermal Ridges...
            </p>
          </div>
        )}

        {/* EMPTY STATE / FILE UPLOAD ZONE */}
        {!palmData && !isLoading && (
          <div className="flex flex-col items-center justify-center py-20 max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <Sparkles className="text-orange-500 mx-auto mb-4 animate-pulse" size={36} />
              <h2 className="text-2xl font-black text-white tracking-tight uppercase italic">Vedic Palm Analysis</h2>
              <p className="text-xs text-white/40 mt-1 uppercase tracking-wider">Upload clear photo of active hand palm</p>
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
                <label htmlFor="palm-upload" className="flex flex-col items-center cursor-pointer group">
                  <div className="w-16 h-16 rounded-[24px] bg-white/5 border border-white/5 flex items-center justify-center text-white/30 mb-4 group-hover:text-orange-500 group-hover:border-orange-500/20 transition-all">
                    <UploadCloud size={28} />
                  </div>
                  <span className="text-sm font-bold text-white mb-1">Drag and drop file here</span>
                  <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">or click to browse local files</span>
                </label>
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 rounded-[24px] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 mx-auto">
                    <CheckCircle2 size={28} />
                  </div>
                  <span className="block text-sm font-bold text-white mb-1 max-w-xs truncate">{selectedFile.name}</span>
                  <span className="block text-[10px] text-white/30 uppercase tracking-widest font-bold mb-6">
                    Ready for celestial scan
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
                      Analyze Palm
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ACTIVE ANALYSIS DATA PRESENT */}
        {palmData && !isLoading && (
          <div className="grid grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            
            {/* Hand Mapping Visual (Left Column) */}
            <div className="col-span-12 lg:col-span-5 bg-[#0d0f14]/60 border border-white/[0.05] rounded-[32px] p-8 flex flex-col items-center relative overflow-hidden backdrop-blur-xl h-fit">
              <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
                <div className="w-full h-full border border-white rounded-full animate-slow-spin scale-150" />
              </div>
              
              <div className="w-full flex justify-between items-start mb-12">
                <h3 className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase italic">Surface Mapping</h3>
                <span className="px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full text-[10px] font-bold text-orange-500 uppercase">
                  Active Profile
                </span>
              </div>
              
              <div className="relative">
                <Hand size={320} strokeWidth={0.5} className="text-white/10" />
                {/* Mount Hotspots mapped using relative coordinates */}
                <MountPoint top="15%" left="48%" color="bg-orange-500" label="Jupiter Mount" />
                <MountPoint top="14%" left="32%" color="bg-blue-500" label="Saturn Mount" />
                <MountPoint top="42%" left="75%" color="bg-pink-500" label="Venus Mount" />
              </div>
              
              <div className="mt-12 grid grid-cols-2 gap-4 w-full">
                <MountBadge icon={<Sun size={12}/>} label="Mount of Sun" status="Strong" />
                <MountBadge icon={<Moon size={12}/>} label="Mount of Moon" status="Highly Active" />
              </div>
            </div>

            {/* Analysis Details (Right Column) */}
            <div className="col-span-12 lg:col-span-7 space-y-6">
              
              {/* Progress bars generated dynamically based on AI response */}
              <div className="bg-[#0d0f14]/60 border border-white/[0.05] rounded-[32px] p-8">
                <h3 className="text-[10px] font-black tracking-[0.2em] text-white/20 uppercase mb-8 italic">Line Intensity Analysis</h3>
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

              {/* Mounts Analysis Field */}
              {palmData.mounts_analysis && (
                <div className="bg-[#0d0f14]/60 border border-white/[0.05] rounded-[32px] p-8">
                  <h3 className="text-[10px] font-black tracking-[0.2em] text-white/20 uppercase mb-4 italic">Mount Prominences</h3>
                  <p className="text-xs text-white/60 leading-relaxed font-medium">
                    {palmData.mounts_analysis}
                  </p>
                </div>
              )}

              {/* Overall Synthesized Verdict */}
              <div className="bg-gradient-to-r from-blue-500/5 to-transparent border border-white/[0.05] rounded-[32px] p-8">
                <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4 italic">Astrologer's Verdict</h3>
                <p className="text-xs text-white/80 leading-relaxed font-serif italic">
                  "{palmData.overall_verdict}"
                </p>
              </div>

              {/* Retake/Re-upload Button */}
              <div className="flex justify-end pt-2">
                <button 
                  onClick={() => {
                    queryClient.setQueryData(['palmHistory', clientData?.id], null);
                    setSelectedFile(null);
                  }}
                  className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-wider text-white/60 transition-all"
                >
                  Analyze New Palm
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MountPoint({ top, left, color, label }: any) {
  return (
    <div className="absolute group" style={{ top, left }}>
      <div className={`w-3 h-3 ${color} rounded-full blur-sm animate-pulse cursor-help`} />
      <span className="absolute left-1/2 -translate-x-1/2 -top-6 text-[8px] font-black text-white/40 uppercase opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        {label}
      </span>
    </div>
  );
}

function MountBadge({ icon, label, status }: any) {
  return (
    <div className="flex items-center gap-3 bg-white/[0.02] border border-white/[0.05] p-3 rounded-2xl">
      <div className="text-orange-500">{icon}</div>
      <div>
        <p className="text-[8px] font-black text-white/20 uppercase tracking-tighter">{label}</p>
        <p className="text-[10px] font-bold text-white/70">{status}</p>
      </div>
    </div>
  );
}