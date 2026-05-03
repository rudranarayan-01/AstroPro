"use client";
import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, Sparkles, ArrowRight, Loader2, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext'; // Path to your context

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form States
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  });

  const { login } = useAuth();
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000/api/v1';

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null); // Clear error on typing
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setError(null);

  const endpoint = isLogin ? '/auth/login' : '/auth/register';
  
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Celestial alignment failed. Check your credentials.');
    }

    // Extraction based on your specific backend structure
    const token = result.session.access_token;
    const userData = {
      id: result.user.id,
      email: result.user.email,
      name: result.user.user_metadata.full_name,
    };

    // Save to AuthContext
    login(token, userData);
    
  } catch (err: any) {
    setError(err.message);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="relative min-h-screen w-full bg-[#02040a] flex items-center justify-center p-6 overflow-hidden font-sans selection:bg-orange-500/30">
      
      {/* --- ASTROLOGICAL BACKGROUND LAYER --- */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] opacity-[0.04] animate-slow-spin">
            {[...Array(24)].map((_, i) => (
                <div 
                    key={i} 
                    className="absolute top-1/2 left-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white to-transparent origin-center"
                    style={{ transform: `translate(-50%, -50%) rotate(${i * 15}deg)` }}
                />
            ))}
            <div className="absolute inset-0 border border-white rounded-full scale-[1.0]" />
            <div className="absolute inset-0 border border-white rounded-full scale-[0.7] border-dashed" />
            <div className="absolute inset-0 border border-white rounded-full scale-[0.4]" />
        </div>

        {mounted && (
          <div className="absolute inset-0">
              {[...Array(40)].map((_, i) => (
                  <div 
                      key={i}
                      className="absolute w-[2px] h-[2px] bg-orange-400 rounded-full animate-twinkle"
                      style={{ 
                          top: `${(i * 19) % 100}%`,
                          left: `${(i * 23) % 100}%`,
                          animationDelay: `${(i * 0.3) % 5}s`,
                          opacity: 0.4
                      }}
                  />
              ))}
          </div>
        )}

        <div className="absolute top-[-10%] left-[-5%] w-[50%] h-[50%] bg-orange-600/[0.08] blur-[140px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-blue-600/[0.08] blur-[140px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* --- AUTH CARD --- */}
      <div className="relative z-10 w-full max-w-[440px]">
        <div className="relative bg-[#0a0c14]/40 backdrop-blur-3xl border border-white/[0.08] rounded-[48px] p-10 md:p-14 shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden">
          
          {/* Status Indicator */}
          <div className="absolute top-8 right-10">
             {isLoading ? (
               <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />
             ) : (
               <ShieldCheck className="w-5 h-5 text-white/10" />
             )}
          </div>

          {/* Header */}
          <div className="text-center mb-10">
            <div className="relative inline-flex items-center justify-center w-20 h-20 mb-8 group">
                <div className="absolute inset-0 border border-orange-500/20 rounded-full animate-spin-slow group-hover:border-orange-500/50 transition-colors" />
                <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-500 to-orange-700 flex items-center justify-center shadow-[0_0_40px_rgba(249,115,22,0.3)]">
                    <Sparkles className="text-white w-7 h-7" />
                </div>
            </div>
            
            <h1 className="text-4xl font-black tracking-tighter text-white mb-3 italic">
              {isLogin ? 'ASCEND' : 'EVOLVE'}
            </h1>
            <div className="flex items-center justify-center gap-2">
                <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-orange-500/50" />
                <p className="text-orange-500/60 text-[10px] font-bold tracking-[0.3em] uppercase">
                  {isLogin ? 'Portal to Cosmos' : 'Sign New Contract'}
                </p>
                <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-orange-500/50" />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <p className="text-red-400 text-[10px] font-bold leading-tight tracking-wider uppercase">{error}</p>
            </div>
          )}

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="group relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-orange-500 transition-colors" />
                <input
                  name="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="NOM DE PLUME (FULL NAME)"
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl py-4 pl-12 pr-4 text-[11px] font-bold tracking-widest text-white placeholder:text-white/10 focus:outline-none focus:border-orange-500/40 focus:bg-white/[0.05] transition-all uppercase"
                />
              </div>
            )}

            <div className="group relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-orange-500 transition-colors" />
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="EMAIL OR USERNAME"
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl py-4 pl-12 pr-4 text-[11px] font-bold tracking-widest text-white placeholder:text-white/10 focus:outline-none focus:border-orange-500/40 focus:bg-white/[0.05] transition-all uppercase"
              />
            </div>

            <div className="group relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-orange-500 transition-colors" />
              <input
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="PASSWORD OR CRYPTIC KEY"
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl py-4 pl-12 pr-4 text-[11px] font-bold tracking-widest text-white placeholder:text-white/10 focus:outline-none focus:border-orange-500/40 focus:bg-white/[0.05] transition-all uppercase"
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="group relative w-full h-14 mt-6 overflow-hidden rounded-2xl bg-orange-600 transition-all active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-700" />
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <span className="relative flex items-center justify-center gap-3 text-white font-black uppercase tracking-[0.25em] text-[11px]">
                  {isLoading ? 'Processing...' : (isLogin ? 'Initiate Link' : 'Forge Path')}
                  {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                </span>
            </button>
          </form>

          {/* Toggle Access */}
          <div className="text-center mt-12">
              <button 
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError(null);
                }}
                className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-orange-500 transition-all border-b border-transparent hover:border-orange-500/50 pb-1"
              >
                {isLogin ? 'Create New Reality' : 'Return to Core'}
              </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slow-spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.5); }
        }
        .animate-slow-spin {
          animation: slow-spin 180s linear infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
        .animate-twinkle {
          animation: twinkle 5s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}