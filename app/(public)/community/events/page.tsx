'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import PageTransition from '@/components/PageTransition';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Carousel from '@/components/Carousel';
import { HighPriorityCard, NormalPriorityEventCard, LowPriorityEventCard } from '@/components/cards';
import { usePosts } from '@/hooks/usePosts';
import { Post } from '@/lib/postsApi';
import { slugify } from '@/utils/slugify';
import { Search, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { NewsCardSkeleton, CarouselSkeleton, LowPriorityCardSkeleton, Skeleton } from '@/components/Skeleton';

interface EventItem {
    id: number;
    uuid?: string;
    title: string; // Map name to title for standard cards
    name: string;
    description: string;
    content: string;
    location: string;
    date: string;
    time: string;
    imageUrl: string;
    category: string;
    status: 'featured' | 'upcoming' | 'done';
    type: string;
    authorName?: string;
    priority: string;
    createdAt: string;
}

const EventsPage: React.FC = () => {
    const router = useRouter();
    const { data: rawPosts = [], isLoading: loading } = usePosts({ type: 'event' });
    const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState('');

    // Pagination states
    const [currentSearchPage, setCurrentSearchPage] = useState(1);
    const [currentRow1Page, setCurrentRow1Page] = useState(1);
    const [currentRow2Page, setCurrentRow2Page] = useState(1);
    const [currentLowPriorityPage, setCurrentLowPriorityPage] = useState(1);

    const GRID_LIMIT = 4;
    const SEARCH_LIMIT = 12;
    const LOW_PRIORITY_LIMIT = 6;

    const events = useMemo(() => {
        // Sort by createdAt descending (most recent first)
        const sortedPosts = [...rawPosts].sort((a: Post, b: Post) =>
            new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
        );

        return sortedPosts.map((post: Post) => ({
            id: post.id!,
            uuid: post.uuid,
            title: post.title,
            name: post.title,
            description: post.content.slice(0, 150) + '...',
            content: post.content,
            location: post.location || 'Cordova Municipal Hall',
            date: post.eventDate ? new Date(post.eventDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }) : new Date(post.createdAt!).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            time: post.eventTime || 'TBA',
            imageUrl: post.imageUrl || `https://picsum.photos/seed/${post.id! + 200}/800/600`,
            category: post.category || 'General Event',
            status: (post.eventStatus || 'upcoming') as 'featured' | 'upcoming' | 'done',
            type: post.type,
            authorName: post.authorName,
            priority: post.priority || 'low_priority',
            createdAt: post.createdAt!
        }));
    }, [rawPosts]);

    // Filter Logic
    const isSearching = searchQuery.trim() !== '' || selectedStatusFilter !== 'All';

    const searchResults = useMemo(() => {
        return events.filter(a => {
            const matchesSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                a.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = selectedStatusFilter === 'All' || a.status === selectedStatusFilter.toLowerCase();
            return matchesSearch && matchesStatus;
        });
    }, [events, searchQuery, selectedStatusFilter]);

    // Data distribution for complex layout
    const topCarouselPosts = events.slice(0, 10);
    const row1CarouselPosts = events.filter(a => a.priority === 'row1_carousel').slice(0, 5);
    const row1GridPosts = events.filter(a => a.priority === 'row1_grid');
    const row2CarouselPosts = events.filter(a => a.priority === 'row2_carousel').slice(0, 5);
    const row2GridPosts = events.filter(a => a.priority === 'row2_grid');
    const lowPriorityPosts = events.filter(a => a.priority === 'low_priority');

    // Pagination calculations
    const paginatedSearch = searchResults.slice((currentSearchPage - 1) * SEARCH_LIMIT, currentSearchPage * SEARCH_LIMIT);
    const paginatedRow1Grid = row1GridPosts.slice((currentRow1Page - 1) * GRID_LIMIT, currentRow1Page * GRID_LIMIT);
    const paginatedRow2Grid = row2GridPosts.slice((currentRow2Page - 1) * GRID_LIMIT, currentRow2Page * GRID_LIMIT);
    const paginatedLowPriority = lowPriorityPosts.slice((currentLowPriorityPage - 1) * LOW_PRIORITY_LIMIT, currentLowPriorityPage * LOW_PRIORITY_LIMIT);

    const handleEventClick = (a: EventItem) => {
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
                <header className="bg-red-800 text-white pt-24 pb-16 border-b-8 border-red-700">
                    <div className="maximize-width px-4">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-2 bg-white text-red-800 px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em]">
                                    Official Gazette
                                </div>
                                <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">
                                    Municipal Events
                                </h1>
                                <p className="text-xl text-white-400 font-medium max-w-2xl">
                                    Official schedule of activities, community gatherings, and public ceremonies in the Municipality of Cordova.
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-grow maximize-width px-4 py-16">
                    {isSearching ? (
                        /* SEARCH MODE LAYOUT */
                        <section className="mb-20">
                            <div className="flex items-center gap-4 mb-10 border-b-2 border-gray-100 dark:border-gray-800 pb-6">
                                <div className="w-2 h-10 bg-gray-900 dark:bg-gray-100"></div>
                                <h2 className="text-3xl font-black uppercase tracking-tight text-gray-900 dark:text-white">
                                    Search Results
                                </h2>
                            </div>

                            {loading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {[1, 2, 3, 4, 5, 6].map(i => (
                                        <NewsCardSkeleton key={i} />
                                    ))}
                                </div>
                            ) : paginatedSearch.length > 0 ? (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {paginatedSearch.map((event) => (
                                            <NormalPriorityEventCard
                                                key={event.id}
                                                id={event.id}
                                                name={event.name}
                                                description={event.description}
                                                location={event.location}
                                                date={event.date}
                                                imageUrl={event.imageUrl}
                                                onClick={() => handleEventClick(event)}
                                                authorName={event.authorName}
                                            />
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
                            {(loading || topCarouselPosts.length > 0) && (
                                <section className="mb-20">
                                    {loading ? (
                                        <CarouselSkeleton />
                                    ) : (
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
                                                    onClick={() => handleEventClick(a)}
                                                />
                                            ))}
                                        </Carousel>
                                    )}
                                </section>
                            )}

                            {/* ROW 1: Grid (Left) + Carousel (Right) */}
                            {(loading || paginatedRow1Grid.length > 0 || row1CarouselPosts.length > 0) && (
                                <section className="mb-20">
                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                        {/* Left Side: 4 Square Grid */}
                                        <div className="lg:col-span-8 flex flex-col">
                                            {loading ? (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
                                                    {[1, 2, 3, 4].map(i => (
                                                        <NewsCardSkeleton key={i} />
                                                    ))}
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
                                                        {paginatedRow1Grid.map((event) => (
                                                            <NormalPriorityEventCard
                                                                key={event.id}
                                                                id={event.id}
                                                                name={event.name}
                                                                description={event.description}
                                                                location={event.location}
                                                                date={event.date}
                                                                imageUrl={event.imageUrl}
                                                                onClick={() => handleEventClick(event)}
                                                                authorName={event.authorName}
                                                            />
                                                        ))}
                                                    </div>
                                                    <PaginationControls
                                                        currentPage={currentRow1Page}
                                                        totalItems={row1GridPosts.length}
                                                        limit={GRID_LIMIT}
                                                        onPageChange={setCurrentRow1Page}
                                                    />
                                                </>
                                            )}
                                        </div>

                                        {/* Right Side: Tall Carousel (8:3 ratio) */}
                                        <div className="lg:col-span-4 hidden lg:block">
                                            {loading ? (
                                                <div className="relative overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 w-full h-[800px]">
                                                    <Skeleton className="w-full h-full" />
                                                </div>
                                            ) : row1CarouselPosts.length > 0 && (
                                                <Carousel
                                                    hideControls={true}
                                                    interval={6000}
                                                    containerClassName="w-full h-full"
                                                    className="relative overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 w-full h-[800px]"
                                                >
                                                    {row1CarouselPosts.map((a, index) => (
                                                        <div key={a.id} className="h-full cursor-pointer group" onClick={() => handleEventClick(a)}>
                                                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10" />
                                                            <img src={a.imageUrl} alt={a.title} className="w-full h-full object-cover" />
                                                            <div className="absolute bottom-0 left-0 p-8 z-20 w-full bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                                                                <span className="inline-block px-3 py-1 bg-red-700 text-white text-[10px] font-black uppercase tracking-widest mb-4">
                                                                    {a.status}
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
                            {(loading || paginatedRow2Grid.length > 0 || row2CarouselPosts.length > 0) && (
                                <section className="mb-20">
                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                        {/* Left Side: Tall Carousel */}
                                        <div className="lg:col-span-4 hidden lg:block">
                                            {loading ? (
                                                <div className="relative overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 w-full h-[800px]">
                                                    <Skeleton className="w-full h-full" />
                                                </div>
                                            ) : row2CarouselPosts.length > 0 && (
                                                <Carousel
                                                    hideControls={true}
                                                    interval={6000}
                                                    containerClassName="w-full h-full"
                                                    className="relative overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 w-full h-[800px]"
                                                >
                                                    {row2CarouselPosts.map((a, index) => (
                                                        <div key={a.id} className="h-full cursor-pointer group" onClick={() => handleEventClick(a)}>
                                                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10" />
                                                            <img src={a.imageUrl} alt={a.title} className="w-full h-full object-cover" />
                                                            <div className="absolute bottom-0 left-0 p-8 z-20 w-full bg-gradient-to-t from-black/90 via-black/50 to-transparent">
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
                                            {loading ? (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
                                                    {[1, 2, 3, 4].map(i => (
                                                        <NewsCardSkeleton key={i} />
                                                    ))}
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
                                                        {paginatedRow2Grid.map((event) => (
                                                            <NormalPriorityEventCard
                                                                key={event.id}
                                                                id={event.id}
                                                                name={event.name}
                                                                description={event.description}
                                                                location={event.location}
                                                                date={event.date}
                                                                imageUrl={event.imageUrl}
                                                                onClick={() => handleEventClick(event)}
                                                                authorName={event.authorName}
                                                            />
                                                        ))}
                                                    </div>
                                                    <PaginationControls
                                                        currentPage={currentRow2Page}
                                                        totalItems={row2GridPosts.length}
                                                        limit={GRID_LIMIT}
                                                        onPageChange={setCurrentRow2Page}
                                                    />
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </section>
                            )}

                            {/* LOW PRIORITY */}
                            {(loading || paginatedLowPriority.length > 0) && (
                                <section className="mb-20 pt-10 border-t border-gray-200 dark:border-gray-800">
                                    <h2 className="text-2xl font-black uppercase tracking-tight text-gray-900 dark:text-white mb-8">
                                        More Events
                                    </h2>
                                    {loading ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {[1, 2, 3, 4].map(i => (
                                                <LowPriorityCardSkeleton key={i} />
                                            ))}
                                        </div>
                                    ) : (
                                        <>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {paginatedLowPriority.map((event) => (
                                                    <LowPriorityEventCard
                                                        key={event.id}
                                                        id={event.id}
                                                        name={event.name}
                                                        description={event.description}
                                                        location={event.location}
                                                        date={event.date}
                                                        time={event.time}
                                                        imageUrl={event.imageUrl}
                                                        onClick={() => handleEventClick(event)}
                                                        authorName={event.authorName}
                                                    />
                                                ))}
                                            </div>
                                            <PaginationControls
                                                currentPage={currentLowPriorityPage}
                                                totalItems={lowPriorityPosts.length}
                                                limit={LOW_PRIORITY_LIMIT}
                                                onPageChange={setCurrentLowPriorityPage}
                                            />
                                        </>
                                    )}
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

export default EventsPage;
