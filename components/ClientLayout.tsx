"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { AuthProvider } from "@/components/AuthProvider";
import { AuthGuard } from "@/components/AuthGuard";
import MobileNav from "@/components/MobileNav";

export function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLoginPage = pathname === "/login";

    return (
        <AuthProvider>
            <AuthGuard>
                {isLoginPage ? (
                    <main className="w-full min-h-screen">
                        {children}
                    </main>
                ) : (
                    <div className="layout-wrapper">
                        <Sidebar />
                        <main className="main-content">
                            {children}
                        </main>
                        <MobileNav />
                    </div>
                )}
            </AuthGuard>
        </AuthProvider>
    );
}
