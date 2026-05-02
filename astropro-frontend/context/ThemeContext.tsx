"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';

// 1. Define the interface for the context shape
interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

// 2. Initialize with the interface and a sensible default
// Using 'undefined' allows us to catch errors if a component is used outside a Provider
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('astro-theme');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
      localStorage.setItem('astro-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
      localStorage.setItem('astro-theme', 'light');
    }
  }, [isDark, mounted]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <div style={{ visibility: mounted ? 'visible' : 'hidden' }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

// 3. Update the hook to handle the 'undefined' case
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};