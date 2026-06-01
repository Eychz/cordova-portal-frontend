'use client';

import React, { useState } from 'react';

interface HighPriorityCardProps {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    date: string;
    category: string;
    currentSlide?: number;
    index: number;
    authorName?: string;
    onClick: () => void;
}

const HighPriorityCard: React.FC<HighPriorityCardProps> = ({
    id,
    title,
    description,
    imageUrl,
    date,
    category,
    currentSlide,
    index,
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
            className="w-full h-full cursor-pointer group/card"
        >
            <div 
                className="h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${imageSrc})`, backgroundColor: '#f3f4f6' }}
            >
                <img 
                    src={imageSrc} 
                    alt={title}
                    onError={handleImageError}
                    className="hidden"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
                    <span className="inline-block bg-red-700 text-white px-4 py-0.5 rounded-none text-xs font-bold mb-4 uppercase tracking-widest">
                        {category}
                    </span>
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight line-clamp-2 break-words group-hover/card:text-red-100 transition-colors">
                        {title}
                    </h2>
                    <p className="text-white/90 text-base md:text-lg mb-8 line-clamp-3 max-w-5xl font-medium">
                        {description}
                    </p>
                    <div className="flex items-center gap-6">
                        <span className="text-sm text-white/70 font-mono tracking-tighter">{date}</span>
                        {authorName && (
                            <>
                                <div className="w-1 h-1 bg-white/30 rounded-full"></div>
                                <span className="text-sm text-white/70 font-black uppercase tracking-widest">{authorName}</span>
                            </>
                        )}
                        <div 
                            className="bg-white text-red-700 px-8 py-3 rounded-none font-black flex items-center gap-2 hover:bg-gray-100 transition-all uppercase text-sm tracking-tight"
                        >
                            Read Full Article
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HighPriorityCard;
