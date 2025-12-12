'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    profileImageUrl?: string;
}

interface UserProfileDropdownProps {
    isLoggedIn?: boolean;
}

const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({ isLoggedIn = false }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [profileImageError, setProfileImageError] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Fetch fresh user data from API to get latest profileImageUrl
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    // Fallback to localStorage if no token
                    const storedUser = localStorage.getItem('user');
                    if (storedUser) {
                        const parsedUser = JSON.parse(storedUser);
                        setUser(parsedUser);
                    }
                    return;
                }

                const { userApi } = await import('../lib/userApi');
                const profile = await userApi.getProfile();
                
                const userData: User = {
                    id: profile.id,
                    firstName: profile.firstName,
                    lastName: profile.lastName,
                    email: profile.email,
                    profileImageUrl: profile.profileImageUrl
                };
                
                setUser(userData);
                // Update localStorage with fresh data
                localStorage.setItem('user', JSON.stringify(userData));
            } catch (err) {
                console.error('Failed to fetch user profile:', err);
                // Fallback to localStorage
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    try {
                        const parsedUser = JSON.parse(storedUser);
                        setUser(parsedUser);
                    } catch (parseErr) {
                        console.error('Failed to parse user from localStorage:', parseErr);
                    }
                }
            }
        };

        if (isLoggedIn) {
            fetchUserData();
        }
    }, [isLoggedIn]);

    const handleLogout = () => {
        // Handle logout logic here
        console.log('Logging out...');
        // Clear session/tokens
        router.push('/home');
    };

    return (
        <div 
            className="relative"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
        >
            {/* Profile Icon Button */}
            <button 
                className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="User Profile"
            >
                {user?.profileImageUrl && !profileImageError ? (
                    <img 
                        src={user.profileImageUrl} 
                        alt="Profile" 
                        className="w-9 h-9 rounded-full object-cover border border-gray-200 dark:border-gray-600"
                        onError={() => setProfileImageError(true)}
                    />
                ) : (
                    <div className="w-9 h-9 rounded-full bg-red-600 dark:bg-red-700 flex items-center justify-center text-white font-semibold">
                        {user ? (
                            <span className="text-sm font-bold">
                                {user.firstName?.charAt(0).toUpperCase()}{user.lastName?.charAt(0).toUpperCase()}
                            </span>
                        ) : (
                            <svg 
                                className="w-5 h-5" 
                                fill="currentColor" 
                                viewBox="0 0 20 20"
                            >
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                        )}
                    </div>
                )}
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
                <div 
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 rounded-lg py-2 z-50 animate-fadeIn"
                    onMouseEnter={() => setShowDropdown(true)}
                    onMouseLeave={() => setShowDropdown(false)}
                >
                    {isLoggedIn && user ? (
                        <>
                            <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">{user.firstName} {user.lastName}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                            </div>
                            
                            <Link 
                                href="/dashboard" 
                                className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 dark:hover:bg-gray-700 text-gray-700 dark:text-white hover:text-red-600 dark:hover:text-red-400 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                <span className="font-medium">Dashboard</span>
                            </Link>
                            
                            <button 
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 dark:hover:bg-gray-700 text-gray-700 dark:text-white hover:text-red-600 dark:hover:text-red-400 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span className="font-medium">Logout</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">Guest User</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Not logged in</p>
                            </div>
                            
                            <Link 
                                href="/auth/login" 
                                className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 dark:hover:bg-gray-700 text-gray-700 dark:text-white hover:text-red-600 dark:hover:text-red-400 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                </svg>
                                <span className="font-medium">Login</span>
                            </Link>
                            
                            <Link 
                                href="/auth/register" 
                                className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 dark:hover:bg-gray-700 text-gray-700 dark:text-white hover:text-red-600 dark:hover:text-red-400 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                                <span className="font-medium">Register</span>
                            </Link>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default UserProfileDropdown;
