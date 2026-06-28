'use client';

import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { changeLogApi, ChangeLog } from '@/lib/changeLogApi';
import { Plus, Edit2, Trash2, Calendar, User, Check, X, Shield, History } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ChangeLogsTab() {
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLog, setEditingLog] = useState<ChangeLog | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        description: '',
        date: new Date().toISOString().split('T')[0],
        contributor: '',
        approvedBy: ''
    });

    // TanStack Query caching change logs
    const { data, isLoading, isError } = useQuery({
        queryKey: ['adminChangeLogs', page],
        queryFn: () => changeLogApi.getAll(page, 15),
        placeholderData: (prev) => prev,
        staleTime: 5 * 60 * 1000,
    });

    const logs = data?.data || [];
    const pagination = data?.pagination || { total: 0, page: 1, limit: 15, totalPages: 1 };

    const handleOpenCreateModal = () => {
        setEditingLog(null);
        setFormData({
            description: '',
            date: new Date().toISOString().split('T')[0],
            contributor: '',
            approvedBy: ''
        });
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (log: ChangeLog) => {
        setEditingLog(log);
        setFormData({
            description: log.description,
            date: new Date(log.date).toISOString().split('T')[0],
            contributor: log.contributor,
            approvedBy: log.approvedBy
        });
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.description || !formData.date || !formData.contributor || !formData.approvedBy) {
            toast.error('All fields are required');
            return;
        }

        setSubmitting(true);
        try {
            if (editingLog) {
                await changeLogApi.update(editingLog.id, formData);
                toast.success('Change log updated successfully');
            } else {
                await changeLogApi.create(formData);
                toast.success('Change log created successfully');
            }
            queryClient.invalidateQueries({ queryKey: ['adminChangeLogs'] });
            setIsModalOpen(false);
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || 'Failed to save change log');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this change log?')) return;
        try {
            await changeLogApi.delete(id);
            toast.success('Change log deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['adminChangeLogs'] });
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || 'Failed to delete change log');
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="space-y-6">
            {/* Header & Controls */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-black uppercase tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
                        <History className="w-5 h-5 text-red-700" /> Change Log Directory
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Track system adjustments, features, and core platform modifications.
                    </p>
                </div>
                <button
                    onClick={handleOpenCreateModal}
                    className="bg-red-700 hover:bg-red-800 text-white px-8 py-3 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all self-start sm:self-auto"
                >
                    <Plus className="w-4 h-4" /> Add Change Log
                </button>
            </div>

            {/* List Table */}
            {isLoading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="w-10 h-10 border-4 border-red-700 border-t-transparent animate-spin rounded-full"></div>
                </div>
            ) : isError ? (
                <div className="text-center py-12 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900">
                    <p className="font-bold">Failed to load change logs. Please try again.</p>
                </div>
            ) : logs.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 dark:bg-gray-900/50 border border-dashed border-gray-300 dark:border-gray-800">
                    <History className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">No change logs found</p>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 text-[10px] font-black uppercase tracking-wider text-gray-400">
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4">Description</th>
                                        <th className="px-6 py-4">Contributor</th>
                                        <th className="px-6 py-4">Approved By</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-800 text-sm">
                                    {logs.map((log) => (
                                        <tr key={log.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                {formatDate(log.date)}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 dark:text-gray-300 max-w-md font-medium">
                                                {log.description}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400 font-semibold">
                                                <span className="flex items-center gap-1.5">
                                                    <User className="w-3.5 h-3.5 text-gray-400" />
                                                    {log.contributor}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400 font-semibold">
                                                <span className="flex items-center gap-1.5">
                                                    <Shield className="w-3.5 h-3.5 text-gray-400" />
                                                    {log.approvedBy}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-bold space-x-2">
                                                <button
                                                    onClick={() => handleOpenEditModal(log)}
                                                    className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
                                                >
                                                    <Edit2 className="w-3.5 h-3.5" /> Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(log.id)}
                                                    className="inline-flex items-center gap-1 text-red-600 dark:text-red-400 hover:underline"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" /> Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination Controls */}
                    {pagination.totalPages > 1 && (
                        <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                className="px-4 py-2 border border-gray-200 dark:border-gray-800 text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:pointer-events-none transition-colors"
                            >
                                Previous
                            </button>
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                                Page {page} of {pagination.totalPages}
                            </span>
                            <button
                                disabled={page === pagination.totalPages}
                                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                                className="px-4 py-2 border border-gray-200 dark:border-gray-800 text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:pointer-events-none transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Modal Dialog */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 max-w-lg w-full shadow-2xl overflow-hidden animate-scaleIn">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50 dark:bg-gray-950/20">
                            <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-wider text-sm flex items-center gap-2">
                                <History className="w-4.5 h-4.5 text-red-700" />
                                {editingLog ? 'Edit Change Log' : 'Add Change Log'}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-6 space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Description</label>
                                <textarea
                                    required
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={4}
                                    placeholder="Describe the implemented change or adjustment..."
                                    className="w-full p-4 bg-gray-50 dark:bg-black border-none text-sm font-semibold focus:ring-2 focus:ring-red-700 transition-all rounded"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        className="w-full p-4 bg-gray-50 dark:bg-black border-none text-sm font-semibold focus:ring-2 focus:ring-red-700 transition-all rounded"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Contributor</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.contributor}
                                        onChange={(e) => setFormData({ ...formData, contributor: e.target.value })}
                                        placeholder="e.g. Lead Dev, DevOps"
                                        className="w-full p-4 bg-gray-50 dark:bg-black border-none text-sm font-semibold focus:ring-2 focus:ring-red-700 transition-all rounded"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Approved By</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.approvedBy}
                                    onChange={(e) => setFormData({ ...formData, approvedBy: e.target.value })}
                                    placeholder="e.g. Project Manager, Admin"
                                    className="w-full p-4 bg-gray-50 dark:bg-black border-none text-sm font-semibold focus:ring-2 focus:ring-red-700 transition-all rounded"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-3 border border-gray-200 dark:border-gray-800 text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="bg-red-700 hover:bg-red-800 disabled:opacity-50 text-white px-8 py-3 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all"
                                >
                                    {submitting ? 'Saving...' : 'Save Change'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
