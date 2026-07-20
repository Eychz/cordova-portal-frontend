'use client';

import React from 'react';
import CachedImage from '@/components/CachedImage';
import PageTransition from '@/components/PageTransition';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { highlightsData } from '@/data/tourismData';
import { Sparkles, ArrowUpRight, MapPin, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function TourismPage() {
    return (
        <PageTransition>
            <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                <Navbar activePage="about" />

                {/* Header Banner */}
                <header className="relative overflow-hidden bg-red-800 text-white pt-24 pb-16 border-b-8 border-red-700">
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
                        style={{ backgroundImage: "url('/bg-cordova.jpg')", opacity: 0.25 }}
                    />
                    <div className="relative maximize-width px-4 z-10">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-2 bg-white text-red-800 px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em]">
                                    Eco-Tourism Hub
                                </div>
                                <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">
                                    Tourism in Cordova
                                </h1>
                                <p className="text-xl text-white font-medium max-w-2xl">
                                    Discover world-class coastal resorts, glowing floral landmarks, and thriving marine sanctuaries across the Municipality of Cordova, Cebu.
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-grow maximize-width px-4 py-16 space-y-24">

                    {/* Section 1: Highlights 3-Square-Card Interactive Hover Grid */}
                    <section className="space-y-10">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-2 border-gray-100 dark:border-gray-800 pb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-2 h-10 bg-red-700"></div>
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-red-600 dark:text-red-400 block">Featured Destinations</span>
                                    <h2 className="text-3xl font-black uppercase tracking-tight text-gray-900 dark:text-white">
                                        Top Tourism Highlights
                                    </h2>
                                </div>
                            </div>
                        </div>

                        {/* 3 Square Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {highlightsData.map((spot) => {
                                const IconComponent = spot.icon;
                                return (
                                    <a
                                        key={spot.id}
                                        href={`#${spot.id}`}
                                        className="relative group overflow-hidden rounded-2xl aspect-square cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 border border-blue-900/30 block"
                                    >
                                        {/* Background Image (Fades & Scales in on Hover) */}
                                        <div
                                            className="absolute inset-0 bg-cover bg-center transition-all duration-700 transform group-hover:scale-110 opacity-0 group-hover:opacity-100"
                                            style={{ backgroundImage: `url('${spot.image}')` }}
                                        />

                                        {/* Dark Overlay over Image on Hover */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/95 via-blue-950/60 to-gray-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                        {/* Default Background Layer: Dark Blue at 80% Opacity */}
                                        <div className="absolute inset-0 bg-red-700 dark:bg-blue-950/85 group-hover:opacity-0 transition-opacity duration-500 backdrop-blur-sm" />

                                        {/* Card Content Overlay */}
                                        <div className="relative z-10 p-6 sm:p-8 h-full flex flex-col justify-between text-white">
                                            {/* Header Badge */}
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full border border-white/30">
                                                    {spot.category}
                                                </span>
                                                <div className="p-2 rounded-full bg-white/10 backdrop-blur-md group-hover:bg-white/30 transition-colors">
                                                    <ArrowUpRight className="w-4 h-4 text-white opacity-100" />
                                                </div>
                                            </div>

                                            {/* Center Category Icon & Title: White at 100% Opacity */}
                                            <div className="flex flex-col items-center justify-center text-center my-auto transition-transform duration-500 group-hover:scale-105">
                                                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/15 group-hover:bg-white/25 backdrop-blur-md flex items-center justify-center mb-4 border border-white/20 shadow-inner">
                                                    <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 text-white opacity-100 drop-shadow-md" />
                                                </div>
                                                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white leading-tight drop-shadow-sm">
                                                    {spot.name}
                                                </h3>
                                            </div>

                                            {/* Bottom Teaser */}
                                            <div className="space-y-2">
                                                <p className="text-xs sm:text-sm text-white/90 font-medium line-clamp-2 leading-relaxed">
                                                    {spot.tagline}
                                                </p>
                                                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-white/80">
                                                    <MapPin className="w-3.5 h-3.5 text-white opacity-100" />
                                                    <span className="truncate">{spot.location.split(',')[1] || spot.location}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                );
                            })}
                        </div>
                    </section>

                    {/* Section 2: Detailed Destination Canvases */}
                    <section className="space-y-16">
                        <div className="flex items-center gap-4 border-b-2 border-gray-100 dark:border-gray-800 pb-6">
                            <div className="w-2 h-10 bg-red-700"></div>
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-red-600 dark:text-red-400 block">Explore Details</span>
                                <h2 className="text-3xl font-black uppercase tracking-tight text-gray-900 dark:text-white">
                                    Destination Canvases
                                </h2>
                            </div>
                        </div>

                        <div className="space-y-16">
                            {highlightsData.map((spot, index) => {
                                const IconComponent = spot.icon;
                                const isEven = index % 2 === 0;

                                return (
                                    <div
                                        key={spot.id}
                                        id={spot.id}
                                        className="bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden p-8 md:p-12 shadow-sm space-y-8 scroll-mt-24"
                                    >
                                        <div className={`flex flex-col lg:flex-row gap-10 items-center ${isEven ? '' : 'lg:flex-row-reverse'}`}>
                                            {/* Image Showcase */}
                                            <div className="w-full lg:w-1/2 relative h-80 md:h-96 rounded-xl overflow-hidden shadow-md group">
                                                <CachedImage
                                                    src={spot.image}
                                                    alt={spot.name}
                                                    fill
                                                    className="object-cover transform group-hover:scale-105 transition-transform duration-700"
                                                />
                                                <div className="absolute top-4 left-4 bg-gray-950/80 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-2">
                                                    <IconComponent className="w-4 h-4 text-red-400" />
                                                    {spot.category}
                                                </div>
                                            </div>

                                            {/* Content Showcase */}
                                            <div className="w-full lg:w-1/2 space-y-6">
                                                <div className="space-y-2">
                                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-700 dark:text-red-400 block">
                                                        Destination #{index + 1}
                                                    </span>
                                                    <h3 className="text-3xl font-black uppercase tracking-tight text-gray-900 dark:text-white">
                                                        {spot.name}
                                                    </h3>
                                                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
                                                        <MapPin className="w-4 h-4 text-red-600" />
                                                        <span>{spot.location}</span>
                                                    </div>
                                                </div>

                                                <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                                                    {spot.description}
                                                </p>

                                                <div className="space-y-3 pt-2">
                                                    <h4 className="text-xs font-black uppercase tracking-wider text-gray-900 dark:text-white flex items-center gap-2">
                                                        <Sparkles className="w-4 h-4 text-red-600" />
                                                        Key Features & Attractions
                                                    </h4>
                                                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-gray-600 dark:text-gray-300">
                                                        {spot.highlights.map((item, idx) => (
                                                            <li key={idx} className="flex items-start gap-2">
                                                                <CheckCircle2 className="w-4 h-4 text-red-700 dark:text-red-400 flex-shrink-0 mt-0.5" />
                                                                <span>{item}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* Section 3: Eco-Tourism Guidelines & Visitor Info */}
                    <section className="bg-gradient-to-r from-[#071330] to-[#071330] text-white rounded-2xl p-8 md:p-12 shadow-xl space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md">
                                <ShieldCheck className="w-8 h-8 text-red-400" />
                            </div>
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-400 block">Responsible Travel</span>
                                <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight">Cordova Eco-Tourism Guidelines</h3>
                            </div>
                        </div>

                        <p className="text-sm md:text-base text-gray-200 leading-relaxed max-w-4xl">
                            The Municipality of Cordova is dedicated to maintaining sustainable tourism practices. Visitors are encouraged to observe marine sanctuary rules, practice proper waste disposal, support local barangay vendors, and respect protected marine environments.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-white/10 text-xs">
                            <div className="space-y-1">
                                <span className="font-black uppercase tracking-wider text-red-400 block">Access via CCLEX</span>
                                <p className="text-gray-300">Direct 15-minute connection from Cebu City via the CCLEX Expressway bridge.</p>
                            </div>
                            <div className="space-y-1">
                                <span className="font-black uppercase tracking-wider text-red-400 block">Island Hopping & Port</span>
                                <p className="text-gray-300">Boats to Gilutongan & Olango depart regularly from the Cordova RORO Port.</p>
                            </div>
                            <div className="space-y-1">
                                <span className="font-black uppercase tracking-wider text-red-400 block">LGU Visitor Support</span>
                                <p className="text-gray-300">Municipal Tourism Office located at the Cordova Municipal Hall in Poblacion.</p>
                            </div>
                        </div>
                    </section>

                </main>

                <Footer />
            </div>
        </PageTransition>
    );
}
