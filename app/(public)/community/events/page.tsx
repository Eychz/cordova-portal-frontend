'use client';

import React, { useState, useMemo } from 'react';
import CachedImage from '@/components/CachedImage';
import { useRouter } from 'next/navigation';
import PageTransition from '@/components/PageTransition';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { NormalPriorityEventCard, LowPriorityEventCard } from '@/components/cards';
import { usePosts } from '@/hooks/usePosts';
import { Post } from '@/lib/postsApi';
import { slugify } from '@/utils/slugify';
import { Search, Info } from 'lucide-react';
import { NewsCardSkeleton, LowPriorityCardSkeleton, Skeleton, NormalPriorityCardSkeleton } from '@/components/Skeleton';

interface EventItem {
    id: number;
    uuid?: string;
    title: string;
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
    const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');
    const [searchQuery, setSearchQuery] = useState('');

    const isSearching = searchQuery.trim() !== '' || selectedStatusFilter !== 'All';

    // Hook query: fetch top 20 latest events posts from backend
    const { data: rawPosts = [], isLoading: loading } = usePosts({
        type: 'event',
        page: 1,
        limit: 20,
        search: searchQuery || undefined,
        status: selectedStatusFilter !== 'All' ? selectedStatusFilter.toLowerCase() : undefined
    });

