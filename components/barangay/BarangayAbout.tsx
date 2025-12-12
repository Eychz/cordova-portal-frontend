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
        <section className="mb-16">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Description */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                    <h2 className="text-3xl font-black text-red-900 dark:text-white mb-4">About {info.name || 'Barangay'}</h2>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                        {info.description}
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        {info.established && (
                            <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-red-600 dark:text-red-400" />
                                <div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">Established</div>
                                    <div className="font-bold text-gray-900 dark:text-white">{info.established}</div>
                                </div>
                            </div>
                        )}
                        <div className="flex items-center gap-3">
                            <Users className="w-5 h-5 text-red-600 dark:text-red-400" />
                            <div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">Population</div>
                                <div className="font-bold text-gray-900 dark:text-white">{info.population}</div>
                            </div>
                        </div>
                        {info.area && (
                            <div className="flex items-center gap-3">
                                <MapPin className="w-5 h-5 text-red-600 dark:text-red-400" />
                                <div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">Area</div>
                                    <div className="font-bold text-gray-900 dark:text-white">{info.area}</div>
                                </div>
                            </div>
                        )}
                        {info.zipCode && (
                            <div className="flex items-center gap-3">
                                <TrendingUp className="w-5 h-5 text-red-600 dark:text-red-400" />
                                <div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">Zip Code</div>
                                    <div className="font-bold text-gray-900 dark:text-white">{info.zipCode}</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Map */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                    <h3 className="text-2xl font-black text-red-900 dark:text-white mb-4">Location Map</h3>
                    <div className="w-full h-80 bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden">
                        {info.mapIframe ? (
                            <div dangerouslySetInnerHTML={{ __html: info.mapIframe }} className="w-full h-full" />
                        ) : info.coordinates ? (
                            <iframe
                                src={`https://maps.google.com/maps?q=${info.coordinates.lat},${info.coordinates.lng}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                                Map not available
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Key Features */}
            {info.keyFeatures && info.keyFeatures.length > 0 && (
                <div className="grid md:grid-cols-3 gap-6">
                    {info.keyFeatures.map((feature, index) => (
                        <div key={index} className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6">
                            <h4 className="font-bold text-red-900 dark:text-white mb-2">{feature.title}</h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300">{feature.description}</p>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default BarangayAbout;
