'use client';

import React, { useEffect, useState } from 'react';

interface CarouselProps {
    children: React.ReactNode[];
    autoSlide?: boolean;
    interval?: number;
}

const Carousel: React.FC<CarouselProps> = ({ 
    children, 
    autoSlide = true, 
    interval = 5000 
}) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const childrenArray = React.Children.toArray(children);

    useEffect(() => {
        if (autoSlide && childrenArray.length > 0) {
            const slideInterval = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % childrenArray.length);
            }, interval);
            return () => clearInterval(slideInterval);
        }
    }, [autoSlide, interval, childrenArray.length]);

    if (childrenArray.length === 0) return null;

    return (
        <div className="max-w-[1400px] mx-auto mb-12">
            <div className="relative overflow-hidden shadow-2xl w-full">
                {/* Carousel Container */}
                <div className="relative h-[600px]">
                    {childrenArray}
                </div>

                {/* Carousel Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {childrenArray.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`h-2 rounded-full transition-all ${
                                index === currentSlide
                                    ? 'w-8 bg-white'
                                    : 'w-2 bg-white/50 hover:bg-white/75'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Carousel;
