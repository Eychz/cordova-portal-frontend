'use client';

import React, { useState } from 'react';

interface LowPriorityCardProps {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    date: string;
    category: string;
    authorName?: string;
    onClick: () => void;
}

const LowPriorityCard: React.FC<LowPriorityCardProps> = ({
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
            className="flex gap-4 relative bg-white dark:bg-gray-800 rounded-none p-4 border border-gray-100 dark:border-gray-700 premium-flag-card group cursor-pointer min-w-0 h-full"
            >
            <div 
                className="w-24 h-24 flex-shrink-0 bg-cover bg-center rounded-none relative z-10"
                style={{ backgroundImage: `url(${imageSrc})`, backgroundColor: '#f3f4f6' }}
            >
                <img 
                    src={imageSrc} 
                    alt={title}
                    onError={handleImageError}
                    className="hidden"
                /></div>
            <div className="flex-1 relative z-10 flex flex-col justify-between">
                <div>
                    <span className="inline-block text-red-700 dark:text-red-400 text-[10px] font-bold mb-1 uppercase tracking-tighter">
                        {category}
                    </span>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors text-base break-words">
                        {title}
                    </h4>
                    <p className="text-xs text-gray-505 dark:text-gray-400 line-clamp-2">
                        {description}
                    </p>
                </div>
                <div className="mt-auto flex items-center gap-2 pt-2">
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium uppercase">{date}</span>
                    {authorName && (
                        <>
                            <span className="text-gray-300 dark:text-gray-600 text-[10px]">•</span>
                            <span className="text-[10px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-widest">{authorName}</span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LowPriorityCard;
