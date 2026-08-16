'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import toast from 'react-hot-toast';
import { verifySession } from '@/lib/apiClient';
import { normalizeRole } from '@/lib/rbac';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            const userStr = localStorage.getItem('user');

            if (!token || !userStr) {
                if (pathname.startsWith('/admin')) {
                    toast.error('Authentication required. Please login.');
                    router.push('/auth/login');
                }
                setLoading(false);
                return;
            }

            try {
                // Real-time verification with the backend
                const user = await verifySession();
                const role = normalizeRole(user.role);

                // Allow authorized roles
                if (!['PIO', 'ADMIN', 'SUPERADMIN'].includes(role)) {
                    toast.error('Access denied. Administrator privileges required.');
                    router.push('/');
                    setLoading(false);
                    return;
                }

                setIsAuthorized(true);
            } catch (err) {
                console.error('Session verification failed:', err);
                toast.error('Session expired. Please login again.');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                router.push('/auth/login');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [router, pathname]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-white dark:bg-[#0a0a0a]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-red-700 border-t-transparent animate-spin rounded-full"></div>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest animate-pulse">
                        Verifying Secure Session...
                    </p>
                </div>
            </div>
        );
    }

    if (!isAuthorized) {
        return null;
    }

    return <>{children}</>;
}
