"use client";
import React, { useState } from 'react';
import { 
  Globe, 
  Search, 
  ChevronRight, 
  MoreVertical, 
  User, 
  Calendar, 
  Clock, 
  MapPin,
  Filter,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Interface matching your backend response
interface Client {
  id: string;
  name: string;
  dob: string;
  tob: string;
  pob: string;
  primary_concern: string;
  created_at: string;
}

interface ClientManagementProps {
  clients: Client[];
  isLoading: boolean;
  onSelectClient: (client: Client) => void;
}

export default function ClientManagement({ clients, isLoading, onSelectClient }: ClientManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [language, setLanguage] = useState('English');

  // Filter logic for search
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.primary_concern.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10">
      {/* Header & Controls: High-Refractive Glass Design */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-1"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-8 bg-orange-600 rounded-full" />
            <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">
              Client <span className="text-orange-500">Vault</span>
            </h2>
          </div>
          <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.3em] ml-5">
            Synchronizing with {clients.length} cosmic profiles
          </p>
        </motion.div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Premium Search Bar */}
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-orange-500 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search by name or destiny..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/[0.03] border border-white/[0.08] rounded-2xl py-3 pl-12 pr-4 text-[11px] font-bold text-white focus:outline-none focus:border-orange-500/40 w-full md:w-72 transition-all backdrop-blur-md placeholder:text-white/10"
            />
          </div>

          {/* Language / Filter Pill */}
          <div className="flex items-center bg-white/[0.03] border border-white/[0.08] rounded-2xl px-4 py-3 gap-3 backdrop-blur-md">
            <Globe size={14} className="text-orange-500" />
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent text-[10px] font-black text-white outline-none cursor-pointer uppercase tracking-widest"
            >
              <option value="English" className="bg-[#0d0f14]">English</option>
              <option value="Hindi" className="bg-[#0d0f14]">Hindi</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            // Premium Skeleton Loaders
            [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
          ) : filteredClients.length > 0 ? (
            filteredClients.map((client, index) => (
              <ClientCard 
                key={client.id} 
                client={client} 
                index={index} 
                onClick={() => onSelectClient(client)} 
              />
            ))
          ) : (
            <EmptyState />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* --- Sub-Components --- */

function ClientCard({ client, index, onClick }: { client: Client, index: number, onClick: () => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      onClick={onClick}
      className="group relative bg-[#0d0f14]/40 backdrop-blur-2xl border border-white/[0.05] rounded-[40px] p-8 cursor-pointer hover:border-orange-500/40 transition-all overflow-hidden"
    >
      {/* Decorative Background Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-600/5 blur-[80px] group-hover:bg-orange-600/10 transition-all" />

      <div className="flex justify-between items-start mb-8 relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xl font-black shadow-2xl shadow-orange-950/40 group-hover:scale-110 transition-transform duration-500">
          {client.name.charAt(0)}
        </div>
        <button className="p-2 text-white/10 hover:text-white transition-colors">
          <MoreVertical size={20} />
        </button>
      </div>

      <div className="space-y-1 mb-6 relative z-10">
        <h3 className="text-xl font-black text-white group-hover:text-orange-500 transition-colors tracking-tight italic uppercase">
          {client.name}
        </h3>
        <div className="flex items-center gap-2 text-[10px] font-bold text-white/20 uppercase tracking-widest">
          <Calendar size={12} /> {new Date(client.dob).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
      </div>

      <div className="space-y-3 mb-8 relative z-10">
        <div className="flex items-center gap-3 text-white/40">
          <MapPin size={14} className="text-orange-500/50" />
          <span className="text-[11px] font-medium truncate">{client.pob || 'Unknown Realm'}</span>
        </div>
        <p className="text-[11px] leading-relaxed text-white/60 line-clamp-2 font-medium italic">
          "{client.primary_concern}"
        </p>
      </div>

      <div className="pt-6 border-t border-white/[0.05] flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Active Trace</span>
        </div>
        <div className="flex items-center gap-1 text-orange-500 text-[10px] font-black uppercase tracking-widest group-hover:gap-2 transition-all">
          Analyze <ChevronRight size={14} />
        </div>
      </div>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white/[0.02] border border-white/[0.05] rounded-[40px] p-8 animate-pulse">
      <div className="w-14 h-14 bg-white/5 rounded-2xl mb-8" />
      <div className="w-2/3 h-5 bg-white/5 rounded-md mb-2" />
      <div className="w-1/2 h-3 bg-white/5 rounded-md mb-8" />
      <div className="space-y-3 mb-8">
        <div className="w-full h-3 bg-white/5 rounded-md" />
        <div className="w-full h-3 bg-white/5 rounded-md" />
      </div>
      <div className="pt-6 border-t border-white/[0.05] flex justify-between">
        <div className="w-20 h-3 bg-white/5 rounded-md" />
        <div className="w-16 h-3 bg-white/5 rounded-md" />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="col-span-full py-24 flex flex-col items-center justify-center text-center space-y-6"
    >
      <div className="w-20 h-20 bg-white/[0.02] rounded-full flex items-center justify-center text-white/10 border border-white/[0.05]">
        <User size={40} strokeWidth={1} />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-black text-white/60 uppercase tracking-widest">No Cosmic Records Found</h3>
        <p className="text-xs text-white/20 font-medium">Clear your filters or onboard a new traveler to the system.</p>
      </div>
    </motion.div>
  );
}