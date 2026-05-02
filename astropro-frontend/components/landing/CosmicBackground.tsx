"use client";
import { useTheme } from '@/context/ThemeContext';
import React, { useMemo, useEffect, useState } from 'react';

export const CosmicBackground = () => {
  const { isDark } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Memoize star positions so they don't jump on theme change
  const stars = useMemo(() => {
    return [...Array(35)].map((_, i) => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 1.5 + 0.5,
      duration: 3 + Math.random() * 5 + "s",
      delay: Math.random() * 5 + "s",
    }));
  }, []);

  // Use a simple fallback for SSR to prevent layout shift
  if (!mounted) return <div className="fixed inset-0 -z-50 bg-[#f8fafc] dark:bg-[#020617]" />;

  return (
    <div 
      className="fixed inset-0 -z-50 overflow-hidden transform-gpu"
      style={{
        // Define Theme-Specific Tokens as CSS Variables for high-speed interpolation
        ['--bg-color' as string]: isDark ? '#020617' : '#f8fafc',
        ['--nebula-1' as string]: isDark ? 'rgba(234, 88, 12, 0.15)' : 'rgba(253, 186, 116, 0.2)',
        ['--nebula-2' as string]: isDark ? 'rgba(49, 46, 129, 0.2)' : 'rgba(191, 219, 254, 0.3)',
        ['--star-opacity' as string]: isDark ? '1' : '0.3',
        ['--star-color' as string]: isDark ? '#ffffff' : '#f97316',
        backgroundColor: 'var(--bg-color)',
        transition: 'background-color 1.2s cubic-bezier(0.23, 1, 0.32, 1)'
      } as React.CSSProperties}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float-ios {
          0% { transform: translate3d(0, 0, 0); }
          33% { transform: translate3d(30px, -20px, 0); }
          66% { transform: translate3d(-20px, 40px, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        @keyframes subtle-twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        .ios-nebula { transition: background-color 1.2s cubic-bezier(0.23, 1, 0.32, 1); }
        .animate-float { animation: float-ios 40s infinite ease-in-out; }
        .animate-twinkle { animation: subtle-twinkle var(--d) infinite ease-in-out; }
      `}} />

      {/* 1. MESH GRADIENT LAYER - GPU Optimized */}
      <div className="absolute inset-0 overflow-hidden opacity-60 mix-blend-soft-light">
        <div 
          className="ios-nebula animate-float absolute top-[-20%] right-[-10%] w-[100%] h-[100%] rounded-full blur-[140px]"
          style={{ backgroundColor: 'var(--nebula-1)' }}
        />
        <div 
          className="ios-nebula animate-float absolute bottom-[-20%] left-[-10%] w-[90%] h-[90%] rounded-full blur-[140px]"
          style={{ 
            backgroundColor: 'var(--nebula-2)',
            animationDirection: 'reverse',
            animationDuration: '50s' 
          }}
        />
      </div>

      {/* 2. DUST OVERLAY - Flips based on theme for depth */}
      <div 
        className={`absolute inset-0 pointer-events-none opacity-[0.04] transition-all duration-1000 ${
          isDark ? 'mix-blend-screen' : 'mix-blend-multiply'
        }`}
        style={{ 
          backgroundImage: "url('https://www.transparenttextures.com/patterns/stardust.png')",
          filter: isDark ? 'none' : 'invert(1)'
        }} 
      />

      {/* 3. STELLAR LAYER - The stars respond to the 'Stellar Color' token */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
        style={{ opacity: 'var(--star-opacity)' }}
      >
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-twinkle transform-gpu"
            style={{
              left: star.left,
              top: star.top,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: 'var(--star-color)',
              animationDelay: star.delay,
              '--d': star.duration,
              boxShadow: isDark ? '0 0 6px rgba(255,255,255,0.4)' : 'none',
              transition: 'background-color 1.2s cubic-bezier(0.23, 1, 0.32, 1)'
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* 4. IOS VIGNETTE - Smooths the edge of the screen */}
      <div 
        className="absolute inset-0 pointer-events-none transition-all duration-1000"
        style={{
          background: isDark 
            ? 'radial-gradient(circle at center, transparent 0%, rgba(2, 6, 23, 0.4) 100%)' 
            : 'radial-gradient(circle at center, transparent 0%, rgba(255, 255, 255, 0.2) 100%)'
        }}
      />
    </div>
  );
};