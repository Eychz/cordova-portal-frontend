'use client';

import React, { useState } from 'react';

interface NormalPriorityCardProps {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    date: string;
    category: string;
    authorName?: string;
    onClick: () => void;
}

const NormalPriorityCard: React.FC<NormalPriorityCardProps> = ({
    id,
    title,
    description,
    imageUrl,
    date,
    category,
    authorName,
    onClick
}) => {
    const [imageSrc, setImageSrc] = useState(imageUrl);

    const handleImageError = () => {
        setImageSrc('/municipal-logo.jpg');
    };

    return (
        <div
            onClick={onClick}
            className="group bg:none cursor-pointer min-w-0 h-full"
        >
            <div className="relative premium-flag-card h-full flex flex-col justify-between">
                <div className="p-3">
                    <div
                        className="h-48 bg-cover bg-top relative overflow-hidden"
                        style={{ backgroundImage: `url(${imageSrc})` }}
                    >
                        <img
                            src={imageSrc}
                            alt={title}
                            onError={handleImageError}
                            className="hidden"
                        />
                        <div className="h-full bg-gradient-to-t from-black/60 to-transparent"></div>
                    </div>
                    <div className="p-5 relative">
                        <span className="inline-block bg-red-600 text-white px-3 py-0.5 rounded-none text-[10px] font-bold mb-3 uppercase tracking-wider">
                            {category}
                        </span>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors break-words">
                            {title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                            {description}
                        </p>
                    </div>
                </div>
                <div className="p-5 pt-0 relative">
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-4">
                        <div className="flex items-center gap-2">
                            <span>{date}</span>
                            {authorName && (
                                <>
                                    <span className="text-gray-300 dark:text-gray-600">•</span>
                                    <span className="font-bold uppercase tracking-tighter">{authorName}</span>
                                </>
                            )}
                        </div>
                        <span className="text-red-700 dark:text-red-400 font-bold flex items-center gap-1 uppercase tracking-tight">
                            View Article
                            <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NormalPriorityCard;
