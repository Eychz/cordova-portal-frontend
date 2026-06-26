'use client';

import React from 'react';
import PageTransition from '@/components/PageTransition';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import * as LucideIcons from 'lucide-react';
import { useRescueHotlines } from '@/hooks/useRescueHotlines';
import { RescueHotlineCardSkeleton } from '@/components/Skeleton';

const RescueDeskPage: React.FC = () => {
    const { data: hotlines = [], isLoading: loading } = useRescueHotlines();

    return (
        <PageTransition>
            <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors flex flex-col">
                <Navbar activePage="Rescue Desk" />

                {/* Emergency Header - High Contrast */}
                <header className="bg-red-800 text-white pt-24 pb-16">
                    <div className="maximize-width px-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-2 bg-white text-red-700 px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em]">
                                    Crisis Management Center
                                </div>
                                <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">
                                    Rescue Desk
                                </h1>
                                <p className="text-xl text-red-100 font-medium max-w-2xl">
                                    Official directory for emergency response, public safety, and crisis intervention in Cordova.
                                </p>
                            </div>

                            <div className="bg-red-800 p-8 border border-white/100">
                                <div className="flex items-center gap-6">
                                    <div className="p-4 bg-white text-red-700">
                                        <LucideIcons.Phone className="w-10 h-10" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black uppercase tracking-[0.2em] mb-1">Emergency Hotline</div>
                                        <div className="text-4xl font-black tabular-nums tracking-tighter">911 CORDOVA</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-grow maximize-width px-4 py-16">
                    {/* Urgency Alert */}
                    <div className="mb-16 bg-red-50 dark:bg-red-950/20 border-l-8 border-red-700 p-8 flex items-start gap-6">
                        <LucideIcons.AlertTriangle className="w-8 h-8 text-red-700 flex-shrink-0" />
                        <div>
                            <h3 className="text-lg font-black text-red-900 dark:text-red-100 uppercase tracking-tight mb-2">Immediate Response Protocol</h3>
                            <p className="text-red-800 dark:text-red-200/70 text-sm leading-relaxed max-w-3xl">
                                If you are experiencing a life-threatening emergency, please call the specific department hotline immediately. For maritime incidents, contact the Coast Guard or Marine Watch. All lines are active 24/7.
                            </p>
                        </div>
                    </div>

                    {/* Directory Grid - Flat & Sharp - 2-gap spacing policy */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 p-0 border-none mb-20">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <RescueHotlineCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : hotlines.length === 0 ? (
                        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-20 text-center mb-20">
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No active hotlines registered</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 p-0 border-none mb-20">
                            {hotlines.map((contact) => {
                                const IconComponent = (LucideIcons as any)[contact.icon] || LucideIcons.Siren;
                                return (
                                    <div
                                        key={contact.id}
                                        className="bg-white dark:bg-gray-900 p-10 group hover:bg-gray-50 dark:hover:bg-gray-800 hover: border hover:border-red-700 transition-colors duration-300 flex flex-col justify-between h-full"
                                    >
                                        <div>
                                            <div className="flex justify-between items-start mb-8">
                                                <div className="w-16 h-16 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 flex items-center justify-center flex-shrink-0">
                                                    <IconComponent className="w-8 h-8" />
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-red-700">
                                                    {contact.category}
                                                </span>
                                            </div>
                                            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tight">
                                                {contact.title}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                                                {contact.description}
                                            </p>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="text-3xl font-black text-red-700 tabular-nums tracking-tighter whitespace-pre-line">
                                                {contact.contact}
                                            </div>
                                            <a
                                                href={`tel:${contact.contact.split(/[\/\n,]/)[0].trim().replace(/[()-\s]/g, '')}`}
                                                className="inline-flex items-center gap-2 bg-gray-900 hover:bg-red-700 text-white px-6 py-3 text-xs font-black tracking-widest uppercase transition-colors w-full justify-center"
                                            >
                                                <LucideIcons.Phone className="w-4 h-4" />
                                                Initiate Call
                                            </a>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Safety Guidelines - Formal Table-like Grid */}
                    <section className="border-t-2 border-gray-100 dark:border-gray-800 pt-20">
                        <div className="flex items-center gap-4 mb-12">
                            <div className="w-2 h-10 bg-gray-900 dark:bg-white"></div>
                            <h2 className="text-3xl font-black uppercase tracking-tight text-gray-900 dark:text-white">Safety Guidelines</h2>
                        </div>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="p-8 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
                                <h4 className="font-black text-gray-900 dark:text-white uppercase text-sm mb-4">In Case of Fire</h4>
                                <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                                    <li className="flex gap-3"><span>1.</span> Evacuate immediately via the nearest exit.</li>
                                    <li className="flex gap-3"><span>2.</span> Do not use elevators.</li>
                                    <li className="flex gap-3"><span>3.</span> Call BFP Cordova hotline at 0933-394-9073.</li>
                                </ul>
                            </div>
                            <div className="p-8 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
                                <h4 className="font-black text-gray-900 dark:text-white uppercase text-sm mb-4">Medical Emergency</h4>
                                <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                                    <li className="flex gap-3"><span>1.</span> Stay calm and check for safety.</li>
                                    <li className="flex gap-3"><span>2.</span> Call MDRRMO Ambulance or Red Cross.</li>
                                    <li className="flex gap-3"><span>3.</span> Provide clear location details and patient status.</li>
                                </ul>
                            </div>
                        </div>
                    </section>
                </main>

                <Footer />
            </div>
        </PageTransition>
    );
};

export default RescueDeskPage;
