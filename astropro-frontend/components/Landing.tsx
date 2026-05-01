"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Map,
  Hand,
  MessageSquare,
  ChevronRight,
  LayoutDashboard,
  Menu,
  Moon,
  Sun,
  Zap
} from 'lucide-react';
import { RashiChakra } from '@/components/RashiChakra';

export default function AstroProLanding() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-orange-100 selection:text-orange-600 overflow-x-hidden">

      {/* 1. STICKY NAVBAR */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-white/80 backdrop-blur-xl border-b border-slate-100 py-3 shadow-sm' : 'bg-transparent py-6'
        }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200 group-hover:rotate-12 transition-transform duration-300">
              <Sparkles className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900">AstroPro</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600">
            <a href="#kundli" className="hover:text-orange-500 transition-colors">Kundli</a>
            <a href="#vastu" className="hover:text-orange-500 transition-colors">Vastu</a>
            <a href="#palm" className="hover:text-orange-500 transition-colors">AI Palmistry</a>

            <div className="h-6 w-[1px] bg-slate-200 mx-2" /> {/* Divider */}

            {/* FUTURE THEME TOGGLE PLACEHOLDER */}
            <button className="p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-colors" title="Toggle Theme (Coming Soon)">
              <Sun className="w-5 h-5" />
            </button>

            <Link href="/login" className="text-slate-900 hover:text-orange-500 transition-colors">Sign In</Link>
            <Link href="/generate" className="bg-slate-900 text-white px-6 py-2.5 rounded-full hover:bg-orange-600 transition-all shadow-xl hover:shadow-orange-100 active:scale-95">
              Launch Engine
            </Link>
          </div>
          <Menu className="md:hidden w-6 h-6" />
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative pt-32 pb-24 px-6">
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-100/40 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[10%] left-[-5%] w-[40%] h-[40%] bg-indigo-50/50 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-xs font-bold uppercase tracking-widest mb-8">
              <Zap className="w-3.5 h-3.5 fill-current" /> Next-Gen Astrology Engine
            </div>

            <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.95] mb-8">
              Decode your <br />
              <span className="relative inline-block">
                Cosmic DNA
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.8, duration: 1 }}
                  className="absolute bottom-2 left-0 h-3 bg-orange-200/60 -z-10"
                />
              </span>
              <br />with AI.
            </h1>

            <p className="text-xl text-slate-500 mb-12 max-w-lg leading-relaxed font-medium">
              Experience the world's most precise Vedic engine. Combining ancient wisdom with Gemini 2.5 Intelligence for hyper-accurate insights.
            </p>

            <div className="flex flex-col sm:flex-row gap-5">
              <Link href="/generate" className="h-16 px-10 bg-orange-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-orange-600 hover:shadow-2xl hover:shadow-orange-200 transition-all group active:scale-95">
                Generate Your Kundli
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="h-16 px-10 bg-white border-2 border-slate-100 text-slate-900 rounded-2xl font-bold flex items-center justify-center gap-2 hover:border-orange-500 hover:bg-slate-50 transition-all active:scale-95">
                View Sample Dashboard
              </button>
            </div>

            {/* Social Proof */}
            <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-6">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-100 overflow-hidden shadow-sm">
                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <div className="flex text-orange-400 mb-0.5">
                  {[...Array(5)].map((_, i) => <Sparkles key={i} className="w-3 h-3 fill-current" />)}
                </div>
                <p className="text-slate-500 font-medium">
                  Trusted by <span className="text-slate-900 font-bold">10k+ active seekers</span>
                </p>
              </div>
            </div>
          </motion.div>

          {/* RIGHT SIDE: RASHI CHAKRA CONTAINER */}
          {/* RIGHT SIDE: FLOATING RASHI CHAKRA */}
<motion.div 
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 1.2, ease: "easeOut" }}
  className="relative flex items-center justify-center lg:justify-end min-h-[500px]"