    const events = useMemo(() => {
        const mapped = rawPosts.map((post: Post) => ({
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
            priority: post.priority || 'normal',
            createdAt: post.createdAt!
        }));

        // Sort strictly by latest createdAt descending
        return mapped.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [rawPosts]);

    // Data distribution across 3 containers: Top 5, Next 5, Last 10
    const container1Posts = useMemo(() => events.slice(0, 5), [events]);
    const container1Grid = useMemo(() => container1Posts.slice(0, 4), [container1Posts]);
    const container1Featured = useMemo(() => container1Posts.slice(4, 5), [container1Posts]);

    const container2Posts = useMemo(() => events.slice(5, 10), [events]);
    const container2Featured = useMemo(() => container2Posts.slice(0, 1), [container2Posts]);
    const container2Grid = useMemo(() => container2Posts.slice(1, 5), [container2Posts]);

    const container3Posts = useMemo(() => events.slice(10, 20), [events]);

    const handleEventClick = (a: EventItem) => {
        router.push(`/community/${a.type}/${slugify(a.title)}`);
    };

    return (
        <PageTransition>
            <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors flex flex-col">
                <Navbar activePage="Community" />

                {/* Formal Government Header */}
                <header className="relative overflow-hidden bg-red-800 text-white pt-24 pb-16 border-b-8 border-red-700">
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
                        style={{ backgroundImage: "url('/bg-cordova.jpg')", opacity: 0.25 }}
                    />
                    <div className="relative maximize-width px-4 z-10">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-2 bg-white text-red-800 px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em]">
                                    Municipal Calendar
                                </div>
                                <h1 className="text-5xl sm:text-3xl md:text-5xl lg:text-8xl font-black uppercase tracking-tighter leading-none">
                                    Events & Activities
                                </h1>
                                <p className="text-xl text-white font-medium max-w-2xl">
                                    Discover upcoming municipal gatherings, cultural festivals, public hearings, and community programs in Cordova.
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-grow maximize-width px-4 py-16">
                    {isSearching ? (
                        /* SEARCH MODE LAYOUT */
                        <section className="mb-20">
                            <div className="flex items-center gap-4 mb-10 border-b-2 pb-6">
                                <h2 className="text-3xl font-black uppercase tracking-tight text-gray-900 dark:text-white">
                                    Search Results
                                </h2>
                            </div>

                            {loading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 p-0 border-none">
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                        <div key={i} className="bg-white border">
                                            <NormalPriorityCardSkeleton />
                                        </div>
                                    ))}
                                </div>
                            ) : events.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 p-0 border-none">
                                    {events.map((a) => (
                                        <div key={a.id} className="bg-white border">
                                            <NormalPriorityEventCard
                                                id={a.id}
                                                name={a.name}
                                                description={a.description}
                                                imageUrl={a.imageUrl}
                                                date={a.date}
                                                location={a.location}
                                                authorName={a.authorName}
                                                onClick={() => handleEventClick(a)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-32 text-center">
                                    <Info className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 font-black uppercase tracking-widest">No results found for your search.</p>
                                </div>
                            )}
                        </section>
                    ) : (
                        /* 3-CONTAINER LAYOUT (TOP 20 LATEST POSTS) */
                        <>
                            {/* CONTAINER 1: Top 5 Posts (4 Grid Left + 1 Featured Right) */}
                            {(loading || container1Posts.length > 0) && (
                                <section className="mb-20">
                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                        {/* Left Side: 4 Grid Cards */}
                                        <div className="lg:col-span-8 flex flex-col">
                                            {loading ? (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 flex-grow p-0 border-none">
                                                    {[1, 2, 3, 4].map(i => (
                                                        <div key={i} className="bg-white border">
                                                            <NormalPriorityCardSkeleton />
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 flex-grow p-0 border-none">
                                                    {container1Grid.map((a) => (
                                                        <div key={a.id} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                                                            <NormalPriorityEventCard
                                                                id={a.id}
                                                                name={a.name}
                                                                description={a.description}
                                                                imageUrl={a.imageUrl}
                                                                date={a.date}
                                                                location={a.location}
                                                                authorName={a.authorName}
                                                                onClick={() => handleEventClick(a)}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Right Side: 1 Featured Card */}
                                        <div className="lg:col-span-4 hidden lg:block">
                                            {loading ? (
                                                <div className="relative overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 w-full h-[800px]">
                                                    <Skeleton className="w-full h-full" />
                                                </div>
                                            ) : container1Featured.length > 0 && (
                                                <div className="relative overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 w-full h-[800px] cursor-pointer group" onClick={() => handleEventClick(container1Featured[0])}>
                                                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10" />
                                                    <CachedImage src={container1Featured[0].imageUrl} alt={container1Featured[0].title} fill className="object-cover" />
                                                    <div className="absolute bottom-0 left-0 p-8 z-20 w-full bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                                                        <span className="inline-block px-3 py-1 bg-red-700 text-white text-[10px] font-black uppercase tracking-widest mb-4">
                                                            {container1Featured[0].category}
                                                        </span>
                                                        <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2 line-clamp-3">
                                                            {container1Featured[0].title}
                                                        </h3>
                                                        <p className="text-gray-300 text-sm line-clamp-2">{container1Featured[0].description}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </section>
                            )}

                            {/* CONTAINER 2: Next 5 Posts (1 Featured Left + 4 Grid Right) */}
                            {(loading || container2Posts.length > 0) && (
                                <section className="mb-20">
                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                        {/* Left Side: 1 Featured Card */}
                                        <div className="lg:col-span-4 hidden lg:block">
                                            {loading ? (
                                                <div className="relative overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 w-full h-[800px]">
                                                    <Skeleton className="w-full h-full" />
                                                </div>
                                            ) : container2Featured.length > 0 && (
                                                <div className="relative overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 w-full h-[800px] cursor-pointer group" onClick={() => handleEventClick(container2Featured[0])}>
                                                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10" />
                                                    <CachedImage src={container2Featured[0].imageUrl} alt={container2Featured[0].title} fill className="object-cover" />
                                                    <div className="absolute bottom-0 left-0 p-8 z-20 w-full bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                                                        <span className="inline-block px-3 py-1 bg-red-700 text-white text-[10px] font-black uppercase tracking-widest mb-4">
                                                            {container2Featured[0].category}
                                                        </span>
                                                        <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2 line-clamp-3">
                                                            {container2Featured[0].title}
                                                        </h3>
                                                        <p className="text-gray-300 text-sm line-clamp-2">{container2Featured[0].description}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Right Side: 4 Grid Cards */}
                                        <div className="lg:col-span-8 flex flex-col">
                                            {loading ? (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 flex-grow bg-gray-200 dark:bg-gray-800 p-0 border-none">
                                                    {[1, 2, 3, 4].map(i => (
                                                        <div key={i} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                                                            <NormalPriorityCardSkeleton />
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 flex-grow p-0 border-none">
                                                    {container2Grid.map((a) => (
                                                        <div key={a.id} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                                                            <NormalPriorityEventCard
                                                                id={a.id}
                                                                name={a.name}
                                                                description={a.description}
                                                                imageUrl={a.imageUrl}
                                                                date={a.date}
                                                                location={a.location}
                                                                authorName={a.authorName}
                                                                onClick={() => handleEventClick(a)}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </section>
                            )}

                            {/* CONTAINER 3: Remaining 10 Posts */}
                            {(loading || container3Posts.length > 0) && (
                                <section className="mb-20 pt-10 border-t border-gray-200 dark:border-gray-800">
                                    <h2 className="text-2xl font-black uppercase tracking-tight text-gray-900 dark:text-white mb-8">
                                        More Events
                                    </h2>
                                    {loading ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {[1, 2, 3, 4, 5, 6].map(i => (
                                                <LowPriorityCardSkeleton key={i} />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {container3Posts.map((a) => (
                                                <LowPriorityEventCard
                                                    key={a.id}
                                                    id={a.id}
                                                    name={a.name}
                                                    description={a.description}
                                                    imageUrl={a.imageUrl}
                                                    date={a.date}
                                                    time={a.time}
                                                    location={a.location}
                                                    authorName={a.authorName}
                                                    onClick={() => handleEventClick(a)}
                                                />
                                            ))}
                                        </div>
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
