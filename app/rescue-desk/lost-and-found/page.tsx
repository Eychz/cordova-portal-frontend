'use client';

import React, { useState } from 'react';
import PageTransition from '../../../components/PageTransition';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import Link from 'next/link';

const LostAndFoundPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filterStatus, setFilterStatus] = useState<string>('all');

    const lostAndFoundItems = [
        {
            id: 1,
            status: 'Missing',
            name: 'IPHONE 13 PRO',
            description: 'Space Gray iPhone 13 Pro with cracked screen protector. Lost near Gaisano Island Mall parking area. Contains important work files and family photos.',
            imageUrl: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=400&q=80',
            date: 'Nov 20, 2025',
            location: 'Gaisano Island Mall',
            contactPerson: 'Maria Santos'
        },
        {
            id: 2,
            status: 'Found',
            name: 'BLACK WALLET',
            description: 'Brown leather wallet found near the public market. Contains ID cards and some cash. Please contact us to claim with valid identification.',
            imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&q=80',
            date: 'Nov 22, 2025',
            location: 'Public Market',
            contactPerson: 'Juan Dela Cruz'
        },
        {
            id: 3,
            status: 'Missing',
            name: 'GOLD NECKLACE',
            description: 'Gold necklace with heart pendant lost at the beach area. Sentimental value as it was a gift from grandmother. Reward offered for safe return.',
            imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80',
            date: 'Nov 18, 2025',
            location: 'Day-as Beach',
            contactPerson: 'Ana Reyes'
        },
        {
            id: 4,
            status: 'Found',
            name: 'BLUE BACKPACK',
            description: 'Navy blue Jansport backpack found at the barangay hall. Contains school books and notebooks. Owner can claim at the municipal office.',
            imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80',
            date: 'Nov 23, 2025',
            location: 'Poblacion Barangay Hall',
            contactPerson: 'Admin Office'
        },
        {
            id: 5,
            status: 'Missing',
            name: 'PRESCRIPTION EYEGLASSES',
            description: 'Black rectangular frame eyeglasses in brown case. Lost near the church area during Sunday mass. Urgently needed for daily activities.',
            imageUrl: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&q=80',
            date: 'Nov 24, 2025',
            location: 'Our Lady of Guadalupe Church',
            contactPerson: 'Roberto Cruz'
        },
        {
            id: 6,
            status: 'Found',
            name: 'CAR KEYS WITH REMOTE',
            description: 'Toyota car keys with black rubber remote. Found in the parking area of the municipal building. Owner can identify by describing key chain.',
            imageUrl: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=400&q=80',
            date: 'Nov 21, 2025',
            location: 'Municipal Building Parking',
            contactPerson: 'Security Guard'
        },
        {
            id: 7,
            status: 'Missing',
            name: 'CHILD\'S STUFFED TOY',
            description: 'Brown teddy bear with red ribbon. Child\'s favorite toy lost at the playground. Answers to the name "Brownie". Family is very worried.',
            imageUrl: 'https://images.unsplash.com/photo-1551361415-69c87624334f?w=400&q=80',
            date: 'Nov 19, 2025',
            location: 'Municipal Playground',
            contactPerson: 'Lisa Mendoza'
        },
        {
            id: 8,
            status: 'Found',
            name: 'SILVER WATCH',
            description: 'Men\'s silver wristwatch with leather strap. Found on the bench near the plaza. Has engraving on the back that owner can verify.',
            imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=400&q=80',
            date: 'Nov 20, 2025',
            location: 'Town Plaza',
            contactPerson: 'Park Maintenance'
        },
        {
            id: 9,
            status: 'Missing',
            name: 'BIRTH CERTIFICATE DOCUMENTS',
            description: 'Brown envelope containing original birth certificate and other important documents. Lost between municipal hall and xerox center.',
            imageUrl: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=400&q=80',
            date: 'Nov 23, 2025',
            location: 'Near Municipal Hall',
            contactPerson: 'Pedro Garcia'
        },
        {
            id: 10,
            status: 'Found',
            name: 'LADIES UMBRELLA',
            description: 'Pink floral umbrella found at the waiting shed. Owner can claim by providing detailed description or any identifying marks.',
            imageUrl: 'https://images.unsplash.com/photo-1508873881324-c92a3fc536ba?w=400&q=80',
            date: 'Nov 24, 2025',
            location: 'Bus Waiting Shed',
            contactPerson: 'Barangay Tanod'
        }
    ];

    // Filter items based on search query and status
    const filteredItems = lostAndFoundItems.filter(item => {
        const matchesSearch = 
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.location.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
        
        return matchesSearch && matchesStatus;
    });

    const missingCount = lostAndFoundItems.filter(item => item.status === 'Missing').length;
    const foundCount = lostAndFoundItems.filter(item => item.status === 'Found').length;

    return (
        <>
            <Navbar activePage="" />
            <PageTransition>
                <div className="min-h-screen bg-gradient-to-br from-pink-50 via-red-50 to-orange-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-colors">
                    {/* Hero Section */}
                    <div className="relative py-20 px-4 overflow-hidden">
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-10 left-10 w-72 h-72 bg-red-600 rounded-full blur-3xl"></div>
                            <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-600 rounded-full blur-3xl"></div>
                        </div>
                        
                        <div className="max-w-7xl mx-auto relative z-10">
                            <div className="text-center mb-12">
                                <h1 className="text-5xl md:text-6xl font-black text-red-900 dark:text-white mb-6">
                                    Find Your Lost Items
                                </h1>
                                <p className="text-xl text-red-800 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                                    Browse through reported items or search for your belongings. Help reunite items with their rightful owners.
                                </p>
                            </div>

                            {/* Search Bar */}
                            <div className="max-w-4xl mx-auto mb-8">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search by item name, description, or location..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full px-6 py-5 pl-14 pr-6 rounded-2xl border-2 border-red-300 dark:border-red-800 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-500 dark:focus:border-red-400 transition-all text-lg shadow-lg"
                                    />
                                    <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery('')}
                                            className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Filter Buttons */}
                            <div className="flex flex-wrap justify-center gap-3 mb-8">
                                <button
                                    onClick={() => setFilterStatus('all')}
                                    className={`px-6 py-2 rounded-full font-semibold transition-all shadow-lg transform hover:scale-105 ${
                                        filterStatus === 'all'
                                            ? 'bg-red-900 text-white'
                                            : 'bg-white dark:bg-gray-800 text-red-900 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    All Items ({lostAndFoundItems.length})
                                </button>
                                <button
                                    onClick={() => setFilterStatus('Missing')}
                                    className={`px-6 py-2 rounded-full font-semibold transition-all shadow-lg transform hover:scale-105 ${
                                        filterStatus === 'Missing'
                                            ? 'bg-red-900 text-white'
                                            : 'bg-white dark:bg-gray-800 text-red-900 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    Missing ({missingCount})
                                </button>
                                <button
                                    onClick={() => setFilterStatus('Found')}
                                    className={`px-6 py-2 rounded-full font-semibold transition-all shadow-lg transform hover:scale-105 ${
                                        filterStatus === 'Found'
                                            ? 'bg-red-900 text-white'
                                            : 'bg-white dark:bg-gray-800 text-red-900 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    Found ({foundCount})
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Items Grid */}
                    <div className="py-8 px-4 pb-16">
                        <div className="max-w-7xl mx-auto">
                            {filteredItems.length === 0 ? (
                                <div className="text-center py-20">
                                    <div className="text-8xl mb-6">🔍</div>
                                    <h3 className="text-3xl font-black text-red-900 dark:text-white mb-4">No Items Found</h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                                        {searchQuery 
                                            ? `No results found for "${searchQuery}". Try adjusting your search.`
                                            : 'No items match the selected filter.'}
                                    </p>
                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery('')}
                                            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold transition-colors shadow-lg"
                                        >
                                            Clear Search
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredItems.map((item, index) => (
                                        <div 
                                            key={item.id}
                                            className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-2 border-gray-100 dark:border-gray-700 hover:border-red-500 dark:hover:border-red-400 relative"
                                            style={{ animationDelay: `${index * 50}ms` }}
                                        >
                                            {/* Image with overlay gradient */}
                                            <div className="relative h-52 overflow-hidden">
                                                <img 
                                                    src={item.imageUrl}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                                
                                                {/* Status Badge */}
                                                <div className="absolute top-3 right-3">
                                                    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs shadow-2xl backdrop-blur-sm border-2 ${
                                                        item.status === 'Missing' 
                                                            ? 'bg-red-600/90 text-white border-red-400' 
                                                            : 'bg-green-600/90 text-white border-green-400'
                                                    }`}>
                                                        <span className="text-base">{item.status === 'Missing' ? '❌' : '✅'}</span>
                                                        <span className="uppercase tracking-wider">{item.status}</span>
                                                    </span>
                                                </div>
                                                
                                                {/* Item Number Badge */}
                                                <div className="absolute top-3 left-3">
                                                    <div className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center font-black text-red-900 text-sm shadow-lg">
                                                        {item.id}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="p-6">
                                                <h3 className="text-xl font-black text-red-900 dark:text-white mb-3 line-clamp-1 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                                                    {item.name}
                                                </h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-5 line-clamp-2 leading-relaxed">
                                                    {item.description}
                                                </p>

                                                {/* Details with enhanced styling */}
                                                <div className="space-y-2.5 mb-5">
                                                    <div className="flex items-center gap-3 text-xs bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2.5">
                                                        <span className="text-lg">📅</span>
                                                        <span className="font-semibold text-gray-700 dark:text-gray-300">{item.date}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-xs bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2.5">
                                                        <span className="text-lg">📍</span>
                                                        <span className="font-semibold text-gray-700 dark:text-gray-300">{item.location}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-xs bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2.5">
                                                        <span className="text-lg">👤</span>
                                                        <span className="font-semibold text-gray-700 dark:text-gray-300">{item.contactPerson}</span>
                                                    </div>
                                                </div>

                                                {/* Action Button */}
                                                <button className={`w-full py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2 ${
                                                    item.status === 'Missing'
                                                        ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white'
                                                        : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white'
                                                }`}>
                                                    <span className="text-lg">{item.status === 'Missing' ? '🔍' : '✋'}</span>
                                                    <span>{item.status === 'Missing' ? 'I Found This' : 'Claim Item'}</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Call to Action */}
                            <div className="mt-16 bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl p-8 border-2 border-red-200/50 dark:border-red-900/50 shadow-lg">
                                <div className="text-center mb-6">
                                    <h3 className="text-2xl font-black text-red-900 dark:text-white mb-2">Can't Find Your Item?</h3>
                                    <p className="text-gray-600 dark:text-gray-400">Report it to us and we'll help you track it down</p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <button className="group bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-10 py-4 rounded-xl font-bold transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center justify-center gap-3 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-white/20 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                                        <span className="text-2xl relative z-10">📝</span>
                                        <span className="relative z-10">Report Lost Item</span>
                                    </button>
                                    <button className="group bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-10 py-4 rounded-xl font-bold transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center justify-center gap-3 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-white/20 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                                        <span className="text-2xl relative z-10">📦</span>
                                        <span className="relative z-10">Report Found Item</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </PageTransition>
        </>
    );
};

export default LostAndFoundPage;
