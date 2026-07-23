'use client';

import React, { useState } from 'react';
import { initialPosts } from '@/data/adminData';
import { postsApi } from '@/lib/postsApi';
import { servicesApi } from '@/lib/servicesApi';
import { emergencyApi } from '@/lib/emergencyApi';
import { barangays } from '@/data/barangays';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import PageTransition from '@/components/PageTransition';
import Carousel from '@/components/Carousel';
import { HighPriorityCard } from '@/components/cards';
import { Bell, ChevronRight, X, Phone, Building2, Landmark, Siren, ShieldAlert, ArrowRight, Sparkles, ArrowUpRight, MapPin } from 'lucide-react';
import { highlightsData } from '@/data/tourismData';
import { slugify } from '@/utils/slugify';
import { CarouselSkeleton, NewsCardSkeleton } from '@/components/Skeleton';
import { useQuery } from '@tanstack/react-query';

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
    const [showBanner, setShowBanner] = useState(true);

    // 1. Announcements carousel posts query
    const { data: announcements = [], isLoading: loading } = useQuery<AnnouncementItem[]>({
        queryKey: ['publicHomeCarouselPosts'],
        queryFn: async () => {
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

                combined.sort((a: any, b: any) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());

                return combined.map((p: any) => ({
                    id: p.id,
                    title: p.title,
                    body: p.content.slice(0, 150) + '...',
                    type: p.type,
                    imageUrl: p.imageUrl || `https://picsum.photos/seed/${p.id}/1200/600`,
                    date: new Date(p.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                    category: p.category || p.type.toUpperCase()
                }));
            } catch (err) {
                console.warn('Failed to fetch high priority posts; using static fallback', err);
                const fallbackNews = initialPosts.filter(p => p.type === 'news').slice(0, 3);
                const fallbackAnn = initialPosts.filter(p => p.type === 'announcement').slice(0, 3);
                const fallbackEvent = initialPosts.filter(p => p.type === 'event').slice(0, 3);
                const combined = [...fallbackNews, ...fallbackAnn, ...fallbackEvent];

                combined.sort((a: any, b: any) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());

                return combined.map((p: any) => ({
                    id: p.id,
                    title: p.title,
                    body: p.content.slice(0, 150) + '...',
                    type: p.type,
                    imageUrl: p.imageUrl || `https://picsum.photos/seed/${p.id}/1200/600`,
                    date: new Date(p.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                    category: p.category || p.type.toUpperCase()
                }));
            }
        },
        staleTime: 5 * 60 * 1000,
    });

    // 2. Featured posts query
    const { data: featuredPosts = [], isLoading: loadingFeatured } = useQuery<any[]>({
        queryKey: ['publicHomeFeaturedPosts'],
        queryFn: () => postsApi.getFeatured(6).catch(() => []),
        staleTime: 5 * 60 * 1000,
    });

    // 3. Shared services query (slices top 2 for display)
    const { data: servicesRaw = [] } = useQuery<any[]>({
        queryKey: ['publicServices'],
        queryFn: () => servicesApi.getAll().catch(() => []),
        staleTime: 5 * 60 * 1000,
    });
    const services = servicesRaw.slice(0, 2).map((s: any) => ({
        id: s.id,
        name: s.name || s.title || '',
        description: s.description || '',
        category: s.category || 'General',
        externalUrl: s.externalUrl || ''
    }));

    const handleServiceClick = (s: any) => {
        let url = s.externalUrl || 'https://bpbc.ibpls.com/cordovacebu/';
        if (url && !/^https?:\/\//i.test(url)) {
            url = 'https://' + url;
        }
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    // 4. Shared hotlines query (slices top 2 for display)
    const { data: hotlinesRaw = [] } = useQuery<any[]>({
        queryKey: ['rescueHotlines'],
        queryFn: () => emergencyApi.getAll().catch(() => []),
        staleTime: 60 * 60 * 1000,
    });
    const hotlines = hotlinesRaw.slice(0, 2);

    const barangayList = barangays.slice(0, 2);

    return (
        <PageTransition>


            <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors flex flex-col">
                {/* Hero Section - Flat & Wide with Transparent Background Image */}
                <section className="relative overflow-hidden py-24 px-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
                        style={{ backgroundImage: "url('/bg-cordova.jpg')", opacity: 0.25 }}
                    />
                    <div className="relative maximize-width text-center z-10">
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



                {/* Discover Cordova - Premium About CTA Banner (Item 6: High Visibility About Page) */}
                <section className="py-10 px-4 bg-gradient-to-r from-red-950 via-red-900 to-red-950 text-white border-y border-red-900">
                    <div className="maximize-width flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="space-y-3 max-w-3xl">
                            <span className="inline-block bg-red-700 px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em] rounded">
                                Institutional Profile
                            </span>
                            <h2 className="text-4xl md:text-5xl font-black uppercase">
                                Discover Our Municipal Profile & History
                            </h2>
                            <p className="text-red-200 text-lg leading-relaxed font-medium">
                                Meet the Municipality's officials, check executive department heads, review the vision and mission, and read the historical timeline of the Municipality of Cordova.
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

                {/* Announcements Carousel Section - Wide & Flat */}
                <section className="py-12 px-4 bg-white dark:bg-gray-900">
                    <div className="maximize-width">
                        {loading ? (
                            <CarouselSkeleton />
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

                {/* Tourism in Cordova Summary Section with Interactive Square Hover Cards */}
                <section className="py-20 px-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
                    <div className="maximize-width space-y-12">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-2 border-gray-100 dark:border-gray-800 pb-6">
                            <div className="space-y-2">
                                <div className="inline-flex items-center gap-2 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-red-200 dark:border-red-900/40">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    Eco-Tourism Gateway & Getaway
                                </div>
                                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-gray-900 dark:text-white">
                                    Tourism Highlights
                                </h2>
                                <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-2xl font-medium">
                                    Explore world-class resorts, coastal landmarks, and protected marine sanctuaries in Cordova.
                                </p>
                            </div>
                            <Link
                                href="/about/tourism"
                                className="inline-flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white px-6 py-3 rounded-lg text-xs font-black uppercase tracking-widest transition-colors shadow-md group whitespace-nowrap self-start md:self-end"
                            >
                                View Tourism Page
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        {/* 3 Square Cards Grid with Icon-to-Image Hover Effect */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {highlightsData.map((spot) => {
                                const IconComponent = spot.icon;
                                return (
                                    <Link
                                        key={spot.id}
                                        href={`/about/tourism#${spot.id}`}
                                        className="relative group overflow-hidden rounded-2xl aspect-square cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 border border-blue-900/30 block"
                                    >
                                        {/* Background Image (Reveals & Scales on Hover) */}
                                        <div
                                            className="absolute inset-0 bg-cover bg-center transition-all duration-700 transform group-hover:scale-110 opacity-0 group-hover:opacity-100"
                                            style={{ backgroundImage: `url('${spot.image}')` }}
                                        />

                                        {/* Dark Gradient Overlay on Hover */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/95 via-blue-950/60 to-gray-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                        {/* Default Background Layer: Dark Blue at 80% Opacity */}
                                        <div className="absolute inset-0 bg-red-700 dark:bg-blue-950/85 group-hover:opacity-0 transition-opacity duration-500 backdrop-blur-sm" />

                                        {/* Card Content Overlay */}
                                        <div className="relative z-10 p-6 sm:p-8 h-full flex flex-col justify-between text-white">
                                            {/* Header Category Badge */}
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full border border-white/30">
                                                    {spot.category}
                                                </span>
                                                <div className="p-2 rounded-full bg-white/10 backdrop-blur-md group-hover:bg-white/30 transition-colors">
                                                    <ArrowUpRight className="w-4 h-4 text-white opacity-100" />
                                                </div>
                                            </div>

                                            {/* Center Category Icon & Title: 100% White Opacity */}
                                            <div className="flex flex-col items-center justify-center text-center my-auto transition-transform duration-500 group-hover:scale-105">
                                                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/15 group-hover:bg-white/25 backdrop-blur-md flex items-center justify-center mb-4 border border-white/20 shadow-inner">
                                                    <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 text-white opacity-100 drop-shadow-md" />
                                                </div>
                                                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white leading-tight drop-shadow-sm">
                                                    {spot.name}
                                                </h3>
                                            </div>

                                            {/* Bottom Teaser */}
                                            <div className="space-y-2">
                                                <p className="text-xs sm:text-sm text-white/90 font-medium line-clamp-2 leading-relaxed">
                                                    {spot.tagline}
                                                </p>
                                                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-white/80">
                                                    <MapPin className="w-3.5 h-3.5 text-white opacity-100" />
                                                    <span className="truncate">{spot.location.split(',')[1] || spot.location}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </section>
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
                                Cordova Public Information Office • Updated {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
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
                                            onClick={() => handleServiceClick(s)}
                                            className="p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-red-500 transition-colors cursor-pointer group"
                                        >
                                            <span className="text-[10px] font-black text-red-700 uppercase tracking-widest">{s.category || 'Regulatory'}</span>
                                            <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-red-700 transition-colors uppercase text-sm mt-1">{s.name}</h4>
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
            </div>
        </PageTransition>
    );
};

export default HomeGuestPage;
