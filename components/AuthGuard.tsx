"use client";

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthContext } from './AuthProvider';

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuthContext();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && !user && pathname !== '/login') {
            router.push('/login');
        }
    }, [user, loading, pathname, router]);

    // Show nothing while checking session OR if redirecting to login
    if (loading || (!user && pathname !== '/login')) {
        return (
            <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return <>{children}</>;
}
