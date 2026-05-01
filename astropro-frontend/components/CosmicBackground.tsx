"use client";
import React from 'react';
import { motion } from 'framer-motion';

export const CosmicBackground = () => {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden bg-[#020617]">
      {/* 1. Primary Nebula Glow */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full bg-orange-900/20 blur-[120px]"
      />

      {/* 2. Secondary Indigo Glow */}
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
          x: [0, -40, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-900/20 blur-[120px]"
      />

      {/* 3. Static Star Field (CSS Texture) */}
      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />

      {/* 4. Twinkling Stars */}
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: Math.random() * 100 + "%", 
            y: Math.random() * 100 + "%",
            opacity: Math.random() 
          }}
          animate={{ opacity: [0.1, 0.8, 0.1] }}
          transition={{ 
            duration: 2 + Math.random() * 4, 
            repeat: Infinity,
            delay: Math.random() * 5 
          }}
          className="absolute w-0.5 h-0.5 bg-white rounded-full shadow-[0_0_5px_white]"
        />
      ))}
    </div>
  );
};