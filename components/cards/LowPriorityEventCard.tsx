'use client';

import React from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';

interface LowPriorityEventCardProps {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    date: string;
    time: string;
    location: string;
    authorName?: string;
    onClick: () => void;
}

const LowPriorityEventCard: React.FC<LowPriorityEventCardProps> = ({
    id,
    name,
    description,
    imageUrl,
    date,
    time,
    location,
    authorName,
    onClick
}) => {

    return (
        <div
            onClick={onClick}
            className="flex gap-4 relative bg-white dark:bg-gray-800 rounded-none p-4 border border-gray-100 dark:border-gray-700 premium-flag-card group cursor-pointer min-w-0"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-transparent pointer-events-none rounded-xl"></div>

            <div className="relative w-28 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                <img
                    src={imageUrl}
                    alt={name}
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="flex-1 relative z-10 flex flex-col justify-between">
                <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-1 line-clamp-1 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors text-base break-words">
                        {name}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                        {description}
                    </p>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500 space-y-0.5">
                    <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {location}
                    </div>
                    <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {date} • <Clock className="w-3 h-3" /> {time}
                        {authorName && (
                            <span className="ml-2 opacity-60">• By {authorName}</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LowPriorityEventCard;
