'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardSidebar from '../../components/DashboardSidebar';
import DashboardHeader from '../../components/DashboardHeader';
import { ArrowLeft, Save, Image as ImageIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast, { Toaster } from 'react-hot-toast';
import { postsApi } from 'lib/postsApi';
import { uploadFile } from 'lib/apiClient';
import { useQueryClient } from '@tanstack/react-query';

// Schema for form validation
const postSchema = z.object({
    title: z.string().min(5, 'Title must be at least 5 characters').max(200, 'Title cannot exceed 200 characters'),
    content: z.string().min(20, 'Content must be at least 20 characters'),
    type: z.enum(['announcement', 'news', 'event']),
    priority: z.enum(['row1_carousel', 'row1_grid', 'row2_carousel', 'row2_grid', 'low_priority']),
    category: z.string().min(2, 'Category is required'),
});

type PostFormData = z.infer<typeof postSchema>;

const CreatePostPage = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<PostFormData>({
        resolver: zodResolver(postSchema),
        defaultValues: {
            type: 'announcement',
            priority: 'low_priority',

            // 
            category: 'General'
        }
    });

    const onSubmit = async (data: PostFormData) => {
        setIsSubmitting(true);
        try {
            let finalImageUrl = 'https://picsum.photos/seed/newpost/800/400';

            // Upload to Supabase Bucket if file exists
            if (selectedFile) {
                toast.loading('Uploading image...', { id: 'uploadToast' });
                finalImageUrl = await uploadFile(selectedFile);
                toast.success('Image uploaded!', { id: 'uploadToast' });
            }

            // Simulated API call. Replace with actual backend integration.
            await postsApi.create({
                ...data,
                imageUrl: finalImageUrl,
            });
            queryClient.invalidateQueries({ queryKey: ['adminPosts'] });
            queryClient.invalidateQueries({ queryKey: ['adminActivities'] });
            toast.success('Post created successfully!');
            setTimeout(() => {
                router.push('/admin/dashboard/posts');
            }, 1500);
        } catch (err: any) {
            toast.error(err.message || 'Failed to create post. Please try again.', { id: 'uploadToast' });
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex h-screen overflow-hidden relative">
            <Toaster position="top-right" />
            
            {/* Mobile Sidebar overlay backdrop */}
            {isSidebarOpen && (
                <div 
                    onClick={() => setIsSidebarOpen(false)}
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity animate-fadeIn"
                />
            )}

            <DashboardSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <main className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-[#0a0a0a]">
                <DashboardHeader title="Create New Post" onMenuClick={() => setIsSidebarOpen(true)} />

                <div className="flex-1 overflow-y-auto p-12">
                    <div className="max-w-4xl mx-auto">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 text-red-700 dark:text-red-500 font-bold uppercase tracking-widest text-xs hover:text-red-800 transition-colors mb-8"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Content Management
                        </button>

                        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8 shadow-none">
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-8 border-l-4 border-red-700 pl-4">
                                Post Details
                            </h2>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Post Title</label>
                                    <input
                                        {...register('title')}
                                        className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 focus:outline-none focus:border-red-700 transition-colors text-gray-900 dark:text-white"
                                        placeholder="Enter the official title..."
                                    />
                                    {errors.title && <p className="text-red-500 text-xs mt-1 font-bold">{errors.title.message}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Content Type</label>
                                        <select
                                            {...register('type')}
                                            className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 focus:outline-none focus:border-red-700 transition-colors text-gray-900 dark:text-white appearance-none"
                                        >
                                            <option value="announcement">Announcement</option>
                                            <option value="news">News</option>
                                            <option value="event">Event</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Display Placement (Hierarchy)</label>
                                        <select
                                            {...register('priority')}
                                            className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 focus:outline-none focus:border-red-700 transition-colors text-gray-900 dark:text-white appearance-none"
                                        >
                                            <option value="row1_carousel">High Priority : First row</option>
                                            <option value="row1_grid">Normal Priority : First row</option>
                                            <option value="row2_carousel">High Priority : Second row</option>
                                            <option value="row2_grid">Normal Priority : Second row</option>
                                            <option value="low_priority">Low Priority List</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Category</label>
                                        <select
                                            {...register('category')}
                                            className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 focus:outline-none focus:border-red-700 transition-colors text-gray-900 dark:text-white"
                                        >
                                            <option value="General">General</option>
                                            <option value="Infrastructure">Infrastructure</option>
                                            <option value="Tourism">Tourism</option>
                                            <option value="Culture">Culture</option>
                                            <option value="Education">Education</option>
                                            <option value="Health">Health</option>
                                            <option value="Governance">Governance</option>
                                            <option value="Community">Community</option>
                                            <option value="Celebration">Celebration</option>
                                            <option value="Disaster">Disaster</option>
                                            <option value="Public Advisory">Public Advisory</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        {errors.category && <p className="text-red-500 text-xs mt-1 font-bold">{errors.category.message}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Main Content</label>
                                    <textarea
                                        {...register('content')}
                                        rows={8}
                                        className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 focus:outline-none focus:border-red-700 transition-colors text-gray-900 dark:text-white resize-y"
                                        placeholder="Write the full content here..."
                                    />
                                    {errors.content && <p className="text-red-500 text-xs mt-1 font-bold">{errors.content.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Featured Image (Optional)</label>
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1 relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <ImageIcon className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                                className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 pl-12 focus:outline-none focus:border-red-700 transition-colors text-gray-900 dark:text-white file:mr-4 file:py-1 file:px-4 file:rounded-none file:border-0 file:text-xs file:font-bold file:bg-gray-100 dark:file:bg-gray-800 file:text-gray-700 dark:file:text-gray-300 hover:file:bg-gray-200 dark:hover:file:bg-gray-700"
                                            />
                                            {selectedFile && <p className="text-[10px] text-green-600 font-bold mt-1 absolute -bottom-5 left-0">Selected: {selectedFile.name}</p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-gray-200 dark:border-gray-800 flex justify-end gap-4">
                                    <button
                                        type="button"
                                        onClick={() => router.back()}
                                        className="px-8 py-4 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-black uppercase tracking-widest text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-8 py-4 bg-red-700 text-white font-black uppercase tracking-widest text-sm hover:bg-red-800 transition-colors disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {isSubmitting ? 'Publishing...' : (
                                            <>
                                                <Save className="w-4 h-4" />
                                                Publish Post
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CreatePostPage;
