import { CosmicBackground } from "@/components/CosmicBackground";
import AstroProLanding from "@/components/Landing";

export default function Home() {
  return (
    // Ensure the root container is dark to prevent "white flashes" on load
    <div className="relative min-h-screen bg-[#020617] selection:bg-orange-500/30 selection:text-orange-200">
      
      {/* 1. HIGH-FIDELITY GRID OVERLAY */}
      <div 
        className="fixed inset-0 -z-40 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #f97316 1px, transparent 1px),
            linear-gradient(to bottom, #f97316 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(circle at center, black, transparent 80%)'
        }}
      />

      {/* 2. ANALOG NOISE TEXTURE (The "Premium" Secret) */}
      <div className="fixed inset-0 -z-30 pointer-events-none opacity-[0.02] mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />

      {/* 3. DYNAMIC BACKGROUND LAYER */}
      <CosmicBackground />

      {/* 4. CONTENT LAYER */}
      <main className="relative z-10 w-full overflow-x-hidden">
        <AstroProLanding />
      </main>

      {/* 5. GLOBAL SCROLL GLOW (Optional: Subtle glow that follows scroll) */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-orange-600/10 blur-[120px] -z-20 pointer-events-none" />
    </div>
  );
}