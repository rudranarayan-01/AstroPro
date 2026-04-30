"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Sparkles, 
  Map, 
  Hand, 
  MessageSquare, 
  ChevronRight, 
  LayoutDashboard, 
  CheckCircle2,
  Menu,
  X
} from 'lucide-react';

export default function AstroProLanding() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-orange-100 selection:text-orange-600">
      
      {/* 1. STICKY NAVBAR */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 backdrop-blur-md border-b border-slate-100 py-3' : 'bg-transparent py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200">
              <Sparkles className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900">AstroPro</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#kundli" className="hover:text-orange-500 transition-colors">Kundli</a>
            <a href="#vastu" className="hover:text-orange-500 transition-colors">Vastu</a>
            <a href="#palm" className="hover:text-orange-500 transition-colors">AI Palmistry</a>
            <Link href="/login" className="text-slate-900">Sign In</Link>
            <Link href="/generate" className="bg-slate-900 text-white px-5 py-2.5 rounded-full hover:bg-orange-600 transition-all shadow-md">
              Launch Engine
            </Link>
          </div>
          <Menu className="md:hidden w-6 h-6" />
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-orange-50 via-white to-white">
        {/* Floating Particles Placeholder */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
           <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200 rounded-full blur-[120px]" />
           <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-100 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-widest mb-6">
              <Zap className="w-3 h-3" /> Next-Gen Astrology
            </div>
            <h1 className="text-6xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[1.05] mb-6">
              Decode your <br />
              <span className="text-orange-500 underline decoration-orange-200 underline-offset-8">Cosmic DNA</span> 
              <br />with AI.
            </h1>
            <p className="text-lg text-slate-600 mb-10 max-w-lg leading-relaxed">
              Experience the world's most precise Vedic engine. Combining ancient wisdom with Gemini 2.5 Intelligence for hyper-accurate Kundli, Vastu, and Palmistry.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/generate" className="h-14 px-8 bg-orange-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-orange-600 hover:shadow-xl hover:shadow-orange-200 transition-all group">
                Generate Your Kundli
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="h-14 px-8 bg-white border border-slate-200 text-slate-900 rounded-2xl font-bold flex items-center justify-center gap-2 hover:border-orange-500 transition-all">
                View Sample Dashboard
              </button>
            </div>

            <div className="mt-12 flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200" />
                ))}
              </div>
              <p className="text-sm text-slate-500 font-medium">
                Joined by <span className="text-slate-900 font-bold">10k+ seekers</span> this month
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* The Zodiac Wheel Component would go here */}
            <div className="relative w-full aspect-square bg-white rounded-[40px] shadow-2xl border border-slate-100 p-8 flex items-center justify-center overflow-hidden group">
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
               <div className="w-full h-full border-2 border-dashed border-orange-200 rounded-full animate-[spin_60s_linear_infinite] flex items-center justify-center">
                  <div className="w-[80%] h-[80%] border border-orange-100 rounded-full" />
               </div>
               <div className="absolute center bg-white p-6 rounded-3xl shadow-xl border border-slate-50 text-center">
                  <Sparkles className="w-10 h-10 text-orange-500 mx-auto mb-2" />
                  <div className="text-2xl font-black italic">Gemini 2.5</div>
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-widest">Active Processing</div>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. CORE SERVICES BENTO GRID */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-slate-900 mb-4">One Platform. Infinite Wisdom.</h2>
          <p className="text-slate-500">Modular AI tools designed for modern life.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ServiceCard 
            title="Precision Kundli" 
            desc="D1 to D60 charts with real-time interpretation of 27 Nakshatras."
            icon={<LayoutDashboard className="text-orange-500" />}
            color="bg-orange-50"
          />
          <ServiceCard 
            title="Vastu Vision" 
            desc="Upload your floor plan and get instant AI scoring for directional harmony."
            icon={<Map className="text-indigo-500" />}
            color="bg-indigo-50"
          />
          <ServiceCard 
            title="Palm Scan" 
            desc="Our neural network maps 1,000+ points on your palm for life path insights."
            icon={<Hand className="text-emerald-500" />}
            color="bg-emerald-50"
          />
          <div className="md:col-span-2 bg-slate-900 rounded-[32px] p-10 flex flex-col justify-between overflow-hidden relative group">
             <div className="relative z-10">
                <h3 className="text-3xl font-bold text-white mb-4">Chat with the Cosmos</h3>
                <p className="text-slate-400 max-w-md">Our AI Astrologer is trained on millennia of texts, providing instant guidance on career, health, and love.</p>
                <button className="mt-8 flex items-center gap-2 text-orange-400 font-bold group-hover:gap-4 transition-all">
                  Start a session <ChevronRight className="w-5 h-5" />
                </button>
             </div>
             <MessageSquare className="absolute bottom-[-20px] right-[-20px] w-64 h-64 text-white/5 rotate-12" />
          </div>
          <div className="bg-orange-500 rounded-[32px] p-10 text-white">
             <h3 className="text-2xl font-bold mb-4 italic">78%</h3>
             <p className="text-orange-100 font-medium">Average Vastu score improvement reported by our users.</p>
          </div>
        </div>
      </section>

      {/* 4. FOOTER */}
      <footer className="border-t border-slate-100 py-12 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Sparkles className="text-orange-500 w-5 h-5" />
            <span className="font-black text-xl">AstroPro</span>
          </div>
          <p className="text-slate-400 text-sm">© 2026 AstroPro Enterprise. Built for the Modern Soul.</p>
          <div className="flex gap-6 text-sm font-bold text-slate-600">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">API Docs</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ServiceCard({ title, desc, icon, color }: any) {
  return (
    <div className="p-8 rounded-[32px] border border-slate-100 bg-white hover:shadow-2xl hover:shadow-slate-100 transition-all group">
      <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
        {React.cloneElement(icon, { size: 28 })}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function Zap({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}