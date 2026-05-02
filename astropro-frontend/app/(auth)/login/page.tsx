"use client";
import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, Sparkles, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Fix hydration mismatch by only rendering random elements after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[#02040a] flex items-center justify-center p-6 overflow-hidden font-sans">
      
      {/* --- ASTROLOGICAL BACKGROUND LAYER --- */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        
        {/* 1. The Great Zodiac Wheel (Geometry) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] opacity-[0.04] animate-slow-spin">
            {/* Compass Markings */}
            {[...Array(24)].map((_, i) => (
                <div 
                    key={i} 
                    className="absolute top-1/2 left-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white to-transparent origin-center"
                    style={{ transform: `translate(-50%, -50%) rotate(${i * 15}deg)` }}
                />
            ))}
            {/* Concentric Sacred Circles */}
            <div className="absolute inset-0 border border-white rounded-full scale-[1.0]" />
            <div className="absolute inset-0 border border-white rounded-full scale-[0.7] border-dashed" />
            <div className="absolute inset-0 border border-white rounded-full scale-[0.4]" />
        </div>

        {/* 2. Hydration-Safe Constellations */}
        {mounted && (
          <div className="absolute inset-0">
              {[...Array(30)].map((_, i) => (
                  <div 
                      key={i}
                      className="absolute w-1 h-1 bg-orange-400 rounded-full animate-twinkle"
                      style={{ 
                          top: `${(i * 7) % 100}%`, // Deterministic "random" positions
                          left: `${(i * 13) % 100}%`,
                          animationDelay: `${(i * 0.5) % 5}s`,
                          opacity: 0.3
                      }}
                  />
              ))}
          </div>
        )}

        {/* 3. Celestial Glows (GPU Accelerated) */}
        <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-orange-600/[0.08] blur-[140px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-blue-600/[0.08] blur-[140px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* --- AUTH CARD --- */}
      <div className="relative z-10 w-full max-w-[420px]">
        {/* Glassmorphism Container */}
        <div className="relative bg-white/[0.01] backdrop-blur-3xl border border-white/[0.07] rounded-[48px] p-10 md:p-12 shadow-[0_40px_100px_rgba(0,0,0,0.7)] overflow-hidden">
          
          {/* Subtle Internal Flare */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-orange-500/10 blur-3xl rounded-full" />

          {/* Header */}
          <div className="text-center mb-10">
            <div className="relative inline-flex items-center justify-center w-20 h-20 mb-8 group">
                {/* Orbital Ring Animation */}
                <div className="absolute inset-0 border border-orange-500/20 rounded-full animate-spin-slow group-hover:border-orange-500/50 transition-colors" />
                <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-500 to-orange-700 flex items-center justify-center shadow-[0_0_30px_rgba(249,115,22,0.4)]">
                    <Sparkles className="text-white w-7 h-7" />
                </div>
            </div>
            
            <h1 className="text-4xl font-black tracking-tighter text-white mb-3 italic">
              {isLogin ? 'ASCEND' : 'EVOLVE'}
            </h1>
            <div className="flex items-center justify-center gap-2">
                <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-orange-500/50" />
                <p className="text-orange-500/60 text-[10px] font-bold tracking-[0.3em] uppercase">
                  Celestial Access
                </p>
                <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-orange-500/50" />
            </div>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            {!isLogin && (
              <div className="group relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-orange-500 transition-colors" />
                <input
                  type="text"
                  placeholder="NOM DE PLUME"
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl py-4 pl-12 pr-4 text-[10px] font-black tracking-widest text-white placeholder:text-white/10 focus:outline-none focus:border-orange-500/40 focus:bg-white/[0.05] transition-all uppercase"
                />
              </div>
            )}

            <div className="group relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-orange-500 transition-colors" />
              <input
                type="email"
                placeholder="UNIVERSE IDENTIFIER"
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl py-4 pl-12 pr-4 text-[10px] font-black tracking-widest text-white placeholder:text-white/10 focus:outline-none focus:border-orange-500/40 focus:bg-white/[0.05] transition-all uppercase"
              />
            </div>

            <div className="group relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-orange-500 transition-colors" />
              <input
                type="password"
                placeholder="CRYPTIC KEY"
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl py-4 pl-12 pr-4 text-[10px] font-black tracking-widest text-white placeholder:text-white/10 focus:outline-none focus:border-orange-500/40 focus:bg-white/[0.05] transition-all uppercase"
              />
            </div>

            <button className="group relative w-full h-14 mt-6 overflow-hidden rounded-2xl bg-orange-600 transition-all active:scale-[0.97]">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-700" />
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <span className="relative flex items-center justify-center gap-3 text-white font-black uppercase tracking-[0.25em] text-[11px]">
                  {isLogin ? 'Initiate Link' : 'Forge Path'}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
            </button>
          </form>

          {/* Toggle Access */}
          <div className="text-center mt-12">
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-orange-500 transition-all"
              >
                {isLogin ? 'Create New Reality' : 'Return to Core'}
              </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slow-spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.5); }
        }
        .animate-slow-spin {
          animation: slow-spin 180s linear infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
        .animate-twinkle {
          animation: twinkle 5s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}