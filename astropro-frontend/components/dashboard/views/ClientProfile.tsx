// components/dashboard/views/ClientProfile.tsx
"use client";
import React, { useState } from 'react';
import { MessageSquare, Moon, Home, Hand, History, User, ChevronLeft } from 'lucide-react';
import KundliView from './KundliView';
import ChatView from './ChatView';
import VastuView from './VastuView';
import PalmReadingView from './PalmReadingView';
import { ClientOverview } from './ClientOverview';

export default function ClientProfile({ client, onBack }: { client: any, onBack: () => void }) {
  const [activeSubTab, setActiveSubTab] = useState('Overview');

  // Enhanced Sidebar/Tabs for the specific client
  const tabs = [
    { name: 'Overview', icon: History },
    { name: 'Chat History', icon: MessageSquare },
    { name: 'Kundli Archive', icon: Moon },
    { name: 'Vastu Analysis', icon: Home },
    { name: 'Palm Records', icon: Hand },
  ];

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      {/* Header: Client Identity */}
      <div className="flex items-center justify-between mb-8 bg-[#0d0f14]/40 p-6 rounded-[24px] border border-white/[0.05]">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-full text-white/40 hover:text-orange-500 transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center font-black text-white shadow-lg">
            {client.name[0]}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{client.name}</h2>
            <p className="text-[10px] text-orange-500 font-black uppercase tracking-[0.2em]">Active Profile • {client.status} Plan</p>
          </div>
        </div>
        
        {/* Sub-Navigation within Client Profile */}
        <nav className="flex bg-white/[0.02] p-1 rounded-xl border border-white/[0.05]">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveSubTab(tab.name)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                activeSubTab === tab.name ? 'bg-orange-500 text-white shadow-md' : 'text-white/40 hover:text-white'
              }`}
            >
              <tab.icon size={14} />
              <span className="hidden lg:block">{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Dynamic Content Area: Loads Previous Data */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {activeSubTab === 'Overview' && <ClientOverview client={client} />}
        {activeSubTab === 'Chat History' && <ChatView clientContext={client} />}
        {activeSubTab === 'Kundli Archive' && <KundliView clientData={client} />}
        {activeSubTab === 'Vastu Analysis' && <VastuView clientData={client} />}
        {activeSubTab === 'Palm Records' && <PalmReadingView clientData={client} />}
      </div>
    </div>
  );
}