'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PageTransition from '@/components/PageTransition';
import Navbar from '@/components/Navbar';
import { barangays } from '@/data/barangays';

export default function BarangaysListPage() {
    return (
        <>
            <Navbar activePage="Barangay" barangay="" />
            <PageTransition>
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors mt-16">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-12">
                            <h1 className="text-4xl font-black text-red-900 dark:text-white mb-4">
                                Our Barangays
                            </h1>
                            <p className="text-lg text-gray-600 dark:text-gray-300">
                                Discover the vibrant communities that make up the Municipality of Cordova.
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {barangays.map((b) => (
                                <Link href={`/barangay/${b.id}`} key={b.id} className="group">
                                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border border-gray-100 dark:border-gray-700 h-full flex flex-col">
                                        <div className="h-48 w-full relative bg-gray-200 dark:bg-gray-700">
                                            <Image 
                                                src={b.previewImage || "/municipal-logo.jpg"} 
                                                alt={b.name}
                                                layout="fill"
                                                objectFit="cover"
                                                className="group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="p-6 flex-grow flex flex-col">
                                            <h3 className="text-2xl font-bold text-red-900 dark:text-white mb-2">{b.name}</h3>
                                            <p className="text-red-600 dark:text-red-400 font-semibold mb-3">{b.tagline}</p>
                                            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4 flex-grow">
                                                {b.info.description}
                                            </p>
                                            <div className="flex items-center text-sm font-medium text-red-700 dark:text-red-400 mt-auto">
                                                View Details
                                                <svg className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </PageTransition>
        </>
    );
}