"use client";
import React from 'react';
import { motion } from 'framer-motion';

// Professional Hand-Drawn Style Zodiac Path Data (Scaled for 50x50 viewbox)
const ZODIAC_SYMBOLS = [
  "M25,10 Q35,5 40,15 M25,15 Q15,5 10,15 M25,15 L25,40", // Aries
  "M15,15 Q25,5 35,15 M25,20 A10,10 0 1,1 24.9,20", // Taurus
  "M15,10 L35,10 M15,40 L35,40 M20,10 L20,40 M30,10 L30,40", // Gemini
  "M35,20 A8,8 0 1,0 20,20 M15,30 A8,8 0 1,0 30,30", // Cancer
  "M15,30 A5,5 0 1,1 25,30 Q30,15 40,25", // Leo
  "M15,15 L15,35 Q15,45 25,35 L25,15 M25,35 Q25,45 35,35 L35,15 M35,35 Q40,45 45,30", // Virgo
  "M10,35 L40,35 M15,30 Q25,10 35,30", // Libra
  "M15,15 L15,35 M25,15 L25,35 M35,15 L35,30 L42,35 L35,40", // Scorpio
  "M15,35 L35,15 M30,15 L35,15 L35,20 M20,30 L25,35", // Sagittarius
  "M15,15 L20,35 L30,25 Q35,15 25,15", // Capricorn
  "M10,20 L15,15 L20,20 L25,15 L30,20 L35,15 L40,20 M10,30 L15,25 L20,30 L25,25 L30,30 L35,25 L40,30", // Aquarius
  "M15,15 Q25,25 15,35 M35,15 Q25,25 35,35 M12,25 L38,25" // Pisces
];

const ZODIAC_NAMES = ["ARIES", "TAURUS", "GEMINI", "CANCER", "LEO", "VIRGO", "LIBRA", "SCORPIO", "SAGITTARIUS", "CAPRICORN", "AQUARIUS", "PISCES"];

export const RashiChakra = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center pointer-events-none select-none">
      
      {/* 1. SVG DEFS & NEON FILTERS */}
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="premium-neon" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feFlood floodColor="#f97316" floodOpacity="0.6" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          <linearGradient id="neon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>
        </defs>
      </svg>

      {/* 2. OUTER RING: NAMES & TICKS (Clockwise) */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <svg viewBox="0 0 500 500" className="w-full h-full drop-shadow-[0_0_10px_rgba(249,115,22,0.3)]">
          <circle cx="250" cy="250" r="248" fill="none" stroke="url(#neon-gradient)" strokeWidth="1" strokeOpacity="0.5" />
          <circle cx="250" cy="250" r="210" fill="none" stroke="#f97316" strokeWidth="0.5" strokeOpacity="0.3" />
          
          {/* Degree Ticks */}
          {[...Array(60)].map((_, i) => (
            <line 
              key={i} x1="250" y1="2" x2="250" y2="12" 
              stroke="#f97316" strokeWidth="1.5" strokeOpacity="0.6"
              transform={`rotate(${i * 6} 250 250)`} 
            />
          ))}

          {/* Curved Names */}
          <defs>
            <path id="nameCircle" d="M 250, 250 m -230, 0 a 230,230 0 1,1 460,0 a 230,230 0 1,1 -460,0" />
          </defs>
          {ZODIAC_NAMES.map((name, i) => (
            <text key={i} className="fill-orange-400 text-[9px] font-bold tracking-[0.4em] uppercase opacity-80">
              <textPath href="#nameCircle" startOffset={(i * 8.33 + 4.16) + "%"} textAnchor="middle">
                {name}
              </textPath>
            </text>
          ))}
        </svg>
      </motion.div>

      {/* 3. INNER RING: SYMBOLS & PARTITIONS (Anti-Clockwise) */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
        className="absolute w-[82%] h-[82%] flex items-center justify-center"
      >
        <svg viewBox="0 0 400 400" className="w-full h-full" style={{ filter: 'url(#premium-neon)' }}>
          {/* Main Structural Lines */}
          {[...Array(12)].map((_, i) => (
            <line 
              key={i} x1="200" y1="20" x2="200" y2="150" 
              stroke="#ea580c" strokeWidth="1" strokeOpacity="0.4"
              transform={`rotate(${i * 30} 200 200)`} 
            />
          ))}

          {/* Zodiac Icons */}
          {ZODIAC_SYMBOLS.map((path, i) => {
            const angle = (i * 30 + 15) * (Math.PI / 180);
            const r = 135;
            const x = 200 + r * Math.sin(angle) - 25;
            const y = 200 - r * Math.cos(angle) - 25;
            return (
              <g key={i} transform={`translate(${x},${y}) rotate(${i * 30 + 15}, 25, 25)`}>
                <path 
                  d={path} 
                  fill="none" 
                  stroke="url(#neon-gradient)" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </g>
            );
          })}
          <circle cx="200" cy="200" r="105" fill="none" stroke="#f97316" strokeWidth="1" strokeOpacity="0.2" />
        </svg>
      </motion.div>

      {/* 4. CORE ENGINE: THE SUN YANTRA (Clockwise) */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        className="absolute w-[48%] h-[48%] flex items-center justify-center"
      >
        <svg viewBox="0 0 200 200" className="w-full h-full" style={{ filter: 'url(#premium-neon)' }}>
          {/* Wavy Sun Rays - Matching Image Reference */}
          {[...Array(24)].map((_, i) => (
            <path
              key={i}
              d="M100,50 Q110,70 100,90"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="1.5"
              strokeLinecap="round"
              transform={`rotate(${i * 15} 100 100)`}
            />
          ))}
          
          {/* Inner Core Detail */}
          <circle cx="100" cy="100" r="45" fill="none" stroke="#f97316" strokeWidth="1" strokeOpacity="0.5" />
          <circle cx="100" cy="100" r="35" fill="none" stroke="#f97316" strokeWidth="2" />
          
          {/* Pulsing Center point */}
          <motion.circle 
            cx="100" cy="100" r="5" 
            fill="#fbbf24"
            animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </svg>
      </motion.div>

      {/* 5. FINISHING GLOW OVERLAY */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,_transparent_40%,rgba(249,115,22,0.05)_100%)] rounded-full" />
    </div>
  );
};