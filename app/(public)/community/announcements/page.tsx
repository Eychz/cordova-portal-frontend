'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import PageTransition from '@/components/PageTransition';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Carousel from '@/components/Carousel';
import { HighPriorityCard, NormalPriorityCard, LowPriorityCard } from '@/components/cards';
import { postsApi } from '@/lib/postsApi';
import { Post } from '@/data/adminData';
import { slugify } from '@/utils/slugify';
import { Search, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { ComplexLayoutSkeleton } from '@/components/Skeleton';

interface Announcement {
    id: number;
    uuid?: string;
    title: string;
    description: string;
    content: string;
    date: string;
    imageUrl: string;
    category: string;
    type: string;
    authorName?: string;
    priority: string;
    createdAt: string;
}

const AnnouncementsPage: React.FC = () => {
    const router = useRouter();
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState('');
    
    // Pagination states
    const [currentSearchPage, setCurrentSearchPage] = useState(1);
    const [currentRow1Page, setCurrentRow1Page] = useState(1);
    const [currentRow2Page, setCurrentRow2Page] = useState(1);
    const [currentLowPriorityPage, setCurrentLowPriorityPage] = useState(1);

    const GRID_LIMIT = 4;
    const SEARCH_LIMIT = 12;
    const LOW_PRIORITY_LIMIT = 6;

    useEffect(() => {
        const loadAnnouncements = async () => {
            try {
                setLoading(true);
                const adminPosts = await postsApi.getAll({ type: 'announcement' });
                
                // Sort by createdAt descending (most recent first)
                const sortedPosts = adminPosts.sort((a: Post, b: Post) => 
                    new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
                );

                const mappedAnnouncements: Announcement[] = sortedPosts.map((post: Post) => ({
                    id: post.id!,
                    uuid: post.uuid,
                    title: post.title,
                    description: post.content.slice(0, 150) + '...',
                    content: post.content,
                    date: new Date(post.createdAt!).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    }),
                    imageUrl: post.imageUrl || `https://picsum.photos/seed/${post.id! + 300}/800/600`,
                    category: post.category || 'Public Notice',
                    type: post.type,
                    authorName: post.authorName,
                    priority: post.priority || 'low_priority',
                    createdAt: post.createdAt!
                }));

                setAnnouncements(mappedAnnouncements);
            } catch (err) {
                console.error('Failed to load announcements:', err);
            } finally {
                setLoading(false);
            }
        };

        loadAnnouncements();
    }, []);

    // Filter Logic
    const isSearching = searchQuery.trim() !== '' || selectedCategory !== 'All';

    const searchResults = useMemo(() => {
        return announcements.filter(a => {
            const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 a.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || a.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [announcements, searchQuery, selectedCategory]);

    // Data distribution for complex layout
    const topCarouselPosts = announcements.slice(0, 10);
    const row1CarouselPosts = announcements.filter(a => a.priority === 'row1_carousel').slice(0, 5);
    const row1GridPosts = announcements.filter(a => a.priority === 'row1_grid');
    const row2CarouselPosts = announcements.filter(a => a.priority === 'row2_carousel').slice(0, 5);
    const row2GridPosts = announcements.filter(a => a.priority === 'row2_grid');
    const lowPriorityPosts = announcements.filter(a => a.priority === 'low_priority');

    // Pagination calculations
    const paginatedSearch = searchResults.slice((currentSearchPage - 1) * SEARCH_LIMIT, currentSearchPage * SEARCH_LIMIT);
    const paginatedRow1Grid = row1GridPosts.slice((currentRow1Page - 1) * GRID_LIMIT, currentRow1Page * GRID_LIMIT);
    const paginatedRow2Grid = row2GridPosts.slice((currentRow2Page - 1) * GRID_LIMIT, currentRow2Page * GRID_LIMIT);
    const paginatedLowPriority = lowPriorityPosts.slice((currentLowPriorityPage - 1) * LOW_PRIORITY_LIMIT, currentLowPriorityPage * LOW_PRIORITY_LIMIT);

    const handleAnnouncementClick = (a: Announcement) => {
        router.push(`/community/${a.type}/${slugify(a.title)}`);
    };

    const PaginationControls = ({ currentPage, totalItems, limit, onPageChange }: { currentPage: number, totalItems: number, limit: number, onPageChange: (p: number) => void }) => {
        const totalPages = Math.ceil(totalItems / limit);
        if (totalPages <= 1) return null;
        return (
            <div className="flex items-center gap-4 mt-6">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
                    Page {currentPage} of {totalPages}
                </span>
                <div className="flex gap-1">
                    <button 
                        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="p-2 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button 
                        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        );
    };

    return (
        <PageTransition>
            <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors flex flex-col">
                <Navbar activePage="Community" />
                
                {/* Formal Government Header */}
                <header className="bg-red-800 text-white pt-24 pb-16 border-b-8 border-red-950">
                    <div className="maximize-width px-4">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-2 bg-white text-red-800 px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em]">
                                    Public Information
                                </div>
                                <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">
                                    Announcements
                                </h1>
                                <p className="text-xl text-red-100 font-medium max-w-2xl">
                                    Official news, public notices, and administrative updates from the Cordova Municipal Government.
                                </p>
                            </div>
                            
                            {/* Filter Bar */}
                            <div className="bg-black/20 p-2 flex items-center gap-2 border border-white/10">
                                <select 
                                    value={selectedCategory}
                                    onChange={(e) => { setSelectedCategory(e.target.value); setCurrentSearchPage(1); }}
                                    className="bg-white/10 border border-white/20 px-4 py-2 text-sm text-white focus:outline-none focus:border-white cursor-pointer"
                                >
                                    <option value="All" className="text-gray-900">All Categories</option>
                                    <option value="Emergency Alert" className="text-gray-900">Emergency Alert</option>
                                    <option value="Public Notice" className="text-gray-900">Public Notice</option>
                                    <option value="Health Advisory" className="text-gray-900">Health Advisory</option>
                                    <option value="Community Update" className="text-gray-900">Community Update</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-grow maximize-width px-4 py-16">
                    {loading ? (
                        <ComplexLayoutSkeleton />
                    ) : isSearching ? (
                        /* SEARCH MODE LAYOUT */
                        <section className="mb-20">
                            <div className="flex items-center gap-4 mb-10 border-b-2 border-gray-100 dark:border-gray-800 pb-6">
                                <div className="w-2 h-10 bg-gray-900 dark:bg-gray-100"></div>
                                <h2 className="text-3xl font-black uppercase tracking-tight text-gray-900 dark:text-white">
                                    Search Results
                                </h2>
                            </div>
                            
                            {paginatedSearch.length > 0 ? (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 bg-gray-200 dark:bg-gray-800 p-0 border-none">
                                        {paginatedSearch.map((a) => (
                                            <div key={a.id} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                                                <NormalPriorityCard
                                                    id={a.id}
                                                    title={a.title}
                                                    description={a.description}
                                                    imageUrl={a.imageUrl}
                                                    date={a.date}
                                                    category={a.category}
                                                    authorName={a.authorName}
                                                    onClick={() => handleAnnouncementClick(a)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <PaginationControls 
                                        currentPage={currentSearchPage} 
                                        totalItems={searchResults.length} 
                                        limit={SEARCH_LIMIT} 
                                        onPageChange={setCurrentSearchPage} 
                                    />
                                </>
                            ) : (
                                <div className="py-32 text-center bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-200 dark:border-gray-700">
                                    <Info className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 font-black uppercase tracking-widest">No results found for your search.</p>
                                </div>
                            )}
                        </section>
                    ) : (
                        /* COMPLEX LAYOUT (DEFAULT) */
                        <>
                            {/* TOP CAROUSEL: 10 Recent Posts */}
                            {topCarouselPosts.length > 0 && (
                                <section className="mb-20">
                                    <Carousel hideControls={true} interval={5000}>
                                        {topCarouselPosts.map((a, index) => (
                                            <HighPriorityCard
                                                key={a.id}
                                                id={a.id}
                                                title={a.title}
                                                description={a.description}
                                                imageUrl={a.imageUrl}
                                                date={a.date}
                                                category={a.category}
                                                authorName={a.authorName}
                                                index={index}
                                                onClick={() => handleAnnouncementClick(a)}
                                            />
                                        ))}
                                    </Carousel>
                                </section>
                            )}

                            {/* ROW 1: Grid (Left) + Carousel (Right) */}
                            {(paginatedRow1Grid.length > 0 || row1CarouselPosts.length > 0) && (
                                <section className="mb-20">
                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                        {/* Left Side: 4 Square Grid */}
                                        <div className="lg:col-span-8 flex flex-col">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 flex-grow bg-gray-200 dark:bg-gray-800 p-0 border-none">
                                                {paginatedRow1Grid.map((a) => (
                                                    <div key={a.id} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                                                        <NormalPriorityCard
                                                            id={a.id}
                                                            title={a.title}
                                                            description={a.description}
                                                            imageUrl={a.imageUrl}
                                                            date={a.date}
                                                            category={a.category}
                                                            authorName={a.authorName}
                                                            onClick={() => handleAnnouncementClick(a)}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                            <PaginationControls 
                                                currentPage={currentRow1Page} 
                                                totalItems={row1GridPosts.length} 
                                                limit={GRID_LIMIT} 
                                                onPageChange={setCurrentRow1Page} 
                                            />
                                        </div>

                                        {/* Right Side: Tall Carousel (8:3 ratio) */}
                                        <div className="lg:col-span-4 hidden lg:block">
                                            {row1CarouselPosts.length > 0 && (
                                                <Carousel 
                                                    hideControls={true} 
                                                    interval={6000}
                                                    containerClassName="w-full h-full"
                                                    className="relative overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 w-full h-[800px]"
                                                >
                                                    {row1CarouselPosts.map((a, index) => (
                                                        <div key={a.id} className="h-full cursor-pointer group" onClick={() => handleAnnouncementClick(a)}>
                                                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10" />
                                                            <img src={a.imageUrl} alt={a.title} className="w-full h-full object-cover" />
                                                            <div className="absolute bottom-0 left-0 p-8 z-20 w-full bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                                                                <span className="inline-block px-3 py-1 bg-red-700 text-white text-[10px] font-black uppercase tracking-widest mb-4">
                                                                    {a.category}
                                                                </span>
                                                                <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2 line-clamp-3">
                                                                    {a.title}
                                                                </h3>
                                                                <p className="text-gray-300 text-sm line-clamp-2">{a.description}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </Carousel>
                                            )}
                                        </div>
                                    </div>
                                </section>
                            )}

                            {/* ROW 2: Carousel (Left) + Grid (Right) */}
                            {(paginatedRow2Grid.length > 0 || row2CarouselPosts.length > 0) && (
                                <section className="mb-20">
                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                        {/* Left Side: Tall Carousel */}
                                        <div className="lg:col-span-4 hidden lg:block">
                                            {row2CarouselPosts.length > 0 && (
                                                <Carousel 
                                                    hideControls={true} 
                                                    interval={6000}
                                                    containerClassName="w-full h-full"
                                                    className="relative overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 w-full h-[800px]"
                                                >
                                                    {row2CarouselPosts.map((a, index) => (
                                                        <div key={a.id} className="h-full cursor-pointer group" onClick={() => handleAnnouncementClick(a)}>
                                                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10" />
                                                            <img src={a.imageUrl} alt={a.title} className="w-full h-full object-cover" />
                                                            <div className="absolute bottom-0 left-0 p-8 z-20 w-full bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                                                                <span className="inline-block px-3 py-1 bg-red-700 text-white text-[10px] font-black uppercase tracking-widest mb-4">
                                                                    {a.category}
                                                                </span>
                                                                <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2 line-clamp-3">
                                                                    {a.title}
                                                                </h3>
                                                                <p className="text-gray-300 text-sm line-clamp-2">{a.description}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </Carousel>
                                            )}
                                        </div>

                                        {/* Right Side: 4 Square Grid */}
                                        <div className="lg:col-span-8 flex flex-col">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 flex-grow bg-gray-200 dark:bg-gray-800 p-0 border-none">
                                                {paginatedRow2Grid.map((a) => (
                                                    <div key={a.id} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                                                        <NormalPriorityCard
                                                            id={a.id}
                                                            title={a.title}
                                                            description={a.description}
                                                            imageUrl={a.imageUrl}
                                                            date={a.date}
                                                            category={a.category}
                                                            authorName={a.authorName}
                                                            onClick={() => handleAnnouncementClick(a)}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                            <PaginationControls 
                                                currentPage={currentRow2Page} 
                                                totalItems={row2GridPosts.length} 
                                                limit={GRID_LIMIT} 
                                                onPageChange={setCurrentRow2Page} 
                                            />
                                        </div>
                                    </div>
                                </section>
                            )}

                            {/* LOW PRIORITY */}
                            {paginatedLowPriority.length > 0 && (
                                <section className="mb-20 pt-10 border-t border-gray-200 dark:border-gray-800">
                                    <h2 className="text-2xl font-black uppercase tracking-tight text-gray-900 dark:text-white mb-8">
                                        More Announcements
                                    </h2>
                                    <div className="space-y-4">
                                        {paginatedLowPriority.map((a) => (
                                            <LowPriorityCard
                                                key={a.id}
                                                id={a.id}
                                                title={a.title}
                                                description={a.description}
                                                imageUrl={a.imageUrl}
                                                date={a.date}
                                                category={a.category}
                                                authorName={a.authorName}
                                                onClick={() => handleAnnouncementClick(a)}
                                            />
                                        ))}
                                    </div>
                                    <PaginationControls 
                                        currentPage={currentLowPriorityPage} 
                                        totalItems={lowPriorityPosts.length} 
                                        limit={LOW_PRIORITY_LIMIT} 
                                        onPageChange={setCurrentLowPriorityPage} 
                                    />
                                </section>
                            )}
                        </>
                    )}
                </main>
                <Footer />
            </div>
        </PageTransition>
    );
};

export default AnnouncementsPage;