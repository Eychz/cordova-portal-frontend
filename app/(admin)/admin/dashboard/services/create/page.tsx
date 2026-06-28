'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { servicesApi } from '@/lib/servicesApi';
import { ArrowLeft, Save, Image as ImageIcon } from 'lucide-react';
import { uploadFile } from '@/lib/apiClient';
import { useQueryClient } from '@tanstack/react-query';
import DashboardSidebar from '../../components/DashboardSidebar';
import DashboardHeader from '../../components/DashboardHeader';
import toast, { Toaster } from 'react-hot-toast';

const CATEGORIES = [
    'Permits & Licenses',
    'Health & Medical',
    'Social Welfare',
    'Civil Registry',
    'General Services',
    'Other'
];


export default function CreateServicePage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        externalUrl: '',
        category: 'General Services'
    });

    const handleSave = async () => {
        if (!formData.name || !formData.description) {
            toast.error('Please fill in the required fields');
            return;
        }

        setLoading(true);
        try {
            let finalImageUrl = '';

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

            await servicesApi.create(payload);
            queryClient.invalidateQueries({ queryKey: ['adminServices'] });
            queryClient.invalidateQueries({ queryKey: ['publicServices'] });
            toast.success('Service created successfully');
            router.push('/admin/dashboard/services');
        } catch (err) {
            console.error(err);
            toast.error('Failed to create service');
        } finally {
            setLoading(false);
        }
    };

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
                <DashboardHeader title="Create New Service" onMenuClick={() => setIsSidebarOpen(true)} />
                <div className="flex-1 overflow-y-auto p-12">
                    <div className="max-w-4xl mx-auto">
                        <button
                            onClick={() => router.push('/admin/dashboard/services')}
                            className="flex items-center gap-2 text-gray-500 hover:text-red-700 font-bold text-xs uppercase tracking-widest mb-8 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" /> Back to Services
                        </button>

                        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-10 shadow-2xl space-y-10">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Service Name *</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-gray-50 dark:bg-black border-none p-4 font-bold text-sm focus:ring-2 focus:ring-red-700 transition-all rounded-lg"
                                            placeholder="e.g., Business Permit Renewal"
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
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Description *</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-gray-50 dark:bg-black border-none p-4 font-bold text-sm focus:ring-2 focus:ring-red-700 transition-all min-h-[120px]"
                                    placeholder="Explain what this service is for..."
                                />
                            </div>

                            <div className="pt-12">
                                <button
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="w-full bg-red-700 hover:bg-red-800 disabled:bg-gray-400 text-white py-5 font-black uppercase tracking-[0.3em] text-sm shadow-xl transition-all flex items-center justify-center gap-3"
                                >
                                    <Save className="w-5 h-5" />
                                    {loading ? 'Creating Service...' : 'Deploy New Service'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
