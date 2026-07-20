'use client';

import React, { useState, useEffect } from 'react';
import CachedImage from '@/components/CachedImage';
import { useRouter, useParams } from 'next/navigation';
import { servicesApi, Service } from '@/lib/servicesApi';
import { ArrowLeft, Save, Image as ImageIcon } from 'lucide-react';
import { uploadFile } from '@/lib/apiClient';
import { useQueryClient } from '@tanstack/react-query';
import DashboardSidebar from '../../../components/DashboardSidebar';
import DashboardHeader from '../../../components/DashboardHeader';
import toast, { Toaster } from 'react-hot-toast';

const CATEGORIES = [
    'Permits & Licenses',
    'Health & Medical',
    'Social Welfare',
    'Civil Registry',
    'General Services',
    'Other'
];


export default function EditServicePage() {
    const router = useRouter();
    const params = useParams();
    const serviceId = parseInt(params.id as string);
    const queryClient = useQueryClient();
    
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        imageUrl: '',
        externalUrl: '',
        category: 'General Services'
    });

    useEffect(() => {
        const fetchService = async () => {
            try {
                // We'll use getById instead of getAll search for efficiency
                // but since servicesApi only has getAll and getBySlug, we fetch all and find
                const all = await servicesApi.getAll();
                const service = all.find(s => s.id === serviceId);
                
                if (service) {
                    setFormData({
                        name: service.name || service.title || '',
                        description: service.description || '',
                        imageUrl: service.imageUrl || '',
                        externalUrl: service.externalUrl || '',
                        category: service.category || 'General Services'
                    });
                } else {
                    toast.error('Service not found');
                    router.push('/admin/dashboard/services');
                }
            } catch (err) {
                console.error(err);
                toast.error('Failed to load service data');
            } finally {
                setLoading(false);
            }
        };
        fetchService();
    }, [serviceId, router]);

    const handleSave = async () => {
        setSaving(true);
        try {
            let finalImageUrl = formData.imageUrl;

            if (selectedFile) {
                toast.loading('Uploading thumbnail...', { id: 'uploadToast' });
                finalImageUrl = await uploadFile(selectedFile);
                toast.success('Thumbnail uploaded!', { id: 'uploadToast' });
            }

            const payload = {
                name: formData.name,
                description: formData.description,
                imageUrl: finalImageUrl,
                externalUrl: formData.externalUrl,
                category: formData.category,
                icon: 'FileText',
                fee: '',
                requirements: [],
                processSteps: [],
                hotline: '',
                email: '',
                processingTime: ''
            };

            await servicesApi.update(serviceId, payload);
            queryClient.invalidateQueries({ queryKey: ['adminServices'] });
            queryClient.invalidateQueries({ queryKey: ['publicServices'] });
            toast.success('Service updated successfully');
            router.push('/admin/dashboard/services');
        } catch (err) {
            console.error(err);
            toast.error('Failed to update service');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-[#0a0a0a]">
                <div className="w-12 h-12 border-4 border-red-700 border-t-transparent animate-spin"></div>
            </div>
        );
    }

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
                <DashboardHeader title={`Editing: ${formData.name}`} onMenuClick={() => setIsSidebarOpen(true)} />
                <div className="flex-1 overflow-y-auto p-12">
                    <div className="max-w-4xl mx-auto">
                        <button
                            onClick={() => router.push('/admin/dashboard/services')}
                            className="flex items-center gap-2 text-gray-500 hover:text-red-700 font-bold text-xs uppercase tracking-widest mb-8 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" /> Cancel Changes
                        </button>

                        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-10 shadow-2xl space-y-10">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Service Name</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-gray-50 dark:bg-black border-none p-4 font-bold text-sm focus:ring-2 focus:ring-red-700 transition-all rounded-lg"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Category</label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full bg-gray-50 dark:bg-black border-none p-4 font-bold text-sm focus:ring-2 focus:ring-red-700 transition-all rounded-lg"
                                        >
                                            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Service Redirection URL (Optional)</label>
                                        <input
                                            type="text"
                                            value={formData.externalUrl}
                                            onChange={(e) => setFormData({ ...formData, externalUrl: e.target.value })}
                                            className="w-full bg-gray-50 dark:bg-black border-none p-4 font-bold text-sm focus:ring-2 focus:ring-red-700 transition-all rounded-lg"
                                            placeholder="e.g., https://bpbc.ibpls.com/cordovacebu/"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Service Thumbnail Image</label>
                                        {formData.imageUrl && (
                                            <div className="mb-3 w-32 h-20 relative overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-750 rounded-lg">
                                                <CachedImage src={formData.imageUrl} alt="Current thumbnail" fill className="object-cover" />
                                            </div>
                                        )}
                                        <div className="flex items-center gap-4">
                                            <div className="flex-1 relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <ImageIcon className="w-5 h-5 text-gray-400" />
                                                </div>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                                    className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 pl-12 focus:outline-none focus:border-red-700 transition-colors text-gray-900 dark:text-white file:mr-4 file:py-1 file:px-4 file:rounded-none file:border-0 file:text-xs file:font-bold file:bg-gray-100 dark:file:bg-gray-800 file:text-gray-700 dark:file:text-gray-300 hover:file:bg-gray-200 dark:hover:file:bg-gray-700 rounded-lg"
                                                />
                                                {selectedFile && <p className="text-[10px] text-green-600 font-bold mt-1 absolute -bottom-5 left-0">Selected: {selectedFile.name}</p>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                             <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-gray-50 dark:bg-black border-none p-4 font-bold text-sm focus:ring-2 focus:ring-red-700 transition-all min-h-[120px]"
                                />
                            </div>

                            <div className="pt-12">
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="w-full bg-red-700 hover:bg-red-800 disabled:bg-gray-400 text-white py-5 font-black uppercase tracking-[0.3em] text-sm shadow-xl transition-all flex items-center justify-center gap-3"
                                >
                                    <Save className="w-5 h-5" />
                                    {saving ? 'Updating Database...' : 'Commit Changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
