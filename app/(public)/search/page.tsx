'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import PageTransition from '@/components/PageTransition';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { postsApi, Post } from '@/lib/postsApi';
import { servicesApi, Service } from '@/lib/servicesApi';
import { slugify } from '@/utils/slugify';
import { getIconByName } from '@/utils/iconMapper';
import { Search as SearchIcon, Calendar as CalendarIcon, ArrowRight, FileText, Info, HelpCircle, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { SearchCardSkeleton } from '@/components/Skeleton';

interface UnifiedResult {
    id: string | number;
    title: string;
    description: string;
    date: string;
    rawDate: string;
    category: string;
    type: 'news' | 'announcement' | 'event' | 'service';
    authorName?: string;
    imageUrl?: string;
    icon?: string;
}

const SearchLoadingState = () => (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
        <Navbar activePage="Search" />
        <main className="flex-grow maximize-width px-4 py-24 text-center">
            <div className="animate-pulse space-y-8">
                <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded w-1/3 mx-auto"></div>
                <div className="h-64 bg-gray-150 dark:bg-gray-850 rounded max-w-4xl mx-auto"></div>
            </div>
        </main>
        <Footer />
    </div>
);

const SearchContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const queryQ = searchParams.get('q') || '';
    const queryDate = searchParams.get('date') || '';

    const [q, setQ] = useState(queryQ);
    const [date, setDate] = useState(queryDate);
    const [results, setResults] = useState<UnifiedResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState<'all' | 'news' | 'event' | 'announcement' | 'service'>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const PAGE_LIMIT = 10;

    // Sync input values with URL changes
    useEffect(() => {
        setQ(queryQ);
        setDate(queryDate);
    }, [queryQ, queryDate]);

    // Load data from APIs
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);
                
                // Fetch posts and services concurrently
                const [posts, services] = await Promise.all([
                    postsApi.getAll(),
                    servicesApi.getAll()
                ]);

                // Map posts
                const mappedPosts: UnifiedResult[] = posts.map(post => ({
                    id: post.id || post.uuid || Math.random(),
                    title: post.title,
                    description: post.content,
                    date: new Date(post.createdAt || '').toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    }),
                    rawDate: post.createdAt || '',
                    category: post.category || 'General',
                    type: post.type, // 'news', 'announcement', 'event'
                    authorName: post.authorName,
                    imageUrl: post.imageUrl
                }));

                // Map services
                const mappedServices: UnifiedResult[] = services.map(service => ({
                    id: service.id,
                    title: service.name || service.title || 'Constituent Service',
                    description: service.description,
                    date: new Date(service.createdAt || '').toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    }),
                    rawDate: service.createdAt || '',
                    category: service.category || 'General Service',
                    type: 'service',
                    icon: service.icon
                }));

                // Combine them
                const combined = [...mappedPosts, ...mappedServices];
                setResults(combined);
            } catch (error) {
                console.error('Error during data fetch:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    // Filter Logic
    const filteredResults = useMemo(() => {
        return results.filter(item => {
            // Text search matches title, description, category
            const matchesText = !q.trim() || 
                item.title.toLowerCase().includes(q.toLowerCase()) ||
                item.description.toLowerCase().includes(q.toLowerCase()) ||
                item.category.toLowerCase().includes(q.toLowerCase());

            // Date match logic
            let matchesDate = true;
            if (date) {
                const itemDateObj = new Date(item.rawDate);
                const queryDateObj = new Date(date);
                matchesDate = 
                    itemDateObj.getFullYear() === queryDateObj.getFullYear() &&
                    itemDateObj.getMonth() === queryDateObj.getMonth() &&
                    itemDateObj.getDate() === queryDateObj.getDate();
            }

            return matchesText && matchesDate;
        });
    }, [results, q, date]);

    // Group counts for tabs
    const counts = useMemo(() => {
        const c = { all: 0, news: 0, event: 0, announcement: 0, service: 0 };
        filteredResults.forEach(item => {
            c.all += 1;
            if (item.type in c) {
                c[item.type as 'news' | 'event' | 'announcement' | 'service'] += 1;
            }
        });
        return c;
    }, [filteredResults]);

    // Filter by Tab
    const tabFilteredResults = useMemo(() => {
        if (selectedTab === 'all') return filteredResults;
        return filteredResults.filter(item => item.type === selectedTab);
    }, [filteredResults, selectedTab]);

    // Pagination
    const totalPages = Math.ceil(tabFilteredResults.length / PAGE_LIMIT);
    const paginatedResults = useMemo(() => {
        const start = (currentPage - 1) * PAGE_LIMIT;
        return tabFilteredResults.slice(start, start + PAGE_LIMIT);
    }, [tabFilteredResults, currentPage]);

    // Reset pagination when search parameters or tab change
    useEffect(() => {
        setCurrentPage(1);
    }, [q, date, selectedTab]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (q.trim()) params.append('q', q.trim());
        if (date) params.append('date', date);
        router.push(`/search?${params.toString()}`);
    };

    const handleClearFilters = () => {
        setQ('');
        setDate('');
        router.push('/search');
    };

    const handleItemClick = (item: UnifiedResult) => {
        if (item.type === 'service') {
            router.push(`/services/${slugify(item.title)}`);
        } else {
            router.push(`/community/${item.type}/${slugify(item.title)}`);
        }
    };

    const getBadgeStyle = (type: string) => {
        switch (type) {
            case 'news':
                return 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border-blue-100 dark:border-blue-800/30';
            case 'event':
                return 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400 border-purple-100 dark:border-purple-800/30';
            case 'announcement':
                return 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border-amber-100 dark:border-amber-800/30';
            case 'service':
                return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/30';
            default:
                return 'bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-100 dark:border-gray-700';
        }
    };

    return (
        <PageTransition>
            <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors flex flex-col">
                <Navbar activePage="Search" />

                {/* Search Banner */}
                <header className="bg-red-800 text-white pt-24 pb-16 border-b-8 border-red-700">
                    <div className="maximize-width px-4">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 bg-white text-red-800 px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em]">
                                Search Directory
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
                                Central Portal Search
                            </h1>
                            
                            {/* Inline Form to Search */}
                            <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2 bg-white/10 p-3 rounded-lg border border-white/20 max-w-4xl backdrop-blur-sm">
                                <div className="flex-grow flex items-center bg-white dark:bg-gray-800 rounded-md px-3 py-2 border border-transparent focus-within:ring-2 focus-within:ring-white">
                                    <SearchIcon className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" />
                                    <input
                                        type="text"
                                        placeholder="Search news, events, announcements, or services..."
                                        value={q}
                                        onChange={(e) => setQ(e.target.value)}
                                        className="bg-transparent border-none outline-none text-sm text-gray-800 dark:text-gray-150 w-full focus:ring-0 focus:outline-none placeholder-gray-400"
                                    />
                                    {q && (
                                        <button type="button" onClick={() => setQ('')} className="text-gray-400 hover:text-gray-600">
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                                <div className="flex items-center bg-white dark:bg-gray-800 rounded-md px-3 py-2 border border-transparent focus-within:ring-2 focus-within:ring-white min-w-[200px]">
                                    <CalendarIcon className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0" />
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="bg-transparent border-none outline-none text-sm text-gray-800 dark:text-gray-150 w-full focus:ring-0 focus:outline-none dark:[color-scheme:dark]"
                                    />
                                    {date && (
                                        <button type="button" onClick={() => setDate('')} className="text-gray-400 hover:text-gray-600">
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                                <button
                                    type="submit"
                                    className="bg-white hover:bg-gray-100 text-red-800 font-bold px-6 py-2 rounded-md transition-colors flex items-center justify-center gap-2"
                                >
                                    <SearchIcon className="w-4 h-4" />
                                    Search
                                </button>
                            </form>
                            
                            {(queryQ || queryDate) && (
                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                    <span className="text-red-200">Active filters:</span>
                                    {queryQ && (
                                        <span className="bg-red-900/40 text-red-100 px-2.5 py-1 rounded-full border border-red-700/50 flex items-center gap-1.5">
                                            Query: &ldquo;{queryQ}&rdquo;
                                        </span>
                                    )}
                                    {queryDate && (
                                        <span className="bg-red-900/40 text-red-100 px-2.5 py-1 rounded-full border border-red-700/50 flex items-center gap-1.5">
                                            Date: {new Date(queryDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </span>
                                    )}
                                    <button
                                        type="button"
                                        onClick={handleClearFilters}
                                        className="text-white underline hover:text-red-200 ml-2"
                                    >
                                        Clear all filters
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Results Section */}
                <main className="flex-grow maximize-width px-4 py-12">
                    {loading ? (
                        <div className="space-y-6">
                            {[1, 2, 3, 4].map(i => (
                                <SearchCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : (
                        <div>
                            {/* Tab Filters */}
                            <div className="flex border-b border-gray-200 dark:border-gray-800 overflow-x-auto pb-px mb-8 scrollbar-none gap-2">
                                {(['all', 'news', 'event', 'announcement', 'service'] as const).map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setSelectedTab(tab)}
                                        className={`px-4 py-3 text-sm font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
                                            selectedTab === tab
                                                ? 'border-red-600 text-red-600 font-black'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                        }`}
                                    >
                                        {tab === 'all' ? 'All Results' : tab + 's'}
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                                            selectedTab === tab 
                                                ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' 
                                                : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                                        }`}>
                                            {counts[tab]}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            {/* List Container */}
                            <div className="space-y-6">
                                {paginatedResults.length > 0 ? (
                                    paginatedResults.map(item => {
                                        const ServiceIconComponent = item.type === 'service' && item.icon ? getIconByName(item.icon) : null;
                                        
                                        return (
                                            <div
                                                key={`${item.type}-${item.id}`}
                                                onClick={() => handleItemClick(item)}
                                                className="group cursor-pointer bg-white dark:bg-gray-850 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-xl p-6 transition-all duration-300 hover:shadow-md hover:border-red-200 dark:hover:border-red-900/50 flex flex-col sm:flex-row gap-6"
                                            >
                                                {/* Left Side: Thumbnail or Icon */}
                                                <div className="w-full h-48 sm:w-48 sm:h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center border border-gray-200 dark:border-gray-700 relative">
                                                    {item.imageUrl ? (
                                                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                    ) : ServiceIconComponent ? (
                                                        <ServiceIconComponent className="w-12 h-12 text-red-600 dark:text-red-400" />
                                                    ) : (
                                                        <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                                                    )}
                                                </div>

                                                {/* Right Side: Details */}
                                                <div className="flex-grow flex flex-col justify-between">
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className={`px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest border rounded-full ${getBadgeStyle(item.type)}`}>
                                                                {item.type}
                                                            </span>
                                                            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                                                                {item.category}
                                                            </span>
                                                            <span className="text-xs text-gray-400 dark:text-gray-500">
                                                                • {item.date}
                                                            </span>
                                                        </div>
                                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors uppercase tracking-tight line-clamp-1">
                                                            {item.title}
                                                        </h3>
                                                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                                                            {item.description.replace(/<[^>]*>/g, '') /* Strip html tags */}
                                                        </p>
                                                    </div>
                                                    
                                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800/60 mt-4">
                                                        <span className="text-xs text-gray-400 dark:text-gray-500">
                                                            {item.authorName ? `Published by ${item.authorName}` : ' Cordova Government'}
                                                        </span>
                                                        <span className="text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                                            Read Full Page
                                                            <ArrowRight className="w-3.5 h-3.5" />
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="py-24 text-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-850">
                                        <Info className="w-12 h-12 text-gray-350 dark:text-gray-600 mx-auto mb-4" />
                                        <h3 className="text-lg font-black uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1">
                                            No Results Found
                                        </h3>
                                        <p className="text-sm text-gray-400 max-w-md mx-auto">
                                            We couldn&rsquo;t find anything matching your search query. Try checking your spelling or adjusting your filters.
                                        </p>
                                        {(q || date) && (
                                            <button
                                                type="button"
                                                onClick={handleClearFilters}
                                                className="mt-6 bg-red-650 hover:bg-red-750 text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-lg shadow transition-colors"
                                            >
                                                Clear Search Filters
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-4 mt-12 border-t border-gray-150 dark:border-gray-800/80 pt-6">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                        className="p-2 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 rounded-lg transition-colors"
                                    >
                                        <ChevronLeft className="w-5 h-5 text-gray-650 dark:text-gray-350" />
                                    </button>
                                    <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
                                        className="p-2 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 rounded-lg transition-colors"
                                    >
                                        <ChevronRight className="w-5 h-5 text-gray-650 dark:text-gray-350" />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </main>

                <Footer />
            </div>
        </PageTransition>
    );
};

export default function SearchPage() {
    return (
        <Suspense fallback={<SearchLoadingState />}>
            <SearchContent />
        </Suspense>
    );
}
