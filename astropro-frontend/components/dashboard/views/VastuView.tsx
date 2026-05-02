// components/dashboard/views/VastuView.tsx
export default function VastuView() {
  const mockVastuData = [
    { zone: 'North East', status: 'Positive', impact: 'Wealth & Health' },
    { zone: 'South West', status: 'Correction Needed', impact: 'Stability' },
    { zone: 'Center (Brahmasthan)', status: 'Clear', impact: 'Peace' }
  ];

  return (
    <div className="grid grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="col-span-12 lg:col-span-8 bg-[#0d0f14]/50 border border-white/[0.05] rounded-[32px] p-8 relative overflow-hidden">
        {/* Module-Specific Astrology Background */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 opacity-10">
            <div className="w-full h-full border-2 border-orange-500 rounded-full animate-spin-slow" />
        </div>

        <h3 className="text-xl font-bold mb-6">Property Vastu Map</h3>
        <div className="grid grid-cols-3 gap-4">
          {mockVastuData.map((d) => (
            <div key={d.zone} className="bg-white/[0.02] border border-white/[0.05] p-6 rounded-2xl">
              <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-2">{d.zone}</p>
              <h4 className="text-lg font-bold mb-1">{d.status}</h4>
              <p className="text-xs text-white/40">{d.impact}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="col-span-12 lg:col-span-4 bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20 rounded-[32px] p-8">
        <h3 className="font-bold mb-4">Quick Remedies</h3>
        <ul className="space-y-4 text-sm text-white/60">
          <li className="flex items-start gap-2">
            <span className="text-orange-500 mt-1">•</span> 
            Place a crystal in the NE corner to enhance flow.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-500 mt-1">•</span> 
            Keep the center of the house clutter-free.
          </li>
        </ul>
      </div>
    </div>
  );
}