"use client";
import React from 'react';
import { 
  LayoutDashboard, 
  Moon, 
  Home, 
  Hand, 
  MessageSquare, 
  Users,
  LogOut,
  ChevronRight,
  Lock,
  Zap,
  LucideIcon
} from 'lucide-react';
// FIX: Use next/navigation for App Router
import { useRouter, usePathname } from 'next/navigation';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (t: string) => void;
  isClientSelected: boolean;
}

interface NavItem {
  name: string;
  icon: LucideIcon;
  badge?: string | null;
}

interface NavGroup {
  group: string;
  items: NavItem[];
  locked?: boolean;
}

export default function Sidebar({ activeTab, setActiveTab, isClientSelected }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  const navItems: NavGroup[] = [
    { 
      group: 'Management', 
      items: [
        { name: 'Dashboard', icon: LayoutDashboard },
        { name: 'Clients', icon: Users, badge: 'Live' },
      ] 
    },
    { 
      group: 'Analysis Suite', 
      items: [
        { name: 'Kundli', icon: Moon },
        { name: 'Vastu', icon: Home },
        { name: 'Palm Reading', icon: Hand },
        { name: 'Chat', icon: MessageSquare },
      ],
      // Suite remains locked unless a client is loaded or we are in Quick Result mode
      locked: !isClientSelected && activeTab !== 'QuickResult' 
    },
  ];

    const handleLogout = () => {
      // Clear session and redirect to login
      localStorage.removeItem('astro_token');
      localStorage.removeItem('astro_user');
      router.push('/login');
    };

  return (
    <aside className="w-72 bg-[#050608] border-r border-white/[0.04] flex flex-col h-screen sticky top-0 z-50 overflow-hidden shadow-2xl">
      {/* Ambient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.03),transparent_50%)] pointer-events-none" />

      {/* Brand Header */}
      <div className="p-8 pb-10 relative">
        <button 
          onClick={() => router.push('/dashboard')} 
          className="flex items-center gap-3 group text-left"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-orange-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="relative w-11 h-11 bg-gradient-to-br from-orange-400 to-orange-600 rounded-[14px] flex items-center justify-center shadow-lg border border-white/10">
              <Zap size={22} className="text-white fill-white/20" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter text-white leading-none">
              ASTRO<span className="text-orange-500">PRO</span>
            </span>
            <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] mt-1.5 flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-orange-500/40" /> Enterprise v2.0
            </span>
          </div>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-9 overflow-y-auto custom-scrollbar relative z-10">
        {navItems.map((group) => (
          <div key={group.group} className="relative">
            <div className="px-4 mb-3 flex items-center justify-between">
              <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.25em] italic">
                {group.group}
              </h3>
              {group.locked && (
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white/[0.02] border border-white/5 rounded-md backdrop-blur-md">
                  <Lock size={10} className="text-orange-500/40" />
                </div>
              )}
            </div>

            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = activeTab === item.name;
                const isDisabled = group.locked;

                return (
                  <button
                    key={item.name}
                    disabled={isDisabled}
                    onClick={() => setActiveTab(item.name)}
                    className={`
                      w-full group relative flex items-center gap-3 px-4 py-3 rounded-2xl text-[13px] transition-all duration-300
                      ${isActive 
                        ? 'text-white' 
                        : isDisabled 
                          ? 'opacity-20 cursor-not-allowed filter grayscale' 
                          : 'text-white/40 hover:text-white/80 hover:bg-white/[0.02]'}
                    `}
                  >
                    {/* Active Indicator Line */}
                    {isActive && (
                      <div className="absolute left-0 w-1 h-5 bg-orange-500 rounded-r-full shadow-[0_0_15px_rgba(249,115,22,0.8)] z-20" />
                    )}
                    
                    {/* Background Highlight */}
                    <div className={`
                      absolute inset-0 rounded-2xl transition-opacity duration-500
                      ${isActive ? 'bg-gradient-to-r from-orange-500/10 to-transparent opacity-100' : 'opacity-0 group-hover:opacity-100 bg-white/[0.01]'}
                    `} />

                    {/* Icon Container */}
                    <div className={`
                      relative z-10 p-2 rounded-xl transition-all duration-300
                      ${isActive ? 'text-orange-500 scale-110' : 'text-white/20 group-hover:text-white/60'}
                    `}>
                      <item.icon size={19} strokeWidth={isActive ? 2.5 : 1.5} />
                    </div>

                    <span className={`relative z-10 font-bold tracking-wide transition-all ${isActive ? 'translate-x-1' : ''}`}>
                      {item.name}
                    </span>

                    {/* Badge */}
                    {item.badge && !isDisabled && (
                      <span className="relative z-10 ml-auto text-[9px] font-black bg-orange-500 text-white px-2 py-0.5 rounded-full shadow-lg shadow-orange-500/20 uppercase tracking-tighter">
                        {item.badge}
                      </span>
                    )}

                    {isActive && (
                      <ChevronRight size={14} className="relative z-10 ml-auto text-orange-500/50" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Footer */}
      <div className="p-6 relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.05] to-transparent" />
        
        <div className="bg-gradient-to-b from-white/[0.04] to-transparent border border-white/[0.05] rounded-[28px] p-4 backdrop-blur-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 p-[1px]">
                <div className="w-full h-full rounded-[15px] bg-[#0d0f14] flex items-center justify-center font-black text-white text-xs">
                  DR
                </div>
              </div>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-black text-white truncate uppercase tracking-wider">Dr. Astrologer</span>
              <span className="text-[9px] text-orange-500/70 font-black uppercase tracking-widest">Master Tier</span>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black text-white/30 hover:text-white hover:bg-red-500/80 transition-all border border-white/[0.03] hover:border-transparent uppercase tracking-[0.2em] group"
          >
            <LogOut size={14} className="group-hover:rotate-12 transition-transform" />
            Termination
          </button>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.03); border-radius: 10px; }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); }
      `}</style>
    </aside>
  );
}