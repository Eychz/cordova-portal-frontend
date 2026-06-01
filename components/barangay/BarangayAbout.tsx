'use client';

import React from 'react';
import { MapPin, Users, Calendar, TrendingUp } from 'lucide-react';

export interface BarangayInfo {
    name?: string;
    description: string;
    established?: string;
    population: string;
    area?: string;
    zipCode?: string;
    coordinates?: { lat: number; lng: number };
    mapIframe?: string;
    keyFeatures?: { title: string; description: string }[];
}

interface BarangayAboutProps {
    info: BarangayInfo;
}

const BarangayAbout: React.FC<BarangayAboutProps> = ({ info }) => {
    return (
        <section className="mb-24">
            <div className="grid lg:grid-cols-1 gap-px bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 mb-12">
                {/* Description - Sharp Panel */}
                <div className="bg-white dark:bg-gray-900 p-12">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-12">
                        <div className="flex-1">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-2 h-10 bg-red-700"></div>
                                <h2 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                                    About {info.name || 'Barangay'}
                                </h2>
                            </div>
                            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                                {info.description}
                            </p>
                        </div>

                        {/* Stats Grid - Sharp - Integrated into side on large screens */}
                        <div className="w-full md:w-80 flex flex-col gap-2 bg-gray-100 dark:bg-gray-800 p-2">
                            {info.established && (
                                <div className="bg-white dark:bg-gray-900 p-6 border border-gray-200 dark:border-gray-700 hover:border-red-700 hover:border-2 hover:scale-105 transition-all duration-200">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Established</div>
                                    <div className="text-xl font-black text-gray-900 dark:text-white uppercase">{info.established}</div>
                                </div>
                            )}
                            <div className="bg-white dark:bg-gray-900 p-6 border border-gray-200 dark:border-gray-700 hover:border-red-700 hover:border-2 hover:scale-105 transition-all duration-200">
                                <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Population</div>
                                <div className="text-xl font-black text-gray-900 dark:text-white uppercase">{info.population}</div>
                            </div>
                            {info.area && (
                                <div className="bg-white dark:bg-gray-900 p-6 border border-gray-200 dark:border-gray-700 hover:border-red-700 hover:border-2 hover:scale-105 transition-all duration-200">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Land Area</div>
                                    <div className="text-xl font-black text-gray-900 dark:text-white uppercase">{info.area}</div>
                                </div>
                            )}
                            {info.zipCode && (
                                <div className="bg-white dark:bg-gray-900 p-6 border border-gray-200 dark:border-gray-700 hover:border-red-700 hover:border-2 hover:scale-105 transition-all duration-200">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Zip Code</div>
                                    <div className="text-xl font-black text-gray-900 dark:text-white uppercase">{info.zipCode}</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Map Location - Sharp Panel */}
            {info.mapIframe && (
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
                    <div className="p-12 border-b border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-4">
                            <div className="w-2 h-10 bg-gray-900 dark:bg-white"></div>
                            <h2 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                                Map Location
                            </h2>
                        </div>
                    </div>
                    <div className="h-[500px] w-full bg-gray-100 dark:bg-gray-800 relative">
                        <div
                            className="w-full h-full"
                            dangerouslySetInnerHTML={{ __html: info.mapIframe }}
                        />
                    </div>
                </div>
            )}

            {/* Key Features - Sharp Cards */}
            {info.keyFeatures && info.keyFeatures.length > 0 && (
                <div className="grid md:grid-cols-3 gap-2 bg-gray-200 dark:bg-gray-800 mt-12">
                    {info.keyFeatures.map((feature, index) => (
                        <div key={index} className="p-12 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                            <div className="flex items-center gap-3 mb-6">
                                <TrendingUp className="w-5 h-5 text-red-700" />
                                <h4 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">
                                    {feature.title}
                                </h4>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default BarangayAbout;
