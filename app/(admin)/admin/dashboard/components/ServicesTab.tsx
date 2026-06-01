'use client';

import React, { useState } from 'react';
import { Package, Search, Edit, Trash2, Plus, FileText, Heart, Shield, Users, Building, Scale, Home, Briefcase, Car, Stethoscope } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Pagination from './Pagination';

interface ServicesTabProps {
    services: any[];
    onDelete: (id: number) => void;
    onEdit?: (id: number, data: any) => void;
    onCreate?: (data: any) => void;
}

const ServicesTab: React.FC<ServicesTabProps> = ({ services, onDelete }) => {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const ICONS = [
        { name: 'FileText', component: FileText },
        { name: 'Heart', component: Heart },
        { name: 'Shield', component: Shield },
        { name: 'Users', component: Users },
        { name: 'Building', component: Building },
        { name: 'Scale', component: Scale },
        { name: 'Home', component: Home },
        { name: 'Briefcase', component: Briefcase },
        { name: 'Car', component: Car },
        { name: 'Stethoscope', component: Stethoscope }
    ];

    const itemsPerPage = 15;

    const filteredServices = services.filter(service =>
        (service.name || service.title || '').toLowerCase().includes(search.toLowerCase()) ||
        (service.description || service.details || '').toLowerCase().includes(search.toLowerCase())
    );

    const paginatedServices = filteredServices.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="space-y-6 relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-900 p-6 border border-gray-200 dark:border-gray-800">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search LGU services..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-red-600 font-bold text-sm text-gray-900 dark:text-white"
                    />
                </div>
                <button
                    onClick={() => router.push('/admin/dashboard/services/create')}
                    className="px-6 py-3 bg-red-700 text-white font-black text-sm uppercase tracking-widest hover:bg-red-800 transition-all flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Add Service
                </button>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-x-auto">
                <table className="w-full text-left min-w-[800px]">
                    <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                            <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Service Name</th>
                            <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Requirements</th>
                            <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Processing Fee</th>
                            <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {paginatedServices.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-8 py-12 text-center">
                                    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">No services found in the catalog</p>
                                </td>
                            </tr>
                        ) : (
                            paginatedServices.map((service) => {
                                const title = service.name || service.title || 'Untitled';
                                const desc = service.description || service.details || '';
                                const reqCount = Array.isArray(service.requirements) ? service.requirements.length : 0;

                                return (
                                    <tr key={service.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 group-hover:bg-red-50 dark:group-hover:bg-red-900/10 transition-colors">
                                                    {React.createElement(ICONS.find(i => i.name === (service.icon || service.iconIdentifier))?.component || Package, { 
                                                        className: "w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-red-700 transition-colors" 
                                                    })}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight line-clamp-1">{title}</p>
                                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest line-clamp-1 max-w-sm">{desc}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{reqCount} Items</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight">{service.fee || 'None'}</p>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => router.push(`/admin/dashboard/services/edit/${service.id}`)}
                                                    className="px-4 py-2 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 text-[10px] font-black uppercase tracking-widest hover:border-gray-900 hover:text-gray-900 dark:hover:border-white dark:hover:text-white transition-all flex items-center gap-2"
                                                >
                                                    <Edit className="w-3 h-3" /> Edit
                                                </button>
                                                <button
                                                    onClick={() => onDelete(service.id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>
                <Pagination
                    currentPage={currentPage}
                    totalItems={filteredServices.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                />
            </div>
        </div>
    );
};

export default ServicesTab;
