'use client';

import React, { useState } from 'react';

interface LowPriorityCardProps {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    date: string;
    category: string;
    onClick: () => void;
}

const LowPriorityCard: React.FC<LowPriorityCardProps> = ({
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
            className="flex gap-4 relative bg-white/30 dark:bg-gray-900/30 backdrop-blur-xl rounded-xl p-4 border border-white/10 dark:border-gray-700/20 hover:shadow-lg hover:border-white/30 dark:hover:border-gray-600/40 transition-all duration-300 group cursor-pointer min-w-0"
            >
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-transparent pointer-events-none rounded-xl"></div>
            
            <div 
                className="w-28 h-20 flex-shrink-0 bg-cover bg-center rounded-lg relative z-10"
                style={{ backgroundImage: `url(${imageSrc})`, backgroundColor: '#f3f4f6' }}
            >
                <img 
                    src={imageSrc} 
                    alt={title}
                    onError={handleImageError}
                    className="hidden"
                /></div>
            <div className="flex-1 relative z-10">
                <span className="inline-block bg-gray-500/20 backdrop-blur-sm text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full text-xs font-bold mb-1">
                    {category}
                </span>
                <h4 className="font-bold text-gray-900 dark:text-white mb-1 line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors text-sm break-words">
                    {title}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-1">
                    {description}
                </p>
                <span className="text-xs text-gray-500 dark:text-gray-500">{date}</span>
            </div>
        </div>
    );
};

export default LowPriorityCard;
