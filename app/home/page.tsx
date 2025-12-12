'use client';

import React, { useEffect, useState } from 'react';
import { initialPosts } from 'data/adminData';
import { postsApi } from 'lib/postsApi';
import selectTopPostsByType from '../../utils/carousel';
import Link from 'next/link';
import PageTransition from '../../components/PageTransition';
import { Bell, ChevronRight, X, AlertTriangle, Phone, HelpCircle } from 'lucide-react';

interface AnnouncementItem {
    id: number;
    title: string;
    body: string;
    imageUrl: string;
}

const HomeGuestPage: React.FC = () => {
    const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
    const [featuredPosts, setFeaturedPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingFeatured, setLoadingFeatured] = useState(true);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [hasMoved, setHasMoved] = useState(false);
    const [showBanner, setShowBanner] = useState(true);
    const carouselRef = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Fetch 6 most recent posts from backend API
        const fetchServerPosts = async () => {
            try {
                const posts = await postsApi.getAll();
                // Sort by createdAt date (most recent first) and take first 6
                const sortedPosts = posts.sort((a, b) => 
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                ).slice(0, 6);
                return sortedPosts;
            } catch (err) {
                console.warn('Failed to fetch posts from API; using static posts', err);
                // Sort static posts and take first 6
                const sortedPosts = initialPosts.sort((a, b) => 
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                ).slice(0, 6);
                return sortedPosts;
            }
        };

        fetchServerPosts().then((selected) => {
            // Map to AnnouncementItem shape (some fields differ between Post and announcement item)
            const selectedMapped = selected.map(p => ({ 
                id: p.id, 
                title: p.title, 
                body: p.content, 
                imageUrl: p.imageUrl || `https://picsum.photos/seed/${p.id}/400/500` 
            }));
            setAnnouncements(selectedMapped);
            setLoading(false);
        });

        // Fetch featured posts
        const fetchFeaturedPosts = async () => {
            try {
                const featured = await postsApi.getFeatured(6);
                // getFeatured API already filters for isFeatured=true
                setFeaturedPosts(featured);
            } catch (err) {
                console.warn('Failed to fetch featured posts', err);
                setFeaturedPosts([]);
            } finally {
                setLoadingFeatured(false);
            }
        };

        fetchFeaturedPosts();
    }, []);

    // Auto-scroll carousel
    useEffect(() => {
        if (loading || announcements.length === 0 || !carouselRef.current) return;

        const autoScrollInterval = setInterval(() => {
            if (!carouselRef.current || isDragging) return;
            
            const maxScrollLeft = carouselRef.current.scrollWidth - carouselRef.current.clientWidth;
            const currentScroll = carouselRef.current.scrollLeft;
            
            if (currentScroll >= maxScrollLeft - 10) {
                carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                const cardWidth = 350;
                carouselRef.current.scrollTo({ 
                    left: currentScroll + cardWidth, 
                    behavior: 'smooth' 
                });
            }
        }, 5000);

        return () => clearInterval(autoScrollInterval);
    }, [loading, announcements, isDragging]);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!carouselRef.current) return;
        setIsDragging(true);
        setHasMoved(false);
        setStartX(e.pageX - carouselRef.current.offsetLeft);
        setScrollLeft(carouselRef.current.scrollLeft);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !carouselRef.current) return;
        e.preventDefault();
        const x = e.pageX - carouselRef.current.offsetLeft;
        const walk = (x - startX) * 2;
        
        // If mouse has moved more than 5px, consider it a drag
        if (Math.abs(walk) > 5) {
            setHasMoved(true);
        }
        
        carouselRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
        setHasMoved(false);
    };

    const handleCardClick = (e: React.MouseEvent, item: AnnouncementItem) => {
        // Only trigger click if the user didn't drag
        if (!hasMoved) {
            console.log('Card clicked:', item.title);
            // Add your click handler here (e.g., open modal, navigate to detail page)
        }
    };

    const scroll = (direction: 'left' | 'right') => {
        if (!carouselRef.current) return;
        const scrollAmount = 350;
        const newScrollLeft = direction === 'left' 
            ? carouselRef.current.scrollLeft - scrollAmount 
            : carouselRef.current.scrollLeft + scrollAmount;
        carouselRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
    };

    return (
        <PageTransition>
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-red-50 to-orange-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-colors">
                {/* Announcement Banner */}
                {showBanner && (
                    <div className="bg-gradient-to-r from-red-600 via-orange-500 to-red-600 text-white py-3 px-4 shadow-lg">
                        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 flex-1">
                                <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg flex-shrink-0">
                                    <Bell className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-sm md:text-base">
                                        Cordova Municipality Annual Festival 2025 - Special Event | Dec 5-15, Cordova
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Link 
                                    href="/community/events"
                                    className="bg-white text-red-600 px-4 py-2 md:px-6 md:py-2 rounded-full font-bold hover:bg-gray-100 transition-colors text-sm md:text-base whitespace-nowrap flex items-center gap-2 shadow-lg"
                                >
                                    View Details
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                                <button 
                                    onClick={() => setShowBanner(false)}
                                    className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-colors flex-shrink-0"
                                    aria-label="Close banner"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Hero Section */}
                <section className="relative py-20 px-4 dark:bg-transparent">
                    <div className="max-w-7xl mx-auto text-center">
                        <h1 className="text-4xl md:text-6xl font-black text-red-900 dark:text-white mb-4">
                            Stay Informed. Stay Connected.
                        </h1>
                        <p className="text-lg md:text-xl text-red-800 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                            Your one-stop portal for community updates, safety alerts, and local events.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link 
                                href="/community/announcements"
                                className="bg-red-900 text-white px-8 py-4 rounded-full font-bold hover:bg-red-800 transition shadow-lg"
                            >
                                View Announcements
                            </Link>
                            <Link 
                                href="/rescue-desk"
                                className="bg-red-800 text-white px-8 py-4 rounded-full font-bold hover:bg-red-700 transition shadow-lg"
                            >
                                Emergency Contacts
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Announcements Carousel Section */}
                <section className="py-12 px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex items-center gap-6">
                            {/* Left Navigation Button */}
                            {!loading && announcements.length > 0 && (
                                <button
                                    onClick={() => scroll('left')}
                                    className="flex-shrink-0 text-red-900 dark:text-white hover:text-red-700 dark:hover:text-red-400 transition-all duration-300 hover:scale-110 z-10"
                                    aria-label="Previous"
                                >
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                            )}

                            {/* Carousel Container */}
                            <div className="flex-1 overflow-hidden">

                        {loading ? (
                            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="min-w-[280px] h-[380px] bg-white dark:bg-gray-700 rounded-xl shadow-lg animate-pulse">
                                        <div className="w-full h-full bg-gray-300 dark:bg-gray-600 rounded-xl"></div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div 
                                ref={carouselRef}
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseLeave}
                                className={`flex gap-6 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-red-900 scrollbar-track-red-100 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} select-none`}
                            >
                                {announcements.map((item) => (
                                    <div 
                                        key={item.id}
                                        onClick={(e) => handleCardClick(e, item)}
                                        className="min-w-[280px] md:min-w-[320px] flex-shrink-0 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group transform hover:-translate-y-2 cursor-pointer"
                                    >
                                        <div 
                                            className="w-full h-[400px] bg-cover bg-center relative"
                                            style={{ backgroundImage: `url(${item.imageUrl})` }}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                                <h3 className="text-lg font-bold mb-2 line-clamp-2">
                                                    {item.title}
                                                </h3>
                                                <p className="text-sm text-white/80 line-clamp-2">
                                                    {item.body}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                            </div>

                            {/* Right Navigation Button */}
                            {!loading && announcements.length > 0 && (
                                <button
                                    onClick={() => scroll('right')}
                                    className="flex-shrink-0 text-red-900 dark:text-white hover:text-red-700 dark:hover:text-red-400 transition-all duration-300 hover:scale-110 z-10"
                                    aria-label="Next"
                                >
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>
                </section>

                {/* Featured Posts Section */}
                {!loadingFeatured && featuredPosts.length > 0 && (
                    <section className="py-12 px-4 bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-800 dark:to-gray-900">
                        <div className="max-w-7xl mx-auto">
                            <div className="text-center mb-8">
                                <div className="inline-block bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-bold mb-3">
                                    ⭐ FEATURED
                                </div>
                                <h2 className="text-3xl md:text-4xl font-black text-red-900 dark:text-white mb-2">
                                    Featured Events & Updates
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Don't miss these important highlights from our community
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {featuredPosts.map((post) => (
                                    <Link 
                                        key={post.id}
                                        href={`/community/${post.type}/${post.id}`} 
                                        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group cursor-pointer block"
                                    >
                                        {post.imageUrl && (
                                            <div className="relative h-48 overflow-hidden">
                                                <img 
                                                    src={post.imageUrl} 
                                                    alt={post.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                />
                                                <div className="absolute top-3 left-3">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                        post.type === 'event' ? 'bg-purple-500 text-white' :
                                                        post.type === 'announcement' ? 'bg-blue-500 text-white' :
                                                        'bg-green-500 text-white'
                                                    }`}>
                                                        {post.type?.toUpperCase()}
                                                    </span>
                                                </div>
                                                {post.priority === 'high' && (
                                                    <div className="absolute top-3 right-3">
                                                        <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                                                            HIGH PRIORITY
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        <div className="p-6">
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                                                {post.title}
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                                                {post.content}
                                            </p>
                                            {post.location && (
                                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    {post.location}
                                                </div>
                                            )}
                                            {post.createdAt && (
                                                <div className="text-xs text-gray-400 dark:text-gray-500">
                                                    {new Date(post.createdAt).toLocaleDateString('en-US', { 
                                                        year: 'numeric', 
                                                        month: 'short', 
                                                        day: 'numeric' 
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* About Cordova Section */}
                <section className="py-16 px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-black text-red-900 dark:text-white mb-4">
                                About Cordova
                            </h2>
                            <p className="text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
                                A progressive coastal municipality on Mactan Island, Cebu, dedicated to sustainable development and quality life for all residents.
                            </p>
                        </div>

                        {/* Vision & Mission - Minimalist Cards */}
                        <div className="grid md:grid-cols-2 gap-6 mb-12">
                            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-red-100 dark:border-gray-700">
                                <h3 className="text-2xl font-bold text-red-900 dark:text-white mb-3">Vision</h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    A progressive, resilient, and sustainable coastal municipality where every resident enjoys quality life through good governance, economic prosperity, and environmental stewardship.
                                </p>
                            </div>
                            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-red-100 dark:border-gray-700">
                                <h3 className="text-2xl font-bold text-red-900 dark:text-white mb-3">Mission</h3>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    To deliver efficient and effective public services, promote inclusive development, protect the environment, and empower communities through transparent governance and active citizen participation.
                                </p>
                            </div>
                        </div>

                        {/* Key Facts - Compact Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <div className="text-center p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl">
                                <div className="text-3xl font-black text-red-900 dark:text-red-400 mb-2">32.5</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Square Kilometers</div>
                            </div>
                            <div className="text-center p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl">
                                <div className="text-3xl font-black text-red-900 dark:text-red-400 mb-2">13</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Barangays</div>
                            </div>
                            <div className="text-center p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl">
                                <div className="text-3xl font-black text-red-900 dark:text-red-400 mb-2">67K+</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Population</div>
                            </div>
                            <div className="text-center p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl">
                                <div className="text-3xl font-black text-red-900 dark:text-red-400 mb-2">1864</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">Established</div>
                            </div>
                        </div>

                        {/* Quick About Points */}
                        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
                            <div className="grid md:grid-cols-3 gap-6 text-center md:text-left">
                                <div>
                                    <h4 className="font-bold text-red-900 dark:text-red-400 mb-2">Economy</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Fishing, agriculture, manufacturing, and growing tourism sector
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-red-900 dark:text-red-400 mb-2">Tourism</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Gilutongan Marine Sanctuary, island hopping, and eco-tourism
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-red-900 dark:text-red-400 mb-2">Culture</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        The Dinagat Festival in Cordova, Cebu is a vibrant cultural and religious celebration held every August 14, honoring the town’s fishing heritage, maritime ecosystem, and devotion to its patron saint, San Roque.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Learn More Link */}
                        <div className="text-center mt-8">
                            <Link 
                                href="/about"
                                className="inline-flex items-center gap-2 text-red-900 dark:text-red-400 font-bold hover:text-red-700 dark:hover:text-red-300 transition-colors"
                            >
                                Learn More About Cordova
                                <ChevronRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Bottom Action Sections */}
                <section className="py-16 px-4 bg-white/50 dark:bg-gray-800/50">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Service Request */}
                        <Link 
                            href="/services"
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 group text-center"
                        >
                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                {/* Clipboard icon for services */}
                                <svg className="w-8 h-8 text-blue-900 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <rect x="9" y="2" width="6" height="4" rx="1" strokeWidth={2} />
                                    <rect x="4" y="6" width="16" height="16" rx="2" strokeWidth={2} />
                                    <path strokeWidth={2} d="M9 2v2a3 3 0 006 0V2" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
                                Service Request
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Request municipal services or report community concerns
                            </p>
                        </Link>

                        {/* Emergency Hotlines */}
                        <Link 
                            href="/rescue-desk"
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 group text-center"
                        >
                            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <Phone className="w-8 h-8 text-red-900 dark:text-red-400" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
                                Emergency Hotlines
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Access 24/7 emergency contact numbers
                            </p>
                        </Link>

                        {/* Visit Barangay */}
                        <Link 
                            href="/barangay"
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 group text-center"
                        >
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                {/* Use a "Users" icon to represent community/barangay */}
                                <svg className="w-8 h-8 text-green-900 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-7a4 4 0 11-8 0 4 4 0 018 0zm6 8a4 4 0 00-3-3.87M3 16a4 4 0 013-3.87" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
                                Visit Barangay
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Explore information and updates from each barangay
                            </p>
                        </Link>
                    </div>
                </section>
            </div>
        </PageTransition>
    );
};

export default HomeGuestPage;
