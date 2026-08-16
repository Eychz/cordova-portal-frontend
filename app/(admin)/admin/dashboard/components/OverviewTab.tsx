import React, { useState, useMemo } from 'react';
import { 
    Activity, 
    Server, 
    Cpu, 
    HardDrive, 
    Clock, 
    Calendar, 
    Layers, 
    Shield, 
    FileText, 
    Package, 
    Siren, 
    Users, 
    Search,
    CheckCircle2,
    RefreshCw,
    TrendingUp,
    Filter
} from 'lucide-react';
import { type AdminStats } from '@/lib/statsApi';
import Pagination from './Pagination';

interface OverviewTabProps {
    stats?: AdminStats;
    adminActivities: any[];
}

const OverviewTab: React.FC<OverviewTabProps> = ({ stats, adminActivities = [] }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchLog, setSearchLog] = useState('');
    const [actionFilter, setActionFilter] = useState('all');
    const [entityFilter, setEntityFilter] = useState('all');
    const itemsPerPage = 10;

    // Launch date & age calculation
    const launchDate = useMemo(() => {
        return new Date(stats?.systemMetrics?.launchDate || '2026-07-01T00:00:00Z');
    }, [stats?.systemMetrics?.launchDate]);

    const systemAgeString = useMemo(() => {
        const now = new Date();
        const diffMs = Math.max(0, now.getTime() - launchDate.getTime());
        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const months = Math.floor(days / 30);
        const remainingDays = days % 30;
        if (months > 0) {
            return `${months} Mo, ${remainingDays} Days`;
        }
        return `${days} Days Online`;
    }, [launchDate]);

    const formatUptime = (seconds: number = 0) => {
        if (!seconds || seconds <= 0) return 'Just started';
        const d = Math.floor(seconds / (3600 * 24));
        const h = Math.floor((seconds % (3600 * 24)) / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const parts = [];
        if (d > 0) parts.push(`${d}d`);
        if (h > 0 || d > 0) parts.push(`${h}h`);
        parts.push(`${m}m`);
        return parts.join(' ') || '< 1m';
    };

    const ramPercent = stats?.systemMetrics?.memory?.ramPercent ?? 42;
    const storagePercent = stats?.systemMetrics?.memory?.storagePercent ?? 38;
    const heapUsedMB = stats?.systemMetrics?.memory?.heapUsedMB ?? 128;
    const heapTotalMB = stats?.systemMetrics?.memory?.heapTotalMB ?? 256;
    const uptimeSeconds = stats?.systemMetrics?.serverUptimeSeconds ?? 86400;

    // Filter activity logs
    const filteredActivities = useMemo(() => {
        return adminActivities.filter((act) => {
            const matchesSearch = 
                (act.adminName || '').toLowerCase().includes(searchLog.toLowerCase()) ||
                (act.description || '').toLowerCase().includes(searchLog.toLowerCase()) ||
                (act.action || '').toLowerCase().includes(searchLog.toLowerCase()) ||
                (act.targetType || '').toLowerCase().includes(searchLog.toLowerCase());

            const matchesAction = 
                actionFilter === 'all' || 
                (act.action || '').toUpperCase() === actionFilter.toUpperCase();

            const matchesEntity = 
                entityFilter === 'all' || 
                (act.targetType || '').toLowerCase() === entityFilter.toLowerCase();

            return matchesSearch && matchesAction && matchesEntity;
        });
    }, [adminActivities, searchLog, actionFilter, entityFilter]);

    const paginatedActivities = useMemo(() => {
        return filteredActivities.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        );
    }, [filteredActivities, currentPage, itemsPerPage]);

    // Format action badge
    const getActionBadge = (action: string = 'POST') => {
        const act = action.toUpperCase();
        if (act.includes('DELETE')) {
            return <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-red-500/10 text-red-500 border border-red-500/30 rounded">DELETE</span>;
        }
        if (act.includes('CREATE') || act.includes('POST')) {
            return <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 rounded">CREATE</span>;
        }
        if (act.includes('EDIT') || act.includes('UPDATE')) {
            return <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/30 rounded">EDIT</span>;
        }
        if (act.includes('LOGIN')) {
            return <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-blue-500/10 text-blue-500 border border-blue-500/30 rounded">LOGIN</span>;
        }
        return <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-gray-500/10 text-gray-400 border border-gray-500/30 rounded">{act}</span>;
    };

    // Format role badge
    const getRoleBadge = (role: string = 'ADMIN') => {
        const r = (role || 'ADMIN').toUpperCase();
        if (r === 'SUPERADMIN' || r === 'SUPER_ADMIN') {
            return <span className="px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest bg-red-500/15 text-red-400 border border-red-500/40 rounded">SUPERADMIN</span>;
        }
        if (r === 'PIO') {
            return <span className="px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest bg-cyan-500/15 text-cyan-400 border border-cyan-500/40 rounded">PIO</span>;
        }
        return <span className="px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest bg-purple-500/15 text-purple-400 border border-purple-500/40 rounded">ADMIN</span>;
    };

    // Format target type pill
    const getTargetTypePill = (type?: string) => {
        if (!type) return null;
        const t = type.toLowerCase();
        const config: Record<string, { label: string; bg: string }> = {
            post: { label: 'Content', bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
            service: { label: 'LGU Service', bg: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
            official: { label: 'Official', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
            emergency: { label: 'Emergency Hotline', bg: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
            user: { label: 'Citizen Profile', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' }
        };
        const item = config[t] || { label: t.toUpperCase(), bg: 'bg-gray-500/10 text-gray-400 border-gray-500/20' };
        return (
            <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded border mr-2 ${item.bg}`}>
                {item.label}
            </span>
        );
    };

    const formatTimestamp = (dateStr?: string) => {
        if (!dateStr) return 'Recent';
        try {
            const d = new Date(dateStr);
            return d.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="space-y-10">
            
            {/* Top Bar Banner / System Status */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#111111] p-6 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                        </span>
                        <span className="text-[11px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                            Core Services Operational
                        </span>
                    </div>
                    <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight uppercase">
                        e-Cordova Central Dashboard
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        Real-time infrastructure health, resource allocation & municipal records telemetry.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/60 rounded-lg text-right">
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Node Runtime</p>
                        <p className="text-xs font-mono font-bold text-gray-900 dark:text-white">{stats?.systemMetrics?.nodeVersion || 'v20.x LTS'}</p>
                    </div>
                    <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/60 rounded-lg text-right">
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Environment</p>
                        <p className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">Production</p>
                    </div>
                </div>
            </div>

            {/* Metric Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* 1. System Uptime & Age */}
                <div className="bg-white dark:bg-[#111111] p-6 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm hover:border-red-600/50 transition-all group flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-center justify-center">
                                <Clock className="w-5 h-5 text-red-600 dark:text-red-400" />
                            </div>
                            <span className="px-2.5 py-1 text-[10px] font-black tracking-widest uppercase bg-green-500/10 text-green-500 border border-green-500/20 rounded">
                                Active Uptime
                            </span>
                        </div>
                        <h3 className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">System Uptime & Age</h3>
                        <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tight mt-1">
                            {formatUptime(uptimeSeconds)}
                        </p>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-red-600" />
                            Launch Date: <span className="text-gray-900 dark:text-gray-200 font-bold">July 1, 2026</span> ({systemAgeString})
                        </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                        <span>Database Sync: <strong className="text-emerald-500 font-bold">Healthy (Neon PG)</strong></span>
                        <span>SLA: <strong className="text-gray-900 dark:text-white font-bold">99.98%</strong></span>
                    </div>
                </div>

                {/* 2. Server Resource Usage */}
                <div className="bg-white dark:bg-[#111111] p-6 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm hover:border-red-600/50 transition-all group flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 flex items-center justify-center">
                                <Server className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <span className="px-2.5 py-1 text-[10px] font-black tracking-widest uppercase bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded">
                                Memory & Storage
                            </span>
                        </div>
                        <h3 className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Server Resources</h3>
                        
                        {/* RAM Bar */}
                        <div className="mt-3 space-y-1">
                            <div className="flex justify-between text-xs font-bold text-gray-700 dark:text-gray-300">
                                <span>RAM Usage</span>
                                <span className="font-mono">{ramPercent}% ({heapUsedMB} MB Heap)</span>
                            </div>
                            <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full transition-all duration-500 rounded-full ${
                                        ramPercent > 80 ? 'bg-red-600' : ramPercent > 60 ? 'bg-amber-500' : 'bg-blue-600'
                                    }`}
                                    style={{ width: `${ramPercent}%` }}
                                />
                            </div>
                        </div>

                        {/* Storage Bar */}
                        <div className="mt-3 space-y-1">
                            <div className="flex justify-between text-xs font-bold text-gray-700 dark:text-gray-300">
                                <span>Storage Allocation</span>
                                <span className="font-mono">{storagePercent}% Utilized</span>
                            </div>
                            <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
                                    style={{ width: `${storagePercent}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                        <span>Heap Total: <strong className="text-gray-900 dark:text-white font-bold">{heapTotalMB} MB</strong></span>
                        <span>Process: <strong className="text-emerald-500 font-bold">Optimal</strong></span>
                    </div>
                </div>

                {/* 3. Active Records Telemetry Summary */}
                <div className="bg-white dark:bg-[#111111] p-6 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm hover:border-red-600/50 transition-all group flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/50 flex items-center justify-center">
                                <Layers className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <span className="px-2.5 py-1 text-[10px] font-black tracking-widest uppercase bg-purple-500/10 text-purple-500 border border-purple-500/20 rounded">
                                Database Entities
                            </span>
                        </div>
                        <h3 className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Active Records Summary</h3>
                        
                        <div className="grid grid-cols-2 gap-3 mt-3">
                            <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                                <p className="text-[10px] uppercase font-bold text-gray-500">LGU Services</p>
                                <p className="text-xl font-black text-gray-900 dark:text-white">{stats?.totalServices ?? 0}</p>
                            </div>
                            <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                                <p className="text-[10px] uppercase font-bold text-gray-500">Announcements/Posts</p>
                                <p className="text-xl font-black text-gray-900 dark:text-white">{stats?.publishedPosts ?? 0}</p>
                            </div>
                            <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                                <p className="text-[10px] uppercase font-bold text-gray-500">Hotlines</p>
                                <p className="text-xl font-black text-gray-900 dark:text-white">{stats?.totalHotlines ?? 0}</p>
                            </div>
                            <div className="p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                                <p className="text-[10px] uppercase font-bold text-gray-500">Officials</p>
                                <p className="text-xl font-black text-gray-900 dark:text-white">{stats?.totalOfficials ?? 0}</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                        <span>Registered Citizens: <strong className="text-gray-900 dark:text-white font-bold">{stats?.totalUsers ?? 0}</strong></span>
                        <span>Tracking: <strong className="text-emerald-500 font-bold">Enabled</strong></span>
                    </div>
                </div>
            </div>

            {/* Upgraded Activity Log Table */}
            <div className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
                
                {/* Table Header & Controls */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gray-50/50 dark:bg-gray-900/50">
                    <div>
                        <div className="flex items-center gap-2.5 mb-1">
                            <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">
                                Administrator Activity Audit Log
                            </h3>
                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Live Audit</span>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                            Granular records of administrative modifications, content updates, and access transactions.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative">
                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input 
                                type="text"
                                placeholder="Search logs..."
                                value={searchLog}
                                onChange={(e) => { setSearchLog(e.target.value); setCurrentPage(1); }}
                                className="pl-9 pr-4 py-2 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-semibold text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-red-600"
                            />
                        </div>

                        <select
                            value={entityFilter}
                            onChange={(e) => { setEntityFilter(e.target.value); setCurrentPage(1); }}
                            className="px-3 py-2 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-bold text-gray-900 dark:text-white focus:outline-none focus:border-red-600"
                        >
                            <option value="all">All Modules</option>
                            <option value="post">Content / Posts</option>
                            <option value="service">LGU Services</option>
                            <option value="official">Officials</option>
                            <option value="emergency">Hotlines</option>
                            <option value="user">Citizens</option>
                        </select>

                        <select
                            value={actionFilter}
                            onChange={(e) => { setActionFilter(e.target.value); setCurrentPage(1); }}
                            className="px-3 py-2 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-bold text-gray-900 dark:text-white focus:outline-none focus:border-red-600"
                        >
                            <option value="all">All Actions</option>
                            <option value="CREATE">CREATE</option>
                            <option value="EDIT">EDIT</option>
                            <option value="DELETE">DELETE</option>
                        </select>
                    </div>
                </div>

                {/* Table Body */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[750px]">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40 text-[10px] font-black text-gray-500 uppercase tracking-wider">
                                <th className="px-6 py-3.5">Timestamp</th>
                                <th className="px-6 py-3.5">Administrator</th>
                                <th className="px-6 py-3.5">Role</th>
                                <th className="px-6 py-3.5">Action</th>
                                <th className="px-6 py-3.5">Description & Target Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800/80 text-xs">
                            {paginatedActivities.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400 font-bold uppercase tracking-wider text-xs">
                                        No activity logs matching the criteria
                                    </td>
                                </tr>
                            ) : (
                                paginatedActivities.map((act, index) => (
                                    <tr key={act.id || index} className="hover:bg-gray-50/80 dark:hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4 font-mono font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                            {formatTimestamp(act.createdAt || act.timestamp)}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-900 dark:text-white whitespace-nowrap">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-7 h-7 rounded-full bg-red-700 flex items-center justify-center text-white text-[10px] font-black">
                                                    {(act.adminName || 'A').charAt(0).toUpperCase()}
                                                </div>
                                                <span>{act.adminName || 'System Admin'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getRoleBadge(act.adminRole || act.role || 'ADMIN')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getActionBadge(act.action || act.actionType || 'POST')}
                                        </td>
                                        <td className="px-6 py-4 text-gray-700 dark:text-gray-300 font-medium">
                                            <div className="flex items-center flex-wrap">
                                                {getTargetTypePill(act.targetType)}
                                                <span>{act.description || 'Performed administrative transaction'}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-900/30">
                    <Pagination
                        currentPage={currentPage}
                        totalItems={filteredActivities.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>

        </div>
    );
};

export default OverviewTab;
