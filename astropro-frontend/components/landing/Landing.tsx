"use client";
import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ChevronRight,
  LayoutDashboard,
  Map,
  Hand,
  MessageSquare,
  Zap,
  Sparkles,
  LucideProps
} from 'lucide-react';

// Dynamically import the Chakra if it's heavy, otherwise standard import is fine
import { RashiChakra } from './RashiChakra';

export default function AstroProLanding() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Performance-optimized Spring Configuration
  const springTransition = { 
    type: "spring", 
    stiffness: 100, 
    damping: 20, 
    restDelta: 0.001 
  } as const;

  if (!mounted) return <div className="min-h-screen bg-[#02040a]" />;

  return (
    <div className="relative w-full min-h-screen bg-[#02040a] text-white selection:bg-orange-500/30 overflow-x-hidden font-sans">
      
      {/* 1. LAYERED AMBIENT SYSTEM (GPU Accelerated) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-orange-600/10 blur-[140px] rounded-full will-change-transform" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-blue-600/10 blur-[140px] rounded-full will-change-transform" />
      </div>

      {/* 2. HERO SECTION - Controlled Width */}
      <section className="relative z-10 pt-26 pb-20 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[70vh]">
          
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springTransition}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] text-orange-400 text-[11px] font-black uppercase tracking-[0.2em] mb-10">
              <Zap className="w-3.5 h-3.5 fill-current" /> Quantum Vedic Analytics
            </div>

            <h1 className="text-5xl sm:text-7xl xl:text-8xl font-black tracking-tight leading-[0.95] mb-8">
              Your Fate, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600">
                Digitally Decoded.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-400 mb-12 max-w-lg leading-relaxed font-medium">
              We bridge 5,000 years of Vedic wisdom with Gemini 1.5 Pro to provide the most precise astrological insights ever built.
            </p>

            <div className="flex flex-wrap gap-5">
              <Link href="/generate" className="h-16 px-10 bg-orange-500 text-white rounded-2xl font-black uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-orange-600 transition-all active:scale-95 shadow-[0_20px_50px_rgba(249,115,22,0.3)]">
                Get Your Kundli
                <ChevronRight className="w-5 h-5" />
              </Link>
              <button className="h-16 px-10 bg-white/[0.03] border border-white/[0.08] text-white rounded-2xl font-bold flex items-center justify-center hover:bg-white/[0.08] transition-all active:scale-95 backdrop-blur-md">
                View Sample
              </button>
            </div>
          </motion.div>

          {/* Right Content: Optimized Chakra Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...springTransition, delay: 0.1 }}
            className="relative flex items-center justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-[500px] aspect-square flex items-center justify-center">
              {/* Chakra Component Injection */}
              <div className="relative z-10 w-full h-full scale-110 sm:scale-100">
                <Suspense fallback={<div className="w-full h-full rounded-full border-2 border-white/5 animate-pulse" />}>
                   <RashiChakra />
                </Suspense>
              </div>
              
              {/* Radial Glow Underlay */}
              <div className="absolute inset-0 bg-orange-500/10 blur-[100px] rounded-full -z-10 animate-pulse" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. BENTO SERVICES GRID */}
      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">

          <ServiceCard
            className="md:col-span-2"
            title="Precision Kundli"
            desc="D1 to D60 charts with real-time interpretation and planetary strengths."
            icon={<LayoutDashboard />}
            color="text-orange-500"
          />

          <ServiceCard
            className="md:col-span-2"
            title="Vastu Vision"
            desc="AI-powered Vastu scoring for homes, offices, and floor plans."
            icon={<Map />}
            color="text-blue-400"
          />

          <ServiceCard
            className="md:col-span-2"
            title="AI Palmistry"
            desc="Scan your palm to reveal health, wealth, and career trajectories."
            icon={<Hand />}
            color="text-emerald-400"
          />

          {/* Main Featured Bento Item */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="md:col-span-4 bg-[#0d0f14] rounded-[32px] p-8 sm:p-12 border border-white/[0.05] relative overflow-hidden group"
          >
            <div className="relative z-10">
              <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 text-[10px] font-black uppercase tracking-widest mb-6 inline-block border border-orange-500/20">
                New Feature
              </span>
              <h3 className="text-4xl sm:text-5xl font-black text-white mb-6 tracking-tighter">Neural Consultation</h3>
              <p className="text-slate-400 max-w-md text-lg mb-10 leading-relaxed">
                Connect with our AI specialized in Parashara and Jaimini astrology for instant, conversational guidance.
              </p>
              <button className="bg-white text-black px-10 py-4 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-orange-500 hover:text-white transition-all">
                Talk to AI
              </button>
            </div>
            {/* Background Decorative Icon */}
            <MessageSquare className="absolute bottom-[-10%] right-[-5%] w-72 h-72 text-white/[0.015] -rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-1000" />
          </motion.div>

          {/* Performance Stat Card */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="md:col-span-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-[32px] p-8 flex flex-col justify-center items-center text-center shadow-2xl shadow-orange-500/20"
          >
            <div className="text-7xl font-black text-white mb-2 italic tracking-tighter">99.9%</div>
            <p className="text-orange-100/90 font-bold uppercase text-[11px] tracking-widest mb-6 px-4">
              Mathematical Precision Guaranteed
            </p>
            <div className="flex gap-1.5">
              {[...Array(5)].map((_, i) => (
                <Sparkles key={i} className="w-5 h-5 text-white fill-current animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
              ))}
            </div>
          </motion.div>

        </div>
      </section>
    </div>
  );
}

// Sub-component for Bento Cards to keep code clean and maintainable
function ServiceCard({ title, desc, icon, color, className = "" }: {
  title: string;
  desc: string;
  icon: React.ReactElement<LucideProps>;
  color: string;
  className?: string;
}) {
  return (
    <motion.div 
      whileHover={{ y: -8, backgroundColor: "rgba(255,255,255,0.04)" }}
      className={`p-8 rounded-[32px] border border-white/[0.05] bg-[#0d0f14]/50 backdrop-blur-xl transition-all cursor-pointer group ${className}`}
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 bg-white/[0.03] border border-white/[0.08] ${color} group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
        {React.cloneElement(icon, { size: 28 } as LucideProps)}
      </div>
      <h3 className="text-2xl font-bold mb-4 tracking-tight group-hover:text-orange-500 transition-colors">
        {title}
      </h3>
      <p className="text-slate-400 text-sm leading-relaxed font-medium">
        {desc}
      </p>
    </motion.div>
  );
}