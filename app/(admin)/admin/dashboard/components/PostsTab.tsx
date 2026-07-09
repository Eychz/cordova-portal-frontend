'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Search, Filter, Plus, Edit, Trash2, FileText } from 'lucide-react';
import { postsApi, Post } from 'lib/postsApi';
import Pagination from './Pagination';
import toast from 'react-hot-toast';

export default function PostsTab() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    // TanStack Query fetching paginated and filtered posts from backend
    const { data, isLoading, isError } = useQuery({
        queryKey: ['adminPostsPaginated', currentPage, filter, search, dateFilter],
        queryFn: async () => {
            return postsApi.getPaginated({
                page: currentPage,
                limit: itemsPerPage,
                type: filter !== 'all' ? filter : undefined,
                search: search || undefined,
                date: dateFilter || undefined
            });
        },
        placeholderData: (prev) => prev,
        staleTime: 5 * 60 * 1000,
    });

    const posts = data?.posts || [];
    const pagination = data?.pagination || { total: 0, page: 1, limit: itemsPerPage, totalPages: 1 };

    const handleDeletePost = async (id: number) => {
        if (!confirm('Are you sure you want to delete this post?')) return;
        try {
            await postsApi.delete(id);
            queryClient.invalidateQueries({ queryKey: ['adminPostsPaginated'] });
            queryClient.invalidateQueries({ queryKey: ['adminActivities'] });
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            queryClient.invalidateQueries({ queryKey: ['publicHomeCarouselPosts'] });
            queryClient.invalidateQueries({ queryKey: ['publicHomeFeaturedPosts'] });
            toast.success('Post deleted successfully');
        } catch (err) {
            toast.error('Failed to delete post');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-900 p-6 border border-gray-200 dark:border-gray-800">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search posts..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-red-600 font-bold text-sm text-gray-900 dark:text-white"
                    />
                </div>
                <div className="flex flex-wrap items-center gap-4">
                    <input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }}
                        className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-red-600 font-bold text-sm text-gray-900 dark:text-white"
                    />
                    <div className="relative">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <select
                            value={filter}
                            onChange={(e) => { setFilter(e.target.value); setCurrentPage(1); }}
                            className="pl-10 pr-8 py-3 bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-red-600 font-bold text-sm text-gray-900 dark:text-white appearance-none"
                        >
                            <option value="all">All Content</option>
                            <option value="news">News</option>
                            <option value="announcement">Announcements</option>
                            <option value="event">Events</option>
                        </select>
                    </div>
                    <button
                        onClick={() => router.push('/admin/dashboard/posts/create')}
                        className="px-6 py-3 bg-red-700 text-white font-black text-sm uppercase tracking-widest hover:bg-red-800 transition-all flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" /> Create Post
                    </button>
                </div>
            </div>

            {/* Table Output */}
            {isLoading ? (
                <div className="flex justify-center items-center py-20 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                    <div className="w-10 h-10 border-4 border-red-700 border-t-transparent animate-spin rounded-full"></div>
                </div>
            ) : isError ? (
                <div className="text-center py-12 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900">
                    <p className="font-bold">Failed to load posts. Please reload the page.</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[800px]">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                                    <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Content</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Type</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Category</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Date</th>
                                    <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {posts.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-12 text-center">
                                            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">No posts found matching your criteria</p>
                                        </td>
                                    </tr>
                                ) : (
                                    posts.map((post) => (
                                        <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 group-hover:bg-red-50 dark:group-hover:bg-red-900/10 transition-colors">
                                                        <FileText className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-red-700 transition-colors" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight line-clamp-1">{post.title}</p>
                                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{post.authorName || 'Cordova PIO'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
                                                    post.type === 'news' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' :
                                                    post.type === 'event' ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400' :
                                                    'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400'
                                                }`}>
                                                    {post.type}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{post.category || 'Uncategorized'}</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'N/A'}</p>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => router.push(`/admin/dashboard/posts/edit/${post.id}`)}
                                                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeletePost(post.id!)}
                                                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                                    >
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
                        totalItems={pagination.total}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}
        </div>
    );
}
