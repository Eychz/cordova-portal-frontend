'use client';

import React, { useEffect, useState } from 'react';
import { initialPosts } from '@/data/adminData';
import { postsApi } from '@/lib/postsApi';
import { servicesApi } from '@/lib/servicesApi';
import { emergencyApi } from '@/lib/emergencyApi';
import { barangays } from '@/data/barangays';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PageTransition from '@/components/PageTransition';
import Footer from '@/components/Footer';
import Carousel from '@/components/Carousel';
import { HighPriorityCard } from '@/components/cards';
import { Bell, ChevronRight, X, Phone, Building2, Landmark, Siren, ShieldAlert, ArrowRight } from 'lucide-react';
import { slugify } from '@/utils/slugify';

interface AnnouncementItem {
    id: number;
    title: string;
    body: string;
    imageUrl: string;
    type: string;
    date: string;
    category: string;
}

const HomeGuestPage: React.FC = () => {
    const router = useRouter();
    const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
    const [featuredPosts, setFeaturedPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingFeatured, setLoadingFeatured] = useState(true);
    const [showBanner, setShowBanner] = useState(true);

    // Sample items for the newspaper section
    const [services, setServices] = useState<any[]>([]);
    const [hotlines, setHotlines] = useState<any[]>([]);
    const [barangayList, setBarangayList] = useState<any[]>([]);

    useEffect(() => {
        // Fetch 3 news, 3 announcements, and 3 events for the carousel (total 9)
        const fetchCarouselPosts = async () => {
            try {
                const [newsPosts, annPosts, eventPosts] = await Promise.all([
                    postsApi.getAll({ type: 'news', limit: 3 }),
                    postsApi.getAll({ type: 'announcement', limit: 3 }),
                    postsApi.getAll({ type: 'event', limit: 3 })
                ]);

                const combined = [
                    ...newsPosts.slice(0, 3),
                    ...annPosts.slice(0, 3),
                    ...eventPosts.slice(0, 3)
                ];

                // Sort by date descending
                combined.sort((a: any, b: any) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());

                const mapped = combined.map((p: any) => ({
                    id: p.id,
                    title: p.title,
                    body: p.content.slice(0, 150) + '...',
                    type: p.type,
                    imageUrl: p.imageUrl || `https://picsum.photos/seed/${p.id}/1200/600`,
                    date: new Date(p.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                    category: p.category || p.type.toUpperCase()
                }));
                setAnnouncements(mapped);
            } catch (err) {
                console.warn('Failed to fetch high priority posts; using static fallback', err);
                const fallbackNews = initialPosts.filter(p => p.type === 'news').slice(0, 3);
                const fallbackAnn = initialPosts.filter(p => p.type === 'announcement').slice(0, 3);
                const fallbackEvent = initialPosts.filter(p => p.type === 'event').slice(0, 3);
                const combined = [...fallbackNews, ...fallbackAnn, ...fallbackEvent];

                combined.sort((a: any, b: any) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());

                const mapped = combined.map((p: any) => ({
                    id: p.id,
                    title: p.title,
                    body: p.content.slice(0, 150) + '...',
                    type: p.type,
                    imageUrl: p.imageUrl || `https://picsum.photos/seed/${p.id}/1200/600`,
                    date: new Date(p.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                    category: p.category || p.type.toUpperCase()
                }));
                setAnnouncements(mapped);
            } finally {
                setLoading(false);
            }
        };

        // Fetch featured posts (latest 6)
        const fetchFeaturedPosts = async () => {
            try {
                const featured = await postsApi.getFeatured(6);
                setFeaturedPosts(featured);
            } catch (err) {
                console.warn('Failed to fetch featured posts', err);
                setFeaturedPosts([]);
            } finally {
                setLoadingFeatured(false);
            }
        };

        // Fetch samples for the newspaper grid
        const fetchNewspaperSamples = async () => {
            try {
                const sData = await servicesApi.getAll();
                setServices(sData.slice(0, 2));
            } catch (e) {
                setServices([
                    { id: 1, name: 'Business Permit', description: 'Application and renewal guidelines for commercial operations.', category: 'Regulatory' },
                    { id: 2, name: "Mayor's Clearance", description: 'Acquiring general security clearance from the office of the mayor.', category: 'Certifications' }
                ]);
            }

            try {
                const hData = await emergencyApi.getAll();
                setHotlines(hData.slice(0, 2));
            } catch (e) {
                setHotlines([
                    { id: 1, title: 'Cordova Police Station', description: 'Emergency response line for municipal safety.', contact: '(032) 496-0000' },
                    { id: 2, title: 'Cordova Fire Station', description: 'Fire protection and emergency services dispatch.', contact: '(032) 496-1111' }
                ]);
            }

            setBarangayList(barangays.slice(0, 2));
        };

        fetchCarouselPosts();
        fetchFeaturedPosts();
        fetchNewspaperSamples();
    }, []);

    return (
        <PageTransition>
            <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors flex flex-col">
                {/* Announcement Banner */}
                {showBanner && (
                    <div className="bg-red-700 text-white py-4 px-4 border-b border-red-800">
                        <div className="maximize-width flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4 flex-1">
                                <div className="bg-white/10 p-2 flex-shrink-0 rounded-lg">
                                    <Bell className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-black text-sm md:text-base uppercase tracking-wider">
                                        Welcome to the Official Portal of the Municipality of Cordova
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/community/news"
                                    className="bg-white text-red-700 px-6 py-2 rounded-lg font-black hover:bg-gray-100 transition-colors text-xs uppercase tracking-widest whitespace-nowrap flex items-center gap-2 shadow"
                                >
                                    Latest News
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                                <button
                                    onClick={() => setShowBanner(false)}
                                    className="text-white/60 hover:text-white p-2 transition-colors flex-shrink-0"
                                    aria-label="Close banner"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Hero Section - Flat & Wide */}
                <section className="relative py-24 px-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <div className="maximize-width text-center">
                        <h1 className="text-5xl md:text-8xl font-black text-gray-900 dark:text-white mb-6 uppercase tracking-tighter">
                            Welcome to Cordova!
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-12 max-w-4xl mx-auto font-medium">
                            The official digital gateway for community updates, municipal services, and public safety.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <Link
                                href="/community/announcements"
                                className="bg-red-700 text-white px-12 py-5 rounded-lg font-black hover:bg-red-800 transition uppercase tracking-widest text-sm shadow-md"
                            >
                                Public Announcements
                            </Link>
                            <Link
                                href="/rescue-desk"
                                className="border-4 border-red-700 text-red-700 dark:text-red-500 bg-white dark:bg-gray-900 px-12 py-5 rounded-lg font-black hover:bg-red-50 transition uppercase tracking-widest text-sm shadow-sm"
                            >
                                Emergency Services
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Announcements Carousel Section - Wide & Flat */}
                <section className="py-12 px-4 bg-white dark:bg-gray-900">
                    <div className="maximize-width">
                        {loading ? (
                            <div className="w-full h-[500px] bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"></div>
                        ) : announcements.length > 0 && (
                            <Carousel>
                                {announcements.map((item, index) => (
                                    <HighPriorityCard
                                        key={item.id}
                                        id={item.id}
                                        title={item.title}
                                        description={item.body}
                                        imageUrl={item.imageUrl}
                                        date={item.date}
                                        category={item.category}
                                        currentSlide={0}
                                        index={index}
                                        onClick={() => router.push(`/community/${item.type}/${slugify(item.title)}`)}
                                    />
                                ))}
                            </Carousel>
                        )}
                    </div>
                </section>

                {/* Featured Posts Section - Flat & Wide - 2-gap spacing policy */}
                {!loadingFeatured && featuredPosts.length > 0 && (
                    <section className="py-20 px-4 bg-white dark:bg-gray-900">
                        <div className="maximize-width">
                            <div className="mb-12 border-l-8 border-red-700 pl-6">
                                <h2 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                                    Latest Featured Updates
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 font-medium">
                                    Important news and upcoming events from the municipality.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {featuredPosts.map((post) => (
                                    <Link
                                        key={post.id}
                                        href={`/community/${post.type}/${slugify(post.title)}`}
                                        className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-lg transition-all group cursor-pointer block"
                                    >
                                        {post.imageUrl && (
                                            <div className="relative h-64 overflow-hidden">
                                                <img
                                                    src={post.imageUrl}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                                />
                                                <div className="absolute top-0 left-0">
                                                    <span className={`px-4 py-1 font-bold text-[10px] uppercase tracking-widest ${post.type === 'event' ? 'bg-blue-700 text-white' :
                                                        post.type === 'announcement' ? 'bg-red-700 text-white' :
                                                            'bg-gray-700 text-white'
                                                        }`}>
                                                        {post.type}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                        <div className="p-10">
                                            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4 uppercase tracking-tight leading-tight group-hover:text-red-700 transition-colors">
                                                {post.title}
                                            </h3>
                                            <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 line-clamp-3 leading-relaxed font-medium">
                                                {post.content}
                                            </p>
                                            <div className="flex items-center justify-between pt-6 border-t border-gray-50 dark:border-gray-800">
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-700 flex items-center gap-2">
                                                    Read More
                                                    <ChevronRight className="w-4 h-4" />
                                                </span>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                    {new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Restructured Newspaper Frontpage Section */}
                <section className="py-20 px-4 bg-gray-50 dark:bg-gray-800/50 border-t border-b border-gray-200 dark:border-gray-800">
                    <div className="maximize-width">
                        {/* Newspaper Banner */}
                        <div className="text-center mb-16 border-b-4 border-double border-red-700 pb-10">
                            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-red-700 mb-4">Official Municipal Gazette</h2>
                            <h1 className="text-4xl md:text-5xl font-extrabold uppercase tracking-tighter text-gray-900 dark:text-white">
                                Cordova Public Digest
                            </h1>
                            <p className="text-xs text-gray-500 mt-2 font-mono">
                                Vol. LVIII • Cordova Public Information Office • Published {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </div>

                        {/* 3-Column Newspaper Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-gray-300 dark:divide-gray-700">

                            {/* Column 1: Services */}
                            <div className="flex flex-col space-y-6 pb-8 lg:pb-0 lg:pr-8">
                                <div className="flex items-center gap-3">
                                    <div className="bg-red-700 text-white p-2 rounded-lg">
                                        <Building2 size={24} />
                                    </div>
                                    <h3 className="text-2xl font-black uppercase tracking-tight text-gray-900 dark:text-white">
                                        E-Services Portal
                                    </h3>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                                    Guidelines and procedures for citizens, business owners, and regulatory clearances. Fast, transparent information dissemination.
                                </p>

                                <div className="space-y-4 pt-4">
                                    {services.map((s) => (
                                        <div
                                            key={s.id}
                                            onClick={() => router.push(`/services/${slugify(s.name || s.title || '')}`)}
                                            className="p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-red-500 transition-colors cursor-pointer group"
                                        >
                                            <span className="text-[10px] font-black text-red-700 uppercase tracking-widest">{s.category || 'Regulatory'}</span>
                                            <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-red-700 transition-colors uppercase text-sm mt-1">{s.name || s.title}</h4>
                                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{s.description}</p>
                                        </div>
                                    ))}
                                </div>

                                <Link
                                    href="/services"
                                    className="inline-flex items-center gap-2 text-xs font-black text-red-700 uppercase tracking-widest mt-auto pt-4 hover:underline"
                                >
                                    Browse All Services <ArrowRight size={14} />
                                </Link>
                            </div>

                            {/* Column 2: Rescue Desk */}
                            <div className="flex flex-col space-y-6 pt-8 lg:pt-0 lg:px-8">
                                <div className="flex items-center gap-3">
                                    <div className="bg-red-700 text-white p-2 rounded-lg">
                                        <Siren size={24} />
                                    </div>
                                    <h3 className="text-2xl font-black uppercase tracking-tight text-gray-900 dark:text-white">
                                        Rescue Desk
                                    </h3>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                                    Emergency hotlines and rapid-assistance directories. Direct public alerts for typhoons, medical assistance, and civic security.
                                </p>

                                <div className="space-y-4 pt-4">
                                    {hotlines.map((h) => (
                                        <div
                                            key={h.id}
                                            onClick={() => router.push('/rescue-desk')}
                                            className="p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-red-500 transition-colors cursor-pointer group"
                                        >
                                            <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-red-700 transition-colors uppercase text-sm">{h.title}</h4>
                                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{h.description}</p>
                                            <div className="mt-2 text-xs font-black text-red-700 uppercase tracking-widest font-mono">
                                                Hotline: {h.contact}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <Link
                                    href="/rescue-desk"
                                    className="inline-flex items-center gap-2 text-xs font-black text-red-700 uppercase tracking-widest mt-auto pt-4 hover:underline"
                                >
                                    Rescue Desk Portal <ArrowRight size={14} />
                                </Link>
                            </div>

                            {/* Column 3: Barangay Portal */}
                            <div className="flex flex-col space-y-6 pt-8 lg:pt-0 lg:pl-8">
                                <div className="flex items-center gap-3">
                                    <div className="bg-red-700 text-white p-2 rounded-lg">
                                        <Landmark size={24} />
                                    </div>
                                    <h3 className="text-2xl font-black uppercase tracking-tight text-gray-900 dark:text-white">
                                        Barangay Portal
                                    </h3>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                                    Explore the 13 administrative units of Cordova. View local profiles, geographical summaries, and specific community updates.
                                </p>

                                <div className="space-y-4 pt-4">
                                    {barangayList.map((b) => (
                                        <div
                                            key={b.id}
                                            onClick={() => router.push(`/barangay/${b.id}`)}
                                            className="p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-red-500 transition-colors cursor-pointer group"
                                        >
                                            <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-red-700 transition-colors uppercase text-sm">Barangay {b.name}</h4>
                                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{b.info.description}</p>
                                            <span className="inline-block text-[9px] bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded mt-2 font-mono">
                                                ZIP: {b.info.zipCode}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <Link
                                    href="/barangay"
                                    className="inline-flex items-center gap-2 text-xs font-black text-red-700 uppercase tracking-widest mt-auto pt-4 hover:underline"
                                >
                                    Browse All Barangays <ArrowRight size={14} />
                                </Link>
                            </div>

                        </div>
                    </div>
                </section>

                {/* Discover Cordova - Premium About CTA Banner (Item 6: High Visibility About Page) */}
                <section className="py-16 px-4 bg-gradient-to-r from-red-950 via-red-900 to-red-950 text-white border-y border-red-900">
                    <div className="maximize-width flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="space-y-3 max-w-3xl">
                            <span className="inline-block bg-red-700 px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em] rounded">
                                Institutional Profile
                            </span>
                            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight">
                                Discover Our Municipal Profile & History
                            </h2>
                            <p className="text-red-200 text-lg leading-relaxed font-medium">
                                Meet the Sangguniang Bayan officials, check executive department heads, review the vision and mission, and read the historical timeline of the Municipality of Cordova.
                            </p>
                        </div>
                        <Link
                            href="/about"
                            className="bg-white text-red-950 px-10 py-5 font-black hover:bg-gray-100 transition-colors uppercase tracking-widest text-sm rounded-lg whitespace-nowrap shadow-lg flex items-center gap-2 group"
                        >
                            Visit About Page
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                        </Link>
                    </div>
                </section>

            </div>
        </PageTransition>
    );
};

export default HomeGuestPage;
