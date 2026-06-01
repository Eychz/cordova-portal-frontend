import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Shield, FileText, Users, UserCheck, Package, Siren } from 'lucide-react';

interface DashboardSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ isOpen, onClose }) => {
    const router = useRouter();
    const pathname = usePathname() || '';
    const activeTab = pathname.includes('/posts') ? 'posts' :
                      pathname.includes('/services') ? 'services' :
                      pathname.includes('/users') ? 'users' :
                      pathname.includes('/verification') ? 'verification' :
                      pathname.includes('/officials') ? 'officials' :
                      pathname.includes('/emergencies') ? 'emergencies' : 'overview';

    const menuItems = [
        { id: 'overview', label: 'Dashboard', icon: Shield },
        { id: 'posts', label: 'Content Management', icon: FileText },
        { id: 'users', label: 'Citizen Registry', icon: Users },
        { id: 'verification', label: 'Verifications', icon: UserCheck },
        { id: 'services', label: 'LGU Services', icon: Package },
        { id: 'officials', label: 'LGU Officials', icon: Users },
        { id: 'emergencies', label: 'Emergency Hotlines', icon: Siren },
    ];

    return (
        <aside className={`w-72 bg-red-950 text-white flex-shrink-0 flex flex-col z-50 border-r border-red-900 fixed lg:static inset-y-0 left-0 transform ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
            
            <div className="p-8 border-b border-red-900/50 flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Shield className="w-8 h-8 text-white" />
                        <h1 className="text-xl font-black tracking-tighter uppercase text-white">Admin Panel</h1>
                    </div>
                    <p className="text-[10px] font-bold text-red-200 uppercase tracking-widest">Cordova Portal</p>
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

            <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                {menuItems.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => {
                            router.push(`/admin/dashboard/${tab.id}`);
                            onClose();
                        }}
                        className={`w-full flex items-center gap-4 px-6 py-4 font-bold text-sm transition-all duration-200 border-l-4 ${
                            activeTab === tab.id
                                ? 'bg-red-900 border-white text-white'
                                : 'border-transparent text-red-200 hover:text-white hover:bg-red-900/50'
                        }`}
                    >
                        <tab.icon className="w-5 h-5" />
                        {tab.label}
                    </button>
                ))}
            </nav>

            <div className="p-6 border-t border-red-900/50">
                <button 
                    onClick={() => {
                        router.push('/home');
                        onClose();
                    }}
                    className="w-full py-3 border border-red-800 text-red-200 hover:text-white hover:border-white transition-all text-xs font-bold uppercase tracking-widest hover:bg-red-900"
                >
                    Back to Portal
                </button>
            </div>
        </aside>
    );
};

export default DashboardSidebar;
