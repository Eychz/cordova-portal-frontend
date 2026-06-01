'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, MapPin, Building2, User, ChevronDown, Trash2, Edit } from 'lucide-react';
import { officialsApi, Official } from '@/lib/officialsApi';
import toast from 'react-hot-toast';

const BARANGAYS = [
    'Alegria', 'Bangbang', 'Buagsong', 'Catarman', 'Cogon', 'Dapitan',
    'Day-as', 'Gabi', 'Gilutongan', 'Ibabao', 'Pilipog', 'Poblacion', 'San Miguel'
];

const CATEGORIES = [
    { id: 'MUNICIPAL', label: 'Municipal Officials' },
    { id: 'DEPARTMENT', label: 'Department Heads' },
    { id: 'BARANGAY', label: 'Barangay Officials' },
    { id: 'SK', label: 'SK Officials' }
];

const OfficialsTab = () => {
    const router = useRouter();
    const [officials, setOfficials] = useState<Official[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedType, setSelectedType] = useState<string>('MUNICIPAL');
    const [selectedBarangay, setSelectedBarangay] = useState<string>(BARANGAYS[0]);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchOfficials = async () => {
        setLoading(true);
        try {
            const data = await officialsApi.getAll(
                selectedType,
                (selectedType === 'BARANGAY' || selectedType === 'SK') ? selectedBarangay : undefined
            );
            setOfficials(data);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load officials');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOfficials();
    }, [selectedType, selectedBarangay]);

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to remove this official?')) return;
        try {
            await officialsApi.delete(id);
            setOfficials(officials.filter(o => o.id !== id));
            toast.success('Official removed');
        } catch (err) {
            toast.error('Failed to delete');
        }
    };

    const filteredOfficials = officials.filter(o =>
        o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.position.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8">
            {/* Header Controls */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex flex-wrap gap-4">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedType(cat.id)}
                                className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${selectedType === cat.id
                                    ? 'bg-red-700 text-white'
                                    : 'bg-gray-50 dark:bg-gray-800 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => router.push(`/admin/dashboard/officials/create?type=${selectedType}${selectedType === 'BARANGAY' || selectedType === 'SK' ? `&barangay=${selectedBarangay}` : ''}`)}
                        className="bg-red-700 hover:bg-red-800 text-white px-8 py-3 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-all"
                    >
                        <Plus className="w-4 h-4" /> Add Official
                    </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or position..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-black border-none text-sm font-bold focus:ring-2 focus:ring-red-700 transition-all"
                        />
                    </div>

                    {(selectedType === 'BARANGAY' || selectedType === 'SK') && (
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-red-700" />
                            <select
                                value={selectedBarangay}
                                onChange={(e) => setSelectedBarangay(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-black border-none text-sm font-black uppercase tracking-widest focus:ring-2 focus:ring-red-700 appearance-none transition-all"
                            >
                                {BARANGAYS.map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    )}
                </div>
            </div>

            {/* Grid Display */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-10 h-10 border-4 border-red-700 border-t-transparent animate-spin rounded-full"></div>
                </div>
            ) : filteredOfficials.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 dark:bg-gray-900/50 border border-dashed border-gray-300 dark:border-gray-800">
                    <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">No officials found in this category</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredOfficials.map((official) => (
                        <div 
                            key={official.id}
                            className="group relative bg-white dark:bg-gray-900 border-l-8 border-red-700 p-6 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
                        >
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="relative w-24 h-24 bg-gray-100 dark:bg-black overflow-hidden shadow-inner">
                                    {official.imageUrl ? (
                                        <img 
                                            src={official.imageUrl} 
                                            alt={official.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <User className="w-10 h-10 text-gray-300" />
                                        </div>
                                    )}
                                    <div className="absolute top-0 right-0 p-1 bg-red-700 text-white text-[8px] font-black uppercase">
                                        {official.hierarchyOrder === 0 ? 'Leader' : `Rank ${official.hierarchyOrder}`}
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight line-clamp-1">
                                        {official.name}
                                    </h4>
                                    <p className="text-[10px] font-bold text-red-700 uppercase tracking-widest">
                                        {official.position}
                                    </p>
                                </div>

                                <div className="w-full pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-center gap-4">
                                    <button 
                                        onClick={() => router.push(`/admin/dashboard/officials/edit/${official.id}`)}
                                        className="p-2 text-gray-400 hover:text-red-700 transition-colors"
                                        title="Edit Profile"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(official.id)}
                                        className="p-2 text-gray-400 hover:text-red-700 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OfficialsTab;
