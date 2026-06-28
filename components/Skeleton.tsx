import React from 'react';

interface SkeletonProps {
    className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
    return (
        <div className={`bg-gray-200 dark:bg-gray-700 animate-pulse ${className}`} />
    );
};

export const NewsCardSkeleton: React.FC = () => {
    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm flex flex-col h-full w-full">
            {/* Image placeholder */}
            <Skeleton className="h-48 w-full" />
            {/* Content area */}
            <div className="p-5 flex-grow space-y-4">
                {/* Category Badge */}
                <Skeleton className="h-5 w-16" />
                {/* Title */}
                <div className="space-y-2">
                    <Skeleton className="h-6 w-5/6" />
                    <Skeleton className="h-6 w-2/3" />
                </div>
                {/* Description */}
                <div className="space-y-2 pt-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700 mt-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                </div>
            </div>
        </div>
    );
};

export const NormalPriorityCardSkeleton: React.FC = () => {
    return (
        <div className="group cursor-pointer min-w-0">
            <div className="relative bg-white dark:bg-gray-800 rounded-none overflow-hidden border border-gray-200 dark:border-gray-700 premium-flag-card">
                <div className="h-48 bg-gray-200 dark:bg-gray-700 animate-pulse relative overflow-hidden">
                    <div className="h-full bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                <div className="p-5 relative animate-pulse">
                    <div className="bg-gray-400 dark:bg-gray-600 h-4 w-16 mb-3 rounded-none"></div>
                    <div className="space-y-2 mb-4">
                        <div className="h-6 bg-gray-300 dark:bg-gray-500 rounded-none w-full"></div>
                        <div className="h-6 bg-gray-300 dark:bg-gray-500 rounded-none w-3/4"></div>
                    </div>
                    <div className="space-y-2 mb-4">
                        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded-none w-full"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded-none w-full"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded-none w-4/5"></div>
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-4 mt-2">
                        <div className="flex items-center gap-2 w-1/2">
                            <div className="h-3 bg-gray-300 dark:bg-gray-500 rounded-none w-16"></div>
                            <span className="text-gray-300 dark:text-gray-600">•</span>
                            <div className="h-3 bg-gray-300 dark:bg-gray-500 rounded-none w-20"></div>
                        </div>
                        <div className="h-3 bg-gray-300 dark:bg-gray-500 rounded-none w-24"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const LowPriorityCardSkeleton: React.FC = () => {
    return (
        <div className="flex gap-4 bg-white dark:bg-gray-800 p-4 border border-gray-100 dark:border-gray-700 w-full">
            {/* Image square */}
            <Skeleton className="w-24 h-24 flex-shrink-0" />
            {/* Content area */}
            <div className="flex-1 flex flex-col justify-center space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-5 w-5/6" />
                <Skeleton className="h-3.5 w-full" />
                <div className="flex items-center gap-2 pt-1">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-16" />
                </div>
            </div>
        </div>
    );
};

export const ServiceCardSkeleton: React.FC = () => {
    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between h-full w-full">
            <div className="p-3">
                {/* Thumbnail image placeholder */}
                <Skeleton className="h-48 rounded-lg w-full" />
                <div className="p-5 space-y-4">
                    {/* Title */}
                    <Skeleton className="h-6 w-3/4" />
                    {/* Description lines */}
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                    </div>
                </div>
            </div>
            <div className="p-5 pt-0">
                {/* Footer border-t line and access actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-4 w-28" />
                </div>
            </div>
        </div>
    );
};

export const SearchCardSkeleton: React.FC = () => {
    return (
        <div className="bg-white dark:bg-gray-850 border border-gray-200 dark:border-gray-800 p-6 flex flex-col sm:flex-row gap-6 w-full">
            {/* Left side: Thumbnail */}
            <Skeleton className="w-full h-48 sm:w-48 sm:h-32 flex-shrink-0" />
            {/* Right side: Content */}
            <div className="flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                    {/* Category badges */}
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                    {/* Title */}
                    <Skeleton className="h-6 w-3/4" />
                    {/* Description */}
                    <div className="space-y-2 pt-1">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                    </div>
                </div>
                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                </div>
            </div>
        </div>
    );
};

export const CarouselSkeleton: React.FC = () => {
    return (
        <div className="w-full mb-12">
            <div className="w-full h-[250px] sm:h-[350px] md:h-[450px] lg:h-[500px] relative overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
                <HighPriorityCardSkeleton />
            </div>
        </div>
    );
};

export const DetailSkeleton: React.FC = () => {
    return (
        <div className="bg-[#faf6ee] dark:bg-[#181614] border border-[#e5dec9] dark:border-[#2a2622] shadow-2xl relative overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-[#e5dec9] dark:divide-[#2a2622] min-h-[600px] animate-pulse">
            
            {/* LEFT PAGE SKELETON */}
            <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-between bg-[#fdfbf7] dark:bg-[#1c1b19] h-full">
                <div className="space-y-6">
                    {/* Header Banner Skeleton */}
                    <div className="flex items-center gap-3 border-b border-[#e5dec9]/60 dark:border-[#2a2622]/60 pb-4">
                        <Skeleton className="w-5 h-5 bg-gray-200 dark:bg-gray-700" />
                        <Skeleton className="h-4 w-24 bg-gray-200 dark:bg-gray-700" />
                    </div>

                    {/* Metadata Skeleton */}
                    <div className="flex flex-wrap items-center gap-4 pb-4 border-b border-[#e5dec9]/30 dark:border-[#2a2622]/30">
                        <Skeleton className="h-3 w-32 bg-gray-200 dark:bg-gray-700" />
                        <Skeleton className="h-3 w-24 bg-gray-200 dark:bg-gray-700" />
                        <Skeleton className="h-3 w-20 bg-gray-200 dark:bg-gray-700" />
                    </div>

                    {/* Featured Image Skeleton */}
                    <div className="w-full aspect-[4/3] bg-gray-200 dark:bg-gray-700 border border-[#e5dec9] dark:border-[#2a2622] p-1 shadow-sm">
                        <Skeleton className="w-full h-full bg-gray-300 dark:bg-gray-650" />
                    </div>

                    {/* Operational Details Skeleton */}
                    <div className="bg-[#faf6ee]/50 dark:bg-gray-900/30 border border-[#e5dec9] dark:border-[#2a2622] p-4 md:p-6 space-y-4">
                        <Skeleton className="h-3 w-32 bg-gray-200 dark:bg-gray-700 mb-2" />
                        <Skeleton className="h-5 w-4/5 bg-gray-200 dark:bg-gray-700" />
                        <Skeleton className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700" />
                    </div>
                </div>

                <div className="mt-8 pt-4 border-t border-[#e5dec9]/60 dark:border-[#2a2622]/60 flex justify-between items-center">
                    <Skeleton className="h-3 w-20 bg-gray-200 dark:bg-gray-700" />
                    <Skeleton className="h-3 w-10 bg-gray-200 dark:bg-gray-700" />
                </div>
            </div>

            {/* RIGHT PAGE SKELETON */}
            <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-between bg-[#fdfbf7] dark:bg-[#1c1b19] h-full relative md:shadow-[-10px_0_15px_-10px_rgba(0,0,0,0.15)] dark:md:shadow-[-10px_0_15px_-10px_rgba(0,0,0,0.5)]">
                <div className="absolute top-0 bottom-0 left-0 w-8 pointer-events-none bg-gradient-to-r from-black/5 via-transparent to-transparent hidden md:block" />
                
                <div className="space-y-6">
                    {/* Title Skeleton */}
                    <div className="space-y-3">
                        <Skeleton className="h-10 w-full bg-gray-300 dark:bg-gray-650" />
                        <Skeleton className="h-10 w-4/5 bg-gray-300 dark:bg-gray-650" />
                    </div>

                    {/* Content Paragraph Skeletons */}
                    <div className="space-y-4 pt-4">
                        <Skeleton className="h-4 w-full bg-gray-200 dark:bg-gray-700" />
                        <Skeleton className="h-4 w-full bg-gray-200 dark:bg-gray-700" />
                        <Skeleton className="h-4 w-11/12 bg-gray-200 dark:bg-gray-700" />
                        <Skeleton className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700" />
                        <div className="h-2" />
                        <Skeleton className="h-4 w-full bg-gray-200 dark:bg-gray-700" />
                        <Skeleton className="h-4 w-full bg-gray-200 dark:bg-gray-700" />
                        <Skeleton className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700" />
                    </div>
                </div>

                <div className="mt-8 pt-4 border-t border-[#e5dec9]/60 dark:border-[#2a2622]/60 flex justify-between items-center">
                    <Skeleton className="h-3 w-24 bg-gray-200 dark:bg-gray-700" />
                    <Skeleton className="h-3 w-10 bg-gray-200 dark:bg-gray-700" />
                </div>
            </div>

        </div>
    );
};

export const ComplexLayoutSkeleton: React.FC = () => {
    return (
        <div className="space-y-20">
            {/* 1. Top Carousel Skeleton */}
            <CarouselSkeleton />

            {/* 2. Row 1: Grid (Left) + Tall Carousel (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-pulse">
                {/* Left Side: 4 Square Grid Skeletons */}
                <div className="lg:col-span-8 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {[1, 2, 3, 4].map(i => (
                            <NewsCardSkeleton key={i} />
                        ))}
                    </div>
                </div>
                {/* Right Side: Tall Carousel Placeholder */}
                <div className="lg:col-span-4 hidden lg:block">
                    <div className="relative overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 w-full h-[800px]">
                        <Skeleton className="w-full h-full" />
                        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent space-y-3">
                            <Skeleton className="h-4 w-16 bg-gray-300 dark:bg-gray-650" />
                            <Skeleton className="h-8 w-5/6 bg-gray-300 dark:bg-gray-650" />
                            <Skeleton className="h-4 w-full bg-gray-400 dark:bg-gray-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Row 2: Tall Carousel (Left) + Grid (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-pulse">
                {/* Left Side: Tall Carousel Placeholder */}
                <div className="lg:col-span-4 hidden lg:block">
                    <div className="relative overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 w-full h-[800px]">
                        <Skeleton className="w-full h-full" />
                        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent space-y-3">
                            <Skeleton className="h-4 w-16 bg-gray-300 dark:bg-gray-650" />
                            <Skeleton className="h-8 w-5/6 bg-gray-300 dark:bg-gray-650" />
                            <Skeleton className="h-4 w-full bg-gray-400 dark:bg-gray-600" />
                        </div>
                    </div>
                </div>
                {/* Right Side: 4 Square Grid Skeletons */}
                <div className="lg:col-span-8 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {[1, 2, 3, 4].map(i => (
                            <NewsCardSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </div>

            {/* 4. More Updates Low Priority List Skeleton */}
            <div className="pt-10 border-t border-gray-200 dark:border-gray-800 space-y-6">
                <Skeleton className="h-8 w-40" />
                <div className="space-y-4">
                    {[1, 2, 3, 4].map(i => (
                        <LowPriorityCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export const BarangayOfficialsSkeleton: React.FC = () => {
    return (
        <section className="mb-24 w-full">
            <div className="flex items-center gap-4 mb-12">
                <div className="w-2 h-10 bg-gray-900 dark:bg-white animate-pulse"></div>
                <Skeleton className="h-10 w-64" />
            </div>

            {/* Featured Official Skeleton */}
            <div className="mb-12 border-4 dark:border-gray-800 p-10 bg-white dark:bg-gray-900 w-full">
                <div className="grid md:grid-cols-12 gap-0">
                    <div className="md:col-span-4 aspect-[3/4] md:aspect-auto h-64 md:h-full">
                        <Skeleton className="w-full h-full" />
                    </div>
                    <div className="md:col-span-8 p-12 flex flex-col justify-center space-y-4">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-12 w-3/4" />
                        <div className="space-y-2 pt-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Other Officials Grid Skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-100 dark:bg-gray-800 border border-gray-100 dark:border-gray-800 w-full">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-white dark:bg-gray-900 p-8 space-y-4">
                        <Skeleton className="aspect-[3/4] w-full" />
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-6 w-3/4" />
                    </div>
                ))}
            </div>
        </section>
    );
};

export const RescueHotlineCardSkeleton: React.FC = () => {
    return (
        <div className="bg-white dark:bg-gray-900 p-10 border border-gray-100 dark:border-gray-850 flex flex-col space-y-6 h-full w-full">
            <div className="flex justify-between items-start">
                <Skeleton className="w-16 h-16" />
                <Skeleton className="h-4 w-20" />
            </div>
            <div className="space-y-2 flex-grow">
                <Skeleton className="h-7 w-3/4" />
                <div className="space-y-2 pt-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </div>
            </div>
            <div className="space-y-3 pt-6 border-t border-gray-100 dark:border-gray-800/50 mt-auto">
                <Skeleton className="h-8 w-2/3" />
                <Skeleton className="h-10 w-full" />
            </div>
        </div>
    );
};

export const HighPriorityCardSkeleton: React.FC = () => {
    return (
        <div className="w-full h-full">
            <div className="h-full bg-gray-200 dark:bg-gray-700 animate-pulse relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 md:p-16">
                    {/* Category */}
                    <div className="bg-gray-400/80 dark:bg-gray-600/80 h-4 sm:h-5 w-20 mb-2 sm:mb-4 rounded-none"></div>

                    {/* Title */}
                    <div className="space-y-2 mb-2 sm:mb-6">
                        <div className="bg-gray-300 dark:bg-gray-500 h-6 sm:h-10 md:h-12 w-full max-w-5xl"></div>
                        <div className="bg-gray-300 dark:bg-gray-500 h-6 sm:h-10 md:h-12 w-11/12 max-w-4xl"></div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2 mb-4 sm:mb-8 hidden sm:block">
                        <div className="bg-gray-400/60 dark:bg-gray-600/60 h-3 sm:h-4 md:h-5 w-full max-w-5xl"></div>
                        <div className="bg-gray-400/60 dark:bg-gray-600/60 h-3 sm:h-4 md:h-5 w-[90%] max-w-4xl"></div>
                    </div>

                    {/* Footer */}
                    <div className="flex flex-wrap items-center gap-3 sm:gap-6">
                        <div className="bg-gray-400/60 dark:bg-gray-600/60 h-3 sm:h-4 w-24"></div>
                        <div className="w-1 h-1 bg-gray-400/60 rounded-full hidden sm:block"></div>
                        <div className="bg-gray-400/60 dark:bg-gray-600/60 h-3 sm:h-4 w-32 hidden sm:block"></div>
                        <div className="bg-gray-300 dark:bg-gray-500 h-8 sm:h-10 w-32 rounded-none"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

