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
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm flex flex-col h-full">
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

export const ServiceCardSkeleton: React.FC = () => {
    return (
        <div className="bg-white dark:bg-gray-900 p-8 border border-gray-200 dark:border-gray-800 flex flex-col h-full space-y-6">
            {/* Icon placeholder */}
            <Skeleton className="w-16 h-16" />
            {/* Title & Description */}
            <div className="flex-grow space-y-3">
                <Skeleton className="h-7 w-3/4" />
                <div className="space-y-2 pt-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </div>
            </div>
            {/* Footer */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-100 dark:border-gray-800">
                <div className="space-y-1">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-4 w-20" />
            </div>
        </div>
    );
};

export const SearchCardSkeleton: React.FC = () => {
    return (
        <div className="bg-white dark:bg-gray-850 border border-gray-200 dark:border-gray-800 p-6 flex flex-col sm:flex-row gap-6">
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
        <div className="w-full h-[250px] sm:h-[350px] md:h-[450px] lg:h-[500px] relative overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-250 dark:border-gray-800">
            {/* Background pulse */}
            <Skeleton className="w-full h-full" />
            {/* Floating Overlay Card Skeleton */}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-12 md:p-16 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end space-y-4">
                {/* Floating content */}
                <div className="max-w-3xl space-y-3">
                    <Skeleton className="h-5 w-24 bg-gray-300 dark:bg-gray-650" />
                    <Skeleton className="h-10 w-5/6 bg-gray-300 dark:bg-gray-650" />
                    <div className="space-y-2 pt-2 hidden sm:block">
                        <Skeleton className="h-4 w-full bg-gray-400 dark:bg-gray-600" />
                        <Skeleton className="h-4 w-3/4 bg-gray-400 dark:bg-gray-600" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export const DetailSkeleton: React.FC = () => {
    return (
        <div className="space-y-8">
            {/* Category & Title */}
            <div className="space-y-4">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-12 w-5/6" />
                <Skeleton className="h-6 w-1/3" />
            </div>
            {/* Featured Image */}
            <Skeleton className="w-full h-[300px] sm:h-[450px]" />
            {/* Article Content Paragraphs */}
            <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-11/12" />
                <Skeleton className="h-4 w-5/6" />
                <div className="h-4" /> {/* spacing */}
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </div>
        </div>
    );
};
