// components/dashboard/PlanetPositions.tsx
const planets = [
  { name: 'Sun', sign: 'Mesha (Aries)', house: 'H1', color: 'bg-orange-500' },
  { name: 'Moon', sign: 'Mithuna (Gemini)', house: 'H3', color: 'bg-blue-400' },
  { name: 'Mars', sign: 'Makara (Capricorn)', house: 'H10', color: 'bg-red-500' },
  { name: 'Mercury', sign: 'Meena (Pisces)', house: 'H12', color: 'bg-emerald-400', retro: true },
];

export default function PlanetPositions() {
  return (
    <div className="bg-[#0d0f14]/50 border border-white/[0.05] rounded-[32px] p-8 h-full">
      <h3 className="text-xs font-black tracking-[0.2em] text-white/40 uppercase italic mb-8">Planet Positions</h3>
      <div className="space-y-5">
        {planets.map((p) => (
          <div key={p.name} className="flex items-center justify-between group cursor-default">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${p.color} shadow-[0_0_8px_${p.color.replace('bg-', '')}]`} />
              <span className="text-sm font-bold text-white group-hover:text-orange-500 transition-colors">{p.name}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[11px] font-medium text-white/40">{p.sign}</span>
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded bg-white/[0.05] text-[10px] font-black text-white/60">{p.house}</span>
                {p.retro && <span className="text-orange-500 font-bold text-[10px]">R</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}