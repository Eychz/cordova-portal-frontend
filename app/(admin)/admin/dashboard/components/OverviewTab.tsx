import React, { useState } from 'react';
import { Users, UserCheck, FileText, Shield } from 'lucide-react';
import Pagination from './Pagination';

interface OverviewTabProps {
    stats: {
        totalUsers: number;
        verificationRequests: number;
        totalPopulation: number;
        publishedPosts: number;
    };
    adminActivities: any[];
}

const OverviewTab: React.FC<OverviewTabProps> = ({ stats, adminActivities }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;

    const totalPages = Math.ceil(adminActivities.length / itemsPerPage);
    const paginatedActivities = adminActivities.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="space-y-12">
            <div className="space-y-6">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">System Metrics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-gray-900 p-8 border border-gray-200 dark:border-gray-800 premium-flag-container hover:scale-[1.01] hover:border-red-700 transition-all duration-200 cursor-pointer">
                        <div className="flex items-center justify-between mb-6">
                            <div className="p-3 bg-red-50 dark:bg-red-900/10">
                                <Users className="w-6 h-6 text-red-700" />
                            </div>
                            <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">+12% New</span>
                        </div>
                        <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Total Users</h3>
                        <p className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">{stats.totalUsers}</p>
                    </div>

                    <div className="bg-white dark:bg-gray-900 p-8 border border-gray-200 dark:border-gray-800 premium-flag-container hover:scale-[1.01] hover:border-red-700 transition-all duration-200 cursor-pointer">
                        <div className="flex items-center justify-between mb-6">
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/10">
                                <UserCheck className="w-6 h-6 text-blue-700" />
                            </div>
                            <span className="text-[10px] font-black text-yellow-600 uppercase tracking-widest">Action Required</span>
                        </div>
                        <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Verifications</h3>
                        <p className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">{stats.verificationRequests}</p>
                    </div>

                    <div className="bg-white dark:bg-gray-900 p-8 border border-gray-200 dark:border-gray-800 premium-flag-container hover:scale-[1.01] hover:border-red-700 transition-all duration-200 cursor-pointer">
                        <div className="flex items-center justify-between mb-6">
                            <div className="p-3 bg-green-50 dark:bg-green-900/10">
                                <Users className="w-6 h-6 text-green-700" />
                            </div>
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Demographics</span>
                        </div>
                        <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Estimated Population</h3>
                        <p className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">{stats.totalPopulation.toLocaleString()}</p>
                    </div>

                    <div className="bg-white dark:bg-gray-900 p-8 border border-gray-200 dark:border-gray-800 premium-flag-container hover:scale-[1.01] hover:border-red-700 transition-all duration-200 cursor-pointer">
                        <div className="flex items-center justify-between mb-6">
                            <div className="p-3 bg-purple-50 dark:bg-purple-900/10">
                                <FileText className="w-6 h-6 text-purple-700" />
                            </div>
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Active Drafts</span>
                        </div>
                        <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Published Posts</h3>
                        <p className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">{stats.publishedPosts}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="p-8 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Admin Activity Log</h3>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Live System Logs</span>
                    </div>
                </div>

                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {paginatedActivities.length === 0 ? (
                        <div className="p-12 text-center">
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">No activities recorded</p>
                        </div>
                    ) : (
                        paginatedActivities.map((activity, index) => (
                            <div key={activity.id || index} className="p-6 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors group">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-gray-100 dark:bg-gray-800 group-hover:bg-red-50 dark:group-hover:bg-red-900/10 transition-colors">
                                        <Shield className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-red-600 transition-colors" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">{activity.adminName}</p>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{activity.timestamp}</span>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed">{activity.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <Pagination
                    currentPage={currentPage}
                    totalItems={adminActivities.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                />
            </div>
        </div>
    );
};

export default OverviewTab;
