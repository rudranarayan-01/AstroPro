// components/dashboard/Sidebar.tsx
export default function Sidebar({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) {
  const navItems = [
    { group: 'MAIN', items: ['Dashboard', 'Kundli', 'Vastu', 'Palm Reading', 'Chat'] },
    // ... rest of your items
  ];

  return (
    <aside className="w-64 bg-[#0d0f14]/80 backdrop-blur-xl border-r border-white/[0.05] p-6 hidden md:flex flex-col">
      <div className="text-xl font-black mb-12 flex items-center gap-2">
        <div className="w-6 h-6 bg-orange-500 rounded shadow-[0_0_15px_rgba(249,115,22,0.5)]" />
        ASTRO<span className="text-orange-500">PRO</span>
      </div>

      <nav className="space-y-8">
        {navItems.map((group) => (
          <div key={group.group}>
            <p className="text-[10px] font-bold text-white/20 tracking-widest mb-4">{group.group}</p>
            {group.items.map((item) => (
              <button
                key={item}
                onClick={() => setActiveTab(item)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all mb-1 ${
                  activeTab === item 
                  ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20 font-bold' 
                  : 'text-white/40 hover:text-white hover:bg-white/[0.02]'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
}