>
  {/* The Ambient Glow behind the Chakra */}
  <div className="absolute w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,_rgba(245,158,11,0.08)_0%,transparent_70%)] blur-3xl pointer-events-none" />

  {/* The Chakra Integration - No borders, no padding, just the motion */}
  <div className="relative w-full max-w-[550px] aspect-square flex items-center justify-center">
    <RashiChakra />
  </div>

</motion.div>
        </div>
      </section>

      {/* 3. CORE SERVICES BENTO GRID */}
      <section className="py-24 px-6 max-w-7xl mx-auto overflow-visible">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">One Platform. Infinite Wisdom.</h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">Our modular engine adapts 5,000 years of astronomical data for the digital era.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ServiceCard
            title="Precision Kundli"
            desc="D1 to D60 charts with real-time interpretation of 27 Nakshatras."
            icon={<LayoutDashboard />}
            accent="orange"
          />
          <ServiceCard
            title="Vastu Vision"
            desc="Upload floor plans for instant AI scoring and directional harmony tips."
            icon={<Map />}
            accent="indigo"
          />
          <ServiceCard
            title="Palm Scan"
            desc="Neural networks map 1,000+ points on your palm for life path insights."
            icon={<Hand />}
            accent="emerald"
          />

          {/* Featured Large Card */}
          <div className="md:col-span-2 bg-slate-900 rounded-[40px] p-12 flex flex-col justify-between overflow-hidden relative group">
            <div className="relative z-10">
              <span className="px-4 py-1 rounded-full bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest mb-6 inline-block">Pro Feature</span>
              <h3 className="text-4xl font-bold text-white mb-6 leading-tight">Interactive <br />AI Consultation</h3>
              <p className="text-slate-400 max-w-sm text-lg leading-relaxed">Chat with an AI trained on millennial texts for instant guidance on career and love.</p>
              <button className="mt-10 flex items-center gap-3 bg-orange-500 text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-orange-600 transition-all active:scale-95">
                Start Consultation <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <MessageSquare className="absolute bottom-[-40px] right-[-40px] w-80 h-80 text-white/[0.03] -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
          </div>

          {/* Metrics Card */}
          <div className="bg-orange-50 rounded-[40px] p-12 border border-orange-100 flex flex-col justify-center text-center">
            <div className="text-6xl font-black text-orange-500 mb-2 italic tracking-tighter">99.9%</div>
            <p className="text-slate-600 font-bold uppercase text-xs tracking-widest">Calculation Accuracy</p>
            <p className="mt-6 text-slate-500 text-sm">Verified against NASA JPL astronomical ephemeris data.</p>
          </div>
        </div>
      </section>

      {/* 4. FOOTER */}
      <footer className="border-t border-slate-100 py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <Sparkles className="text-white w-4 h-4" />
            </div>
            <span className="font-black text-2xl tracking-tighter">AstroPro</span>
          </div>
          <p className="text-slate-400 text-sm font-medium italic">Empowering the modern soul through data-driven spirituality.</p>
          <div className="flex gap-8 text-sm font-bold text-slate-500">
            <a href="#" className="hover:text-orange-500 transition-colors">Privacy</a>
            <a href="#" className="hover:text-orange-500 transition-colors">Terms</a>
            <a href="#" className="hover:text-orange-500 transition-colors">API Portal</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ServiceCard({ title, desc, icon, accent }: any) {
  const colors: any = {
    orange: "bg-orange-50 text-orange-500 border-orange-100 shadow-orange-100/50",
    indigo: "bg-indigo-50 text-indigo-500 border-indigo-100 shadow-indigo-100/50",
    emerald: "bg-emerald-50 text-emerald-500 border-emerald-100 shadow-emerald-100/50"
  };

  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="p-10 rounded-[40px] border border-slate-100 bg-white shadow-xl shadow-slate-200/20 hover:shadow-2xl hover:shadow-slate-200/40 transition-all group cursor-pointer"
    >
      <div className={`w-16 h-16 ${colors[accent]} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-lg border`}>
        {React.cloneElement(icon, { size: 32 })}
      </div>
      <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{title}</h3>
      <p className="text-slate-500 text-base leading-relaxed">{desc}</p>
    </motion.div>
  );
}