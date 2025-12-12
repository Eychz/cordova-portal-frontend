'use client';

import React, { useState, useEffect } from 'react';

interface VideoHighlight {
    id: number;
    title: string;
    description: string;
    duration: string;
    thumbnail: string;
    embedUrl: string;
}

interface VideoHighlightsProps {
    videos: VideoHighlight[];
    subtitle?: string;
    onVideoSelect: (embedUrl: string) => void;
}

const VideoHighlights: React.FC<VideoHighlightsProps> = ({ videos, subtitle = "Watch important updates and featured content", onVideoSelect }) => {
    const [videoSlide, setVideoSlide] = useState(0);

    // Video carousel auto-slide every 5 seconds
    useEffect(() => {
        const videoInterval = setInterval(() => {
            setVideoSlide((prev) => (prev + 1) % videos.length);
        }, 5000);
        return () => clearInterval(videoInterval);
    }, [videos.length]);

    return (
        <div className="w-full bg-gradient-to-br from-gray-950 via-black to-gray-950 text-white py-24 px-6 relative overflow-hidden mt-auto border-t-4 border-red-600 shadow-2xl">
            {/* Animated Decorative Elements */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-br from-red-600 to-pink-600 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-gradient-to-br from-purple-600 to-blue-600 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-yellow-600 to-red-600 rounded-full blur-3xl opacity-30"></div>
            </div>

            {/* Animated Grid Pattern */}
            <div className="absolute inset-0 opacity-5" style={{backgroundImage: 'linear-gradient(rgba(239, 68, 68, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(239, 68, 68, 0.3) 1px, transparent 1px)', backgroundSize: '50px 50px'}}></div>

            {/* Section Title */}
            <div className="max-w-[1600px] mx-auto mb-16 relative z-10">
                <div className="flex items-center justify-center gap-6 mb-4">
                    <div className="h-1.5 w-24 bg-gradient-to-r from-transparent via-red-600 to-red-600 rounded-full shadow-lg shadow-red-500/50"></div>
                    <div className="relative">
                        <h2 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-white via-red-400 to-white bg-clip-text text-transparent drop-shadow-2xl">
                            Video Highlights
                        </h2>
                        <div className="absolute -inset-2 bg-gradient-to-r from-red-600/20 via-transparent to-red-600/20 blur-xl"></div>
                    </div>
                    <div className="h-1.5 w-24 bg-gradient-to-r from-red-600 to-transparent rounded-full shadow-lg shadow-red-500/50"></div>
                </div>
                <p className="text-gray-300 text-lg text-center font-light tracking-wide">{subtitle}</p>
                <div className="flex justify-center gap-2 mt-3">
                    <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
            </div>

            <div className="max-w-[1600px] mx-auto relative z-10">
                {/* Minimalist Navigation Arrows */}
                <button
                    onClick={() => setVideoSlide((prev) => (prev - 1 + videos.length) % videos.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-3 rounded-full transition-all duration-200 hover:scale-105 group"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <button
                    onClick={() => setVideoSlide((prev) => (prev + 1) % videos.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-3 rounded-full transition-all duration-200 hover:scale-105 group"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </button>

                {/* Carousel Container */}
                <div className="overflow-hidden px-16">
                    <div 
                        className="flex transition-transform duration-1000 ease-in-out gap-8"
                        style={{ transform: `translateX(-${(videoSlide % videos.length) * (300 + 32)}px)` }}
                    >
                        {/* Render videos + duplicates for infinite loop */}
                        {[...videos, ...videos].map((video, index) => (
                            <div 
                                key={`video-${index}`}
                                onClick={() => onVideoSelect(video.embedUrl)}
                                className="group cursor-pointer flex-shrink-0"
                            >
                                <div className="relative rounded-2xl overflow-hidden shadow-2xl w-[300px] h-[500px] border-2 border-gray-800 group-hover:border-red-600 transition-all duration-300">
                                    <img 
                                        src={video.thumbnail} 
                                        alt={video.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                                    
                                    {/* Minimalist Play Button */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 group-hover:scale-110 transition-all duration-300 shadow-lg">
                                            <svg className="w-6 h-6 text-gray-900 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        </div>
                                    </div>

                                    {/* Duration Badge */}
                                    <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs font-bold border border-white/20">
                                        <svg className="w-3 h-3 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                        </svg>
                                        {video.duration}
                                    </div>

                                    {/* Video Info */}
                                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                        <div className="bg-gradient-to-t from-black/90 to-transparent p-3 rounded-t-xl -mx-4 -mb-4 pt-8">
                                            <h3 className="text-white font-bold text-sm mb-1 line-clamp-2">{video.title}</h3>
                                            <p className="text-gray-300 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">{video.description}</p>
                                        </div>
                                    </div>

                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 border-2 border-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Enhanced Carousel Dots Navigation */}
                <div className="flex justify-center gap-4 mt-10">
                    {videos.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setVideoSlide(index)}
                            className={`transition-all duration-500 rounded-full relative group ${
                                videoSlide === index
                                    ? 'w-16 h-4 bg-gradient-to-r from-red-600 via-red-500 to-red-600 shadow-lg shadow-red-500/50'
                                    : 'w-4 h-4 bg-gray-700 hover:bg-gray-500 hover:scale-125'
                            }`}
                        >
                            {videoSlide === index && (
                                <div className="absolute inset-0 rounded-full bg-white animate-ping opacity-20"></div>
                            )}
                        </button>
                    ))}
                </div>
                
                {/* Video Counter */}
                <div className="text-center mt-4">
                    <span className="text-gray-400 text-sm font-semibold">
                        <span className="text-red-500 text-lg">{videoSlide + 1}</span> / {videos.length}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default VideoHighlights;
