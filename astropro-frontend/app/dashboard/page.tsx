"use client";
import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '@/components/dashboard/Sidebar';
import ClientManagement from '@/components/dashboard/views/ClientManagement';
import KundliView from '@/components/dashboard/views/KundliView';
import VastuView from '@/components/dashboard/views/VastuView';
import PalmReadingView from '@/components/dashboard/views/PalmReadingView';
import ChatView from '@/components/dashboard/views/ChatView';
import QuickAnalysisResult from '@/components/dashboard/views/QuickAnalysisResult';
import { ChevronDown, Plus, Moon, Hand, Home, UserPlus, Zap, X, User, Users, Activity, Star, MapPin, Loader2, Sparkle } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';

type AnalysisType = 'Dashboard' | 'Clients' | 'Kundli' | 'Vastu' | 'Palm Reading' | 'Chat' | 'QuickResult';

export default function Dashboard() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<AnalysisType>('Dashboard');
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [quickData, setQuickData] = useState<any>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<'quick' | 'newClient' | null>(null);
  const [isQuickAnalysisOpen, setIsQuickAnalysisOpen] = useState(false);
  const [selectedQuickType, setSelectedQuickType] = useState<string | null>(null);

  // Location Search States
  const [locationQuery, setLocationQuery] = useState('');
  const [locationResults, setLocationResults] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);

  // Create an Axios instance
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api/v1',
    headers: { 'Authorization': `Bearer ${token}` }
  });

  // --- API Fetching ---
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await api.get('/clients/');
        if (response.data.success) {
          setClients(response.data.data);
        }
      } catch (error) {
        console.error("Celestial connection failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) fetchClients();
  }, [token]);

  // --- Location Search Handler ---
  useEffect(() => {
    const searchLocation = async () => {
      if (locationQuery.length < 3) return;
      setIsSearchingLocation(true);
      try {
        // Using Nominatim (OpenStreetMap) for free geocoding
        const res = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${locationQuery}`);
        setLocationResults(res.data);
      } catch (err) {
        console.error("Location search failed", err);
      } finally {
        setIsSearchingLocation(false);
      }
    };

    const timeoutId = setTimeout(searchLocation, 800);
    return () => clearTimeout(timeoutId);
  }, [locationQuery]);

  // --- Handlers ---
  const handleCreateClient = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedLocation) return alert("Please select a valid location from the dropdown");

    const formData = new FormData(e.currentTarget);
    
    // Automatic TZ Fetch (Simplified for frontend)
    // Note: In production, use a library like 'tz-lookup' or a Google Timezone API
    const timezone = 5.5; // Defaulting to IST or calculate based on Lon

    const clientPayload = {
      name: formData.get('name'),
      dob: formData.get('dob'),
      tob: formData.get('tob'),
      pob: selectedLocation.display_name,
      lat: parseFloat(selectedLocation.lat),
      lon: parseFloat(selectedLocation.lon),
      tz: timezone,
      primaryConcern: formData.get('issue'),
    };

    try {
      const response = await api.post('/clients/', clientPayload);
      if (response.data.success) {
        setClients([response.data.data, ...clients]);
        setSelectedClient(response.data.data);
        setActiveTab((formData.get('initialAnalysis') as AnalysisType) || 'Kundli');
        setActiveModal(null);
        setSelectedLocation(null);
      }
    } catch (err) {
      console.error("Failed to onboard client:", err);
    }
  };

  const handleQuickAnalyse = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setQuickData({
      name: formData.get('name'),
      dob: formData.get('dob'),
      tob: formData.get('tob'),
      pob: selectedLocation?.display_name,
      type: selectedQuickType
    });
    setActiveTab('QuickResult');
    setActiveModal(null);
  };

  // --- View Logic ---
  const viewContent = useMemo(() => {
    if (activeTab === 'QuickResult') return <QuickAnalysisResult data={quickData} />;
    if (activeTab === 'Dashboard') {
      return (
        <div className="space-y-8 animate-in fade-in duration-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard icon={<Users />} label="Total Clients" value={clients.length} color="text-blue-400" />
            <StatsCard icon={<Activity />} label="Sessions Today" value="12" color="text-orange-500" />
            <StatsCard icon={<Star />} label="Premium Status" value="Elite" color="text-emerald-400" />
          </div>
          <ClientManagement clients={clients} isLoading={isLoading} onSelectClient={(client) => { setSelectedClient(client); setActiveTab('Kundli'); }} />
        </div>
      );
    }
    if (activeTab === 'Clients' || !selectedClient) {
      return <ClientManagement clients={clients} isLoading={isLoading} onSelectClient={(client) => { setSelectedClient(client); setActiveTab('Kundli'); }} />;
    }
    switch (activeTab) {
      case 'Kundli': return <KundliView clientData={selectedClient} />;
      case 'Vastu': return <VastuView clientData={selectedClient} />;
      case 'Palm Reading': return <PalmReadingView clientData={selectedClient} />;
      case 'Chat': return <ChatView clientContext={selectedClient} />;
      default: return <ClientManagement clients={clients} isLoading={isLoading} onSelectClient={() => { }} />;
    }
  }, [activeTab, selectedClient, quickData, clients, isLoading]);

  return (
    <ProtectedRoute>
      <main className="flex min-h-screen bg-[#050608] text-slate-200 overflow-hidden font-sans selection:bg-orange-500/30">
        <Sidebar activeTab={activeTab} setActiveTab={(t: any) => setActiveTab(t)} isClientSelected={!!selectedClient} />

        <div className="flex-1 relative z-10 h-screen overflow-y-auto custom-scrollbar scroll-smooth">
          <header className="sticky top-0 z-30 px-8 lg:px-12 py-5 bg-[#050608]/60 backdrop-blur-xl border-b border-white/[0.03] flex items-center justify-between">
            <div className="flex flex-col">
              <h1 className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em] mb-1 italic">
                {activeTab === 'QuickResult' ? 'Instant Session' : 'Active View'}
              </h1>
              <span className="text-lg font-black text-white uppercase tracking-tighter italic">{activeTab}</span>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={() => setActiveModal('quick')} className="flex items-center gap-2 px-5 py-2.5 border-orange-600 border-2 hover:border-orange-300 animate text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95">
                <Sparkle size={14} /> Quick Analysis
              </button>
              <button onClick={() => setActiveModal('newClient')} className="flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95">
                <UserPlus size={14} /> New Client
              </button>
            </div>
          </header>

          <div className="p-8 lg:p-12 max-w-7xl mx-auto">{viewContent}</div>
        </div>

        {/* --- ONBOARDING MODAL --- */}
        {activeModal === 'newClient' && (
          <Modal title="Onboard New Client" onClose={() => { setActiveModal(null); setLocationResults([]); }}>
            <form onSubmit={handleCreateClient} className="space-y-4">
              <Input label="Client Name" name="name" placeholder="Legal Name" required />
              
              <div className="grid grid-cols-2 gap-4">
                <Input label="Date of Birth" name="dob" type="date" required />
                <Input label="Time of Birth" name="tob" type="time" required />
              </div>

              {/* Location Dropdown Selection */}
              <div className="flex flex-col gap-2 relative">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Place of Birth</label>
                <div className="relative group">
                  <MapPin size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-orange-500" />
                  <input 
                    type="text"
                    value={selectedLocation ? selectedLocation.display_name : locationQuery}
                    onChange={(e) => {
                      setLocationQuery(e.target.value);
                      if (selectedLocation) setSelectedLocation(null);
                    }}
                    placeholder="Search city/town..."
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-xs outline-none focus:border-orange-500 transition-all"
                    required
                  />
                  {isSearchingLocation && <Loader2 size={14} className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-orange-500" />}
                </div>

                {locationResults.length > 0 && !selectedLocation && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-[#0d0f14] border border-white/10 rounded-2xl overflow-hidden z-[110] shadow-2xl max-h-48 overflow-y-auto">
                    {locationResults.map((loc, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedLocation(loc)}
                        className="w-full text-left px-4 py-3 text-[10px] text-white/60 hover:bg-white/5 hover:text-white border-b border-white/5 last:border-0"
                      >
                        {loc.display_name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1">Context / Primary Concern</label>
                <textarea name="issue" required className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-xs focus:border-orange-500 outline-none min-h-[80px] transition-all" placeholder="Enter primary concern..." />
              </div>

              <button type="submit" className="w-full py-4 bg-orange-600 rounded-2xl font-black uppercase tracking-widest text-[11px] mt-2 shadow-xl hover:bg-orange-500 transition-all active:scale-[0.98]">
                Create & Save Profile
              </button>
            </form>
          </Modal>
        )}
      </main>
    </ProtectedRoute>
  );
}

// --- Shared Internal Components ---
function Modal({ title, children, onClose }: any) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-sm bg-black/80">
      <div className="bg-[#0d0f14] border border-white/10 w-full max-w-lg rounded-[40px] p-8 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 text-white/40 hover:text-white transition-colors"><X size={20} /></button>
        <h2 className="text-xl font-black tracking-tighter uppercase italic text-white/90 mb-8">{title}</h2>
        {children}
      </div>
    </div>
  );
}

function Input({ label, ...props }: any) {
  return (
    <div className="flex flex-col gap-2 group">
      <label className="text-[10px] font-black uppercase tracking-widest text-white/30 ml-1 group-focus-within:text-orange-500 transition-colors">{label}</label>
      <input {...props} className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-xs focus:border-orange-500 outline-none transition-all" />
    </div>
  );
}

function StatsCard({ icon, label, value, color }: any) {
  return (
    <div className="bg-white/[0.02] border border-white/[0.05] p-6 rounded-[32px] hover:border-white/10 transition-all group">
      <div className={`w-10 h-10 rounded-2xl bg-white/[0.03] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${color}`}>{icon}</div>
      <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-3xl font-black text-white italic tracking-tighter">{value}</p>
    </div>
  );
}