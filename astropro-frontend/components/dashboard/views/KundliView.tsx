// components/dashboard/KundliView.tsx
"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import BirthChart from '../BirthChart';
import InsightCard from './InsightCard';
import { translations } from '../translation';
import { translateText } from '@/utils/ClientTranslation';
import {
  Sparkles, TrendingUp, Heart, Wallet, Loader2, Compass,
  Activity, Microscope, Languages, CheckCircle2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface KundliViewProps {
  clientData?: any;
}

export default function KundliView({ clientData }: KundliViewProps) {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [lang, setLang] = useState('en');
  const [chartType, setChartType] = useState('North');

  // State for dynamic translated text from backend predictions
  const [translatedPredictions, setTranslatedPredictions] = useState<any>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/v1';
  const t = translations[lang] || translations.en;

  // --- 1. Fetch History with React Query ---
  const { data: kundliData, isLoading: historyLoading } = useQuery({
    queryKey: ['kundliHistory', clientData?.id],
    queryFn: async () => {
      if (!clientData?.id || !token) return null;
      const response = await axios.get(`${BASE_URL}/history?client_id=${clientData.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const historyItem = response.data.history?.find((h: any) => h.analysis_type === 'KUNDLI');
      return historyItem?.result_data || null;
    },
    enabled: !!clientData?.id && !!token,
    staleTime: 1000 * 60 * 30,
  });

  // --- 2. Generate Kundli Mutation ---
  const mutation = useMutation({
    mutationFn: async () => {
      const payload = {
        client_id: clientData.id,
        dob: clientData.dob,
        tob: clientData.tob,
        pob: clientData.pob,
        lat: clientData.lat,
        lon: clientData.lon,
        tz: clientData.tz || 5.5,
        lang: lang
      };
      const response = await axios.post(`${BASE_URL}/horoscope/kundli`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.data;
    },
    onSuccess: (newData: any) => {
      queryClient.setQueryData(['kundliHistory', clientData?.id], newData);
    }
  });

  // --- 3. Dynamic Backend Text Translation Process ---
  useEffect(() => {
    async function translateBackendContent() {
      if (!kundliData?.predictions) return;

      // If language is English, just use the original content directly
      if (lang === 'en') {
        setTranslatedPredictions(kundliData.predictions);
        return;
      }

      setIsTranslating(true);
      const predictions = kundliData.predictions;

      try {
        const [personality, love, money, work_life, future, behavior] = await Promise.all([
          translateText(predictions.personality, lang),
          translateText(predictions.love, lang),
          translateText(predictions.money, lang),
          translateText(predictions.work_life, lang),
          translateText(predictions.future, lang),
          translateText(predictions.behavior, lang),
        ]);

        setTranslatedPredictions({
          personality,
          love,
          money,
          work_life,
          future,
          behavior
        });
      } catch (err) {
        console.error("Could not translate predictions automatically", err);
        setTranslatedPredictions(predictions); // Fallback to raw data
      } finally {
        setIsTranslating(false);
      }
    }

    translateBackendContent();
  }, [lang, kundliData]);

  const getPlanet = (name: string) => kundliData?.chart?.find((p: any) => p.name === name) || {};
  const isLoading = historyLoading || mutation.isPending || isTranslating;
  const activePredictions = translatedPredictions || kundliData?.predictions;

  return (
    <div className="relative min-h-screen animate-in fade-in duration-1000 pb-20">
      {/* Background UI */}
      <div className="fixed inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="w-[1400px] h-[1400px] border border-orange-500/[0.03] rounded-full animate-slow-spin opacity-30" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-10">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">{t.title}</h1>
            <p className="text-[10px] tracking-[0.4em] text-orange-500/60 font-bold uppercase">Alignment of the Heavens</p>
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

        {/* STATE HANDLING */}
        {!kundliData && !isLoading && (
          <div className="flex flex-col items-center justify-center py-32 bg-[#0d0f14]/60 border border-white/5 rounded-[40px] backdrop-blur-2xl">
            <Sparkles className="text-orange-500 mb-6 animate-pulse" size={48} />
            <button
              onClick={() => mutation.mutate()}
              className="group relative px-10 py-5 bg-orange-600 hover:bg-orange-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all overflow-hidden"
            >
              <span className="relative z-10">{t.generate}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </button>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="relative">
              <Loader2 className="text-orange-500 animate-spin" size={64} strokeWidth={1} />
              <Activity className="absolute inset-0 m-auto text-orange-500/50 animate-pulse" size={24} />
            </div>
            <p className="mt-8 text-[11px] font-black text-white/40 uppercase tracking-[0.5em] animate-pulse">{t.decoding}</p>
          </div>
        )}

        {kundliData && !isLoading && (
          <>
            {/* KEY METRICS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: t.sunSign, val: getPlanet('Sun').sign, color: 'text-yellow-500' },
                { label: t.moonSign, val: getPlanet('Moon').sign, color: 'text-blue-400' },
                { label: t.jupiterSign, val: getPlanet('Jupiter').sign, color: 'text-purple-400' },
                { label: t.primaryHouse, val: `H-${getPlanet('Sun').house}`, color: 'text-emerald-400' }
              ].map((item) => (
                <div key={item.label} className="group bg-[#0d0f14]/80 backdrop-blur-md border border-white/[0.05] rounded-[24px] p-6 hover:border-orange-500/20 transition-all">
                  <p className="text-[9px] font-black tracking-[0.2em] text-white/20 uppercase mb-2 group-hover:text-orange-500/40 transition-colors">{item.label}</p>
                  <h4 className={`text-xl font-bold tracking-tight ${item.color}`}>{item.val}</h4>
                </div>
              ))}
            </div>

            {/* CHART & DEGREES */}
            <div className="grid grid-cols-12 gap-6 mb-8">
              <div className="col-span-12 lg:col-span-7 bg-[#0d0f14]/60 backdrop-blur-2xl border border-white/[0.05] rounded-[40px] p-8">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                    <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">{t.lagnaChart}</h3>
                  </div>
                  <div className="flex gap-1 bg-white/5 p-1 rounded-xl">
                    <button onClick={() => setChartType('North')} className={`px-4 py-2 rounded-lg text-[10px] font-bold transition-all ${chartType === 'North' ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/50'}`}>{t.north}</button>
                    <button onClick={() => setChartType('South')} className={`px-4 py-2 rounded-lg text-[10px] font-bold transition-all ${chartType === 'South' ? 'bg-white/10 text-white' : 'text-white/30 hover:text-white/50'}`}>{t.south}</button>
                  </div>
                </div>
                <div className="flex justify-center py-4">
                  <BirthChart type={chartType} onTypeChange={setChartType} chart={kundliData.chart} />
                </div>
              </div>

              <div className="col-span-12 lg:col-span-5 bg-[#0d0f14]/80 backdrop-blur-2xl border border-white/[0.05] rounded-[40px] p-8 h-full">
                <div className="flex items-center gap-3 mb-8">
                  <Activity size={20} className="text-orange-500" />
                  <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">{t.degrees}</h3>
                </div>
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {kundliData.chart.map((p: any) => (
                    <div key={p.name} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/[0.03] hover:bg-white/[0.05] transition-all">
                      <div>
                        <p className="text-xs font-black text-white tracking-tight">{p.name}</p>
                        <p className="text-[9px] text-white/30 uppercase font-bold">{p.sign} • H-{p.house}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-mono text-orange-400 font-bold">{parseFloat(p.longitude).toFixed(2)}°</p>
                        <div className="flex items-center justify-end gap-1 mt-1">
                          <CheckCircle2 size={10} className={p.is_major_placement ? 'text-emerald-500' : 'text-white/10'} />
                          <p className={`text-[8px] uppercase font-black ${p.is_major_placement ? 'text-emerald-500' : 'text-white/10'}`}>
                            {p.is_major_placement ? t.major : t.minor}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* INSIGHTS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <InsightCard title={t.personality} icon={<TrendingUp size={20} />} content={activePredictions?.personality} accent="border-emerald-500/10" iconColor="text-emerald-400" />
              <InsightCard title={t.love} icon={<Heart size={20} />} content={activePredictions?.love} accent="border-pink-500/10" iconColor="text-pink-400" />
              <InsightCard title={t.wealth} icon={<Wallet size={20} />} content={activePredictions?.money} accent="border-orange-500/10" iconColor="text-orange-400" />
            </div>

            {/* ADVANCED ANALYSIS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="group bg-[#0d0f14]/80 backdrop-blur-md border border-indigo-500/10 rounded-[40px] p-10 hover:border-indigo-500/30 transition-all">
                <div className="flex items-center gap-4 mb-6 text-indigo-400">
                  <div className="p-3 bg-indigo-500/5 rounded-2xl"><Microscope size={24} /></div>
                  <h3 className="font-black text-xs uppercase tracking-[0.3em]">{t.work}</h3>
                </div>
                <p className="text-sm text-white/50 leading-[1.8] font-medium">{activePredictions?.work_life}</p>
              </div>
              <div className="group bg-[#0d0f14]/80 backdrop-blur-md border border-purple-500/10 rounded-[40px] p-10 hover:border-purple-500/30 transition-all">
                <div className="flex items-center gap-4 mb-6 text-purple-400">
                  <div className="p-3 bg-purple-500/5 rounded-2xl"><Compass size={24} /></div>
                  <h3 className="font-black text-xs uppercase tracking-[0.3em]">{t.future}</h3>
                </div>
                <p className="text-sm text-white/50 leading-[1.8] font-medium">{activePredictions?.future}</p>
              </div>
            </div>

            {/* VERDICT */}
            <div className="bg-gradient-to-br from-orange-600/10 via-transparent to-transparent border border-white/[0.05] rounded-[40px] p-10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity">
                <Sparkles size={120} />
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-[2px] bg-orange-600" />
                <h3 className="text-sm font-black text-white uppercase tracking-[0.4em]">{t.verdict}</h3>
              </div>
              <p className="text-lg text-white/80 leading-relaxed italic max-w-4xl font-serif">
                "{activePredictions?.behavior}"
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}