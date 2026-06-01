import React, { useState } from 'react';
import { Calendar, Users, Edit, Trash2, Plus, Search, X, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { type BarangayOfficial } from 'data/adminData';
import Pagination from './Pagination';

interface BarangayTabProps {
    barangays: string[];
    activeBarangay: string;
    onBarangayChange: (name: string) => void;
    officials: BarangayOfficial[];
    onEditOfficial: (official: BarangayOfficial) => void;
    onDeleteOfficial: (id: number) => void;
    onAddOfficial: () => void;
}

const BarangayTab: React.FC<BarangayTabProps> = ({
    barangays,
    activeBarangay,
    onBarangayChange,
    officials,
    onEditOfficial,
    onDeleteOfficial,
    onAddOfficial
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const itemsPerPage = 15;

    const officialSchema = z.object({
        name: z.string().min(2, 'Name is required'),
        position: z.string().min(2, 'Position is required'),
        contact: z.string().min(5, 'Contact is required'),
    });

    type OfficialFormData = z.infer<typeof officialSchema>;

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<OfficialFormData>({
        resolver: zodResolver(officialSchema)
    });

    const onSubmit = async (data: OfficialFormData) => {
        try {
            // Simulated API call. In the future this will be await barangayApi.addOfficial(...)
            await new Promise(resolve => setTimeout(resolve, 800));
            toast.success('Official added successfully!');
            setIsAddModalOpen(false);
            reset();
            // onAddOfficial() can be triggered here if we had a data-refresh prop
        } catch (err) {
            toast.error('Failed to add official');
        }
    };

    const filteredOfficials = officials.filter(o => o.barangay === activeBarangay);
    const paginatedOfficials = filteredOfficials.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const populations: Record<string, string> = {
        'Alegria': '7,500', 'Bangbang': '6,200', 'Buagsong': '5,100', 'Catarman': '4,500',
        'Cogon': '3,800', 'Dapitan': '5,200', 'Day-as': '4,100', 'Gabi': '6,500',
        'Gilutongan': '1,800', 'Ibabao': '4,300', 'Pilipog': '5,800', 'Poblacion': '7,200', 'San Miguel': '4,900'
    };

    return (
        <>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-gray-900 p-8 border border-gray-200 dark:border-gray-800">
                <div>
                    <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Barangay Units Management</h2>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Viewing statistics and leadership for {activeBarangay}</p>
                </div>
                <select
                    value={activeBarangay}
                    onChange={(e) => { onBarangayChange(e.target.value); setCurrentPage(1); }}
                    className="px-6 py-3 bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-red-600 font-black text-sm text-gray-900 dark:text-white appearance-none min-w-[200px] text-center"
                >
                    {barangays.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-gray-900 p-8 border border-gray-200 dark:border-gray-800 premium-flag-container hover:scale-[1.01] hover:border-red-700 transition-all duration-200 cursor-pointer">
                        <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-6">Barangay Profile</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Population</label>
                                <div className="flex items-center justify-between">
                                    <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">{populations[activeBarangay] || '0'}</p>
                                    <button className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors">
                                        <Edit className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                                <p className="text-[10px] text-gray-500 font-bold leading-relaxed uppercase tracking-widest">Population data is updated quarterly by the municipal census bureau.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden">
                        <div className="p-8 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">Barangay Leadership</h3>
                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="px-4 py-2 bg-red-700 text-white text-[10px] font-black uppercase tracking-widest hover:bg-red-800 transition-all flex items-center gap-2"
                            >
                                <Plus className="w-3 h-3" /> Add Official
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left min-w-[600px]">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-gray-800/50">
                                        <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Official</th>
                                        <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Position</th>
                                        <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {paginatedOfficials.length === 0 ? (
                                        <tr>
                                            <td colSpan={3} className="px-8 py-12 text-center">
                                                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">No officials recorded for this unit</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        paginatedOfficials.map((official) => (
                                            <tr key={official.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors group">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-black text-gray-500 group-hover:bg-red-50 dark:group-hover:bg-red-900/10 group-hover:text-red-700 transition-colors">
                                                            <Users className="w-4 h-4" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">{official.name}</p>
                                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{official.contact}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest">
                                                        {official.position}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button onClick={() => onEditOfficial(official)} className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button onClick={() => onDeleteOfficial(official.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <Pagination
                            currentPage={currentPage}
                            totalItems={filteredOfficials.length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                </div>
            </div>
        </div>

            {/* Add Official Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-900 w-full max-w-md border border-gray-200 dark:border-gray-800 shadow-2xl">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
                            <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">Add Barangay Official</h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Full Name</label>
                                <input 
                                    {...register('name')}
                                    className="w-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3 text-sm focus:outline-none focus:border-red-700 text-gray-900 dark:text-white"
                                    placeholder="Enter full name"
                                />
                                {errors.name && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.name.message}</p>}
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Position</label>
                                <input 
                                    {...register('position')}
                                    className="w-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3 text-sm focus:outline-none focus:border-red-700 text-gray-900 dark:text-white"
                                    placeholder="e.g. Barangay Captain"
                                />
                                {errors.position && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.position.message}</p>}
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Contact Number / Email</label>
                                <input 
                                    {...register('contact')}
                                    className="w-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3 text-sm focus:outline-none focus:border-red-700 text-gray-900 dark:text-white"
                                    placeholder="Enter contact info"
                                />
                                {errors.contact && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.contact.message}</p>}
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-3 border border-gray-200 dark:border-gray-700 text-xs font-black uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-gray-800">
                                    Cancel
                                </button>
                                <button type="submit" disabled={isSubmitting} className="flex-1 py-3 bg-red-700 text-white text-xs font-black uppercase tracking-widest hover:bg-red-800 flex justify-center items-center gap-2">
                                    {isSubmitting ? 'Saving...' : <><Save className="w-4 h-4"/> Save</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default BarangayTab;
