'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

const FloatingMessagesButton: React.FC = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [unreadCount] = useState(7); // This could come from a context or API
    const [showTooltip, setShowTooltip] = useState(false);

    // Hide button when on dashboard page (any tab)
    if (pathname === '/dashboard') {
        return null;
    }

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <Link 
                href="/dashboard?tab=messages"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="relative group"
            >
                {/* Tooltip */}
                {showTooltip && (
                    <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg whitespace-nowrap shadow-xl animate-fadeIn">
                        Messages & Inquiries
                        <div className="absolute bottom-0 right-6 transform translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900 dark:bg-gray-700"></div>
                    </div>
                )}

                {/* Button */}
                <div className="relative">
                    <button className="w-16 h-16 bg-gradient-to-br from-red-900 to-red-800 hover:from-red-800 hover:to-red-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 group-hover:shadow-red-500/50">
                        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                    </button>

                    {/* Unread Badge */}
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg animate-pulse border-2 border-white dark:border-gray-900">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}

                    {/* Pulse animation ring */}
                    <div className="absolute inset-0 rounded-full bg-red-500 opacity-0 group-hover:opacity-20 group-hover:animate-ping"></div>
                </div>
            </Link>
        </div>
    );
};

export default FloatingMessagesButton;
