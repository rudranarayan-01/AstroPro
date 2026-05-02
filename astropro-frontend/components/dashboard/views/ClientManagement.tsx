// components/dashboard/views/ClientManagement.tsx
"use client";
import React, { useState } from 'react';
import { Users, Search, Globe, ChevronRight, Star, MoreVertical } from 'lucide-react';

// Mock Client Data
const MOCK_CLIENTS = [
  { id: '1', name: 'Priya Rajan', rashi: 'Mithuna', lagna: 'Mesha', status: 'Pro', lastActive: '2 mins ago' },
  { id: '2', name: 'Arjun Mehta', rashi: 'Simha', lagna: 'Vrishabha', status: 'Basic', lastActive: '1 hour ago' },
  { id: '3', name: 'Sanya Iyer', rashi: 'Kanya', lagna: 'Kumbha', status: 'Pro', lastActive: 'Yesterday' },
];

export default function ClientManagement({ onSelectClient }: { onSelectClient: (client: any) => void }) {
  const [language, setLanguage] = useState('English');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="animate-in fade-in duration-700 space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white italic tracking-tight">CLIENT <span className="text-orange-500">VAULT</span></h2>
          <p className="text-xs text-white/40 font-bold uppercase tracking-widest mt-1">Manage cosmic profiles</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <div className="flex items-center bg-white/[0.03] border border-white/[0.08] rounded-2xl px-4 py-2 gap-3">
            <Globe size={16} className="text-orange-500" />
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent text-xs font-bold text-white outline-none cursor-pointer uppercase tracking-tighter"
            >
              <option value="English" className="bg-[#0d0f14]">English</option>
              <option value="Hindi" className="bg-[#0d0f14]">Hindi</option>
              <option value="Sanskrit" className="bg-[#0d0f14]">Sanskrit</option>
            </select>
          </div>
          
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
            <input 
              type="text" 
              placeholder="Search Client..."
              className="bg-white/[0.03] border border-white/[0.08] rounded-2xl py-2 pl-12 pr-4 text-xs text-white focus:outline-none focus:border-orange-500/40 w-64"
            />
          </div>
        </div>
      </div>

      {/* Client List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_CLIENTS.map((client) => (
          <div 
            key={client.id}
            onClick={() => onSelectClient(client)}
            className="group relative bg-[#0d0f14]/60 backdrop-blur-md border border-white/[0.05] rounded-[32px] p-6 cursor-pointer hover:border-orange-500/30 transition-all hover:translate-y-[-4px]"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center text-white font-black shadow-lg shadow-orange-900/20">
                {client.name.split(' ').map(n => n[0]).join('')}
              </div>
              <button className="text-white/20 hover:text-white"><MoreVertical size={18}/></button>
            </div>

            <h3 className="text-lg font-bold text-white group-hover:text-orange-500 transition-colors">{client.name}</h3>
            <div className="flex gap-2 mt-2 mb-6">
               <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 bg-white/5 rounded text-white/40">{client.rashi}</span>
               <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 bg-orange-500/10 rounded text-orange-500">{client.status} Plan</span>
            </div>

            <div className="pt-6 border-t border-white/[0.05] flex items-center justify-between">
              <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{client.lastActive}</span>
              <div className="flex items-center gap-1 text-orange-500 text-[10px] font-black uppercase tracking-widest">
                Analyze Chart <ChevronRight size={14} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}