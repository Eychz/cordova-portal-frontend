'use client';

import React, { useState, useEffect } from 'react';
import PageTransition from '../../../components/PageTransition';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import VideoHighlights from '../../../components/VideoHighlights';
import Carousel from '../../../components/Carousel';
import { HighPriorityCard, NormalPriorityCard, LowPriorityCard } from '../../../components/cards';
import { loadData, loadDataAsync, initialPosts, STORAGE_KEYS, Post } from 'data/adminData';

interface Announcement {
    id: number;
    uuid?: string;
    title: string;
    description: string;
    content: string;
    date: string;
    imageUrl: string;
    category: string;
}

const AnnouncementsPage: React.FC = () => {
    // Video highlights data
    const videoHighlights = [
        {
            id: 1,
            title: 'Emergency Response Drill 2024',
            description: 'Official announcement video',
            duration: '3:24',
            thumbnail: 'https://picsum.photos/seed/video1/400/600',
            embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        },
        {
            id: 2,
            title: 'Tsunami Safety Guidelines',
            description: 'Safety and preparedness tips',
            duration: '5:12',
            thumbnail: 'https://picsum.photos/seed/video2/400/600',
            embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        },
        {
            id: 3,
            title: 'Community Health Program',
            description: 'Healthcare initiatives update',
            duration: '4:48',
            thumbnail: 'https://picsum.photos/seed/video3/400/600',
            embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        },
        {
            id: 4,
            title: 'Municipal Updates',
            description: 'Latest news and developments',
            duration: '2:56',
            thumbnail: 'https://picsum.photos/seed/video4/400/600',
            embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        },
        {
            id: 5,
            title: 'Tourism and Events',
            description: 'Upcoming community activities',
            duration: '6:34',
            thumbnail: 'https://picsum.photos/seed/video5/400/600',
            embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        }
    ];
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [filteredAnnouncements, setFilteredAnnouncements] = useState<Announcement[]>([]);
    const [featuredAnnouncements, setFeaturedAnnouncements] = useState<Announcement[]>([]);
    const [lowPriorityAnnouncements, setLowPriorityAnnouncements] = useState<Announcement[]>([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [loading, setLoading] = useState(true);
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
    const [selectedTopic, setSelectedTopic] = useState<string>('All');
    const [selectedDate, setSelectedDate] = useState<string>('All');
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
    const [videoSlide, setVideoSlide] = useState(0);
    const [currentNormalPage, setCurrentNormalPage] = useState(1);
    const [currentLowPage, setCurrentLowPage] = useState(1);
    
    const HIGH_PRIORITY_LIMIT = 5;
    const NORMAL_PRIORITY_LIMIT = 12;
    const LOW_PRIORITY_LIMIT = 9;
    
    // Reset pagination when announcements data changes to prevent "no results" state
    useEffect(() => {
        setCurrentNormalPage(1);
        setCurrentLowPage(1);
    }, [announcements, lowPriorityAnnouncements]);

    useEffect(() => {
        // Load announcements from admin dashboard
        const loadAnnouncements = async () => {
            const postsApi = await import('../../../lib/postsApi');
            let adminPosts;
            try {
                adminPosts = await postsApi.postsApi.getAll('announcement');
            } catch (err: any) {
                console.warn('Failed to fetch from API, falling back to localStorage', err);
                adminPosts = await loadDataAsync(STORAGE_KEYS.POSTS, initialPosts);
            }
            const announcementsOnly = adminPosts
                .filter((post: Post) => post.type === 'announcement' && post.status === 'published')
                .map((post: Post) => ({
                    id: post.id,
                    uuid: post.uuid,
                    title: post.title,
                    description: post.content.slice(0, 150),
                    content: post.content,
                    date: new Date(post.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    }),
                    imageUrl: post.imageUrl || `https://picsum.photos/seed/${post.id + 300}/800/600`,
                    category: post.category || 'Public Notice'
                }));

            // Separate by priority
            const highPriority = announcementsOnly.filter((announcement: any) => {
                const originalPost = adminPosts.find((p: Post) => p.id === announcement.id);
                return originalPost?.priority === 'high';
            }).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

            const normalPriority = announcementsOnly.filter((announcement: any) => {
                const originalPost = adminPosts.find((p: Post) => p.id === announcement.id);
                return originalPost?.priority === 'normal' || !originalPost?.priority;
            }).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

            const lowPriority = announcementsOnly.filter((announcement: any) => {
                const originalPost = adminPosts.find((p: Post) => p.id === announcement.id);
                return originalPost?.priority === 'low';
            }).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

            // High priority only in carousel (max 3)
            // Dedupe to avoid duplicate keys when rendering
            const dedupedAnnouncements = Array.from(new Map(highPriority.map((item: any) => [item.id, item])).values());
            if (dedupedAnnouncements.length < highPriority.length) {
                console.warn('Duplicate announcement IDs found in featured announcements; duplicates were removed.');
            }
            setFeaturedAnnouncements(dedupedAnnouncements.slice(0, 3));
            
            // Normal priority in main section
            setAnnouncements(normalPriority);
            
            // Low priority in bottom section
            setLowPriorityAnnouncements(lowPriority);
            
            // Combined for filtering
            setFilteredAnnouncements([...normalPriority, ...lowPriority]);
            
            setLoading(false);
        };

        loadAnnouncements();

        // Set up listener for localStorage changes (real-time updates)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === STORAGE_KEYS.POSTS) {
                loadAnnouncements();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        
        // Also listen for custom event for same-tab updates
        const handleCustomUpdate = () => loadAnnouncements();
        window.addEventListener('adminDataUpdated', handleCustomUpdate);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('adminDataUpdated', handleCustomUpdate);
        };
    }, []);

    // Auto-slide carousel every 5 seconds
    useEffect(() => {
        if (featuredAnnouncements.length > 0) {
            const interval = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % featuredAnnouncements.length);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [announcements]);

    useEffect(() => {
        let filtered = [...announcements];

        // Filter by topic
        if (selectedTopic !== 'All') {
            filtered = filtered.filter(announcement => announcement.category === selectedTopic);
        }

        // Filter by date with specific ranges
        if (selectedDate !== 'All') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            filtered = filtered.filter(announcement => {
                const announcementDate = new Date(announcement.date);
                announcementDate.setHours(0, 0, 0, 0);
                
                const daysDiff = Math.floor((today.getTime() - announcementDate.getTime()) / (1000 * 60 * 60 * 24));
                
                if (selectedDate === 'Last 24 Hours') {
                    return daysDiff === 0;
                } else if (selectedDate === 'Last 3 Days') {
                    return daysDiff <= 2;
                } else if (selectedDate === 'Last Week') {
                    return daysDiff <= 6;
                } else if (selectedDate === 'Last 2 Weeks') {
                    return daysDiff <= 13;
                } else if (selectedDate === 'Last Month') {
                    return daysDiff <= 29;
                } else if (selectedDate === 'Last 3 Months') {
                    return daysDiff <= 89;
                }
                return true;
            });
        }

        setFilteredAnnouncements(filtered);
    }, [selectedTopic, selectedDate, announcements]);

    return (
        <>
            <Navbar activePage="announcements" />
            <PageTransition>
                <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors flex flex-col overflow-x-hidden">
                    {/* Page Header */}
                    <div className="relative bg-gradient-to-r from-red-900 to-red-800 text-white py-16 overflow-hidden">
                        {/* Background Image Overlay */}
                        <div 
                            className="absolute inset-0 bg-cover opacity-20"
                            style={{ backgroundImage: "url('/municipality-bg.jpg')", backgroundPosition: 'center top 30%' }}
                        />
                        <div className="max-w-7xl mx-auto px-4 relative z-10">
                            <h1 className="text-6xl md:text-7xl font-black mb-4">MGA ANUNSYO</h1>
                            <p className="text-xl text-white/80">Stay updated with the latest announcements from the Municipality of Cordova</p>
                        </div>
                    </div>

                    <div className="max-w-[1400px] mx-auto w-full px-4 py-12 flex-1 min-w-0 md:min-w-[900px] lg:min-w-[1200px]">
                        {/* Filters */}
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Filter by:</span>
                            <select 
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            >
                                <option value="All">All Time</option>
                                <option value="Last 24 Hours">Last 24 Hours</option>
                                <option value="Last 3 Days">Last 3 Days</option>
                                <option value="Last Week">Last Week</option>
                                <option value="Last 2 Weeks">Last 2 Weeks</option>
                                <option value="Last Month">Last Month</option>
                                <option value="Last 3 Months">Last 3 Months</option>
                            </select>
                            <select 
                                value={selectedTopic}
                                onChange={(e) => setSelectedTopic(e.target.value)}
                                className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            >
                                <option value="All">All Topics</option>
                                <option value="Emergency Alert">Emergency Alert</option>
                                <option value="Public Notice">Public Notice</option>
                                <option value="Health Advisory">Health Advisory</option>
                                <option value="Community Update">Community Update</option>
                            </select>
                        </div>

                        {loading ? (
                            <div className="animate-pulse space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {[1, 2, 3, 4, 5, 6].map(i => (
                                        <div key={i} className="h-96 bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Featured Announcement Carousel */}
                                {featuredAnnouncements.length > 0 && (
                                    <Carousel>
                                        {featuredAnnouncements.map((announcement, index) => (
                                            <HighPriorityCard
                                                key={`${announcement.uuid ?? announcement.id}-${index}`}
                                                id={announcement.id}
                                                title={announcement.title}
                                                description={announcement.content}
                                                imageUrl={announcement.imageUrl}
                                                date={announcement.date}
                                                category={announcement.category}
                                                currentSlide={currentSlide}
                                                index={index}
                                                onClick={() => setSelectedAnnouncement(announcement)}
                                            />
                                        ))}
                                    </Carousel>
                                )}

                                {/* Normal Priority Announcements Grid */}
                                {announcements.length > 0 && (
                                <div className="mb-12">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="bg-gray-800 dark:bg-gray-900 text-white px-6 py-2 font-black text-lg" 
                                             style={{ clipPath: 'polygon(0 0, 100% 0, 95% 100%, 0% 100%)' }}>
                                            LATEST ANNOUNCEMENTS
                                        </div>
                                        {announcements.length > NORMAL_PRIORITY_LIMIT && (
                                            <div className="flex items-center gap-1 text-sm">
                                                <button
                                                    onClick={() => { setCurrentNormalPage(prev => Math.max(1, prev - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                                    disabled={currentNormalPage === 1}
                                                    className="px-2 py-1 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                                    title="Previous"
                                                >
                                                    ‹
                                                </button>
                                                <span className="px-2 text-xs text-gray-500 dark:text-gray-400">
                                                    {currentNormalPage}/{Math.ceil(announcements.length / NORMAL_PRIORITY_LIMIT)}
                                                </span>
                                                <button
                                                    onClick={() => { setCurrentNormalPage(prev => Math.min(Math.ceil(announcements.length / NORMAL_PRIORITY_LIMIT), prev + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                                    disabled={currentNormalPage >= Math.ceil(announcements.length / NORMAL_PRIORITY_LIMIT)}
                                                    className="px-2 py-1 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                                    title="Next"
                                                >
                                                    ›
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 min-w-0">
                                    {announcements
                                        .slice((currentNormalPage - 1) * NORMAL_PRIORITY_LIMIT, currentNormalPage * NORMAL_PRIORITY_LIMIT)
                                        .map((announcement, index) => (
                                        <NormalPriorityCard
                                            key={`${announcement.uuid ?? announcement.id}-${index}`}
                                            id={announcement.id}
                                            title={announcement.title}
                                            description={announcement.description}
                                            imageUrl={announcement.imageUrl}
                                            date={announcement.date}
                                            category={announcement.category}
                                            onClick={() => setSelectedAnnouncement(announcement)}
                                        />
                                    ))}
                                    </div>
                                </div>
                                )}

                                {/* Low Priority Announcements Section */}
                                {lowPriorityAnnouncements.length > 0 && (
                                <div className="mt-12">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="bg-gray-700 text-white px-6 py-2 font-black text-lg" 
                                             style={{ clipPath: 'polygon(0 0, 100% 0, 95% 100%, 0% 100%)' }}>
                                            MORE ANNOUNCEMENTS
                                        </div>
                                        {lowPriorityAnnouncements.length > LOW_PRIORITY_LIMIT && (
                                            <div className="flex items-center gap-1 text-sm">
                                                <button
                                                    onClick={() => { setCurrentLowPage(prev => Math.max(1, prev - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                                    disabled={currentLowPage === 1}
                                                    className="px-2 py-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                                    title="Previous"
                                                >
                                                    ‹
                                                </button>
                                                <span className="px-2 text-xs text-gray-500 dark:text-gray-400">
                                                    {currentLowPage}/{Math.ceil(lowPriorityAnnouncements.length / LOW_PRIORITY_LIMIT)}
                                                </span>
                                                <button
                                                    onClick={() => { setCurrentLowPage(prev => Math.min(Math.ceil(lowPriorityAnnouncements.length / LOW_PRIORITY_LIMIT), prev + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                                    disabled={currentLowPage >= Math.ceil(lowPriorityAnnouncements.length / LOW_PRIORITY_LIMIT)}
                                                    className="px-2 py-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                                    title="Next"
                                                >
                                                    ›
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-3 min-w-0">
                                        {lowPriorityAnnouncements
                                            .slice((currentLowPage - 1) * LOW_PRIORITY_LIMIT, currentLowPage * LOW_PRIORITY_LIMIT)
                                            .map((announcement, index) => (
                                            <LowPriorityCard
                                                key={`${announcement.uuid ?? announcement.id}-${index}`}
                                                id={announcement.id}
                                                title={announcement.title}
                                                description={announcement.description}
                                                imageUrl={announcement.imageUrl}
                                                date={announcement.date}
                                                category={announcement.category}
                                                onClick={() => setSelectedAnnouncement(announcement)}
                                            />
                                        ))}
                                    </div>
                                </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Video Highlights Section - Full Width at Bottom */}
                    <VideoHighlights 
                        videos={videoHighlights}
                        subtitle="Watch important announcements and community updates"
                        onVideoSelect={setSelectedVideo}
                    />

                    {/* Announcement Detail Modal */}
                    {selectedAnnouncement && (
                        <div 
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                            onClick={() => setSelectedAnnouncement(null)}
                        >
                            <div 
                                className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl my-8 overflow-y-auto"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Close Button */}
                                <button 
                                    onClick={() => setSelectedAnnouncement(null)}
                                    className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>

                                {/* Announcement Image */}
                                <div 
                                    className="h-80 bg-cover bg-center rounded-t-2xl relative"
                                    style={{ backgroundImage: `url(${selectedAnnouncement.imageUrl})` }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-t-2xl"></div>
                                    <div className="absolute bottom-6 left-6">
                                        <span className="inline-block bg-red-600 text-white px-4 py-1 rounded-full text-sm font-bold mb-2">
                                            {selectedAnnouncement.category}
                                        </span>
                                    </div>
                                </div>

                                {/* Announcement Content */}
                                <div className="p-8">
                                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                                        <div className="flex items-center gap-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span>{selectedAnnouncement.date}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                            </svg>
                                            <span className="font-semibold">Official Announcement</span>
                                        </div>
                                    </div>

                                    <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
                                        {selectedAnnouncement.title}
                                    </h1>

                                    <div className="prose prose-lg dark:prose-invert max-w-none">
                                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                                            {selectedAnnouncement.description}
                                        </p>

                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-6 mb-3">Contact Information</h3>
                                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                                            <p className="text-gray-700 dark:text-gray-300 mb-2">
                                                <strong>Municipality of Cordova</strong>
                                            </p>
                                            <p className="text-gray-700 dark:text-gray-300 mb-2">
                                                📞 Emergency Hotline: (032) 495-0000
                                            </p>
                                            <p className="text-gray-700 dark:text-gray-300 mb-2">
                                                📧 Email: info@cordova.gov.ph
                                            </p>
                                            <p className="text-gray-700 dark:text-gray-300">
                                                🏛️ Municipal Hall, Poblacion, Cordova, Cebu
                                            </p>
                                        </div>
                                    </div>

                                    {/* Share Section */}
                                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Share this announcement:</span>
                                                <div className="flex gap-2">
                                                    <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                                        </svg>
                                                    </button>
                                                    <button className="p-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors">
                                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                                        </svg>
                                                    </button>
                                                    <button className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Video Modal */}
                    {selectedVideo && (
                        <div 
                            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                            onClick={() => setSelectedVideo(null)}
                        >
                            <div className="relative w-full max-w-4xl aspect-video">
                                <button 
                                    onClick={() => setSelectedVideo(null)}
                                    className="absolute -top-12 right-0 text-white hover:text-red-400 transition"
                                >
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                <iframe
                                    src={selectedVideo}
                                    className="w-full h-full rounded-lg"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>
                    )}
                </div>
                <Footer />
            </PageTransition>
        </>
    );
};

export default AnnouncementsPage;