"use client";
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Menu, ChevronRight, UserCircle, Rocket } from 'lucide-react';
import { useAuth } from '@/context/AuthContext'; // Import your auth hook

export const Header = ({ isScrolled }: { isScrolled: boolean }) => {
    const { user } = useAuth(); // Access authentication state
    
    // Apple-style Spring: Zero oscillation for crisp stops
    const springConfig = { type: "spring", stiffness: 280, damping: 28, mass: 0.5 } as const;

    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4 pointer-events-none">
            <motion.nav
                layout 
                initial={false}
                animate={{
                    width: isScrolled ? "auto" : "100%",
                    borderRadius: isScrolled ? "999px" : "24px", // Smoother corners for premium feel
                }}
                transition={springConfig}
                style={{
                    backdropFilter: "blur(24px) saturate(180%)",
                    WebkitBackdropFilter: "blur(24px) saturate(180%)",
                }}
                className={`
                    pointer-events-auto
                    flex items-center justify-between
                    h-14 md:h-16
                    px-6
                    bg-[#0a0a0a]/70
                    border border-white/[0.08]
                    shadow-[0_20px_50px_rgba(0,0,0,0.5)]
                    relative
                    will-change-transform
                `}
            >
                {/* Logo Section */}
                <Link href="/" className="flex items-center gap-3 group cursor-pointer flex-shrink-0">
                    <motion.div 
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/20"
                    >
                        <Sparkles className="text-white w-4 h-4" />
                    </motion.div>
                    <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
                        AstroPro
                    </span>
                </Link>

                {/* Navigation Desktop */}
                <div className="hidden md:flex items-center gap-8 ml-8">
                    <div className="flex items-center gap-6 text-[13px] font-medium tracking-tight">
                        {["Kundli", "Vastu", "AI Palmistry"].map((item) => (
                            <a 
                                key={item} 
                                href={`#${item.toLowerCase().replace(" ", "")}`} 
                                className="text-white/50 transition-all duration-300 hover:text-white whitespace-nowrap hover:translate-y-[-1px]"
                            >
                                {item}
                            </a>
                        ))}
                        
                        {/* New Join System Route */}
                        <Link 
                            href="/register" 
                            className="flex items-center gap-1.5 text-orange-400 transition-all duration-300 hover:text-orange-300 whitespace-nowrap hover:translate-y-[-1px]"
                        >
                            <Rocket size={14} className="animate-pulse" />
                            <span>Become Partner</span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-3 ml-4">
                        {/* Auth Conditional Rendering */}
                        {!user ? (
                            <Link 
                                href="/login" 
                                className="text-[13px] font-medium text-white/70 px-3 py-2 hover:text-white transition-colors flex items-center gap-2"
                            >
                                Sign In
                            </Link>
                        ) : (
                            <div className="flex items-center gap-2 px-3 py-2 text-white/40 text-[12px] font-medium select-none">
                                <UserCircle size={16} className="text-green-500/60" />
                                <span className="max-w-[80px] truncate uppercase tracking-widest">Active</span>
                            </div>
                        )}
                        
                        <Link 
                            href="/dashboard" 
                            className="group flex items-center gap-2 bg-white text-black text-[12px] font-black px-5 py-2.5 rounded-full shadow-[0_10px_20px_rgba(255,255,255,0.1)] hover:bg-orange-500 hover:text-white transition-all duration-300 active:scale-95 whitespace-nowrap"
                        >
                            <span>Launch</span>
                            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
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