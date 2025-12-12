'use client';

import React, { useState } from 'react';

interface HighPriorityCardProps {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    date: string;
    category: string;
    currentSlide: number;
    index: number;
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
    onClick
}) => {
    const [imageSrc, setImageSrc] = useState(imageUrl);

    const handleImageError = () => {
        setImageSrc('/municipal-logo.jpg');
    };

    return (
        <div
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                index === currentSlide
                    ? 'opacity-100 translate-x-0'
                    : index < currentSlide
                    ? 'opacity-0 -translate-x-full'
                    : 'opacity-0 translate-x-full'
            }`}
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                    <span className="inline-block bg-red-600 text-white px-4 py-1 rounded-full text-sm font-bold mb-4">
                        {category}
                    </span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight line-clamp-3 break-words">
                        {title}
                    </h2>
                    <p className="text-white/90 text-base md:text-lg mb-4 line-clamp-3 max-w-4xl">
                        {description}
                    </p>
                    <div className="flex items-center gap-4 text-white/80">
                        <span className="text-sm">{date}</span>
                        <button 
                            onClick={onClick}
                            className="text-red-400 hover:text-red-300 font-bold flex items-center gap-2 transition-colors"
                        >
                            Read More 
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HighPriorityCard;
