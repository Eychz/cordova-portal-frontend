'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { servicesApi } from '@/lib/servicesApi';
import { ArrowLeft, Save, Plus, Trash2, FileText, Heart, Shield, Users, Building, Scale, Home, Briefcase, Car, Stethoscope } from 'lucide-react';
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

const ICONS = [
    { name: 'FileText', label: 'Document / Form', component: FileText },
    { name: 'Heart', label: 'Health / Welfare', component: Heart },
    { name: 'Shield', label: 'Security / Protection', component: Shield },
    { name: 'Users', label: 'Community / People', component: Users },
    { name: 'Building', label: 'Business / Infrastructure', component: Building },
    { name: 'Scale', label: 'Legal / Justice', component: Scale },
    { name: 'Home', label: 'Housing / Real Estate', component: Home },
    { name: 'Briefcase', label: 'Employment / Jobs', component: Briefcase },
    { name: 'Car', label: 'Transport / Vehicle', component: Car },
    { name: 'Stethoscope', label: 'Medical / Clinic', component: Stethoscope }
];

export default function CreateServicePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        fee: '',
        requirementsList: [''],
        processStepsList: [''],
        category: 'General Services',
        icon: 'FileText',
        hotline: '',
        email: '',
        processingTime: ''
    });

    const handleSave = async () => {
        if (!formData.name || !formData.description) {
            toast.error('Please fill in the required fields');
            return;
        }

        setLoading(true);
        try {
            const validSteps = formData.processStepsList.filter(s => s.trim() !== '');
            const validReqs = formData.requirementsList.filter(r => r.trim() !== '');
            
            const payload = {
                name: formData.name,
                description: formData.description,
                fee: formData.fee,
                requirements: validReqs,
                processSteps: validSteps,
                category: formData.category,
                icon: formData.icon,
                hotline: formData.hotline,
                email: formData.email,
                processingTime: formData.processingTime
            };

            await servicesApi.create(payload);
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
        <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-[#0a0a0a]">
            <Toaster position="top-right" />
            <DashboardSidebar />
            <main className="flex-1 flex flex-col overflow-hidden">
                <DashboardHeader title="Create New Service" />
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
                                            className="w-full bg-gray-50 dark:bg-black border-none p-4 font-bold text-sm focus:ring-2 focus:ring-red-700 transition-all"
                                            placeholder="e.g., Business Permit Renewal"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Category</label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full bg-gray-50 dark:bg-black border-none p-4 font-bold text-sm focus:ring-2 focus:ring-red-700 transition-all"
                                        >
                                            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Service Icon</label>
                                        <div className="grid grid-cols-5 gap-2">
                                            {ICONS.map((icon) => (
                                                <button
                                                    key={icon.name}
                                                    onClick={() => setFormData({ ...formData, icon: icon.name })}
                                                    className={`p-3 flex items-center justify-center border-2 transition-all ${
                                                        formData.icon === icon.name 
                                                        ? 'border-red-700 bg-red-50 dark:bg-red-950/20 text-red-700' 
                                                        : 'border-transparent bg-gray-50 dark:bg-black text-gray-400'
                                                    }`}
                                                    title={icon.label}
                                                >
                                                    <icon.component className="w-5 h-5" />
                                                </button>
                                            ))}
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
                                    placeholder="Explain what this service is for and who can apply..."
                                />
                            </div>

                            <div className="grid md:grid-cols-3 gap-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Processing Fee</label>
                                    <input
                                        type="text"
                                        value={formData.fee}
                                        onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
                                        className="w-full bg-gray-50 dark:bg-black border-none p-4 font-bold text-sm focus:ring-2 focus:ring-red-700 transition-all"
                                        placeholder="e.g. ₱150.00 or Free"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Est. Finish Time</label>
                                    <input
                                        type="text"
                                        value={formData.processingTime}
                                        onChange={(e) => setFormData({ ...formData, processingTime: e.target.value })}
                                        className="w-full bg-gray-50 dark:bg-black border-none p-4 font-bold text-sm focus:ring-2 focus:ring-red-700 transition-all"
                                        placeholder="e.g. 3-5 Business Days"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Contact Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-gray-50 dark:bg-black border-none p-4 font-bold text-sm focus:ring-2 focus:ring-red-700 transition-all"
                                        placeholder="dept@cordova.gov.ph"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Hotline Number</label>
                                <input
                                    type="text"
                                    value={formData.hotline}
                                    onChange={(e) => setFormData({ ...formData, hotline: e.target.value })}
                                    className="w-full bg-gray-50 dark:bg-black border-none p-4 font-bold text-sm focus:ring-2 focus:ring-red-700 transition-all"
                                    placeholder="e.g. (032) 496-0000"
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-12 pt-10 border-t border-gray-100 dark:border-gray-800">
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Requirements</label>
                                        <button 
                                            onClick={() => setFormData({ ...formData, requirementsList: [...formData.requirementsList, ''] })}
                                            className="text-[10px] font-black text-red-700 uppercase tracking-widest hover:underline"
                                        >
                                            + Add Item
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        {formData.requirementsList.map((req, index) => (
                                            <div key={index} className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={req}
                                                    onChange={(e) => {
                                                        const newList = [...formData.requirementsList];
                                                        newList[index] = e.target.value;
                                                        setFormData({ ...formData, requirementsList: newList });
                                                    }}
                                                    className="flex-1 bg-gray-50 dark:bg-black border-none p-3 font-bold text-xs focus:ring-1 focus:ring-red-700"
                                                    placeholder={`Requirement #${index + 1}`}
                                                />
                                                {formData.requirementsList.length > 1 && (
                                                    <button 
                                                        onClick={() => setFormData({ ...formData, requirementsList: formData.requirementsList.filter((_, i) => i !== index) })}
                                                        className="p-3 text-gray-400 hover:text-red-700"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">Process Steps</label>
                                        <button 
                                            onClick={() => setFormData({ ...formData, processStepsList: [...formData.processStepsList, ''] })}
                                            className="text-[10px] font-black text-red-700 uppercase tracking-widest hover:underline"
                                        >
                                            + Add Step
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        {formData.processStepsList.map((step, index) => (
                                            <div key={index} className="flex gap-2 items-center">
                                                <span className="w-8 text-[10px] font-black text-gray-300"># {index + 1}</span>
                                                <input
                                                    type="text"
                                                    value={step}
                                                    onChange={(e) => {
                                                        const newList = [...formData.processStepsList];
                                                        newList[index] = e.target.value;
                                                        setFormData({ ...formData, processStepsList: newList });
                                                    }}
                                                    className="flex-1 bg-gray-50 dark:bg-black border-none p-3 font-bold text-xs focus:ring-1 focus:ring-red-700"
                                                    placeholder="Describe the step..."
                                                />
                                                {formData.processStepsList.length > 1 && (
                                                    <button 
                                                        onClick={() => setFormData({ ...formData, processStepsList: formData.processStepsList.filter((_, i) => i !== index) })}
                                                        className="p-3 text-gray-400 hover:text-red-700"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
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
