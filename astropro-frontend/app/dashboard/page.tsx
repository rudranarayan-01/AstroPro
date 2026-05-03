"use client";
import React, { useState, useMemo } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import ClientManagement from '@/components/dashboard/views/ClientManagement';
import KundliView from '@/components/dashboard/views/KundliView';
import VastuView from '@/components/dashboard/views/VastuView';
import PalmReadingView from '@/components/dashboard/views/PalmReadingView';
import ChatView from '@/components/dashboard/views/ChatView';
import QuickAnalysisResult from '@/components/dashboard/views/QuickAnalysisResult';
import { ChevronDown, Plus, Moon, Hand, Home, UserPlus, Zap, X, User } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';

type AnalysisType = 'Dashboard' | 'Clients' | 'Kundli' | 'Vastu' | 'Palm Reading' | 'Chat' | 'QuickResult';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<AnalysisType>('Dashboard');
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [quickData, setQuickData] = useState<any>(null);

  const [isQuickAnalysisOpen, setIsQuickAnalysisOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<'quick' | 'newClient' | null>(null);
  const [selectedQuickType, setSelectedQuickType] = useState<string | null>(null);

  // --- Handlers ---
  const handleQuickAnalyse = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      dob: formData.get('dob'),
      tob: formData.get('tob'),
      pob: formData.get('pob'),
      type: selectedQuickType
    };
    setQuickData(data);
    setActiveTab('QuickResult');
    setActiveModal(null);
  };

  const handleCreateClient = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newClient = {
      id: Date.now(),
      name: formData.get('name'),
      dob: formData.get('dob'),
      issue: formData.get('issue'),
      type: formData.get('initialAnalysis')
    };
    setSelectedClient(newClient);
    setActiveTab((formData.get('initialAnalysis') as AnalysisType) || 'Kundli');
    setActiveModal(null);
  };

  // --- View Logic ---
  const viewContent = useMemo(() => {
    if (activeTab === 'QuickResult') return <QuickAnalysisResult data={quickData} />;

    if (activeTab === 'Dashboard' || activeTab === 'Clients' || !selectedClient) {
      return <ClientManagement onSelectClient={(client) => { setSelectedClient(client); setActiveTab('Kundli'); }} />;
    }

    switch (activeTab) {
      case 'Kundli': return <KundliView clientData={selectedClient} />;
      case 'Vastu': return <VastuView clientData={selectedClient} />;
      case 'Palm Reading': return <PalmReadingView clientData={selectedClient} />;
      case 'Chat': return <ChatView clientContext={selectedClient} />;
      default: return <ClientManagement onSelectClient={() => { }} />;
    }
  }, [activeTab, selectedClient, quickData]);

  return (
    <ProtectedRoute>

      <main className="flex min-h-screen bg-[#050608] text-slate-200 overflow-hidden font-sans selection:bg-orange-500/30">
        <Sidebar activeTab={activeTab} setActiveTab={(t: any) => setActiveTab(t)} isClientSelected={!!selectedClient} />

        <div className="flex-1 relative z-10 h-screen overflow-y-auto custom-scrollbar scroll-smooth">
          {/* Premium Header Bar */}
          <header className="sticky top-0 z-30 px-8 lg:px-12 py-5 bg-[#050608]/60 backdrop-blur-xl border-b border-white/[0.03] flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <h1 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em] mb-1 italic">
                  {activeTab === 'QuickResult' ? 'Instant Session' : 'Active View'}
                </h1>
                <span className="text-lg font-black text-white uppercase tracking-tighter italic">
                  {activeTab === 'QuickResult' ? 'Analysis Report' : activeTab}
                </span>
              </div>

              {/* CRITICAL FIX: Active Client Indicator */}
              {selectedClient && activeTab !== 'QuickResult' && activeTab !== 'Dashboard' && activeTab !== 'Clients' && (
                <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/[0.03] border border-white/10 rounded-2xl animate-in slide-in-from-left-4 duration-500">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black text-white/30 uppercase tracking-widest leading-none mb-0.5">Focusing on</span>
                    <span className="text-xs font-bold text-white tracking-wide">{selectedClient.name}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setIsQuickAnalysisOpen(!isQuickAnalysisOpen)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  <Zap size={14} className={`${isQuickAnalysisOpen ? 'text-orange-500' : 'text-orange-500/50'}`} /> Quick Analysis <ChevronDown size={12} className={`transition-transform duration-300 ${isQuickAnalysisOpen ? 'rotate-180' : ''}`} />
                </button>

                {isQuickAnalysisOpen && (
                  <div className="absolute right-0 mt-3 w-52 bg-[#0d0f14]/95 backdrop-blur-2xl border border-white/[0.08] rounded-[24px] p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 animate-in fade-in zoom-in-95 duration-200">
                    <DropdownOption icon={<Moon size={14} />} label="Kundli" onClick={() => { setSelectedQuickType('Kundli'); setActiveModal('quick'); setIsQuickAnalysisOpen(false); }} />
                    <DropdownOption icon={<Hand size={14} />} label="Palm" onClick={() => { setSelectedQuickType('Palm'); setActiveModal('quick'); setIsQuickAnalysisOpen(false); }} />
                    <DropdownOption icon={<Home size={14} />} label="Vastu" onClick={() => { setSelectedQuickType('Vastu'); setActiveModal('quick'); setIsQuickAnalysisOpen(false); }} />
                  </div>
                )}
              </div>

              <button
                onClick={() => setActiveModal('newClient')}
                className="flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-orange-900/40 active:scale-95"
              >
                <UserPlus size={14} /> New Client
              </button>
            </div>
          </header>

          {/* Content Area */}
          <div className="p-8 lg:p-12 max-w-7xl mx-auto">
            {viewContent}
          </div>
        </div>

        {/* --- MODALS --- */}
        {activeModal === 'quick' && (
          <Modal title={`Quick ${selectedQuickType} Analysis`} onClose={() => setActiveModal(null)}>
            <form onSubmit={handleQuickAnalyse} className="space-y-4">
              <Input name="name" label="Full Name" placeholder="Client Name" required />
              <div className="grid grid-cols-2 gap-4">
                <Input name="dob" label="Date of Birth" type="date" required />
                <Input name="tob" label="Time of Birth" type="time" required />
              </div>
              <Input name="pob" label="Place of Birth" placeholder="City, Country" required />
              <button type="submit" className="w-full py-4 bg-orange-600 rounded-2xl font-black uppercase tracking-widest text-[11px] mt-4 hover:bg-orange-500 transition-all shadow-xl shadow-orange-900/20 active:scale-[0.98]">
                Begin Instant Analysis
              </button>
            </form>
          </Modal>
        )}

        {activeModal === 'newClient' && (
          <Modal title="Onboard New Client" onClose={() => setActiveModal(null)}>
            <form onSubmit={handleCreateClient} className="space-y-4">
              <Input label="Client Name" name="name" placeholder="Legal Name" required />
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Context / Primary Concern</label>
                <textarea name="issue" className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-xs focus:border-orange-500 outline-none min-h-[100px] transition-all placeholder:text-white/10" placeholder="Primary issue or reason for visit..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="DOB" name="dob" type="date" required />
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Primary Tool</label>
                  <select name="initialAnalysis" className="bg-[#1a1d23] border border-white/10 rounded-xl p-3 text-xs outline-none focus:border-orange-500 text-white cursor-pointer transition-all">
                    <option value="Kundli">Kundli Analysis</option>
                    <option value="Palm Reading">Palm Reading</option>
                    <option value="Vastu">Vastu Consultation</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full py-4 bg-orange-600 rounded-2xl font-black uppercase tracking-widest text-[11px] mt-2 shadow-xl shadow-orange-900/20 hover:bg-orange-500 active:scale-[0.98] transition-all">
                Create & Save Profile
              </button>
            </form>
          </Modal>
        )}
      </main>
    </ProtectedRoute>
  );
}

// --- Components ---

function Modal({ title, children, onClose }: { title: string, children: React.ReactNode, onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-sm bg-black/80 animate-in fade-in duration-300">
      <div className="bg-[#0d0f14] border border-white/10 w-full max-w-lg rounded-[40px] p-10 shadow-[0_0_100px_rgba(0,0,0,1)] animate-in zoom-in-95 duration-300">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-black tracking-tighter uppercase italic text-white/90">{title}</h2>
          <button onClick={onClose} className="p-2.5 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-colors"><X size={22} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Input({ label, ...props }: any) {
  return (
    <div className="flex flex-col gap-2 group">
      <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1 group-focus-within:text-orange-500 transition-colors">{label}</label>
      <input {...props} className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-xs focus:border-orange-500 focus:bg-white/[0.05] outline-none transition-all placeholder:text-white/5" />
    </div>
  );
}

function DropdownOption({ icon, label, onClick }: any) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-[10px] font-bold text-white/60 hover:text-white hover:bg-white/[0.05] transition-all uppercase tracking-widest group">
      <span className="text-orange-500 group-hover:scale-110 transition-transform">{icon}</span> {label}
    </button>
  );
}