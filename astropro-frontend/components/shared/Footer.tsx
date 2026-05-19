"use client";

import React from 'react';
import {
    Moon,
    ArrowRight,
    Globe,
    Shield,
    Scale
} from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#07080a] border-t border-white/[0.05] text-white/60 text-sm relative overflow-hidden">
            {/* Background Sacred Geometry Accent Blur */}
            <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-orange-600/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-0 left-0 w-[200px] h-[200px] bg-purple-600/5 rounded-full blur-[100px] pointer-events-none" />

            {/* Main Content Container */}
            <div className="max-w-7xl mx-auto px-6 pt-16 pb-8 relative z-10">

                {/* Top Section: Brand & Navigation Columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 pb-12 border-b border-white/[0.05]">

                    {/* Column 1: Brand Identifier */}
                    <div className="lg:col-span-2 pr-0 lg:pr-8 flex flex-col gap-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-orange-600/10">
                                <Moon size={20} className="fill-white" />
                            </div>
                            <span className="text-xl font-black text-white uppercase tracking-wider italic">
                                Astro<span className="text-orange-500 font-medium">PRO</span>
                            </span>
                        </div>
                        <p className="text-white/40 leading-relaxed max-w-sm text-xs">
                            Enterprise-grade cosmological telemetry systems. Harmonizing ancient Vedic wisdom with high-fidelity cloud intelligence dashboards for precise planetary synchronization.
                        </p>

                        {/* Social Icons Matrix (Self-contained SVG fallbacks) */}
                        <div className="flex items-center gap-3 mt-2">
                            {/* X / Twitter */}
                            <SocialIcon href="#">
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </SocialIcon>

                            {/* YouTube */}
                            <SocialIcon href="#">
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                </svg>
                            </SocialIcon>

                            {/* Instagram */}
                            <SocialIcon href="#">
                                <svg className="w-4 h-4 stroke-current fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
                                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                                </svg>
                            </SocialIcon>

                            {/* LinkedIn */}
                            <SocialIcon href="#">
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z" />
                                </svg>
                            </SocialIcon>
                        </div>
                    </div>

                    {/* Column 2: Platform Links */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-white text-xs font-black uppercase tracking-[0.2em] mb-1 italic text-white/90">Platform</h4>
                        <FooterLink href="#">Live Workspaces</FooterLink>
                        <FooterLink href="#">Kundli Engines</FooterLink>
                        <FooterLink href="#">Vastu Layout Tools</FooterLink>
                        <FooterLink href="#">Palmmetry Analysis</FooterLink>
                    </div>

                    {/* Column 3: Resources */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-white text-xs font-black uppercase tracking-[0.2em] mb-1 italic text-white/90">Resources</h4>
                        <FooterLink href="#">API Documentation</FooterLink>
                        <FooterLink href="#">Vedic Frameworks</FooterLink>
                        <FooterLink href="#">Security & Encryption</FooterLink>
                        <FooterLink href="#">System Status</FooterLink>
                    </div>

                    {/* Column 4: Newsletter Engine */}
                    <div className="flex flex-col gap-4 lg:col-span-1">
                        <h4 className="text-white text-xs font-black uppercase tracking-[0.2em] mb-1 italic text-white/90">Transit Alerts</h4>
                        <p className="text-white/40 text-xs leading-relaxed">
                            Subscribe to global planetary macro-trend reporting notifications.
                        </p>
                        <form onSubmit={(e) => e.preventDefault()} className="relative mt-2">
                            <input
                                type="email"
                                placeholder="Secure email address"
                                className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl py-3 pl-4 pr-12 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-orange-500/40 transition-colors"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-2 bottom-2 w-8 h-8 bg-white/[0.03] hover:bg-orange-600 rounded-lg flex items-center justify-center text-white/40 hover:text-white border border-white/[0.05] hover:border-orange-500 transition-all group"
                            >
                                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                            </button>
                        </form>
                    </div>

                </div>

                {/* Bottom Section: Compliance, Legal & System Health */}
                <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6">

                    {/* Copyright Metadata */}
                    <div className="flex items-center gap-2 text-xs text-white/30 font-medium">
                        <span>© {currentYear} AstroPRO Systems Inc.</span>
                        <span className="w-1 h-1 bg-white/10 rounded-full" />
                        <span>All spatial data secure.</span>
                    </div>

                    {/* Micro Legal & Trust Footers */}
                    <div className="flex flex-wrap justify-center items-center gap-6 text-xs text-white/40 font-medium">
                        <a href="#" className="hover:text-white flex items-center gap-1.5 transition-colors">
                            <Shield size={12} className="text-white/20" /> Privacy Charter
                        </a>
                        <a href="#" className="hover:text-white flex items-center gap-1.5 transition-colors">
                            <Scale size={12} className="text-white/20" /> Terms of Service
                        </a>
                        <button className="hover:text-white flex items-center gap-1.5 transition-colors bg-white/[0.02] border border-white/[0.05] rounded-full px-3 py-1 text-[11px]">
                            <Globe size={12} className="text-orange-500" /> English (US)
                        </button>
                    </div>

                </div>

            </div>
        </footer>
    );
}

// Inner Component: Fluid Nav Links
function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <a
            href={href}
            className="text-white/40 hover:text-white text-xs font-medium transition-colors w-fit relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-orange-500/50 hover:after:w-full after:transition-all after:duration-300"
        >
            {children}
        </a>
    );
}

// Inner Component: Social Media Badge Matrix Icons
function SocialIcon({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <a
            href={href}
            className="w-8 h-8 rounded-lg bg-white/[0.02] border border-white/[0.05] text-white/30 hover:text-white hover:bg-white/[0.05] hover:border-white/[0.1] flex items-center justify-center transition-all"
        >
            {children}
        </a>
    );
}