"use client";
import React, { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';

// Shared Components
import { Header } from '@/components/shared/Header';

// Landing Specific Components (View Layer)
import { CosmicBackground } from '@/components/landing/CosmicBackground';
import AstroProLanding from '@/components/landing/Landing';

/**
 * HOME COMPONENT
 * The entry point for the landing page. Wraps everything in the ThemeProvider
 * to ensure all sub-components have access to the 'isDark' state.
 */
export default function Home() {
  return (
    <ThemeProvider>
      <ThemeAwareLayout />
    </ThemeProvider>
  );
}

/**
 * THEME AWARE LAYOUT
 * Handles the high-fidelity background layers, global scroll logic, 
 * and theme-dependent CSS classes.
 */
function ThemeAwareLayout() {
  const { isDark } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);

  // Controller Logic: Monitor scroll position for Header "Glassmorphism" effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div 
      className={`relative min-h-screen transition-colors duration-700 ease-in-out selection:bg-orange-500/30 ${
        isDark ? "bg-[#020617] text-white" : "bg-white text-slate-900"
      }`}
    >
      {/* 1. STRUCTURAL GRID OVERLAY */}
      <div 
        className="fixed inset-0 -z-40 pointer-events-none transition-opacity duration-700"
        style={{
          opacity: isDark ? 0.05 : 0.02,
          backgroundImage: `
            linear-gradient(to right, #f97316 1px, transparent 1px),
            linear-gradient(to bottom, #f97316 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(circle at center, black, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black, transparent 85%)'
        }}
      />

      {/* 2. PREMIUM NOISE TEXTURE (Inverted for Light Mode) */}
      <div 
        className={`fixed inset-0 -z-30 pointer-events-none opacity-[0.02] mix-blend-overlay ${
          isDark ? "invert-0" : "invert"
        }`}
        style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/stardust.png')" }}
      />

      {/* 3. DYNAMIC NEBULA/PARTICLE LAYER */}
      <CosmicBackground />

      {/* 4. NAVIGATION BAR */}
      <Header isScrolled={isScrolled} />

      {/* 5. LANDING PAGE CONTENT */}
      <main className="relative z-10 w-full overflow-x-hidden">
        <AstroProLanding />
      </main>

      {/* 6. AMBIENT ATMOSPHERIC GLOW */}
      <div 
        className={`fixed top-0 left-1/2 -translate-x-1/2 w-full h-[600px] blur-[140px] -z-20 pointer-events-none transition-all duration-1000 ${
          isDark ? "bg-orange-600/10 opacity-100" : "bg-orange-200/20 opacity-40"
        }`} 
      />

      {/* 7. FOOTER GLOW (Subtle neon at the bottom) */}
      <div className="fixed bottom-0 left-0 w-full h-[200px] bg-gradient-to-t from-orange-500/5 to-transparent -z-20 pointer-events-none" />
    </div>
  );
}