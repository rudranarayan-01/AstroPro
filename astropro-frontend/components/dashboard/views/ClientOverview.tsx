export function ClientOverview({ client }: { client: any }) {
  const activities = [
    { type: 'Kundli', date: 'May 01, 2026', note: 'Analyzed Saturn Dasha impact' },
    { type: 'Vastu', date: 'April 20, 2026', note: 'Kitchen correction suggested' },
    { type: 'Chat', date: 'Yesterday', note: 'Query regarding career transition' },
  ];

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Bio & Details */}
      <div className="col-span-12 lg:col-span-4 space-y-6">
        <div className="bg-[#0d0f14]/60 border border-white/[0.05] rounded-[32px] p-8">
          <h3 className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-6">Client Details</h3>
          <div className="space-y-4">
            <DetailRow label="DOB" value="14 April 1996" />
            <DetailRow label="TOB" value="08:30 AM" />
            <DetailRow label="Place" value="Mumbai, MH" />
            <DetailRow label="Language" value="Hindi / English" />
          </div>
        </div>
      </div>

      {/* Analysis History Timeline */}
      <div className="col-span-12 lg:col-span-8 bg-[#0d0f14]/60 border border-white/[0.05] rounded-[32px] p-8 relative overflow-hidden">
        {/* Background Astrology Wheel Accent */}
        <div className="absolute -right-20 -bottom-20 w-64 h-64 border border-orange-500/5 rounded-full animate-slow-spin" />
        
        <h3 className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-6">Analysis History</h3>
        <div className="space-y-6 relative z-10">
          {activities.map((act, i) => (
            <div key={i} className="flex gap-4 group">
              <div className="w-px bg-white/10 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-orange-500 rounded-full" />
              </div>
              <div className="pb-6">
                <p className="text-[10px] font-black text-orange-500 uppercase">{act.type} • {act.date}</p>
                <p className="text-sm text-white/60 mt-1">{act.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DetailRow({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between border-b border-white/5 pb-3">
      <span className="text-[11px] font-bold text-white/30 uppercase">{label}</span>
      <span className="text-sm font-medium text-white">{value}</span>
    </div>
  );
}