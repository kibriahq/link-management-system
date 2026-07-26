'use client'
import React from 'react'
import { useAuth } from "@/lib/AuthContext";
import { SidebarProvider } from "@/lib/SidebarContext";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import { useRouter, usePathname } from 'next/navigation';
import LoadingScreen from './LoadingScreen';

function Children({ children }: { children: React.ReactNode }) {
    const { session, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname()

    if (loading) {
        return <LoadingScreen />
    }

    
    if(pathname.startsWith('/r/')) {
        console.log('Yes');
        
        return children;
    }

    if (!session) {
        if (pathname === '/login' || pathname === '/signup') {
            return children
        } else {
            router.push('/login');
            return;
        }
    } else {
        if (pathname === '/login' || pathname === '/signup') {
            router.push('/');
        }
        return (
            <SidebarProvider>
                <Sidebar />
                <TopNav />
                <main className="lg:ml-[240px] pt-16 min-h-screen bg-[#f8f9ff]">
                    <div className="max-w-[1440px] mx-auto p-4 lg:p-8">
                        {children}
                    </div>
                </main>
            </SidebarProvider>
        )
    }

}

export default Children