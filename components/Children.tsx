'use client'
import React, { useEffect } from 'react'
import { useAuth } from "@/lib/AuthContext";
import { LinkProvider } from "@/lib/LinkContext";
import { SidebarProvider } from "@/lib/SidebarContext";
import { AuthProvider } from "@/lib/AuthContext";
import Sidebar from "@/components/Sidebar";
import TopNav from "@/components/TopNav";
import { useRouter, usePathname } from 'next/navigation';

function Children({ children }: { children: React.ReactNode }) {
    const { session, user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname()

    console.log(pathname);

    // useEffect(() => {
    //     if (!session) {
    //         router.push("/login");
    //     }
    //     console.log('called');

    // }, [router]);

    if (!session) {
        return children
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