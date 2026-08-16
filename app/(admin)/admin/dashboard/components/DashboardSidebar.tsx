'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Shield, FileText, Users, Package, Siren, History, UserCheck, ShieldAlert } from 'lucide-react';
import { hasTabAccess, normalizeRole, ROLE_DEFINITIONS, type AdminRole } from '@/lib/rbac';

interface DashboardSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ isOpen, onClose }) => {
    const router = useRouter();
    const pathname = usePathname() || '';
    const [userRole, setUserRole] = useState<AdminRole>('ADMIN');
    const [userName, setUserName] = useState<string>('');

    useEffect(() => {
        try {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                setUserRole(normalizeRole(user.role));
                setUserName(user.lastName || '');
            }
        } catch { }
    }, []);

    const activeTab = pathname.includes('/posts') ? 'posts' :
        pathname.includes('/services') ? 'services' :
            pathname.includes('/users') ? 'users' :
                pathname.includes('/officials') ? 'officials' :
                    pathname.includes('/emergencies') ? 'emergencies' :
                        pathname.includes('/changelog') ? 'changelog' : 'overview';

    const allMenuItems = [
        { id: 'overview', label: 'Dashboard Overview', icon: Shield },
        { id: 'posts', label: 'Content Management', icon: FileText },
        { id: 'users', label: 'Citizen Registry', icon: Users },
        { id: 'services', label: 'LGU Services', icon: Package },
        { id: 'officials', label: 'LGU Officials', icon: Users },
        { id: 'emergencies', label: 'Emergency Hotlines', icon: Siren },
        { id: 'changelog', label: 'Change Logs', icon: History },
    ];

    // Filter menu items dynamically according to active session user's role
    const authorizedMenuItems = allMenuItems.filter(item => hasTabAccess(userRole, item.id));
    const roleConfig = ROLE_DEFINITIONS[userRole];

    return (
        <aside className={`w-72 bg-red-950 text-white flex-shrink-0 flex flex-col z-50 border-r border-red-900 fixed lg:static inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
            } lg:translate-x-0 transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none`}>

            {/* Header / Brand */}
            <div className="p-6 border-b border-red-900/50 flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-1.5">
                        <div className="w-8 h-8 rounded bg-red-800 border border-red-700 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-lg font-black tracking-tighter uppercase text-white">e-Cordova Admin</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded border ${roleConfig.badgeColor}`}>
                            {userRole}
                        </span>
                        <span className="text-[10px] text-red-300/80 font-medium truncate max-w-[120px]">
                            {roleConfig.label}
                        </span>
                    </div>
                </div>

                {/* Mobile close button */}
                <button
                    onClick={onClose}
                    className="p-2 lg:hidden text-red-200 hover:text-white"
                    aria-label="Close Sidebar"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5">
                <div className="px-3 pb-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-red-300/60">Navigation</p>
                </div>
                {authorizedMenuItems.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => {
                            router.push(`/admin/dashboard/${tab.id}`);
                            onClose();
                        }}
                        className={`w-full flex items-center gap-3.5 px-4 py-3 font-bold text-xs uppercase tracking-wider transition-all duration-200 rounded-lg border ${activeTab === tab.id
                            ? 'bg-red-800 border-red-600 text-white shadow-inner font-black'
                            : 'border-transparent text-red-200/90 hover:text-white hover:bg-red-900/60 hover:border-red-800/50'
                            }`}
                    >
                        <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-white' : 'text-red-300'}`} />
                        {tab.label}
                    </button>
                ))}
            </nav>

            {/* Active User Footer */}
            <div className="p-4 border-t border-red-900/50 space-y-3 bg-red-950/80">
                <div className="px-2 py-1.5 rounded bg-red-900/40 border border-red-800/40">
                    <p className="text-[9px] uppercase tracking-wider text-red-300/70 font-semibold">Active Session</p>
                    <p className="text-xs font-bold text-white truncate" title={userName}>
                        {userName || 'Cordova Admin'}
                    </p>
                </div>

                <button
                    onClick={() => {
                        router.push('/home');
                        onClose();
                    }}
                    className="w-full py-2.5 px-3 border border-red-800 text-red-200 hover:text-white hover:border-white transition-all text-[11px] font-bold uppercase tracking-widest hover:bg-red-900 rounded"
                >
                    Back to Public Portal
                </button>
            </div>
        </aside>
    );
};

export default DashboardSidebar;
