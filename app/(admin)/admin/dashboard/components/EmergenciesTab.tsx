'use client';

import React, { useState, useEffect } from 'react';
import { Search, Edit, Trash2, Plus, Siren, X, Save, ShieldCheck, Flame, Cross, Ambulance, Anchor, Landmark, Phone } from 'lucide-react';
import { emergencyApi, EmergencyHotline } from '@/lib/emergencyApi';
import toast from 'react-hot-toast';

const CATEGORIES = [
    { id: 'Security', label: 'Security (Police, Law Enforcement)', icon: 'ShieldCheck' },
    { id: 'Fire & Rescue', label: 'Fire & Rescue', icon: 'Flame' },
    { id: 'Medical', label: 'Medical & Ambulance', icon: 'Ambulance' },
    { id: 'Maritime', label: 'Maritime (Coast Guard)', icon: 'Anchor' },
    { id: 'Municipal', label: 'Municipal Leaders / LGU Office', icon: 'Landmark' },
    { id: 'Others', label: 'Others', icon: 'Siren' }
];

const ICON_MAP: Record<string, any> = {
    ShieldCheck,
    Flame,
    Cross,
    Ambulance,
    Anchor,
    Landmark,
    Siren
};

export default function EmergenciesTab() {
    const [hotlines, setHotlines] = useState<EmergencyHotline[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    
    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingHotline, setEditingHotline] = useState<EmergencyHotline | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Form states
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        contact: '',
        category: 'Security',
        icon: 'ShieldCheck'
    });

    const fetchHotlines = async () => {
        setLoading(true);
        try {
            const data = await emergencyApi.getAll();
            setHotlines(data);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load emergency hotlines');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHotlines();
    }, []);

    // Auto select icon base on category & title changes
    useEffect(() => {
        let suggestedIcon = 'Siren';
        const category = formData.category;
        const titleLower = formData.title.toLowerCase();

        if (category === 'Security') {
            suggestedIcon = 'ShieldCheck';
        } else if (category === 'Fire & Rescue') {
            suggestedIcon = 'Flame';
        } else if (category === 'Medical') {
            if (titleLower.includes('ambulance')) {
                suggestedIcon = 'Ambulance';
            } else {
                suggestedIcon = 'Cross';
            }
        } else if (category === 'Maritime') {
            suggestedIcon = 'Anchor';
        } else if (category === 'Municipal') {
            suggestedIcon = 'Landmark';
        } else {
            suggestedIcon = 'Siren';
        }

        setFormData(prev => ({ ...prev, icon: suggestedIcon }));
    }, [formData.category, formData.title]);

    const handleOpenCreate = () => {
        setEditingHotline(null);
        setFormData({
            title: '',
            description: '',
            contact: '',
            category: 'Security',
            icon: 'ShieldCheck'
        });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (hotline: EmergencyHotline) => {
        setEditingHotline(hotline);
        setFormData({
            title: hotline.title,
            description: hotline.description,
            contact: hotline.contact,
            category: hotline.category,
            icon: hotline.icon
        });
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.contact) {
            toast.error('Title and Contact fields are required');
            return;
        }

        setSubmitting(true);
        try {
            if (editingHotline) {
                const updated = await emergencyApi.update(editingHotline.id, formData);
                setHotlines(prev => prev.map(h => h.id === editingHotline.id ? updated : h));
                toast.success('Emergency hotline updated successfully');
            } else {
                const created = await emergencyApi.create(formData);
                setHotlines(prev => [created, ...prev]);
                toast.success('Emergency hotline added successfully');
            }
            setIsModalOpen(false);
        } catch (err) {
            console.error(err);
            toast.error('Failed to save emergency hotline');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this emergency hotline?')) return;
        try {
            await emergencyApi.delete(id);
            setHotlines(prev => prev.filter(h => h.id !== id));
            toast.success('Emergency hotline deleted successfully');
        } catch (err) {
            console.error(err);
            toast.error('Failed to delete emergency hotline');
        }
    };

    const filteredHotlines = hotlines.filter(h =>
        h.title.toLowerCase().includes(search.toLowerCase()) ||
        h.description.toLowerCase().includes(search.toLowerCase()) ||
        h.category.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6 relative">
            {/* Header / Action panel */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-900 p-6 border border-gray-200 dark:border-gray-800">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search emergency hotlines..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-red-600 font-bold text-sm text-gray-900 dark:text-white"
                    />
                </div>
                <button
                    onClick={handleOpenCreate}
                    className="px-6 py-3 bg-red-700 text-white font-black text-sm uppercase tracking-widest hover:bg-red-800 transition-all flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Add Hotline
                </button>
            </div>

            {/* List / Table */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-x-auto">
                <table className="w-full text-left min-w-[800px]">
                    <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                            <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Hotline Agency</th>
                            <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Contact Numbers</th>
                            <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Category</th>
                            <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {loading ? (
                            <tr>
                                <td colSpan={4} className="px-8 py-12 text-center">
                                    <div className="animate-spin w-8 h-8 border-4 border-red-700 border-t-transparent rounded-full mx-auto mb-4"></div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading records...</p>
                                </td>
                            </tr>
                        ) : filteredHotlines.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-8 py-12 text-center">
                                    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">No emergency hotlines found</p>
                                </td>
                            </tr>
                        ) : (
                            filteredHotlines.map((hotline) => {
                                const IconComponent = ICON_MAP[hotline.icon] || Siren;
                                return (
                                    <tr key={hotline.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 group-hover:bg-red-50 dark:group-hover:bg-red-900/10 transition-colors">
                                                    <IconComponent className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-red-700 transition-colors" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight line-clamp-1">{hotline.title}</p>
                                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest line-clamp-1 max-w-sm">{hotline.description}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-sm font-bold text-red-700 dark:text-red-500 whitespace-pre-line leading-relaxed">
                                            {hotline.contact}
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="inline-flex items-center px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900/30">
                                                {hotline.category}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <button
                                                    onClick={() => handleOpenEdit(hotline)}
                                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-red-700 transition-colors"
                                                    title="Edit Hotline"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(hotline.id)}
                                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-red-700 transition-colors"
                                                    title="Delete Hotline"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Overlay */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/40">
                            <h3 className="text-lg font-black uppercase tracking-wider text-gray-900 dark:text-white">
                                {editingHotline ? 'Edit Emergency Hotline' : 'Add New Emergency Hotline'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Form */}
                        <form onSubmit={handleSave} className="p-8 space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Hotline Name / Agency *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full bg-gray-50 dark:bg-black border-none p-4 font-bold text-sm focus:ring-2 focus:ring-red-700 transition-all text-gray-900 dark:text-white"
                                        placeholder="e.g. Cordova Police Station"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Category *</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full bg-gray-50 dark:bg-black border-none p-4 font-bold text-sm focus:ring-2 focus:ring-red-700 appearance-none transition-all text-gray-900 dark:text-white"
                                    >
                                        {CATEGORIES.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.id}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Contact Number(s) *</label>
                                <textarea
                                    required
                                    rows={2}
                                    value={formData.contact}
                                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                    className="w-full bg-gray-50 dark:bg-black border-none p-4 font-bold text-sm focus:ring-2 focus:ring-red-700 transition-all text-gray-900 dark:text-white"
                                    placeholder="e.g. 0998-598-6392&#10;(Multiple numbers can be placed on separate lines)"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Service Description</label>
                                <textarea
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-gray-50 dark:bg-black border-none p-4 font-bold text-sm focus:ring-2 focus:ring-red-700 transition-all text-gray-900 dark:text-white"
                                    placeholder="Describe their rescue services, scope, or operation hours."
                                />
                            </div>

                            {/* Auto Selected Icon Preview */}
                            <div className="bg-gray-50 dark:bg-black p-6 border border-gray-100 dark:border-gray-800 flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Icon Identifier (Auto-Selected)</p>
                                    <p className="text-sm font-black uppercase text-red-700 tracking-wider">{formData.icon}</p>
                                </div>
                                <div className="w-14 h-14 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-red-700">
                                    {React.createElement(ICON_MAP[formData.icon] || Siren, { className: "w-8 h-8" })}
                                </div>
                            </div>

                            {/* Submit */}
                            <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex gap-4 justify-end">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-700 dark:text-gray-300 font-bold text-xs uppercase tracking-widest transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-8 py-4 bg-red-700 hover:bg-red-800 disabled:bg-gray-400 text-white font-black text-xs uppercase tracking-[0.2em] shadow-lg transition-all flex items-center gap-2"
                                >
                                    <Save className="w-4 h-4" />
                                    {submitting ? 'Saving...' : 'Save Hotline'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
