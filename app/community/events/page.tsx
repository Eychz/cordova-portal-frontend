'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import PageTransition from '../../../components/PageTransition';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import VideoHighlights from '../../../components/VideoHighlights';
import { MapPin, Calendar, Clock, CalendarPlus, X } from 'lucide-react';
import { loadData, loadDataAsync, initialPosts, STORAGE_KEYS, Post } from 'data/adminData';
import Carousel from '../../../components/Carousel';
import { HighPriorityCard, NormalPriorityEventCard, LowPriorityEventCard } from '../../../components/cards';

interface Event {
    id: number;
    uuid?: string;
    name: string;
    description: string;
    content: string;
    location: string;
    date: string;
    time: string;
    imageUrl: string;
    priority: 'high' | 'moderate' | 'low';
    status: 'featured' | 'upcoming' | 'done';
}

const EventsPage: React.FC = () => {
    // Video highlights data
    const videoHighlights = [
        {
            id: 1,
            title: 'Festival Highlights',
            description: 'Celebration moments',
            duration: '3:24',
            thumbnail: 'https://picsum.photos/seed/eventv1/400/600',
            embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        },
        {
            id: 2,
            title: 'Community Gathering',
            description: 'Together as one',
            duration: '5:12',
            thumbnail: 'https://picsum.photos/seed/eventv2/400/600',
            embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        },
        {
            id: 3,
            title: 'Sports Events',
            description: 'Athletic competitions',
            duration: '4:48',
            thumbnail: 'https://picsum.photos/seed/eventv3/400/600',
            embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        },
        {
            id: 4,
            title: 'Cultural Shows',
            description: 'Traditional performances',
            duration: '2:56',
            thumbnail: 'https://picsum.photos/seed/eventv4/400/600',
            embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        },
        {
            id: 5,
            title: 'Public Programs',
            description: 'Community initiatives',
            duration: '6:34',
            thumbnail: 'https://picsum.photos/seed/eventv5/400/600',
            embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        }
    ];

    const [events, setEvents] = useState<Event[]>([]);
    const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
    const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
    const [lowPriorityEvents, setLowPriorityEvents] = useState<Event[]>([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [loading, setLoading] = useState(true);
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [addingToCalendar, setAddingToCalendar] = useState<number | null>(null);
    const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [selectedDate, setSelectedDate] = useState<string>('All');
    const [selectedStatus, setSelectedStatus] = useState<string>('All');
    const [currentNormalPage, setCurrentNormalPage] = useState(1);
    const [currentLowPage, setCurrentLowPage] = useState(1);
    
    // Reset pagination when events data changes to prevent "no results" state
    useEffect(() => {
        setCurrentNormalPage(1);
        setCurrentLowPage(1);
    }, [events, lowPriorityEvents]);
    
    const HIGH_PRIORITY_LIMIT = 5;
    const NORMAL_PRIORITY_LIMIT = 12;
    const LOW_PRIORITY_LIMIT = 9;

    useEffect(() => {
        // Load events from admin dashboard
        const loadEvents = async () => {
            const postsApi = await import('../../../lib/postsApi');
            let adminPosts;
            try {
                adminPosts = await postsApi.postsApi.getAll('event');
            } catch (err: any) {
                console.warn('Failed to fetch from API, falling back to localStorage', err);
                adminPosts = await loadDataAsync(STORAGE_KEYS.POSTS, initialPosts);
            }
            const eventsOnly = adminPosts
                .filter((post: Post) => post.type === 'event' && post.status === 'published')
                .map((post: Post) => ({
                    id: post.id,
                    uuid: post.uuid,
                    name: post.title,
                    description: post.content.slice(0, 100),
                    content: post.content,
                    location: post.location || 'Cordova Sports Complex',
                    date: post.eventDate ? new Date(post.eventDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    }) : new Date(post.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    }),
                    time: post.eventTime || '10:00 AM',
                    imageUrl: post.imageUrl || `https://picsum.photos/seed/${post.id + 200}/800/600`,
                    priority: (post.priority === 'high' ? 'high' : post.priority === 'low' ? 'low' : 'moderate') as 'high' | 'moderate' | 'low',
                    status: (post.eventStatus || 'upcoming') as 'featured' | 'upcoming' | 'done'
                }));

            // Separate by priority
            const highPriority = eventsOnly.filter((event: any) => {
                const originalPost = adminPosts.find((p: Post) => p.id === event.id);
                return originalPost?.priority === 'high';
            }).sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

            const normalPriority = eventsOnly.filter((event: any) => {
                const originalPost = adminPosts.find((p: Post) => p.id === event.id);
                return originalPost?.priority === 'normal' || !originalPost?.priority;
            }).sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

            const lowPriority = eventsOnly.filter((event: any) => {
                const originalPost = adminPosts.find((p: Post) => p.id === event.id);
                return originalPost?.priority === 'low';
            }).sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

            // High priority only in carousel (max 3)
            // Dedupe by id to avoid duplicate keys when rendering
            const dedupedHighPriority = Array.from(new Map(highPriority.map((item: any) => [item.id, item])).values());
            if (dedupedHighPriority.length < highPriority.length) {
                console.warn('Duplicate event IDs found in featured events; duplicates were removed.');
            }
            setFeaturedEvents(dedupedHighPriority.slice(0, 3));
            
            // Normal priority in main section
            setEvents(normalPriority);
            
            // Low priority in bottom section
            setLowPriorityEvents(lowPriority);
            
            // Combined for filtering
            setFilteredEvents([...normalPriority, ...lowPriority]);
            
            setLoading(false);
        };

        loadEvents();

        // Set up listener for localStorage changes (real-time updates)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === STORAGE_KEYS.POSTS) {
                loadEvents();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        
        // Also listen for custom event for same-tab updates
        const handleCustomUpdate = () => loadEvents();
        window.addEventListener('adminDataUpdated', handleCustomUpdate);

        // Auto-slide carousel every 5 seconds
        const carouselInterval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % 3);
        }, 5000);

        // Countdown timer - Calculate to Christmas
        const updateCountdown = () => {
            const now = new Date();
            const currentYear = now.getFullYear();
            let christmas = new Date(currentYear, 11, 25); // December 25
            
            // If Christmas has passed this year, set to next year
            if (now > christmas) {
                christmas = new Date(currentYear + 1, 11, 25);
            }
            
            const diff = christmas.getTime() - now.getTime();
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            
            setCountdown({ days, hours, minutes, seconds });
        };
        
        updateCountdown(); // Initial call
        const countdownInterval = setInterval(updateCountdown, 1000);

        return () => {
            clearInterval(countdownInterval);
            clearInterval(carouselInterval);
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('adminDataUpdated', handleCustomUpdate);
        };
    }, []);

    // Filter events based on date and status
    useEffect(() => {
        let filtered = [...events];

        // Filter by status
        if (selectedStatus !== 'All') {
            filtered = filtered.filter(event => event.status === selectedStatus.toLowerCase());
        }

        // Filter by date
        if (selectedDate !== 'All') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            filtered = filtered.filter(event => {
                const eventDate = new Date(event.date);
                eventDate.setHours(0, 0, 0, 0);

                const daysDiff = Math.floor((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

                if (selectedDate === 'Next 7 Days') {
                    return daysDiff >= 0 && daysDiff <= 6;
                } else if (selectedDate === 'Next 2 Weeks') {
                    return daysDiff >= 0 && daysDiff <= 13;
                } else if (selectedDate === 'Next Month') {
                    return daysDiff >= 0 && daysDiff <= 29;
                } else if (selectedDate === 'Next 3 Months') {
                    return daysDiff >= 0 && daysDiff <= 89;
                } else if (selectedDate === 'This Month') {
                    return eventDate.getMonth() === today.getMonth() && eventDate.getFullYear() === today.getFullYear();
                }
                return true;
            });
        }

        setFilteredEvents(filtered);
    }, [selectedDate, selectedStatus, events]);

    return (
        <>
            <Navbar activePage="events" />
            <PageTransition>
                <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors flex flex-col overflow-x-hidden">
                    {/* Page Header with Countdown */}
                    <div className="relative bg-gradient-to-r from-red-900 to-red-800 text-white py-16 overflow-hidden">
                        {/* Background Image Overlay */}
                        <div 
                            className="absolute inset-0 bg-cover opacity-20"
                            style={{ backgroundImage: "url('/municipality-bg.jpg')", backgroundPosition: 'center top 30%' }}
                        />
                        <div className="max-w-7xl mx-auto px-4 relative z-10">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-6xl md:text-7xl font-black mb-4">EVENTS</h1>
                                </div>
                                {/* Countdown Timer with Christmas Background */}
                                <div className="hidden md:block relative overflow-hidden rounded-2xl">
                                    {/* Christmas Background Image */}
                                    <div 
                                        className="absolute inset-0 bg-cover bg-center brightness-75"
                                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=800&q=80')" }}
                                    />
                                    {/* Glass Effect Overlay with Blue Tint */}
                                    <div className="absolute inset-0 backdrop-blur-lg bg-blue-900/40" />
                                    
                                    {/* Animated Christmas Effects - Santa Icons */}
                                    <div className="absolute inset-0 pointer-events-none">
                                        {/* Floating Santa 1 */}
                                        <div className="absolute top-2 left-4 text-4xl animate-bounce" style={{ animationDuration: '3s' }}>🎅</div>
                                        {/* Floating Santa 2 */}
                                        <div className="absolute bottom-2 right-4 text-3xl animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>🎅</div>
                                        {/* Snowflakes */}
                                        <div className="absolute top-4 right-8 text-2xl animate-pulse" style={{ animationDuration: '2s' }}>❄️</div>
                                        <div className="absolute bottom-4 left-8 text-xl animate-pulse" style={{ animationDuration: '3s', animationDelay: '0.5s' }}>❄️</div>
                                        {/* Gift Box */}
                                        <div className="absolute top-1/2 left-2 text-2xl animate-pulse" style={{ animationDuration: '2.5s' }}>🎁</div>
                                    </div>
                                    
                                    {/* Content */}
                                    <div className="relative px-8 py-4 text-center">
                                        <div className="text-5xl font-black mb-2 drop-shadow-2xl">
                                            {countdown.days}d {countdown.hours}h:{countdown.minutes}m
                                        </div>
                                        <div className="text-sm font-bold drop-shadow-md">CHRISTMAS DAY</div>
                                    </div>
                                </div>
                            </div>
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
                                <option value="All">All Dates</option>
                                <option value="Next 7 Days">Next 7 Days</option>
                                <option value="Next 2 Weeks">Next 2 Weeks</option>
                                <option value="This Month">This Month</option>
                                <option value="Next Month">Next Month</option>
                                <option value="Next 3 Months">Next 3 Months</option>
                            </select>
                            <select 
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            >
                                <option value="All">All Status</option>
                                <option value="Featured">Featured</option>
                                <option value="Upcoming">Upcoming</option>
                                <option value="Done">Done</option>
                            </select>
                        </div>

                        {loading ? (
                            <div className="animate-pulse space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <div key={i} className="h-96 bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Featured Events Carousel */}
                                {featuredEvents.length > 0 && (
                                    <Carousel>
                                        {featuredEvents.map((event, index) => (
                                            <HighPriorityCard
                                                key={`${event.uuid ?? event.id}-${index}`}
                                                id={event.id}
                                                title={event.name}
                                                description={event.content}
                                                imageUrl={event.imageUrl}
                                                date={event.date}
                                                category="Featured Event"
                                                currentSlide={currentSlide}
                                                index={index}
                                                onClick={() => setSelectedEvent(event)}
                                            />
                                        ))}
                                    </Carousel>
                                )}

                                {/* Status badge configuration */}
                                {(() => {
                                    const statusConfig: Record<string, { text: string; color: string }> = {
                                        featured: { text: 'Featured', color: 'text-orange-400' },
                                        upcoming: { text: 'Upcoming', color: 'text-green-400' },
                                        done: { text: 'Done', color: 'text-gray-400' }
                                    };
                                
                                return (
                                <>
                                {/* Normal Priority Events Grid */}
                                {events.length > 0 && (
                                <div className="mb-12">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="bg-gray-800 dark:bg-gray-900 text-white px-6 py-2 font-black text-lg" 
                                             style={{ clipPath: 'polygon(0 0, 100% 0, 95% 100%, 0% 100%)' }}>
                                            UPCOMING EVENTS
                                        </div>
                                        {events.length > NORMAL_PRIORITY_LIMIT && (
                                            <div className="flex items-center gap-1 text-sm">
                                                <button
                                                    onClick={() => { setCurrentNormalPage(prev => Math.max(1, prev - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                                    disabled={currentNormalPage === 1}
                                                    className="px-2 py-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                                    title="Previous"
                                                >
                                                    ‹
                                                </button>
                                                <span className="px-2 text-xs text-gray-500 dark:text-gray-400">
                                                    {currentNormalPage}/{Math.ceil(events.length / NORMAL_PRIORITY_LIMIT)}
                                                </span>
                                                <button
                                                    onClick={() => { setCurrentNormalPage(prev => Math.min(Math.ceil(events.length / NORMAL_PRIORITY_LIMIT), prev + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                                    disabled={currentNormalPage >= Math.ceil(events.length / NORMAL_PRIORITY_LIMIT)}
                                                    className="px-2 py-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                                    title="Next"
                                                >
                                                    ›
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 min-w-0">
                                    {events
                                        .slice((currentNormalPage - 1) * NORMAL_PRIORITY_LIMIT, currentNormalPage * NORMAL_PRIORITY_LIMIT)
                                        .map((event, index) => (
                                        <NormalPriorityEventCard
                                            key={`${event.uuid ?? event.id}-${index}`}
                                            id={event.id}
                                            name={event.name}
                                            description={event.description}
                                            imageUrl={event.imageUrl}
                                            date={event.date}
                                            location={event.location}
                                            status={event.status}
                                            onClick={() => setSelectedEvent(event)}
                                        />
                                    ))}
                                </div>
                                </div>
                                )}

                                {/* Low Priority Events Section - Special Compact Card Design */}
                                {lowPriorityEvents.length > 0 && (
                                <div className="mt-12">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="bg-gray-700 text-white px-6 py-2 font-black text-lg" 
                                             style={{ clipPath: 'polygon(0 0, 100% 0, 95% 100%, 0% 100%)' }}>
                                            MORE EVENTS
                                        </div>
                                        {lowPriorityEvents.length > LOW_PRIORITY_LIMIT && (
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
                                                    {currentLowPage}/{Math.ceil(lowPriorityEvents.length / LOW_PRIORITY_LIMIT)}
                                                </span>
                                                <button
                                                    onClick={() => { setCurrentLowPage(prev => Math.min(Math.ceil(lowPriorityEvents.length / LOW_PRIORITY_LIMIT), prev + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                                    disabled={currentLowPage >= Math.ceil(lowPriorityEvents.length / LOW_PRIORITY_LIMIT)}
                                                    className="px-2 py-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                                    title="Next"
                                                >
                                                    ›
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-w-0">
                                        {lowPriorityEvents
                                            .slice((currentLowPage - 1) * LOW_PRIORITY_LIMIT, currentLowPage * LOW_PRIORITY_LIMIT)
                                            .map((event, index) => (
                                            <LowPriorityEventCard
                                                key={`${event.uuid ?? event.id}-${index}`}
                                                id={event.id}
                                                name={event.name}
                                                description={event.description}
                                                imageUrl={event.imageUrl}
                                                date={event.date}
                                                time={event.time}
                                                location={event.location}
                                                status={event.status}
                                                onClick={() => setSelectedEvent(event)}
                                            />
                                        ))}
                                    </div>
                                </div>
                                )}
                                </>
                                );
                                })()}
                            </>
                        )}
                    </div>

                    {/* Video Highlights Section - Full Width at Bottom */}
                    <VideoHighlights 
                        videos={videoHighlights}
                        subtitle="Watch event highlights and memorable moments"
                        onVideoSelect={setSelectedVideo}
                    />

                    {/* Event Details Modal */}
                    {selectedEvent && (
                        <div 
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                            onClick={() => setSelectedEvent(null)}
                        >
                            <div 
                                className="relative bg-white dark:bg-gray-900 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Close Button */}
                                <button 
                                    onClick={() => setSelectedEvent(null)}
                                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors z-10 bg-white dark:bg-gray-800 rounded-full p-2"
                                >
                                    <X className="w-6 h-6" />
                                </button>

                                {/* Event Image */}
                                <div className="relative h-64 md:h-80 w-full">
                                    <img 
                                        src={selectedEvent.imageUrl}
                                        alt={selectedEvent.name}
                                        className="w-full h-full object-cover"
                                        style={{ objectPosition: 'top 5%' }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <div className="absolute bottom-6 left-6 right-6">
                                        <h2 className="text-3xl md:text-4xl font-black text-white mb-2">{selectedEvent.name}</h2>
                                        <div className="flex items-center gap-2 text-white/90">
                                            <MapPin className="w-5 h-5" />
                                            <span className="text-lg font-medium">{selectedEvent.location}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Event Details */}
                                <div className="p-6 md:p-8 space-y-6">
                                    {/* Date and Time */}
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="flex items-start gap-3 bg-gray-100 dark:bg-gray-800 p-4 rounded-xl">
                                            <Calendar className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Date</div>
                                                <div className="text-lg font-bold text-gray-900 dark:text-white">{selectedEvent.date}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3 bg-gray-100 dark:bg-gray-800 p-4 rounded-xl">
                                            <Clock className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Time</div>
                                                <div className="text-lg font-bold text-gray-900 dark:text-white">{selectedEvent.time}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">About This Event</h3>
                                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{selectedEvent.description}</p>
                                    </div>

                                    {/* Status Badge */}
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Status:</span>
                                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                                            selectedEvent.status === 'featured' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' :
                                            selectedEvent.status === 'upcoming' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                                            'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                                        }`}>
                                            {selectedEvent.status ? selectedEvent.status.charAt(0).toUpperCase() + selectedEvent.status.slice(1) : 'N/A'}
                                        </span>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3 pt-4">
                                        {selectedEvent.status === 'done' ? (
                                            <div className="relative group w-full">
                                                <button 
                                                    disabled
                                                    title="Event is already done! Stay tune for upcoming events in our community."
                                                    className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all bg-gray-400 text-white opacity-60 cursor-not-allowed"
                                                >
                                                    <CalendarPlus className="w-5 h-5" />
                                                    Event Already Done
                                                </button>
                                                <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-black text-white text-sm px-3 py-2 rounded whitespace-nowrap z-50">
                                                    Event is already done! Stay tune for upcoming events in our community.
                                                </div>
                                            </div>
                                        ) : (
                                            <button 
                                                onClick={async () => {
                                                    // Check if user is logged in
                                                    const token = localStorage.getItem('token');
                                                    if (!token) {
                                                        toast.error('Please log in to add events to your calendar');
                                                        return;
                                                    }
                                                    
                                                    // Check if user is verified
                                                    const userStr = localStorage.getItem('user');
                                                    if (userStr) {
                                                        const user = JSON.parse(userStr);
                                                        if (!user.isVerified) {
                                                            toast.error('You need to verify first to access this feature. Please complete verification in your dashboard.');
                                                            return;
                                                        }
                                                    }
                                                    
                                                    try {
                                                        const { addEventToCalendar } = await import('../../../lib/apiClient');
                                                        await addEventToCalendar({
                                                            eventId: selectedEvent.id,
                                                            eventTitle: selectedEvent.name,
                                                            eventDate: selectedEvent.date,
                                                            eventTime: selectedEvent.time,
                                                            location: selectedEvent.location
                                                        });
                                                        setAddingToCalendar(selectedEvent.id);
                                                        setTimeout(() => setAddingToCalendar(null), 3000);
                                                        toast.success('Event added to your calendar!');
                                                    } catch (err: any) {
                                                        console.error('Failed to add event to calendar:', err);
                                                        const errorMsg = err.message || 'Failed to add event to calendar';
                                                        
                                                        // Check if it's a duplicate event error
                                                        if (errorMsg.toLowerCase().includes('already saved') || 
                                                            errorMsg.toLowerCase().includes('already exists') ||
                                                            errorMsg.toLowerCase().includes('duplicate')) {
                                                            toast.error('This event is already in your calendar');
                                                            // Show it as added since it's already there
                                                            setAddingToCalendar(selectedEvent.id);
                                                            setTimeout(() => setAddingToCalendar(null), 3000);
                                                        } else if (errorMsg.toLowerCase().includes('endpoint not available') ||
                                                                   errorMsg.toLowerCase().includes('not available')) {
                                                            // API endpoint doesn't exist yet
                                                            toast.error('Calendar feature is currently unavailable. Please try again later.');
                                                        } else if (errorMsg.toLowerCase().includes('authentication') ||
                                                                   errorMsg.toLowerCase().includes('log in')) {
                                                            toast.error('Please log in to add events to your calendar');
                                                        } else {
                                                            toast.error('Failed to add event. Please try again.');
                                                        }
                                                    }
                                                }}
                                                className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                                                    addingToCalendar === selectedEvent.id 
                                                    ? 'bg-green-600 text-white' 
                                                    : 'bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700'
                                                }`}
                                                disabled={addingToCalendar === selectedEvent.id}
                                            >
                                                <CalendarPlus className="w-5 h-5" />
                                                {addingToCalendar === selectedEvent.id ? 'Added to Calendar!' : 'Add to Calendar'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Video Popup Modal */}
                    {selectedVideo && (
                        <div 
                            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
                            onClick={() => setSelectedVideo(null)}
                        >
                            <div className="relative w-full max-w-5xl aspect-video">
                                <button 
                                    onClick={() => setSelectedVideo(null)}
                                    className="absolute -top-12 right-0 text-white hover:text-red-400 transition-colors"
                                >
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                <iframe
                                    className="w-full h-full rounded-lg"
                                    src={selectedVideo}
                                    title="Video Player"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    onClick={(e) => e.stopPropagation()}
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

export default EventsPage;
