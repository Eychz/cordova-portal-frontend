'use client';

import React, { useState, useEffect } from 'react';
import CachedImage from '@/components/CachedImage';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, User, Camera, MapPin, Building2, UserPlus, Upload, Trash2 } from 'lucide-react';
import { officialsApi } from '@/lib/officialsApi';
import { uploadFile } from '@/lib/apiClient';
import { useQueryClient } from '@tanstack/react-query';
import DashboardSidebar from '../../../components/DashboardSidebar';
import DashboardHeader from '../../../components/DashboardHeader';
import toast, { Toaster } from 'react-hot-toast';

const BARANGAYS = [
    'Alegria', 'Bangbang', 'Buagsong', 'Catarman', 'Cogon', 'Dapitan', 
    'Day-as', 'Gabi', 'Gilutongan', 'Ibabao', 'Pilipog', 'Poblacion', 'San Miguel'
];

const TYPES = [
    { id: 'MUNICIPAL', label: 'Municipal Official' },
    { id: 'DEPARTMENT', label: 'Department Head' },
    { id: 'BARANGAY', label: 'Barangay Official' },
    { id: 'SK', label: 'SK Official' }
];

export default function EditOfficialPage() {
    const router = useRouter();
    const params = useParams();
    const queryClient = useQueryClient();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '',
        position: '',
        slug: '',
        type: 'MUNICIPAL',
        hierarchyOrder: '0',
        imageUrl: '',
        barangayName: BARANGAYS[0],
        email: '',
        contactNumber: ''
    });

    useEffect(() => {
        const fetchOfficial = async () => {
            try {
                const data = await officialsApi.getById(parseInt(params.id as string));
                setFormData({
                    name: data.name || '',
                    position: data.position || '',
                    slug: data.slug || '',
                    type: data.type || 'MUNICIPAL',
                    hierarchyOrder: (data.hierarchyOrder ?? 0).toString(),
                    imageUrl: data.imageUrl || '',
                    barangayName: data.barangayName || BARANGAYS[0],
                    email: data.email || '',
                    contactNumber: data.contactNumber || ''
                });
            } catch (err) {
                toast.error('Failed to load official data');
                router.push('/admin/dashboard/officials');
            } finally {
                setLoading(false);
            }
        };
        if (params.id) fetchOfficial();
    }, [params.id, router]);

    // Auto-generate slug from name if changed (optional, maybe keep original slug)
    const handleNameChange = (name: string) => {
        const generatedSlug = name.toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '');
        setFormData(prev => ({ ...prev, name, slug: generatedSlug }));
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const url = await uploadFile(file);
            setFormData({ ...formData, imageUrl: url });
            toast.success('Image uploaded successfully');
        } catch (err) {
            toast.error('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        if (!formData.name || !formData.position) {
            toast.error('Please fill in Name and Position');
            return;
        }

        setSaving(true);
        try {
            await officialsApi.update(parseInt(params.id as string), formData);
            queryClient.invalidateQueries({ queryKey: ['adminOfficials'] });
            queryClient.invalidateQueries({ queryKey: ['publicOfficials'] });
            toast.success('Profile updated successfully');
            router.push('/admin/dashboard/officials');
        } catch (err) {
            console.error(err);
            toast.error('Failed to update official');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return null;

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-[#0a0a0a] relative">
            <Toaster position="top-right" />
            
            {/* Mobile Sidebar overlay backdrop */}
            {isSidebarOpen && (
                <div 
                    onClick={() => setIsSidebarOpen(false)}
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity animate-fadeIn"
                />
            )}

            <DashboardSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <main className="flex-1 flex flex-col overflow-hidden">
                <DashboardHeader title="Edit Official Profile" onMenuClick={() => setIsSidebarOpen(true)} />
                <div className="flex-1 overflow-y-auto p-12">
                    <div className="max-w-4xl mx-auto">
                        <button
                            onClick={() => router.push('/admin/dashboard/officials')}
                            className="flex items-center gap-2 text-gray-500 hover:text-red-700 font-bold text-xs uppercase tracking-widest mb-8 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back to Registry
                        </button>

                        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-10 shadow-2xl space-y-10">
                            <div className="flex flex-col md:flex-row gap-12 items-start">
                                {/* Portrait Upload */}
                                <div className="space-y-4">
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Official Portrait</label>
                                    <div className="w-48 h-56 bg-gray-50 dark:bg-black border border-gray-100 dark:border-gray-800 flex items-center justify-center relative group overflow-hidden">
                                        {formData.imageUrl ? (
                                            <CachedImage src={formData.imageUrl} fill className="object-cover" alt="Preview" />
                                        ) : (
                                            <div className="text-center p-6">
                                                <User className="w-12 h-12 text-gray-200 mx-auto mb-2" />
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">No Image</p>
                                            </div>
                                        )}
                                        {uploading && (
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                <div className="w-6 h-6 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
                                            </div>
                                        )}
                                        <label className="absolute inset-0 bg-red-700/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer">
                                            <Upload className="w-6 h-6 text-white mb-2" />
                                            <span className="text-[8px] font-black text-white uppercase">Replace Photo</span>
                                            <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                                        </label>
                                    </div>
                                    <p className="text-[8px] text-gray-400 uppercase font-bold text-center italic">Supported: JPG, PNG (Max 10MB)</p>
                                </div>

                                <div className="flex-1 space-y-6 w-full">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Full Name *</label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => handleNameChange(e.target.value)}
                                                className="w-full bg-gray-50 dark:bg-black border-none p-4 font-bold text-sm focus:ring-2 focus:ring-red-700 transition-all"
                                                placeholder="Hon. Juan Dela Cruz"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Position *</label>
                                            <input
                                                type="text"
                                                value={formData.position}
                                                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                                className="w-full bg-gray-50 dark:bg-black border-none p-4 font-bold text-sm focus:ring-2 focus:ring-red-700 transition-all"
                                                placeholder="Municipal Mayor"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Profile Slug</label>
                                            <input
                                                type="text"
                                                value={formData.slug}
                                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                                className="w-full bg-gray-50 dark:bg-black border-none p-4 font-bold text-xs focus:ring-2 focus:ring-red-700 transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Hierarchy Order (0 = Top Leader)</label>
                                            <input
                                                type="number"
                                                value={formData.hierarchyOrder}
                                                onChange={(e) => setFormData({ ...formData, hierarchyOrder: e.target.value })}
                                                className="w-full bg-gray-50 dark:bg-black border-none p-4 font-bold text-sm focus:ring-2 focus:ring-red-700 transition-all"
                                                min="0"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Level</label>
                                            <select
                                                value={formData.type}
                                                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                                                className="w-full bg-gray-50 dark:bg-black border-none p-4 font-bold text-sm focus:ring-2 focus:ring-red-700 appearance-none transition-all"
                                            >
                                                {TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                                            </select>
                                        </div>
                                        {(formData.type === 'BARANGAY' || formData.type === 'SK') && (
                                            <div>
                                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Assigned Barangay</label>
                                                <select
                                                    value={formData.barangayName}
                                                    onChange={(e) => setFormData({ ...formData, barangayName: e.target.value })}
                                                    className="w-full bg-gray-50 dark:bg-black border-none p-4 font-bold text-sm focus:ring-2 focus:ring-red-700 appearance-none transition-all"
                                                >
                                                    {BARANGAYS.map(b => <option key={b} value={b}>{b}</option>)}
                                                </select>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-10 border-t border-gray-100 dark:border-gray-800 grid md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Internal Contact Number</label>
                                    <input
                                        type="text"
                                        value={formData.contactNumber || ''}
                                        onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                                        className="w-full bg-gray-50 dark:bg-black border-none p-4 font-bold text-sm focus:ring-2 focus:ring-red-700 transition-all"
                                        placeholder="09XX-XXX-XXXX"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Internal Email Address</label>
                                    <input
                                        type="email"
                                        value={formData.email || ''}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-gray-50 dark:bg-black border-none p-4 font-bold text-sm focus:ring-2 focus:ring-red-700 transition-all"
                                        placeholder="official@cordova.gov.ph"
                                    />
                                </div>
                            </div>

                            <div className="pt-12">
                                <button
                                    onClick={handleSave}
                                    disabled={saving || uploading}
                                    className="w-full bg-red-700 hover:bg-red-800 disabled:bg-gray-400 text-white py-5 font-black uppercase tracking-[0.3em] text-sm shadow-xl transition-all flex items-center justify-center gap-3"
                                >
                                    <Save className="w-5 h-5" />
                                    {saving ? 'Saving...' : 'Update Profile'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
