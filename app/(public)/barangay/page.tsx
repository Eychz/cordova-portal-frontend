'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
                <header className="bg-red-800 text-white pt-24 pb-16 border-b-8 border-red-700">
                    <div className="maximize-width px-4">
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

                <main className="flex-grow maximize-width px-4 py-16">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 bg-gray-200 dark:bg-gray-800 p-0 border-none">
                        {barangays.map((b) => (
                            <Link
                                href={`/barangay/${b.id}`}
                                key={b.id}
                                className="group bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex flex-col"
                            >
                                <div className="h-32 md:h-64 w-full relative overflow-hidden">
                                    <Image
                                        src={b.previewImage || "/municipal-logo.jpg"}
                                        alt={b.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-0 left-0 bg-red-700 text-white px-2 md:px-6 py-1 md:py-2 text-[8px] md:text-xs font-black uppercase tracking-[0.2em]">
                                        BRGY. {b.name}
                                    </div>
                                </div>

                                <div className="p-4 md:p-10 flex-grow flex flex-col">
                                    <div className="mb-2 md:mb-6">
                                        <h3 className="text-sm md:text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-1 md:mb-2 group-hover:text-red-700 transition-colors line-clamp-1">
                                            {b.name}
                                        </h3>
                                        <p className="text-[8px] md:text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-widest line-clamp-1">{b.tagline}</p>
                                    </div>

                                    <p className="text-[10px] md:text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4 md:mb-10 line-clamp-2 md:line-clamp-3 font-medium min-h-[30px] md:min-h-[60px]">
                                        {b.info.description}
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 mb-4 md:mb-10 border-y border-gray-50 dark:border-gray-800 py-2 md:py-6 hidden sm:grid">
                                        <div className="flex items-center gap-2 md:gap-3">
                                            <Users className="w-3 h-3 md:w-4 md:h-4 text-gray-300" />
                                            <div className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-gray-400">7,200+ Pop.</div>
                                        </div>
                                        <div className="flex items-center gap-2 md:gap-3">
                                            <MapPin className="w-3 h-3 md:w-4 md:h-4 text-gray-300" />
                                            <div className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-gray-400">2.5 SQ. KM</div>
                                        </div>
                                    </div>

                                    <div className="mt-auto flex items-center justify-between">
                                        <div className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-gray-900 dark:text-white flex items-center gap-1 md:gap-2 group-hover:gap-2 md:group-hover:gap-4 transition-all">
                                            Village Profile
                                            <ChevronRight className="w-3 h-3 md:w-4 md:h-4 text-red-700" />
                                        </div>
                                        <Landmark className="w-4 h-4 md:w-5 md:h-5 text-gray-100 dark:text-gray-800 group-hover:text-gray-200 transition-colors" />
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