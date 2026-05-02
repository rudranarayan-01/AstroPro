"use client";
import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Menu, ChevronRight } from 'lucide-react';

export const Header = ({ isScrolled }: { isScrolled: boolean }) => {
    // Apple-style Spring: Zero oscillation for crisp stops
    const springConfig = { type: "spring", stiffness: 280, damping: 28, mass: 0.5 } as const;

    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4 pointer-events-none">
            <motion.nav
                layout // Crucial for preventing blur during size changes
                initial={false}
                animate={{
                    width: isScrolled ? "auto" : "100%",
                    borderRadius: isScrolled ? "999px" : "20px",
                }}
                transition={springConfig}
                style={{
                    // Using standard inline style for backdrop-filter to ensure browser compatibility
                    backdropFilter: "blur(20px) saturate(180%)",
                    WebkitBackdropFilter: "blur(20px) saturate(180%)",
                }}
                className={`
                    pointer-events-auto
                    flex items-center justify-between
                    h-14 md:h-16
                    px-6
                    bg-[#0a0a0a]/80
                    border border-white/[0.08]
                    shadow-[0_8px_32px_rgba(0,0,0,0.5)]
                    relative
                    will-change-transform
                `}
            >
                {/* Logo Section */}
                <div className="flex items-center gap-3 group cursor-pointer flex-shrink-0">
                    <motion.div 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/20"
                    >
                        <Sparkles className="text-white w-4 h-4" />
                    </motion.div>
                    <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
                        AstroPro
                    </span>
                </div>

                {/* Navigation Desktop */}
                <div className="hidden md:flex items-center gap-8 ml-8">
                    <div className="flex items-center gap-6 text-[13px] font-medium tracking-tight">
                        {["Kundli", "Vastu", "AI Palmistry"].map((item) => (
                            <a 
                                key={item} 
                                href={`#${item.toLowerCase().replace(" ", "")}`} 
                                className="text-white/50 transition-all duration-300 hover:text-white whitespace-nowrap"
                            >
                                {item}
                            </a>
                        ))}
                    </div>

                    <div className="flex items-center gap-3 ml-4">
                        <Link 
                            href="/login" 
                            className="text-[13px] font-medium text-white/70 px-3 py-2 hover:text-white transition-colors"
                        >
                            Sign In
                        </Link>
                        
                        <Link 
                            href="/generate" 
                            className="group flex items-center gap-2 bg-white text-black text-[12px] font-extrabold px-5 py-2.5 rounded-full transition-all active:scale-95 whitespace-nowrap"
                        >
                            <span>Launch</span>
                            <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                    </div>
                </div>

                {/* Mobile Menu Icon */}
                <motion.button 
                    whileTap={{ scale: 0.9 }}
                    className="md:hidden ml-4 p-2 text-white/80"
                >
                    <Menu size={20} strokeWidth={2} />
                </motion.button>
            </motion.nav>
        </header>
    );
};