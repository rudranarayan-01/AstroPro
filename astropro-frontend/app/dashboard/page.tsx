// app/dashboard/page.tsx
"use client";
import React, { useState } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import ClientManagement from '@/components/dashboard/views/ClientManagement';
import KundliView from '@/components/dashboard/views/KundliView';

export default function Dashboard() {
  const [view, setView] = useState<'listing' | 'report'>('listing');
  const [selectedClient, setSelectedClient] = useState<any>(null);

  const handleClientSelect = (client: any) => {
    setSelectedClient(client);
    setView('report');
  };

  return (
    <main className="flex min-h-screen bg-[#02040a] text-slate-200 overflow-hidden font-sans">
      {/* PERSISTENT ASTROLOGY WHEEL BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] flex items-center justify-center">
        <div className="w-[1100px] h-[1100px] border border-white rounded-full animate-slow-spin">
           {[...Array(12)].map((_, i) => (
             <div key={i} className="absolute top-1/2 left-1/2 w-full h-[1px] bg-white origin-left" style={{ transform: `rotate(${i * 30}deg)` }} />
           ))}
        </div>
      </div>

      <Sidebar activeTab={view === 'listing' ? 'Dashboard' : 'Kundli'} setActiveTab={() => setView('listing')} />

      <div className="flex-1 relative z-10 h-screen overflow-y-auto p-8 lg:p-12">
        <div className="max-w-7xl mx-auto">
          {view === 'listing' ? (
            <ClientManagement onSelectClient={handleClientSelect} />
          ) : (
            <>
              {/* Back to Listing Button */}
              <button 
                onClick={() => setView('listing')}
                className="mb-8 flex items-center gap-2 text-[10px] font-black text-white/30 uppercase tracking-[0.2em] hover:text-orange-500 transition-colors"
              >
                ← Back to Vault
              </button>
              {/* Load KundliView with specific client context */}
              <KundliView clientData={selectedClient} />
            </>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes slow-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-slow-spin { animation: slow-spin 200s linear infinite; }
      `}</style>
    </main>
  );
}