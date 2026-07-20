'use client';

import React, { useState, useEffect } from 'react';
import CachedImage from '@/components/CachedImage';
import { useParams, useRouter } from 'next/navigation';
import PageTransition from '@/components/PageTransition';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowLeft, Mail, Phone, MapPin, Building2, User, ExternalLink } from 'lucide-react';
import { officialsApi, Official } from '@/lib/officialsApi';

export default function LeaderProfilePage() {
    const params = useParams();
    const router = useRouter();
    const [official, setOfficial] = useState<Official | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOfficial = async () => {
            try {
                const data = await officialsApi.getBySlug(params.slug as string);
                setOfficial(data);
            } catch (err) {
                console.error(err);
                router.push('/about');
            } finally {
                setLoading(false);
            }
        };
        if (params.slug) fetchOfficial();
    }, [params.slug, router]);

    if (loading) return (
        <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-red-700 border-t-transparent animate-spin rounded-full"></div>
        </div>
    );

    if (!official) return null;

    return (
        <PageTransition>
            <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors flex flex-col">
                <Navbar activePage="About" />

                <main className="flex-grow pt-24 pb-16">
                    <div className="maximize-width">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 text-gray-500 hover:text-red-700 font-bold text-xs uppercase tracking-widest mb-8 transition-colors group"
                        >
                            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Back to Leadership
                        </button>

                        <div className="flex flex-col lg:flex-row gap-10">
                            {/* Profile Sidebar */}
                            <div className="lg:w-1/4 space-y-6">
                                <div className="aspect-[4/5] relative bg-gray-50 dark:bg-black border-4 border-red-800 shadow-lg overflow-hidden rounded-xl">
                                    {official.imageUrl ? (
                                        <CachedImage
                                            src={official.imageUrl}
                                            alt={official.name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <User className="w-20 h-20 text-gray-200" />
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">
                                        {official.name}
                                    </h1>
                                    {(() => {
                                        const parts = official.position.split(' | ');
                                        const designation = parts[0];
                                        const office = parts[1] || '';
                                        return (
                                            <div className="space-y-1">
                                                <p className="text-blue-900 dark:text-blue-450 font-black text-xs uppercase tracking-[0.2em]">
                                                    {designation}
                                                </p>
                                                {office && (
                                                    <p className="text-gray-500 dark:text-gray-400 font-bold text-[10px] uppercase tracking-[0.25em]">
                                                        {office}
                                                    </p>
                                                )}
                                            </div>
                                        );
                                    })()}
                                </div>
                            </div>
 
                            {/* Content Area */}
                            <div className="flex-1 space-y-8">
                                <section>
                                    <div className="flex items-center gap-3 mb-6 border-b-2 border-gray-150 dark:border-gray-800 pb-3">
                                        <div className="w-1.5 h-6 bg-red-700"></div>
                                        <h2 className="text-xl font-black uppercase tracking-tight text-gray-900 dark:text-white">Official Information</h2>
                                    </div>
 
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="bg-gray-50 dark:bg-gray-800 p-4 md:p-6 border border-gray-100 dark:border-gray-700 space-y-4 rounded-xl">
                                            <div className="space-y-1">
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Office / Level</p>
                                                <div className="flex items-center gap-2">
                                                    <Building2 className="w-3.5 h-3.5 text-red-700" />
                                                    <p className="font-bold text-gray-900 dark:text-white uppercase text-xs tracking-tight">
                                                        {official.type === 'MUNICIPAL' ? 'Municipal' :
                                                            official.type === 'DEPARTMENT' ? `Executive Department ${official.position.split(' | ')[1] ? `- ${official.position.split(' | ')[1]}` : ''}` :
                                                                official.type === 'BARANGAY' ? `Barangay ${official.barangayName}` :
                                                                    `SK ${official.barangayName}`}
                                                    </p>
                                                </div>
                                            </div>

                                            {official.barangayName && (
                                                <div className="space-y-1">
                                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Jurisdiction</p>
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="w-3.5 h-3.5 text-red-700" />
                                                        <p className="font-bold text-gray-900 dark:text-white uppercase text-xs tracking-tight">
                                                            Municipality of Cordova
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="space-y-1 border-t border-gray-250 dark:border-gray-700 pt-3">
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Office Location</p>
                                                <p className="text-gray-600 dark:text-gray-300 text-xs font-semibold">
                                                    Cordova Municipal Hall | Poblacion Cordova, Cebu
                                                </p>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 dark:bg-gray-800 p-4 md:p-6 border border-gray-100 dark:border-gray-700 space-y-4 rounded-xl">
                                            <div className="space-y-1">
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Contact Email</p>
                                                <div className="flex items-center gap-2">
                                                    <Mail className="w-3.5 h-3.5 text-red-700" />
                                                    <p className="font-bold text-gray-900 dark:text-white text-xs lowercase">
                                                        {official.email || 'Not available'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Phone / Mobile</p>
                                                <div className="flex items-center gap-2">
                                                    <Phone className="w-3.5 h-3.5 text-red-700" />
                                                    <p className="font-bold text-gray-900 dark:text-white text-xs">
                                                        {official.contactNumber || 'Not available'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="space-y-1 border-t border-gray-250 dark:border-gray-700 pt-3">
                                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Service Schedule</p>
                                                <p className="text-gray-600 dark:text-gray-300 text-xs font-semibold">
                                                    Monday - Friday, 8:00 AM - 5:00 PM
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section className="bg-red-800 text-white p-8 relative overflow-hidden rounded-xl shadow-md">
                                    <div className="relative z-10 space-y-4">
                                        <h2 className="text-xl font-black uppercase tracking-tighter">Public Service Mandate</h2>
                                        <p className="text-sm text-red-100 font-medium leading-relaxed max-w-2xl italic">
                                            "Serving the people of Cordova with transparency, integrity, and dedication. Our office is committed to fostering inclusive growth and sustainable development for every Cordovanhon."
                                        </p>
                                    </div>
                                    <Building2 className="absolute -bottom-10 -right-10 w-48 h-48 text-red-950 opacity-15" />
                                </section>
                            </div>
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        </PageTransition>
    );
}
