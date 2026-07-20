'use client';

import React from 'react';
import CachedImage from '@/components/CachedImage';
import { useRouter } from 'next/navigation';
import PageTransition from '@/components/PageTransition';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { User, Users, Shield, Award } from 'lucide-react';
import { officialsApi, Official } from '@/lib/officialsApi';
import { useQuery } from '@tanstack/react-query';
import { DEPARTMENTS, getDepartmentCategory } from '@/data/departments';

export default function LeadershipPage() {
    const router = useRouter();

    const { data: municipalOfficials = [], isLoading: loadingMunicipal } = useQuery<Official[]>({
        queryKey: ['publicOfficials', 'MUNICIPAL'],
        queryFn: () => officialsApi.getAll('MUNICIPAL'),
        staleTime: 5 * 60 * 1000,
    });

    const { data: departmentHeads = [], isLoading: loadingDepartment } = useQuery<Official[]>({
        queryKey: ['publicOfficials', 'DEPARTMENT'],
        queryFn: () => officialsApi.getAll('DEPARTMENT'),
        staleTime: 5 * 60 * 1000,
    });

    const loading = loadingMunicipal || loadingDepartment;

    // Filter municipal officials into hierarchy layers
    const mayor = municipalOfficials.find(o => o.position.toLowerCase().includes('vice-mayor') === false && o.position.toLowerCase().includes('vice mayor') === false && o.position.toLowerCase().includes('mayor'));
    const viceMayor = municipalOfficials.find(o => o.position.toLowerCase().includes('vice-mayor') || o.position.toLowerCase().includes('vice mayor'));
    const secretary = municipalOfficials.find(o => o.position.toLowerCase().includes('secretary'));
    const abcPresident = municipalOfficials.find(o => o.position.toLowerCase().includes('abc'));
    const skfPresident = municipalOfficials.find(o => o.position.toLowerCase().includes('skf') || o.position.toLowerCase().includes('sk president') || o.position.toLowerCase().includes('federation president'));
    const councilors = municipalOfficials.filter(o =>
        o.id !== mayor?.id &&
        o.id !== viceMayor?.id &&
        o.id !== secretary?.id
    );

    return (
        <PageTransition>
            <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors flex flex-col">
                <Navbar activePage="About" />

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
                                    Municipal Administration
                                </div>
                                <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">
                                    Our Leaders
                                </h1>
                                <p className="text-xl text-white font-medium max-w-2xl">
                                    Meet the public servants dedicated to directing growth, service, and governance in Cordova.
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-grow maximize-width px-4 py-16 space-y-24">

                    {/* Municipal Leadership Section: Sangguniang Bayan Org Chart */}
                    <section className="space-y-12">
                        <div className="flex items-center gap-4 mb-12 border-b-2 border-gray-100 dark:border-gray-800 pb-6">
                            <div className="w-2 h-10 bg-red-700"></div>
                            <h2 className="text-3xl font-black uppercase tracking-tight text-gray-900 dark:text-white">
                                Municipal Government Structure
                            </h2>
                        </div>
                        {loading ? (
                            <div className="h-64 flex items-center justify-center">
                                <div className="w-8 h-8 border-4 border-red-700 border-t-transparent animate-spin rounded-full"></div>
                            </div>
                        ) : (
                            <div className="w-full overflow-x-auto pb-10">
                                <div className="min-w-[1000px] flex flex-col items-center">

                                    {/* Level 1: People of Cordova */}
                                    <div className="bg-red-800 text-white font-black uppercase tracking-[0.2em] px-8 py-3 rounded-full text-2xl shadow-md border-2 border-red-700 hover:scale-105 transition-transform duration-300">
                                        People of the Municipality of Cordova
                                    </div>

                                    {/* Level 2: Mayor */}
                                    {mayor && (
                                        <div
                                            onClick={() => router.push(`/about/leaders/${mayor.slug}`)}
                                            className="mt-20 relative z-10 bg-white dark:bg-gray-900 border-2 border-red-700 hover:border-red-600 rounded-xl p-6 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 w-96 cursor-pointer flex flex-col items-center group mb-4"
                                        >
                                            <div className="w-60 h-60 rounded-full relative overflow-hidden mb-3 -mt-20 bg-white shadow-md">
                                                {mayor.imageUrl ? (
                                                    <CachedImage src={mayor.imageUrl} alt={mayor.name} fill className="object-cover object-top" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300"><User className="w-16 h-16" /></div>
                                                )}
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-700 dark:text-red-400 mb-1">
                                                {mayor.position}
                                            </span>
                                            <h3 className="text-base font-black text-gray-900 dark:text-white uppercase text-center group-hover:text-red-700 transition-colors">
                                                {mayor.name}
                                            </h3>
                                        </div>
                                    )}

                                    {/* Connector Line 2-3 */}
                                    <div className="w-0.5 h-20 bg-red-700/50"></div>

                                    {/* Level 3: Vice Mayor */}
                                    {viceMayor && (
                                        <div
                                            onClick={() => router.push(`/about/leaders/${viceMayor.slug}`)}
                                            className="relative z-10 bg-white dark:bg-gray-900 border-2 border-blue-900 hover:border-blue-800 rounded-xl p-5 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 w-80 cursor-pointer flex flex-col items-center group mb-4"
                                        >
                                            <div className="w-48 h-48 rounded-full relative overflow-hidden mb-3 -mt-16 bg-white shadow-md">
                                                {viceMayor.imageUrl ? (
                                                    <CachedImage src={viceMayor.imageUrl} alt={viceMayor.name} fill className="object-cover object-top" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300"><User className="w-12 h-12" /></div>
                                                )}
                                            </div>
                                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-900 dark:text-blue-400 mb-1">
                                                {viceMayor.position}
                                            </span>
                                            <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase text-center group-hover:text-blue-900 transition-colors">
                                                {viceMayor.name}
                                            </h3>
                                        </div>
                                    )}

                                    {/* Connector Line 3-4 */}
                                    <div className="w-0.5 h-10 bg-red-700/50"></div>

                                    {/* Legislative Sangguniang Bayan Branch Title */}
                                    <div className="bg-gray-900 text-white font-black uppercase tracking-[0.2em] px-6 py-2 rounded text-[10px] mb-4">
                                        Sangguniang Bayan (Legislative Council)
                                    </div>

                                    {/* Horizontal bar for councilors */}
                                    <div className="w-[80%] h-0.5 bg-red-700/50 relative mb-8"></div>

                                    {/* Sangguniang Bayan Members Grid */}
                                    <div className="grid grid-cols-5 gap-6 max-w-6xl w-full px-6 relative">
                                        {councilors.map((c) => (
                                            <div
                                                key={c.id}
                                                onClick={() => router.push(`/about/leaders/${c.slug}`)}
                                                className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-red-700 rounded-xl p-3 shadow hover:shadow-md hover:scale-105 transition-all duration-300 cursor-pointer flex flex-col items-center group w-full max-w-[16rem] mx-auto"
                                            >
                                                {/* Top vertical connector hook */}
                                                <div className="absolute -top-6 left-1/2 w-0.5 h-6 bg-red-700/50 -translate-x-1/2"></div>

                                                <div className="w-40 h-40 rounded-full relative overflow-hidden mb-3 bg-white shadow-md">
                                                    {c.imageUrl ? (
                                                        <CachedImage src={c.imageUrl} alt={c.name} fill className="object-cover object-top" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-300"><User className="w-10 h-10" /></div>
                                                    )}
                                                </div>
                                                <span className="text-[8px] font-black uppercase tracking-widest text-red-700 dark:text-red-400 mb-1 text-center line-clamp-1">
                                                    {c.position}
                                                </span>
                                                <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase text-center group-hover:text-red-700 transition-colors leading-tight line-clamp-2">
                                                    {c.name}
                                                </h4>
                                            </div>
                                        ))}

                                        {/* Sangguniang Bayan Secretary */}
                                        {secretary && (
                                            <div
                                                onClick={() => router.push(`/about/leaders/${secretary.slug}`)}
                                                className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-gray-900 rounded-xl p-3 shadow hover:shadow-md hover:scale-105 transition-all duration-300 cursor-pointer flex flex-col items-center group col-span-5 mx-auto w-64 mt-8"
                                            >
                                                {/* Top vertical connector hook */}
                                                <div className="absolute -top-8 left-1/2 w-0.5 h-8 bg-red-700/50 -translate-x-1/2"></div>

                                                <div className="w-40 h-40 rounded-full relative overflow-hidden mb-3 bg-white shadow-md">
                                                    {secretary.imageUrl ? (
                                                        <CachedImage src={secretary.imageUrl} alt={secretary.name} fill className="object-cover object-top" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-300"><User className="w-10 h-10" /></div>
                                                    )}
                                                </div>
                                                <span className="text-[8px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1 text-center">
                                                    {secretary.position}
                                                </span>
                                                <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase text-center group-hover:text-gray-900 transition-colors leading-tight">
                                                    {secretary.name}
                                                </h4>
                                            </div>
                                        )}
                                    </div>

                                </div>
                            </div>
                        )}
                    </section>

                    {/* Department Heads Grouped by Category */}
                    {DEPARTMENTS.map((dept) => {
                        const officialsInDept = departmentHeads
                            .filter(o => getDepartmentCategory(o.position) === dept.key)
                            .sort((a, b) => a.hierarchyOrder - b.hierarchyOrder);

                        if (officialsInDept.length === 0) return null;

                        return (
                            <section key={dept.key} className="space-y-12">
                                <div className="flex items-center gap-4 mb-10 border-b-2 border-gray-100 dark:border-gray-800 pb-6">
                                    <div className="w-2 h-10 bg-blue-900 dark:bg-blue-400"></div>
                                    <h2 className="text-3xl font-black uppercase tracking-tight text-gray-900 dark:text-white">
                                        {dept.label}
                                    </h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {officialsInDept.map((official) => (
                                        <div
                                            key={official.id}
                                            onClick={() => router.push(`/about/leaders/${official.slug}`)}
                                            className="bg-white dark:bg-gray-900 p-8 border border-gray-100 dark:border-gray-800 flex items-center gap-6 cursor-pointer group hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-xl shadow-sm hover:shadow"
                                        >
                                            <div className="w-32 h-32 rounded-full flex-shrink-0 relative overflow-hidden bg-white dark:bg-gray-800 shadow-md">
                                                {official.imageUrl ? (
                                                    <CachedImage
                                                        src={official.imageUrl}
                                                        alt={official.name}
                                                        fill
                                                        className="object-cover transition-transform group-hover:scale-110"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-gray-850">
                                                        <User className="w-8 h-8 text-gray-300" />
                                                    </div>
                                                )}
                                            </div>
                                            {(() => {
                                                const parts = official.position.split(' | ');
                                                const designation = parts[0];
                                                const office = parts[1] || '';
                                                return (
                                                    <div>
                                                        <h3 className="text-md font-black text-gray-900 dark:text-white mb-1.5 uppercase tracking-tight leading-none group-hover:text-blue-800 dark:group-hover:text-blue-400 transition-colors">
                                                            {official.name}
                                                        </h3>
                                                        <p className="text-blue-900 dark:text-blue-400 font-bold text-[10px] uppercase tracking-widest leading-normal">
                                                            {designation} {office ? `| ${office}` : ''}
                                                        </p>
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        );
                    })}

                </main>

                <Footer />
            </div>
        </PageTransition>
    );
}
