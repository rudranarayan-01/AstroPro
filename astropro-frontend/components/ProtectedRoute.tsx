"use client";
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // If not logged in, boot them to login
        router.replace('/login');
      } else {
        // If logged in, allow the render
        setIsAuthorized(true);
      }
    }
  }, [user, loading, router]);

  // While checking auth status, show the celestial loader
  if (loading || !isAuthorized) {
    return (
      <div className="h-screen w-full bg-[#02040a] flex items-center justify-center">
         <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-2 border-orange-500/20 rounded-full animate-ping" />
            <div className="absolute inset-0 border-t-2 border-orange-500 rounded-full animate-spin" />
         </div>
      </div>
    );
  }

  return <>{children}</>;
}