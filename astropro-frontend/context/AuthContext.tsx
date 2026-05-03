"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
interface Astrologer {
    id: string;
    name: string;
    email: string;
}
interface AuthContextType {
    user: Astrologer | null;
    token: string | null;
    loading: boolean;
    login: (token: string, userData: Astrologer) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<Astrologer | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // 1. Wrap in a try-catch to prevent "undefined" crashes
        try {
            const storedToken = localStorage.getItem('astro_token');
            const storedUser = localStorage.getItem('astro_user');

            // 2. Only parse if the string actually exists and isn't the literal string "undefined"
            if (storedToken && storedUser && storedUser !== "undefined") {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Failed to parse celestial session:", error);
            // Clear corrupted storage if necessary
            localStorage.removeItem('astro_token');
            localStorage.removeItem('astro_user');
        } finally {
            setLoading(false);
        }
    }, []);

    const login = (newToken: string, userData: Astrologer) => {
        localStorage.setItem('astro_token', newToken);
        localStorage.setItem('astro_user', JSON.stringify(userData));
        setToken(newToken);
        setUser(userData);
        router.push('/dashboard');
    };

    const logout = () => {
        localStorage.removeItem('astro_token');
        localStorage.removeItem('astro_user');
        setToken(null);
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};