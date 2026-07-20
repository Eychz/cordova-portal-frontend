'use client';

import React from 'react';
import Link from 'next/link';
import CachedImage from '@/components/CachedImage';
import PageTransition from '@/components/PageTransition';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { barangays } from '@/data/barangays';
import { ChevronRight, Users, MapPin, Landmark } from 'lucide-react';

export default function BarangaysListPage() {
    return (
        <PageTransition>
            <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors flex flex-col">
                <Navbar activePage="Barangay" />

                {/* Formal Header */}
                <header className="relative overflow-hidden bg-red-800 text-white pt-24 pb-16 border-b-8 border-red-700">
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
                        style={{ backgroundImage: "url('/bg-cordova.jpg')", opacity: 0.15 }}
                    />
                    <div className="relative maximize-width px-4 z-10">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 bg-white text-red-800 px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em]">
                                Local Government Units
                            </div>
                            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">
                                Our Barangays
                            </h1>
                            <p className="text-xl text-white font-medium max-w-2xl">
                                The Municipality of Cordova is composed of 13 progressive and culturally rich barangays, each with its own unique heritage and community spirit.
                            </p>
                        </div>
                    </div>
                </header>

                <main className="flex-grow maximize-width px-4 py-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 p-0 border-none">
                        {barangays.map((b) => (
                            <Link
                                href={`/barangay/${b.id}`}
                                key={b.id}
                                className="group bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex flex-col"
                            >
                                <div className="h-40 w-full relative overflow-hidden bg-gray-50 dark:bg-gray-850 flex items-center justify-center p-6 border-b border-gray-100 dark:border-gray-800">
                                    <CachedImage
                                        src={b.previewImage}
                                        alt={`Logo of Barangay ${b.name}`}
                                        width={144}
                                        height={144}
                                        className="h-36 w-36 object-contain transform group-hover:scale-110 transition-transform duration-300"
                                    />
                                    <div className="absolute top-4 left-4 bg-red-700 text-white px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] shadow-sm">
                                        BRGY. {b.name}
                                    </div>
                                </div>

                                <div className="p-10 flex-grow flex flex-col">
                                    <div className="mb-6">
                                        <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-2 group-hover:text-red-700 transition-colors">
                                            {b.name}
                                        </h3>
                                        <p className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-widest">{b.tagline}</p>
                                    </div>

                                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-10 line-clamp-3 font-medium">
                                        {b.info.description}
                                    </p>

                                    <div className="mt-auto flex items-center justify-between">
                                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-900 dark:text-white flex items-center gap-2 group-hover:gap-4 transition-all">
                                            Village Profile
                                            <ChevronRight className="w-4 h-4 text-red-700" />
                                        </div>
                                        <Landmark className="w-5 h-5 text-gray-100 dark:text-gray-800 group-hover:text-gray-200 transition-colors" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </main>

                <Footer />
            </div>
        </PageTransition>
    );
}