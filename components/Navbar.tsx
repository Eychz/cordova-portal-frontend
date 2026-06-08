'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, LogOut, ChevronDown, Search, Calendar } from 'lucide-react';
import DarkModeToggle from './DarkModeToggle';

interface NavbarProps {
    activePage?: string;
    barangay?: string;
}

const Navbar: React.FC<NavbarProps> = ({ activePage, barangay }) => {
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchDate, setSearchDate] = useState('');

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (searchQuery.trim()) params.append('q', searchQuery.trim());
        if (searchDate) params.append('date', searchDate);
        router.push(`/search?${params.toString()}`);
    };
    const [showCommunity, setShowCommunity] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState<string>('');
    const [showBarangay, setShowBarangay] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [showAdminDropdown, setShowAdminDropdown] = useState(false);
    const [userProfileImage, setUserProfileImage] = useState<string | null>(null);
    const [profileImageError, setProfileImageError] = useState(false);
    const [userInitials, setUserInitials] = useState<string>('');
    const [userRole, setUserRole] = useState<string>('');

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

                if (user.role) {
                    setUserRole(user.role);
                }

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
        setShowProfileDropdown(false);
        setShowAdminDropdown(false);
    };


    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
            setShowBackToTop(window.scrollY > 300);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Handle click outside dropdowns
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;

            // Check if click is outside all dropdowns
            if (!target.closest('.community-dropdown') &&
                !target.closest('.barangay-dropdown') &&
                !target.closest('.profile-dropdown') &&
                !target.closest('.admin-dropdown')) {
                closeAllDropdowns();
            }
        };

        // Only add listener if any dropdown is open
        if (showCommunity || showBarangay || showProfileDropdown || showAdminDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showCommunity, showBarangay, showProfileDropdown]);


    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };


    return (
        <nav className={`bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'py-2' : 'py-0'
            }`}>
            <div className="maximize-width">
                <div className={`flex justify-between items-center gap-4 transition-all duration-300 ${isScrolled ? 'h-16' : 'h-20'
                    }`}>
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
                                <span className={`font-black text-gray-900 dark:text-white transition-all duration-300 leading-tight whitespace-nowrap ${isScrolled ? 'text-base' : 'text-lg'
                                    }`}>Municipality of Cordova</span>
                                {barangay && (
                                    <span className={`font-black text-red-600 dark:text-red-400 transition-all duration-300 leading-tight truncate ${isScrolled ? 'text-base' : 'text-lg'
                                        }`}>| Barangay {barangay}</span>
                                )}
                            </div>
                            <span className={`text-xs text-gray-500 dark:text-gray-400 transition-all duration-300 truncate ${isScrolled ? 'hidden' : 'block'
                                }`}>{barangay ? `Barangay ${barangay}` : 'Official Portal'}</span>
                        </div>
                    </Link>

                    {/* Desktop Menu - Center */}
                    <div className="hidden lg:flex items-center justify-center space-x-6 lg:space-x-8 flex-1">
                        <Link href="/home" className={`transition-all font-medium py-2 ${isActive('/home')
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
                                className={`flex items-center gap-1 transition-all font-medium py-2 ${isActive('/community')
                                    ? 'text-red-600 dark:text-red-400 font-bold border-b-2 border-red-600'
                                    : 'text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400'
                                    }`}
                            >
                                Community
                                <svg
                                    className={`w-4 h-4 transition-transform duration-200 ${showCommunity ? 'rotate-180' : 'rotate-0'
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

                        <Link href="/services" className={`transition-all font-medium py-2 whitespace-nowrap ${isActive('/services')
                            ? 'text-red-600 dark:text-red-400 font-bold border-b-2 border-red-600'
                            : 'text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400'
                            }`}>
                            Services
                        </Link>
                        <Link href="/rescue-desk" className={`transition-all font-medium py-2 whitespace-nowrap ${isActive('/rescue-desk')
                            ? 'text-red-600 dark:text-red-400 font-bold border-b-2 border-red-600'
                            : 'text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400'
                            }`}>
                            Rescue Desk
                        </Link>

                        <Link href="/barangay" className={`transition-all font-medium py-2 whitespace-nowrap ${isActive('/barangay')
                            ? 'text-red-600 dark:text-red-400 font-bold border-b-2 border-red-600'
                            : 'text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400'
                            }`}>
                            Barangay
                        </Link>
                    </div>

                    {/* Right Side - Search, Notification, Dark Mode Toggle and Profile Icon */}
                    <div className="hidden lg:flex items-center space-x-4">
                        <form onSubmit={handleSearchSubmit} className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1.5 border border-gray-200 dark:border-gray-700 shadow-sm focus-within:ring-2 focus-within:ring-red-500 focus-within:border-transparent transition-all max-w-xs lg:max-w-sm">
                            <div className="flex items-center gap-1.5 border-r border-gray-300 dark:border-gray-700 pr-2">
                                <Search className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-transparent border-none outline-none text-xs text-gray-800 dark:text-gray-200 w-20 lg:w-32 focus:ring-0 focus:outline-none placeholder-gray-400 dark:placeholder-gray-500"
                                />
                            </div>
                            <div className="flex items-center gap-1.5 pl-2 relative">
                                <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                                <input
                                    type="date"
                                    value={searchDate}
                                    onChange={(e) => setSearchDate(e.target.value)}
                                    className="bg-transparent border-none outline-none text-xs text-gray-750 dark:text-gray-350 focus:ring-0 focus:outline-none w-24 dark:[color-scheme:dark]"
                                />
                                {searchDate && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchDate('')}
                                        className="absolute right-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xs font-bold"
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                            <button
                                type="submit"
                                className="ml-2 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full transition-colors flex items-center justify-center"
                                aria-label="Submit Search"
                            >
                                <Search className="w-3 h-3" />
                            </button>
                        </form>

                        <DarkModeToggle />

                        {/* Profile Dropdown or Admin Dashboard Link */}
                        {isLoggedIn && userRole === 'admin' ? (
                            <div className="relative admin-dropdown">
                                <button
                                    onClick={() => {
                                        closeAllDropdowns();
                                        setShowAdminDropdown(!showAdminDropdown);
                                    }}
                                    className="flex items-center gap-2 p-2 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-all border border-red-100 dark:border-red-800/30 shadow-sm"
                                    aria-label="Admin Dashboard Options"
                                >
                                    <div className="w-8 h-8 rounded-full bg-red-600 dark:bg-red-700 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
                                        <LayoutDashboard className="w-4 h-4" />
                                    </div>
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showAdminDropdown ? 'rotate-180' : ''}`} />
                                </button>

                                {showAdminDropdown && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 shadow-2xl border border-gray-200 dark:border-gray-700 rounded-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700 mb-1">
                                            <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Admin Portal</p>
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{userName || 'Administrator'}</p>
                                        </div>

                                        <Link
                                            href="/admin/dashboard"
                                            onClick={() => setShowAdminDropdown(false)}
                                            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-gray-700 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                        >
                                            <LayoutDashboard className="w-4 h-4" />
                                            <span className="font-medium">Admin Dashboard</span>
                                        </Link>

                                        <div className="h-px bg-gray-100 dark:bg-gray-700 my-1"></div>

                                        <button
                                            onClick={() => {
                                                localStorage.removeItem('token');
                                                localStorage.removeItem('user');
                                                setIsLoggedIn(false);
                                                window.location.href = '/home';
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span className="font-medium">Logout</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
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
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="lg:hidden text-gray-700 dark:text-gray-300 focus:outline-none"
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
            </div>

            {/* Mobile Menu - Full Width Dropdown */}
            <div
                className={`lg:hidden absolute left-0 right-0 top-full bg-white dark:bg-gray-900 shadow-2xl z-40 origin-top transition-all duration-300 ease-in-out border-b dark:border-gray-700 overflow-hidden rounded-none ${isOpen
                    ? 'max-h-[50vh] opacity-100 border-gray-200'
                    : 'max-h-0 opacity-0 border-transparent pointer-events-none'
                    }`}
            >
                <div className="maximize-width py-6 overflow-y-auto max-h-[50vh]">
                    <form onSubmit={handleSearchSubmit} className="flex items-center bg-gray-100 dark:bg-gray-800 p-2 border-gray-200 dark:border-gray-700 mb-6">
                        <div className="flex items-center gap-1.5 flex-1 pr-2 border-gray-300 dark:border-gray-700">
                            <Search className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                            <input
                                type="text"
                                placeholder="Search community, services..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-transparent border-none outline-none text-xs text-gray-800 dark:text-gray-200 w-full focus:ring-0 focus:outline-none"
                            />
                        </div>
                        <div className="flex items-center gap-1 pl-2 relative">
                            <input
                                type="date"
                                value={searchDate}
                                onChange={(e) => setSearchDate(e.target.value)}
                                className="bg-transparent border-none outline-none text-xs text-gray-750 dark:text-gray-350 focus:ring-0 focus:outline-none w-24 dark:[color-scheme:dark]"
                            />
                        </div>
                        <button
                            type="submit"
                            className="ml-2 bg-red-700 hover:bg-red-800 text-white p-1.5 transition-colors"
                        >
                            <Search className="w-3.5 h-3.5" />
                        </button>
                    </form>
                    <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 mb-2">
                        <span className="text-gray-700 dark:text-gray-300 font-bold uppercase tracking-widest text-xs">Theme</span>
                        <DarkModeToggle />
                    </div>
                    <div className="flex flex-col space-y-1 mt-4">
                        <Link href="/home" className={`block py-3 ${isActive('/home')
                            ? 'text-red-700 font-black border-l-4 border-red-700 pl-4 bg-red-50 dark:bg-gray-800'
                            : 'text-gray-700 dark:text-gray-300 hover:text-red-700 font-bold pl-4 hover:bg-gray-50 dark:hover:bg-gray-800'
                            }`}>Home</Link>
                        <Link href="/community/news" className={`block py-3 ${isActive('/community/news')
                            ? 'text-red-700 font-black border-l-4 border-red-700 pl-4 bg-red-50 dark:bg-gray-800'
                            : 'text-gray-700 dark:text-gray-300 hover:text-red-700 font-bold pl-4 hover:bg-gray-50 dark:hover:bg-gray-800'
                            }`}>News</Link>
                        <Link href="/community/events" className={`block py-3 ${isActive('/community/events')
                            ? 'text-red-700 font-black border-l-4 border-red-700 pl-4 bg-red-50 dark:bg-gray-800'
                            : 'text-gray-700 dark:text-gray-300 hover:text-red-700 font-bold pl-4 hover:bg-gray-50 dark:hover:bg-gray-800'
                            }`}>Events</Link>
                        <Link href="/community/announcements" className={`block py-3 ${isActive('/community/announcements')
                            ? 'text-red-700 font-black border-l-4 border-red-700 pl-4 bg-red-50 dark:bg-gray-800'
                            : 'text-gray-700 dark:text-gray-300 hover:text-red-700 font-bold pl-4 hover:bg-gray-50 dark:hover:bg-gray-800'
                            }`}>Announcements</Link>
                        <Link href="/services" className={`block py-3 ${isActive('/services')
                            ? 'text-red-700 font-black border-l-4 border-red-700 pl-4 bg-red-50 dark:bg-gray-800'
                            : 'text-gray-700 dark:text-gray-300 hover:text-red-700 font-bold pl-4 hover:bg-gray-50 dark:hover:bg-gray-800'
                            }`}>Services</Link>
                        <Link href="/rescue-desk" className={`block py-3 ${isActive('/rescue-desk')
                            ? 'text-red-700 font-black border-l-4 border-red-700 pl-4 bg-red-50 dark:bg-gray-800'
                            : 'text-gray-700 dark:text-gray-300 hover:text-red-700 font-bold pl-4 hover:bg-gray-50 dark:hover:bg-gray-800'
                            }`}>Rescue Desk</Link>
                        <Link
                            href="/barangay"
                            className={`block py-3 ${isActive('/barangay')
                                ? 'text-red-700 font-black border-l-4 border-red-700 pl-4 bg-red-50 dark:bg-gray-800'
                                : 'text-gray-700 dark:text-gray-300 hover:text-red-700 font-bold pl-4 hover:bg-gray-50 dark:hover:bg-gray-800'
                                }`}
                            onClick={() => setIsOpen(false)}
                        >
                            Barangay
                        </Link>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-6 flex flex-col gap-3">
                        {isLoggedIn ? (
                            <>
                                {userName && (
                                    <div className="py-2 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest text-center border-b border-gray-200 dark:border-gray-700 mb-2">
                                        {userName}
                                    </div>
                                )}
                                <Link href="/dashboard" className="block w-full py-3 text-center bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-none border border-gray-200 dark:border-gray-700 font-bold tracking-widest uppercase text-xs" onClick={() => setIsOpen(false)}>My Dashboard</Link>
                                <button onClick={() => {
                                    localStorage.removeItem('token');
                                    localStorage.removeItem('user');
                                    setIsLoggedIn(false);
                                    setIsOpen(false);
                                    window.location.href = '/home';
                                }} className="w-full py-3 text-center bg-red-700 hover:bg-red-800 text-white font-bold tracking-widest uppercase text-xs">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link href="/auth/login" className="block w-full py-3 text-center bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-none border border-gray-200 dark:border-gray-700 font-bold tracking-widest uppercase text-xs" onClick={() => setIsOpen(false)}>Login</Link>
                                <Link href="/auth/register" className="block w-full py-3 text-center bg-red-700 text-white rounded-none font-bold tracking-widest uppercase text-xs hover:bg-red-800" onClick={() => setIsOpen(false)}>Register</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Back to Top Button */}
            {
                showBackToTop && (
                    <button
                        onClick={scrollToTop}
                        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-all duration-200 z-40 hover:scale-110"
                        aria-label="Back to top"
                    >
                        <svg className="w-8 h-8 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                )
            }
        </nav >
    );
}
export default Navbar;