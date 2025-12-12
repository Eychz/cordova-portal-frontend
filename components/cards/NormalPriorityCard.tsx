'use client';

import React, { useState } from 'react';

interface NormalPriorityCardProps {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    date: string;
    category: string;
    onClick: () => void;
}

const NormalPriorityCard: React.FC<NormalPriorityCardProps> = ({
    id,
    title,
    description,
    imageUrl,
    date,
    category,
    onClick
}) => {
    const [imageSrc, setImageSrc] = useState(imageUrl);

    const handleImageError = () => {
        setImageSrc('/municipal-logo.jpg');
    };

    return (
        <div 
            onClick={onClick}
            className="group cursor-pointer min-w-0"
        >
            <div className="relative bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/20 dark:border-gray-700/30 shadow-xl hover:shadow-2xl hover:border-white/40 dark:hover:border-gray-600/50 transition-all duration-300">
                {/* Gradient overlay for glass effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none"></div>
                
                <div 
                    className="h-48 bg-cover bg-center transition-transform duration-500 group-hover:scale-105 relative overflow-hidden"
                    style={{ backgroundImage: `url(${imageSrc})`, backgroundColor: '#f3f4f6' }}
                >
                    <img 
                        src={imageSrc} 
                        alt={title}
                        onError={handleImageError}
                        className="hidden"
                    />
                    <div className="h-full bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                </div>
                <div className="p-5 relative">
                    <span className="inline-block bg-red-500/20 backdrop-blur-sm text-red-600 dark:text-red-400 px-3 py-1 rounded-full text-xs font-bold mb-3 border border-red-500/30">
                        {category}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors break-words">
                        {title}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-200 text-sm line-clamp-3 mb-3">
                        {description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                        <span>{date}</span>
                        <span className="text-red-600 dark:text-red-400 font-semibold flex items-center gap-1">
                            Read More
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
