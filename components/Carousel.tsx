'use client';

import React, { useEffect, useState } from 'react';

interface CarouselProps {
    children: React.ReactNode[];
    autoSlide?: boolean;
    interval?: number;
    hideControls?: boolean;
    className?: string;
    containerClassName?: string;
}

const Carousel: React.FC<CarouselProps> = ({ 
    children, 
    autoSlide = true, 
    interval = 5000,
    hideControls = false,
    className = "relative overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 w-full h-[250px] sm:h-[350px] md:h-[450px] lg:h-[500px]",
    containerClassName = "w-full mb-12"
}) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const childrenArray = React.Children.toArray(children);

    useEffect(() => {
        if (autoSlide && childrenArray.length > 1) {
            const slideInterval = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % childrenArray.length);
            }, interval);
            return () => clearInterval(slideInterval);
        }
    }, [autoSlide, interval, childrenArray.length]);

    if (childrenArray.length === 0) return null;

    return (
        <div className={containerClassName}>
            <div className={className}>
                {/* Carousel Slides with Rightward Slide Transition */}
                <div 
                    className="relative w-full h-full flex transition-transform duration-1000 ease-in-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                    {childrenArray.map((child, index) => (
                        <div 
                            key={index}
                            className="w-full h-full flex-shrink-0 relative overflow-hidden"
                        >
                            {child}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Carousel;
