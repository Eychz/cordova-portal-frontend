'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import DarkModeToggle from './DarkModeToggle';
import UserProfileDropdown from './UserProfileDropdown';

interface NavbarProps {
    activePage?: string;
    barangay?: string;
}

interface Notification {
    id: number;
    title: string;
    message: string;
    type: string;
    timestamp: string;
    read?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ activePage, barangay }) => {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [showCommunity, setShowCommunity] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false); 
    const [userName, setUserName] = useState<string>('');
    const [showBarangay, setShowBarangay] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showNotifications, setShowNotifications] = useState(false);
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [userNotifications, setUserNotifications] = useState<Notification[]>([]);
    const [loadingNotifications, setLoadingNotifications] = useState(false);
    const [userProfileImage, setUserProfileImage] = useState<string | null>(null);
    const [profileImageError, setProfileImageError] = useState(false);
    const [userInitials, setUserInitials] = useState<string>('');

    // Check authentication status on mount and fetch profile data
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        
        if (token && userStr) {
            setIsLoggedIn(true);
            try {
                const user = JSON.parse(userStr);
                const fullName = user.firstName && user.lastName 
                    ? `${user.firstName} ${user.lastName}`
                    : user.email;
                setUserName(fullName);
                
                // Set user initials
                const initials = user.firstName && user.lastName
                    ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
                    : user.email?.charAt(0).toUpperCase() || 'U';
                setUserInitials(initials);
                
                // Set profile image if available
                if (user.profileImageUrl) {
                    setUserProfileImage(user.profileImageUrl);
                }
            } catch (e) {
                console.error('Error parsing user data:', e);
            }
        }
    }, []);

    // Helper function to check if a path is active
    const isActive = (path: string) => pathname === path || pathname?.startsWith(path + '/');

    const closeAllDropdowns = () => {
        setShowCommunity(false);
        setShowBarangay(false);
        setShowNotifications(false);
        setShowProfileDropdown(false);
        setShowSuggestions(false);
    };

    const handleSuggestionClick = (suggestion: string) => {
        setSearchQuery(suggestion);
        setShowSuggestions(false);
        // Trigger search with the suggestion
        const query = suggestion.toLowerCase();
        window.location.href = `/search?q=${encodeURIComponent(query)}`;
    };

    const handleSearch = () => {
        if (searchQuery.trim()) {
            // Fuzzy search - match nearest words
            const searchTerms = ['events', 'announcements', 'news', 'services', 'rescue', 'emergency', 'barangay', 'officials', 'hotlines', 'health', 'community'];
            const query = searchQuery.toLowerCase();
            
            // Find best match using simple similarity
            let bestMatch = query;
            let bestScore = 0;
            
            searchTerms.forEach(term => {
                const score = getSimilarity(query, term);
                if (score > bestScore && score > 0.5) {
                    bestScore = score;
                    bestMatch = term;
                }
            });
            
            // Navigate to search results page
            window.location.href = `/search?q=${encodeURIComponent(bestMatch)}`;
        }
    };
    
    const getSimilarity = (str1: string, str2: string): number => {
        const longer = str1.length > str2.length ? str1 : str2;
        const shorter = str1.length > str2.length ? str2 : str1;
        if (longer.length === 0) return 1.0;
        if (longer.includes(shorter)) return 0.8;
        const editDistance = getEditDistance(str1, str2);
        return (longer.length - editDistance) / longer.length;
    };
    
    const getEditDistance = (str1: string, str2: string): number => {
        const matrix: number[][] = [];
        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }
        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }
        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        return matrix[str2.length][str1.length];
    };

    // Helper function to format relative time
    const formatRelativeTime = (timestamp: string | number): string => {
        try {
            const notificationDate = typeof timestamp === 'string' ? new Date(timestamp) : new Date(timestamp);
            const now = new Date();
            
            // Check if date is valid
            if (isNaN(notificationDate.getTime())) {
                return 'just now';
            }
            
            const diffMs = now.getTime() - notificationDate.getTime();
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMs / 3600000);
            const diffDays = Math.floor(diffMs / 86400000);
            
            if (diffMins < 1) return 'just now';
            if (diffMins < 60) return `${diffMins}m ago`;
            if (diffHours < 24) return `${diffHours}h ago`;
            if (diffDays < 7) return `${diffDays}d ago`;
            
            return notificationDate.toLocaleDateString();
        } catch (e) {
            return 'recently';
        }
    };

    const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
            setShowBackToTop(window.scrollY > 300);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Fetch notifications when notification modal is opened
    useEffect(() => {
        const fetchNotifications = async () => {
            if (!showNotifications || !isLoggedIn) return;
            
            setLoadingNotifications(true);
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/notifications`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    console.log('Fetched notifications:', data);
                    setUserNotifications(Array.isArray(data) ? data.slice(0, 3) : []);
                } else {
                    console.error('Failed to fetch notifications:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
            } finally {
                setLoadingNotifications(false);
            }
        };
        
        fetchNotifications();
    }, [showNotifications, isLoggedIn]);

    // Handle click outside dropdowns
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            
            // Check if click is outside all dropdowns
            if (!target.closest('.community-dropdown') && 
                !target.closest('.barangay-dropdown') && 
                !target.closest('.profile-dropdown') &&
                !target.closest('.notification-dropdown') &&
                !target.closest('.search-suggestions')) {
                closeAllDropdowns();
            }
        };

        // Only add listener if any dropdown is open
        if (showCommunity || showBarangay || showProfileDropdown || showNotifications || showSuggestions) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showCommunity, showBarangay, showProfileDropdown, showNotifications, showSuggestions]);

    const suggestedSearches = ['Emergency Hotlines', 'Barangay Officials', 'Upcoming Events', 'Latest News', 'Health Services', 'Community Updates'];
    
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const barangays = [
        'Alegria', 'Bangbang', 'Buagsong', 'Catarman', 'Cogon', 
        'Dapitan', 'Day-as', 'Ibabao', 'Gabi', 'Gilutongan', 
        'Pilipog', 'Poblacion', 'San Miguel'
    ];

    return (
        <nav className={`bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-all duration-300 ${
            isScrolled ? 'py-2' : 'py-0'
        }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className={`flex justify-between items-center gap-4 transition-all duration-300 ${
                    isScrolled ? 'h-16' : 'h-20'
                }`}>
                    {/* Search Mode - Enhanced Search Bar with Logo */}
                    {showSearch ? (
                        <>
                            {/* Logo - Always visible on the left */}
                            <Link href="/home" className="flex items-center space-x-3 hover:opacity-80 transition-opacity flex-shrink-0 max-w-md lg:max-w-lg">
                                <Image
                                    src="/municipal-logo.jpg"
                                    alt="Municipality of Cordova"
                                    width={isScrolled ? 35 : 45}
                                    height={isScrolled ? 35 : 45}
                                    className="rounded-full transition-all duration-300 flex-shrink-0"
                                />
                                <div className="flex flex-col min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className={`font-black text-gray-900 dark:text-white transition-all duration-300 leading-tight whitespace-nowrap ${
                                            isScrolled ? 'text-base' : 'text-lg'
                                        }`}>Municipality of Cordova</span>
                                        {barangay && (
                                            <span className={`font-black text-red-600 dark:text-red-400 transition-all duration-300 leading-tight truncate ${
                                                isScrolled ? 'text-base' : 'text-lg'
                                            }`}>| Barangay {barangay}</span>
                                        )}
                                    </div>
                                    <span className={`text-xs text-gray-500 dark:text-gray-400 transition-all duration-300 truncate ${
                                        isScrolled ? 'hidden' : 'block'
                                    }`}>{barangay ? `Barangay ${barangay}` : 'Official Portal'}</span>
                                </div>
                            </Link>

                            {/* Search Bar in Center */}
                            <div className="flex items-center gap-3 flex-1 justify-center animate-in fade-in slide-in-from-right duration-300">
                                <div className="relative flex-1 max-w-2xl search-suggestions">
                                    <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 rounded-full px-6 py-3 shadow-lg border-2 border-transparent focus-within:border-red-500 transition-all">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            onKeyPress={handleSearchKeyPress}
                                            onFocus={() => setShowSuggestions(true)}
                                            placeholder="Search for events, announcements, services..."
                                            className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400 text-base"
                                            autoFocus
                                        />
                                        {searchQuery && (
                                            <button 
                                                onClick={() => setSearchQuery('')}
                                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all hover:scale-110 flex-shrink-0"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>

                                    {/* Suggestions Dropdown */}
                                    {showSuggestions && (
                                        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                                            <div className="p-2">
                                                <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                    Popular Searches
                                                </div>
                                                {suggestedSearches.map((suggestion, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => handleSuggestionClick(suggestion)}
                                                        className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-3 group"
                                                    >
                                                        <svg className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                        </svg>
                                                        <span className="text-gray-700 dark:text-gray-300 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                                                            {suggestion}
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                <button 
                                    onClick={handleSearch}
                                    className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white px-6 py-3 rounded-full font-semibold transition-all hover:scale-105 shadow-lg flex-shrink-0"
                                >
                                    Search
                                </button>
                            </div>

                            {/* Close button on the right */}
                            <button 
                                onClick={() => {
                                    setShowSearch(false);
                                    setShowSuggestions(false);
                                    setSearchQuery('');
                                }}
                                className="p-2 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-all hover:scale-110 flex-shrink-0"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </>
                    ) : (
                        <>
                    {/* Logo - Left aligned with max width */}
                    <Link href="/home" className="flex items-center space-x-3 hover:opacity-80 transition-opacity flex-shrink-0 max-w-md lg:max-w-lg">
                        <Image
                            src="/municipal-logo.jpg"
                            alt="Municipality of Cordova"
                            width={isScrolled ? 35 : 45}
                            height={isScrolled ? 35 : 45}
                            className="rounded-full transition-all duration-300 flex-shrink-0"
                        />
                        <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-2">
                                <span className={`font-black text-gray-900 dark:text-white transition-all duration-300 leading-tight whitespace-nowrap ${
                                    isScrolled ? 'text-base' : 'text-lg'
                                }`}>Municipality of Cordova</span>
                                {barangay && (
                                    <span className={`font-black text-red-600 dark:text-red-400 transition-all duration-300 leading-tight truncate ${
                                        isScrolled ? 'text-base' : 'text-lg'
                                    }`}>| Barangay {barangay}</span>
                                )}
                            </div>
                            <span className={`text-xs text-gray-500 dark:text-gray-400 transition-all duration-300 truncate ${
                                isScrolled ? 'hidden' : 'block'
                            }`}>{barangay ? `Barangay ${barangay}` : 'Official Portal'}</span>
                        </div>
                    </Link>

                    {/* Desktop Menu - Center */}
                    <div className="hidden md:flex items-center justify-center space-x-6 lg:space-x-8 flex-1">
                        <Link href="/home" className={`transition-all font-medium py-2 ${
                            isActive('/home') 
                                ? 'text-red-600 dark:text-red-400 font-bold border-b-2 border-red-600' 
                                : 'text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400'
                        }`}>
                            Home
                        </Link>
                        
                        {/* Community Dropdown */}
                        <div className="relative group community-dropdown">
                            <button 
                                onClick={() => {
                                    closeAllDropdowns();
                                    setShowCommunity(!showCommunity);
                                }}
                                className={`flex items-center gap-1 transition-all font-medium py-2 ${
                                    isActive('/community') 
                                        ? 'text-red-600 dark:text-red-400 font-bold border-b-2 border-red-600' 
                                        : 'text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400'
                                }`}
                            >
                                Community
                                <svg 
                                    className={`w-4 h-4 transition-transform duration-200 ${
                                        showCommunity ? 'rotate-180' : 'rotate-0'
                                    }`} 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {showCommunity && (
                                <div className="absolute left-0 bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 rounded-lg mt-1 py-2 w-56 z-50 animate-fadeIn">
                                    <Link href="/community/news" className={`block px-4 py-2.5 hover:bg-red-50 dark:hover:bg-gray-700 dark:text-white text-sm transition-colors ${activePage === 'news' ? 'bg-red-50 dark:bg-gray-700 text-red-600 dark:text-red-400 border-l-4 border-red-600' : 'text-gray-700 hover:text-red-600'}`}>
                                        <span className="font-medium">News</span>
                                    </Link>
                                    <Link href="/community/events" className={`block px-4 py-2.5 hover:bg-red-50 dark:hover:bg-gray-700 dark:text-white text-sm transition-colors ${activePage === 'events' ? 'bg-red-50 dark:bg-gray-700 text-red-600 dark:text-red-400 border-l-4 border-red-600' : 'text-gray-700 hover:text-red-600'}`}>
                                        <span className="font-medium">Events</span>
                                    </Link>
                                    <Link href="/community/announcements" className={`block px-4 py-2.5 hover:bg-red-50 dark:hover:bg-gray-700 dark:text-white text-sm transition-colors ${activePage === 'announcements' ? 'bg-red-50 dark:bg-gray-700 text-red-600 dark:text-red-400 border-l-4 border-red-600' : 'text-gray-700 hover:text-red-600'}`}>
                                        <span className="font-medium">Announcements</span>
                                    </Link>
                                </div>
                            )}
                        </div>
                        
                        <Link href="/services" className={`transition-all font-medium py-2 whitespace-nowrap ${
                            isActive('/services') 
                                ? 'text-red-600 dark:text-red-400 font-bold border-b-2 border-red-600' 
                                : 'text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400'
                        }`}>
                            Services
                        </Link>
                        <Link href="/rescue-desk" className={`transition-all font-medium py-2 whitespace-nowrap ${
                            isActive('/rescue-desk') 
                                ? 'text-red-600 dark:text-red-400 font-bold border-b-2 border-red-600' 
                                : 'text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400'
                        }`}>
                            Rescue Desk
                        </Link>
                        
                        {/* Barangay Dropdown */}
                        <div className="relative group barangay-dropdown">
                            <button 
                                onClick={() => {
                                    closeAllDropdowns();
                                    setShowBarangay(!showBarangay);
                                }}
                                className={`flex items-center gap-1 transition-all font-medium py-2 ${
                                    isActive('/barangay') 
                                        ? 'text-red-600 dark:text-red-400 font-bold border-b-2 border-red-600' 
                                        : 'text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400'
                                }`}
                            >
                                Barangay
                                <svg 
                                    className={`w-4 h-4 transition-transform duration-200 ${
                                        showBarangay ? 'rotate-180' : 'rotate-0'
                                    }`} 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {showBarangay && (
                                <div className="absolute left-0 bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 rounded-lg mt-1 py-2 w-56 max-h-80 overflow-y-auto z-50 animate-fadeIn scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                                    {barangays.map((barangay) => (
                                        <Link 
                                            key={barangay}
                                            href={`/barangay/${barangay.toLowerCase().replace(/ /g, '-')}`} 
                                            className="block px-4 py-2.5 hover:bg-red-50 dark:hover:bg-gray-700 dark:text-white text-gray-700 hover:text-red-600 transition-colors text-sm"
                                        >
                                            <span className="font-medium">{barangay}</span>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Side - Search, Notification, Dark Mode Toggle and Profile Icon */}
                    <div className="hidden md:flex items-center space-x-4">
                        {/* Search Button */}
                        <button 
                            onClick={() => {
                                closeAllDropdowns();
                                setShowSearch(!showSearch);
                            }}
                            className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                        
                        {/* Notification Icon - Only for logged-in users */}
                        {isLoggedIn && (
                            <div className="relative notification-dropdown">
                                <button 
                                    onClick={() => {
                                        closeAllDropdowns();
                                        setShowNotifications(!showNotifications);
                                    }}
                                    className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                    {/* Notification Badge */}
                                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"></span>
                                </button>
                            
                                {/* Notification Panel */}
                                {showNotifications && (
                                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 shadow-2xl border border-gray-200 dark:border-gray-700 rounded-lg z-50 animate-fadeIn">
                                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                        <h3 className="font-bold text-gray-900 dark:text-white">Notifications</h3>
                                    </div>
                                    <div className="max-h-96 overflow-y-auto">
                                        {loadingNotifications ? (
                                            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                                                <p className="text-sm">Loading notifications...</p>
                                            </div>
                                        ) : userNotifications.length > 0 ? (
                                            userNotifications.map((notification) => {
                                                const isClickable = notification.type === 'post' || notification.type === 'featured_post';
                                                return (
                                                <div key={notification.id} className={`p-4 border-b border-gray-100 dark:border-gray-700 ${isClickable ? 'hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer' : 'opacity-75 cursor-default'}`}>
                                                    <div className="flex gap-3">
                                                        <div className={`w-2 h-2 rounded-full mt-2 ${
                                                            notification.type === 'alert' ? 'bg-red-600' :
                                                            notification.type === 'event' ? 'bg-blue-600' :
                                                            notification.type === 'announcement' ? 'bg-green-600' :
                                                            'bg-purple-600'
                                                        }`}></div>
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{notification.title}</p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">{notification.message}</p>
                                                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{formatRelativeTime(notification.timestamp)}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                );
                                            })
                                        ) : (
                                            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                                                <p className="text-sm">No notifications yet</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-3 border-t border-gray-200 dark:border-gray-700 text-center">
                                        <Link 
                                            href="/notifications" 
                                            className="text-sm text-red-600 dark:text-red-400 font-medium hover:underline inline-block"
                                            onClick={() => setShowNotifications(false)}
                                        >
                                            View All Notifications
                                        </Link>
                                    </div>
                                </div>
                                )}
                            </div>
                        )}
                        
                        <DarkModeToggle />
                        
                        {/* Profile Dropdown */}
                        <div className="relative profile-dropdown">
                            <button 
                                onClick={() => {
                                    closeAllDropdowns();
                                    setShowProfileDropdown(!showProfileDropdown);
                                }}
                                className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                aria-label="User Profile"
                            >
                                {userProfileImage && !profileImageError ? (
                                    <img 
                                        src={userProfileImage} 
                                        alt="Profile" 
                                        className="w-9 h-9 rounded-full object-cover border border-gray-200 dark:border-gray-600"
                                        onError={() => setProfileImageError(true)}
                                    />
                                ) : (
                                    <div className="w-9 h-9 rounded-full bg-red-600 dark:bg-red-700 flex items-center justify-center text-white font-semibold">
                                        {isLoggedIn && userInitials ? (
                                            <span className="text-sm font-bold">{userInitials}</span>
                                        ) : (
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </div>
                                )}
                            </button>
                            
                            {/* Profile Dropdown Menu */}
                            {showProfileDropdown && (
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 rounded-lg py-2 z-50 animate-fadeIn">
                                    {isLoggedIn ? (
                                        <>
                                            {userName && (
                                                <div className="px-4 py-2.5 text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                                                    {userName}
                                                </div>
                                            )}
                                            <Link href="/dashboard" className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-gray-700 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                                                <div className="flex items-center gap-2">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                                    </svg>
                                                    My Dashboard
                                                </div>
                                            </Link>
                                            <button onClick={() => { 
                                                localStorage.removeItem('token');
                                                localStorage.removeItem('user');
                                                setIsLoggedIn(false); 
                                                window.location.href = '/home'; 
                                            }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-gray-700 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                                                <div className="flex items-center gap-2">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                    </svg>
                                                    Logout
                                                </div>
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link href="/auth/login" className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-gray-700 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                                                <div className="flex items-center gap-2">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                                    </svg>
                                                    Login
                                                </div>
                                            </Link>
                                            <Link href="/auth/register" className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-gray-700 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                                                <div className="flex items-center gap-2">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                                    </svg>
                                                    Register
                                                </div>
                                            </Link>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                        </>
                    )}

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden text-gray-700 dark:text-gray-300 focus:outline-none"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden pb-4">
                        <div className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 mb-2">
                            <div className="flex items-center gap-3">
                                <span className="text-gray-700 dark:text-gray-300 font-medium">Theme</span>
                                <button className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"></span>
                                </button>
                            </div>
                            <DarkModeToggle />
                        </div>
                        <Link href="/home" className={`block py-2 ${
                            isActive('/home') 
                                ? 'text-red-600 dark:text-red-400 font-bold border-l-4 border-red-600 pl-4' 
                                : 'text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400'
                        }`}>Home</Link>
                        <Link href="/community/news" className={`block py-2 ${
                            isActive('/community/news') 
                                ? 'text-red-600 dark:text-red-400 font-bold border-l-4 border-red-600 pl-4' 
                                : 'text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400'
                        }`}>News</Link>
                        <Link href="/community/events" className={`block py-2 ${
                            isActive('/community/events') 
                                ? 'text-red-600 dark:text-red-400 font-bold border-l-4 border-red-600 pl-4' 
                                : 'text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400'
                        }`}>Events</Link>
                        <Link href="/community/announcements" className={`block py-2 ${
                            isActive('/community/announcements') 
                                ? 'text-red-600 dark:text-red-400 font-bold border-l-4 border-red-600 pl-4' 
                                : 'text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400'
                        }`}>Announcements</Link>
                        <Link href="/services" className={`block py-2 ${
                            isActive('/services') 
                                ? 'text-red-600 dark:text-red-400 font-bold border-l-4 border-red-600 pl-4' 
                                : 'text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400'
                        }`}>Services</Link>
                        <Link href="/rescue-desk" className={`block py-2 ${
                            isActive('/rescue-desk') 
                                ? 'text-red-600 dark:text-red-400 font-bold border-l-4 border-red-600 pl-4' 
                                : 'text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400'
                        }`}>Rescue Desk</Link>
                        {barangays.map((barangay) => {
                            const barangayPath = `/barangay/${barangay.toLowerCase().replace(/ /g, '-')}`;
                            return (
                                <Link 
                                    key={barangay}
                                    href={barangayPath} 
                                    className={`block py-2 pl-4 ${
                                        isActive(barangayPath) 
                                            ? 'text-red-600 dark:text-red-400 font-bold border-l-4 border-red-600' 
                                            : 'text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400'
                                    }`}
                                >
                                    {barangay}
                                </Link>
                            );
                        })}
                        <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                            {isLoggedIn ? (
                                <>
                                    {userName && (
                                        <div className="py-2 text-gray-500 dark:text-gray-400 text-sm border-b border-gray-200 dark:border-gray-700 mb-2">
                                            {userName}
                                        </div>
                                    )}
                                    <Link href="/dashboard" className="block py-2 text-red-600 dark:text-red-400 font-semibold">My Dashboard</Link>
                                    <Link href="/dashboard" className="block py-2 text-red-600 dark:text-red-400 font-semibold">Dashboard</Link>
                                    <button onClick={() => { 
                                        localStorage.removeItem('token');
                                        localStorage.removeItem('user');
                                        setIsLoggedIn(false); 
                                        window.location.href = '/home'; 
                                    }} className="w-full text-left py-2 text-red-600 dark:text-red-400 font-semibold">Logout</button>
                                </>
                            ) : (
                                <>
                                    <Link href="/auth/login" className="block py-2 text-red-600 dark:text-red-400 font-semibold">Login</Link>
                                    <Link href="/auth/register" className="block py-2 text-red-600 dark:text-red-400 font-semibold">Register</Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>



            {/* Back to Top Button */}
            {showBackToTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-6 left-1/2 transform -translate-x-1/2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-all duration-200 z-40 hover:scale-110"
                    aria-label="Back to top"
                >
                    <svg className="w-8 h-8 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            )}
        </nav>
    );
};

export default Navbar;