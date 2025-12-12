'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import PageTransition from '../../../components/PageTransition';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import VideoHighlights from '../../../components/VideoHighlights';
import Carousel from '../../../components/Carousel';
import { HighPriorityCard, NormalPriorityCard, LowPriorityCard } from '../../../components/cards';
import { loadData, loadDataAsync, initialPosts, STORAGE_KEYS, Post } from 'data/adminData';
import { postsApi } from 'lib/postsApi';

interface NewsArticle {
    id: number;
    uuid?: string;
    title: string;
    body: string;
    imageUrl: string;
    date: string;
    category: string;
}

interface HourlyForecast {
    time: string;
    temp: number;
    condition: string;
    weatherCode: number;
}

const NewsPage: React.FC = () => {
    // Video highlights data
    const videoHighlights = [
        {
            id: 1,
            title: 'Asa na dapit si Bagyong Wilma?',
            description: 'Latest updates and reports',
            duration: '3:24',
            thumbnail: 'https://scontent.fmnl4-3.fna.fbcdn.net/v/t39.30808-6/594958403_876639648421253_2983198414767901319_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeHNU5Ohl20J1PwFcy7_meHPpRGcZ0PKuhalEZxnQ8q6FjEATeoKOTYR1ZM8P857eSD-EVJ17CqJYMqvlxdTMgSN&_nc_ohc=RGwIZluQR68Q7kNvwGGkQqZ&_nc_oc=AdmOsSIxyjDlHytQr-fNf9p36sH1xOLTUf7yhGhC1xIFrxSjf75AiwtOxaEQdiKtngta0NdOZRZn9E7D9lG_if2m&_nc_zt=23&_nc_ht=scontent.fmnl4-3.fna&_nc_gid=1Kw06ZjxkuzlYmmkipgtJA&oh=00_AfmKfmSDYcLA7zqqZD93r9sH5_gcLdQl8F7re1eV7JbiIg&oe=69389F7A',
            embedUrl: 'https://scontent.fmnl4-3.fna.fbcdn.net/v/t39.30808-6/594958403_876639648421253_2983198414767901319_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeHNU5Ohl20J1PwFcy7_meHPpRGcZ0PKuhalEZxnQ8q6FjEATeoKOTYR1ZM8P857eSD-EVJ17CqJYMqvlxdTMgSN&_nc_ohc=RGwIZluQR68Q7kNvwGGkQqZ&_nc_oc=AdmOsSIxyjDlHytQr-fNf9p36sH1xOLTUf7yhGhC1xIFrxSjf75AiwtOxaEQdiKtngta0NdOZRZn9E7D9lG_if2m&_nc_zt=23&_nc_ht=scontent.fmnl4-3.fna&_nc_gid=1Kw06ZjxkuzlYmmkipgtJA&oh=00_AfmKfmSDYcLA7zqqZD93r9sH5_gcLdQl8F7re1eV7JbiIg&oe=69389F7A'
        },
        {
            id: 2,
            title: 'Community Highlights',
            description: 'Stories from our municipality',
            duration: '5:12',
            thumbnail: 'https://picsum.photos/seed/newsv2/400/600',
            embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        },
        {
            id: 3,
            title: 'Weather Update',
            description: 'Local forecast and advisories',
            duration: '4:48',
            thumbnail: 'https://picsum.photos/seed/newsv3/400/600',
            embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        },
        {
            id: 4,
            title: 'Municipal Projects',
            description: 'Development and infrastructure',
            duration: '2:56',
            thumbnail: 'https://picsum.photos/seed/newsv4/400/600',
            embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        },
        {
            id: 5,
            title: 'Special Reports',
            description: 'In-depth coverage',
            duration: '6:34',
            thumbnail: 'https://picsum.photos/seed/newsv5/400/600',
            embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        }
    ];

    const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
    const [filteredArticles, setFilteredArticles] = useState<NewsArticle[]>([]);
    const [featuredArticles, setFeaturedArticles] = useState<NewsArticle[]>([]);
    const [lowPriorityArticles, setLowPriorityArticles] = useState<NewsArticle[]>([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [loading, setLoading] = useState(true);
    const [weather, setWeather] = useState({ 
        temp: 0, 
        condition: 'Loading...', 
        location: 'Cordova',
        icon: '01d',
        humidity: 0,
        windSpeed: 0
    });
    const [hourlyForecast, setHourlyForecast] = useState<HourlyForecast[]>([]);
    const [weatherLoading, setWeatherLoading] = useState(true);
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
    const [selectedTopic, setSelectedTopic] = useState<string>('All');
    const [selectedDate, setSelectedDate] = useState<string>('All');
    const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
    const [currentHighPage, setCurrentHighPage] = useState(1);
    const [currentNormalPage, setCurrentNormalPage] = useState(1);
    const [currentLowPage, setCurrentLowPage] = useState(1);
    
    const HIGH_PRIORITY_LIMIT = 5;
    const NORMAL_PRIORITY_LIMIT = 12;
    const LOW_PRIORITY_LIMIT = 9;
    
    // Reset pagination when news data changes to prevent "no results" state
    useEffect(() => {
        setCurrentNormalPage(1);
        setCurrentLowPage(1);
    }, [newsArticles, lowPriorityArticles]);

    useEffect(() => {
        // Fetch real-time weather data for Cordova, Cebu, Philippines
        // Coordinates for Cordova, Cebu: 10.2515° N, 123.9474° E
        const fetchWeather = async () => {
            try {
                // Using Open-Meteo API (free, no API key required)
                // Including hourly forecast for next 8 hours
                const response = await fetch(
                    'https://api.open-meteo.com/v1/forecast?latitude=10.2515&longitude=123.9474&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code&timezone=Asia%2FSingapore&forecast_days=1'
                );
                const data = await response.json();
                
                // Weather code mapping
                const weatherCodeMap: { [key: number]: string } = {
                    0: 'Clear Sky',
                    1: 'Mainly Clear',
                    2: 'Partly Cloudy',
                    3: 'Overcast',
                    45: 'Foggy',
                    48: 'Foggy',
                    51: 'Light Drizzle',
                    53: 'Drizzle',
                    55: 'Heavy Drizzle',
                    61: 'Light Rain',
                    63: 'Rain',
                    65: 'Heavy Rain',
                    71: 'Light Snow',
                    73: 'Snow',
                    75: 'Heavy Snow',
                    77: 'Snow Grains',
                    80: 'Light Showers',
                    81: 'Showers',
                    82: 'Heavy Showers',
                    85: 'Light Snow Showers',
                    86: 'Snow Showers',
                    95: 'Thunderstorm',
                    96: 'Thunderstorm with Hail',
                    99: 'Thunderstorm with Hail'
                };

                const weatherCode = data.current.weather_code;
                const condition = weatherCodeMap[weatherCode] || 'Unknown';

                setWeather({
                    temp: Math.round(data.current.temperature_2m),
                    condition: condition,
                    location: 'Cordova, Cebu',
                    icon: weatherCode.toString(),
                    humidity: data.current.relative_humidity_2m,
                    windSpeed: Math.round(data.current.wind_speed_10m)
                });

                // Process hourly forecast for next 8 hours
                const currentHour = new Date().getHours();
                const forecast: HourlyForecast[] = [];
                
                for (let i = 0; i < 8; i++) {
                    const hourIndex = currentHour + i;
                    if (hourIndex < data.hourly.time.length) {
                        const hourTime = new Date(data.hourly.time[hourIndex]);
                        const hourWeatherCode = data.hourly.weather_code[hourIndex];
                        
                        forecast.push({
                            time: hourTime.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
                            temp: Math.round(data.hourly.temperature_2m[hourIndex]),
                            condition: weatherCodeMap[hourWeatherCode] || 'Unknown',
                            weatherCode: hourWeatherCode
                        });
                    }
                }
                
                setHourlyForecast(forecast);
                setWeatherLoading(false);
            } catch (error) {
                console.error('Error fetching weather:', error);
                setWeather({
                    temp: 31,
                    condition: 'Partly Cloudy',
                    location: 'Cordova, Cebu',
                    icon: '02d',
                    humidity: 70,
                    windSpeed: 15
                });
                setWeatherLoading(false);
            }
        };

        fetchWeather();

        // Load news articles from admin dashboard
        const loadNewsArticles = async () => {
            let adminPosts;
            try {
                adminPosts = await postsApi.getAll();
            } catch (err: any) {
                console.error('Failed to load news from API, using localStorage fallback:', err);
                adminPosts = await loadDataAsync(STORAGE_KEYS.POSTS, initialPosts);
            }
            
            const newsOnly = adminPosts
                .filter((post: Post) => post.type === 'news' && post.status === 'published')
                .map((post: Post) => ({
                    id: post.id,
                    uuid: post.uuid,
                    title: post.title,
                    body: post.content,
                    imageUrl: post.imageUrl || `https://picsum.photos/seed/${post.id + 100}/800/600`,
                    date: new Date(post.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    }),
                    category: post.category || 'Latest News',
                    priority: post.priority || 'normal'
                }));

            // Separate by priority
            const highPriority = newsOnly.filter((article: any) => {
                const originalPost = adminPosts.find((p: Post) => p.id === article.id);
                return originalPost?.priority === 'high';
            }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

            const normalPriority = newsOnly.filter((article: any) => {
                const originalPost = adminPosts.find((p: Post) => p.id === article.id);
                return originalPost?.priority === 'normal' || !originalPost?.priority;
            }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

            const lowPriority = newsOnly.filter((article: any) => {
                const originalPost = adminPosts.find((p: Post) => p.id === article.id);
                return originalPost?.priority === 'low';
            }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

            // High priority - limit to 5 per page (3 in carousel, 2 shown below)
            const dedupedHighPriority = Array.from(new Map(highPriority.map((item: any) => [item.id, item])).values());
            if (dedupedHighPriority.length < highPriority.length) {
                console.warn('Duplicate news IDs found in featured articles; duplicates were removed.');
            }
            setFeaturedArticles(dedupedHighPriority.slice(0, 3));
            
            // Normal priority - limit to 12 per page
            setNewsArticles(normalPriority);
            
            // Low priority - limit to 9 per page
            setLowPriorityArticles(lowPriority);
            
            // Combined for filtering
            setFilteredArticles([...normalPriority, ...lowPriority]);
            
            setLoading(false);
        };

        loadNewsArticles();

        // Set up listener for localStorage changes (real-time updates)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === STORAGE_KEYS.POSTS) {
                loadNewsArticles();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        
        // Also listen for custom event for same-tab updates
        const handleCustomUpdate = () => loadNewsArticles();
        window.addEventListener('adminDataUpdated', handleCustomUpdate);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('adminDataUpdated', handleCustomUpdate);
        };
    }, []);

    // Auto-slide carousel every 5 seconds
    useEffect(() => {
        if (featuredArticles.length > 0) {
            const interval = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % featuredArticles.length);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [featuredArticles]);

    // Filter articles based on topic and date
    useEffect(() => {
        let filtered = [...newsArticles];
        
        if (selectedTopic !== 'All') {
            filtered = filtered.filter(article => article.category === selectedTopic);
        }
        
        if (selectedDate !== 'All') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            filtered = filtered.filter(article => {
                const articleDate = new Date(article.date);
                articleDate.setHours(0, 0, 0, 0);
                
                const daysDiff = Math.floor((today.getTime() - articleDate.getTime()) / (1000 * 60 * 60 * 24));
                
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
        
        setFilteredArticles(filtered);
    }, [selectedTopic, selectedDate, newsArticles]);

    return (
        <>
            <Navbar activePage="news" />
            <PageTransition>
                <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors flex flex-col overflow-x-hidden">
                    {/* Page Header with Weather */}
                    <div className="relative bg-gradient-to-r from-red-900 to-red-800 text-white py-16 overflow-hidden">
                        {/* Background Image Overlay */}
                        <div 
                            className="absolute inset-0 bg-cover opacity-20"
                            style={{ backgroundImage: "url('/municipality-bg.jpg')", backgroundPosition: 'center top 30%' }}
                        />
                        <div className="max-w-7xl mx-auto px-4 relative z-10">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-6xl md:text-7xl font-black mb-4">MGA BALITA</h1>
                                    <p className="text-xl text-white/80">Stay updated with the latest news from Cordova</p>
                                </div>
                                {/* Weather Widget with Forecast */}
                                <div className="hidden lg:flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/20">
                                    {weatherLoading ? (
                                        <div className="animate-pulse flex items-center gap-4">
                                            <div className="text-right">
                                                <div className="h-3 bg-white/30 rounded w-24 mb-2"></div>
                                                <div className="h-8 bg-white/30 rounded w-16 mb-1"></div>
                                                <div className="h-2 bg-white/30 rounded w-20"></div>
                                            </div>
                                            <div className="w-12 h-12 bg-white/30 rounded-full"></div>
                                        </div>
                                    ) : (
                                        <>
                                            {/* Current Weather */}
                                            <div className="flex items-center gap-4 border-r border-white/30 pr-4">
                                                <div className="text-right">
                                                    <div className="text-sm text-white/80 font-semibold">{weather.location}</div>
                                                    <div className="text-4xl font-black">{weather.temp}°C</div>
                                                    <div className="text-xs text-white/70">{weather.condition}</div>
                                                    <div className="text-xs text-white/60 mt-1">
                                                        💧 {weather.humidity}% | 💨 {weather.windSpeed} km/h
                                                    </div>
                                                </div>
                                                <div className="text-5xl">
                                                    {weather.condition.includes('Clear') ? '☀️' : 
                                                     weather.condition.includes('Cloudy') ? '⛅' : 
                                                     weather.condition.includes('Rain') || weather.condition.includes('Shower') ? '🌧️' : 
                                                     weather.condition.includes('Thunder') ? '⛈️' : 
                                                     weather.condition.includes('Fog') ? '🌫️' : '☀️'}
                                                </div>
                                            </div>

                                            {/* 8-Hour Forecast */}
                                            {hourlyForecast.length > 0 && (
                                                <div className="pl-2">
                                                    <div className="text-xs text-white/70 font-semibold mb-2">Next 8 Hours</div>
                                                    <div className="flex gap-2">
                                                        {hourlyForecast.slice(0, 4).map((hour, index) => (
                                                            <div 
                                                                key={index}
                                                                className="flex-shrink-0 bg-white/20 rounded-lg p-2 text-center min-w-[55px]"
                                                            >
                                                                <div className="text-xs text-white/80 font-medium mb-1">
                                                                    {hour.time.split(' ')[0]}
                                                                </div>
                                                                <div className="text-xl mb-1">
                                                                    {hour.condition.includes('Clear') ? '☀️' : 
                                                                     hour.condition.includes('Cloudy') ? '⛅' : 
                                                                     hour.condition.includes('Rain') || hour.condition.includes('Shower') ? '🌧️' : 
                                                                     hour.condition.includes('Thunder') ? '⛈️' : 
                                                                     hour.condition.includes('Fog') ? '🌫️' : '☀️'}
                                                                </div>
                                                                <div className="text-sm font-bold text-white">
                                                                    {hour.temp}°
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
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
                                <option value="Latest News">Latest News</option>
                                <option value="Breaking News">Breaking News</option>
                                <option value="Community">Community</option>
                                <option value="Local Event">Local Event</option>
                            </select>
                        </div>

                        {loading ? (
                            <div className="animate-pulse space-y-8">
                                <div className="h-96 bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-w-0">
                                    {[1, 2, 3, 4, 5, 6].map(i => (
                                        <div key={i} className="h-64 bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* Featured Article Carousel */}
                                {featuredArticles.length > 0 && (
                                    <Carousel>
                                        {featuredArticles.map((article, index) => (
                                            <HighPriorityCard
                                                key={`${article.uuid ?? article.id}-${index}`}
                                                id={article.id}
                                                title={article.title}
                                                description={article.body}
                                                imageUrl={article.imageUrl}
                                                date={article.date}
                                                category={article.category}
                                                currentSlide={currentSlide}
                                                index={index}
                                                onClick={() => setSelectedArticle(article)}
                                            />
                                        ))}
                                    </Carousel>
                                )}

                                {/* Normal Priority News Section */}
                                {newsArticles.length > 0 && (
                                <div className="mb-8">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="bg-red-900 text-white px-6 py-2 font-black text-lg" 
                                             style={{ clipPath: 'polygon(0 0, 100% 0, 95% 100%, 0% 100%)' }}>
                                            LATEST NEWS
                                        </div>
                                        {newsArticles.length > NORMAL_PRIORITY_LIMIT && (
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
                                                    {currentNormalPage}/{Math.ceil(newsArticles.length / NORMAL_PRIORITY_LIMIT)}
                                                </span>
                                                <button
                                                    onClick={() => { setCurrentNormalPage(prev => Math.min(Math.ceil(newsArticles.length / NORMAL_PRIORITY_LIMIT), prev + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                                    disabled={currentNormalPage >= Math.ceil(newsArticles.length / NORMAL_PRIORITY_LIMIT)}
                                                    className="px-2 py-1 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                                    title="Next"
                                                >
                                                    ›
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 min-w-0">
                                        {newsArticles
                                            .slice((currentNormalPage - 1) * NORMAL_PRIORITY_LIMIT, currentNormalPage * NORMAL_PRIORITY_LIMIT)
                                            .map((article, index) => (
                                            <NormalPriorityCard
                                                key={`${article.uuid ?? article.id}-${index}`}
                                                id={article.id}
                                                title={article.title}
                                                description={article.body}
                                                imageUrl={article.imageUrl}
                                                date={article.date}
                                                category={article.category}
                                                onClick={() => setSelectedArticle(article)}
                                            />
                                        ))}
                                    </div>
                                </div>
                                )}

                                {/* Low Priority News Section */}
                                {lowPriorityArticles.length > 0 && (
                                <div className="mt-12">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="bg-gray-700 text-white px-6 py-2 font-black text-lg" 
                                             style={{ clipPath: 'polygon(0 0, 100% 0, 95% 100%, 0% 100%)' }}>
                                            MORE STORIES
                                        </div>
                                        {lowPriorityArticles.length > LOW_PRIORITY_LIMIT && (
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
                                                    {currentLowPage}/{Math.ceil(lowPriorityArticles.length / LOW_PRIORITY_LIMIT)}
                                                </span>
                                                <button
                                                    onClick={() => { setCurrentLowPage(prev => Math.min(Math.ceil(lowPriorityArticles.length / LOW_PRIORITY_LIMIT), prev + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                                    disabled={currentLowPage >= Math.ceil(lowPriorityArticles.length / LOW_PRIORITY_LIMIT)}
                                                    className="px-2 py-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                                    title="Next"
                                                >
                                                    ›
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        {lowPriorityArticles
                                            .slice((currentLowPage - 1) * LOW_PRIORITY_LIMIT, currentLowPage * LOW_PRIORITY_LIMIT)
                                            .map((article, index) => (
                                            <LowPriorityCard
                                                key={`${article.uuid ?? article.id}-${index}`}
                                                id={article.id}
                                                title={article.title}
                                                description={article.body}
                                                imageUrl={article.imageUrl}
                                                date={article.date}
                                                category={article.category}
                                                onClick={() => setSelectedArticle(article)}
                                            />
                                        ))}
                                    </div>
                                </div>
                                )}

                                {/* Popular News Section - Removed to make space for priority sections */}
                                <div className="mt-12" style={{ display: 'none' }}>
                                    <div className="flex items-center mb-6">
                                        <div className="bg-blue-900 text-white px-6 py-2 font-black text-lg" 
                                             style={{ clipPath: 'polygon(0 0, 100% 0, 95% 100%, 0% 100%)' }}>
                                            POPULAR NEWS
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {newsArticles.slice(0, 5).map((article, index) => (
                                            <div 
                                                key={`${article.uuid ?? article.id}-${index}`}
                                                onClick={() => setSelectedArticle(article)}
                                                className="flex gap-4 relative bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl rounded-xl p-4 border border-white/20 dark:border-gray-700/30 hover:shadow-xl hover:border-white/40 dark:hover:border-gray-600/50 transition-all duration-300 group cursor-pointer"
                                            >
                                                {/* Gradient overlay for glass effect */}
                                                <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-transparent pointer-events-none rounded-xl"></div>
                                                
                                                <div 
                                                    className="w-32 h-24 flex-shrink-0 bg-cover bg-center rounded-lg relative z-10"
                                                    style={{ backgroundImage: `url(${article.imageUrl})` }}
                                                ></div>
                                                <div className="flex-1 relative z-10">
                                                    <h4 className="font-bold text-gray-900 dark:text-white mb-1 line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                                                        {article.title}
                                                    </h4>
                                                    <p className="text-sm text-gray-700 dark:text-gray-200 line-clamp-2 mb-2">
                                                        {article.body}
                                                    </p>
                                                    <span className="text-xs text-gray-600 dark:text-gray-300">{article.date}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </>
                        )}
                    </div>

                    {/* Video Highlights Section - Full Width at Bottom */}
                    <VideoHighlights 
                        videos={videoHighlights}
                        subtitle="Watch breaking news and featured stories"
                        onVideoSelect={setSelectedVideo}
                    />

                    {/* Article Detail Modal */}
                    {selectedArticle && (
                        <div 
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                            onClick={() => setSelectedArticle(null)}
                        >
                            <div 
                                className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl my-8 overflow-y-auto"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Close Button */}
                                <button 
                                    onClick={() => setSelectedArticle(null)}
                                    className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>

                                {/* Article Image */}
                                <div 
                                    className="h-80 bg-cover bg-center rounded-t-2xl relative"
                                    style={{ backgroundImage: `url(${selectedArticle.imageUrl})` }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent rounded-t-2xl"></div>
                                    <div className="absolute bottom-6 left-6">
                                        <span className="inline-block bg-red-600 text-white px-4 py-1 rounded-full text-sm font-bold mb-2">
                                            {selectedArticle.category}
                                        </span>
                                    </div>
                                </div>

                                {/* Article Content */}
                                <div className="p-8">
                                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                                        <div className="flex items-center gap-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span>{selectedArticle.date}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>5 min read</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            <span>1.2k views</span>
                                        </div>
                                    </div>

                                    <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
                                        {selectedArticle.title}
                                    </h1>

                                    <div className="prose prose-lg dark:prose-invert max-w-none">
                                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                                            {selectedArticle.body}
                                        </p>
                                        
                                       
                                    </div>

                                    {/* Share Section */}
                                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Share this article:</span>
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

                    {/* Video Popup Modal */}
                    {selectedVideo && (
                        <div 
                            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
                            onClick={() => setSelectedVideo(null)}
                        >
                            <div className="relative w-full max-w-5xl aspect-video">
                                {/* Close Button */}
                                <button 
                                    onClick={() => setSelectedVideo(null)}
                                    className="absolute -top-12 right-0 text-white hover:text-red-400 transition-colors"
                                >
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                {/* Video Player */}
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

export default NewsPage;