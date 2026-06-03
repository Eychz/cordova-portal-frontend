'use client';

import React from 'react';
import { Calendar, MapPin } from 'lucide-react';

interface NormalPriorityEventCardProps {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    date: string;
    location: string;
    authorName?: string;
    onClick: () => void;
}

const NormalPriorityEventCard: React.FC<NormalPriorityEventCardProps> = ({
    id,
    name,
    description,
    imageUrl,
    date,
    location,
    authorName,
    onClick
}) => {


    return (
        <div
            onClick={onClick}
            className="group cursor-pointer min-w-0"
        >
            <div className="relative bg-white dark:bg-gray-800 rounded-none overflow-hidden border border-gray-200 dark:border-gray-700 premium-flag-card">
                {/* Gradient overlay for glass effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none"></div>

                <div
                    className="h-48 bg-cover bg-center transition-transform duration-500 group-hover:scale-105 relative"
                    style={{ backgroundImage: `url(${imageUrl})` }}
                >
                    <div className="h-full bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                </div>
                <div className="p-5 relative">
                    <span className="inline-block bg-red-500/20 backdrop-blur-sm text-red-600 dark:text-red-400 px-3 py-1 rounded-full text-xs font-bold mb-3 border border-red-500/30">
                        {location}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors break-words">
                        {name}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-200 text-sm line-clamp-3 mb-3">
                        {description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span className="text-[10px]">{date}</span>
                            </div>
                            {authorName && (
                                <span className="text-[9px] font-bold uppercase tracking-tighter opacity-70">By {authorName}</span>
                            )}
                        </div>
                        <button
                            className="text-red-600 dark:text-red-400 font-semibold flex items-center gap-1"
                        >
                            View
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NormalPriorityEventCard;
