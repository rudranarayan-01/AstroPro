// components/dashboard/ReportHeader.tsx
import { Share2, Download, MessageCircle, Bell } from 'lucide-react';

export default function ReportHeader() {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Kundli Report — <span className="text-orange-500">Priya Rajan</span></h2>
        <p className="text-white/30 text-xs tracking-wider">LATEST CALCULATION: MAY 02, 2026</p>
      </div>
      
      <div className="flex items-center gap-3">
        <button className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] text-white/60 hover:text-white transition-colors"><Share2 size={18}/></button>
        <button className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] text-white/60 hover:text-white transition-colors"><Download size={18}/></button>
        <button className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-orange-900/20">
          <MessageCircle size={18}/> Chat with Expert
        </button>
        <div className="relative p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
          <Bell size={18} className="text-white/60" />
          <div className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full border-2 border-[#02040a]" />
        </div>
      </div>
    </div>
  );
}