'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import PageTransition from '../../components/PageTransition';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

interface Barangay {
    name: string;
    slug: string;
    population: number;
    area: string;
    description: string;
}

const BarangayPage = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const barangays: Barangay[] = [
        { name: 'Alegria', slug: 'alegria', population: 5234, area: '2.3 km²', description: 'Coastal barangay known for fishing industry' },
        { name: 'Bangbang', slug: 'bangbang', population: 3892, area: '1.8 km²', description: 'Historic community with rich cultural heritage' },
        { name: 'Buagsong', slug: 'buagsong', population: 4521, area: '2.1 km²', description: 'Agricultural area with vibrant community life' },
        { name: 'Catarman', slug: 'catarman', population: 6123, area: '3.2 km²', description: 'Growing residential and commercial area' },
        { name: 'Cogon', slug: 'cogon', population: 4876, area: '2.5 km²', description: 'Rural barangay with scenic landscapes' },
        { name: 'Dapitan', slug: 'dapitan', population: 5643, area: '2.7 km²', description: 'Coastal community with fishing traditions' },
        { name: 'Day-as', slug: 'day-as', population: 7234, area: '3.8 km²', description: 'One of the largest barangays in Cordova' },
        { name: 'Gabi', slug: 'gabi', population: 3456, area: '1.6 km²', description: 'Small but vibrant coastal community' },
        { name: 'Gilutongan', slug: 'gilutongan', population: 2891, area: '0.8 km²', description: 'Island barangay famous for marine sanctuary' },
        { name: 'Ibabao', slug: 'ibabao', population: 5987, area: '2.9 km²', description: 'Coastal barangay with beautiful beaches' },
        { name: 'Pilipog', slug: 'pilipog', population: 4321, area: '2.2 km²', description: 'Agricultural community with strong traditions' },
        { name: 'Poblacion', slug: 'poblacion', population: 8567, area: '4.1 km²', description: 'Town center and commercial hub' },
        { name: 'San Miguel', slug: 'san-miguel', population: 5123, area: '2.4 km²', description: 'Peaceful residential barangay' },
    ];

    const filteredBarangays = barangays.filter(barangay =>
        barangay.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getBarangayColor = (index: number) => {
        const colors = [
            'from-red-500 to-red-600',
            'from-orange-500 to-orange-600',
            'from-yellow-500 to-yellow-600',
            'from-green-500 to-green-600',
            'from-teal-500 to-teal-600',
            'from-blue-500 to-blue-600',
            'from-indigo-500 to-indigo-600',
            'from-purple-500 to-purple-600',
            'from-pink-500 to-pink-600',
        ];
        return colors[index % colors.length];
    };

    return (
        <PageTransition>
            <Navbar activePage="barangay" />
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-red-50 to-orange-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-20 px-4 transition-colors">
                <div className="max-w-7xl mx-auto">
                    {/* Header Section */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-black text-red-900 dark:text-white mb-4">
                            Barangays of Cordova
                        </h1>
                        <p className="text-lg text-red-800 dark:text-gray-300 max-w-3xl mx-auto mb-8">
                            Cordova is composed of 13 barangays, each with its unique character and community. Select a barangay to learn more about its services, officials, and local updates.
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-md mx-auto">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search barangay..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-6 py-4 rounded-full border-2 border-red-200 dark:border-gray-700 focus:border-red-500 dark:focus:border-red-400 outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-lg"
                                />
                                <svg className="absolute right-6 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-lg">
                            <div className="text-4xl font-black text-red-900 dark:text-red-400 mb-2">13</div>
                            <div className="text-gray-700 dark:text-gray-300 font-semibold">Barangays</div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-lg">
                            <div className="text-4xl font-black text-red-900 dark:text-red-400 mb-2">67K+</div>
                            <div className="text-gray-700 dark:text-gray-300 font-semibold">Total Population</div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-lg">
                            <div className="text-4xl font-black text-red-900 dark:text-red-400 mb-2">32.5</div>
                            <div className="text-gray-700 dark:text-gray-300 font-semibold">Total Area (km²)</div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-lg">
                            <div className="text-4xl font-black text-red-900 dark:text-red-400 mb-2">1</div>
                            <div className="text-gray-700 dark:text-gray-300 font-semibold">Island Barangay</div>
                        </div>
                    </div>

                    {/* Barangays Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredBarangays.map((barangay, index) => (
                            <Link key={barangay.slug} href={`/barangay/${barangay.slug}`}>
                                <div className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer">
                                    {/* Gradient Header */}
                                    <div className={`bg-gradient-to-r ${getBarangayColor(index)} p-6 text-white relative overflow-hidden`}>
                                        <div className="absolute top-0 right-0 text-6xl opacity-20 transform translate-x-4 -translate-y-2">
                                            🏘️
                                        </div>
                                        <h2 className="text-2xl font-black mb-1 relative z-10">
                                            {barangay.name}
                                        </h2>
                                        <p className="text-sm opacity-90 relative z-10">Barangay</p>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <div className="space-y-3 mb-4">
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="text-red-900 dark:text-red-400">👥</span>
                                                <span className="text-gray-700 dark:text-gray-300">
                                                    <strong>{barangay.population.toLocaleString()}</strong> residents
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <span className="text-red-900 dark:text-red-400">📍</span>
                                                <span className="text-gray-700 dark:text-gray-300">
                                                    <strong>{barangay.area}</strong> land area
                                                </span>
                                            </div>
                                        </div>

                                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                                            {barangay.description}
                                        </p>

                                        <div className="flex items-center text-red-900 dark:text-red-400 font-bold group-hover:translate-x-2 transition-transform text-sm">
                                            View Details
                                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {filteredBarangays.length === 0 && (
                        <div className="text-center py-20">
                            <div className="text-6xl mb-4">🔍</div>
                            <h3 className="text-2xl font-bold text-red-900 dark:text-white mb-2">No Barangay Found</h3>
                            <p className="text-gray-600 dark:text-gray-400">Try a different search term.</p>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </PageTransition>
    );
};

export default BarangayPage;