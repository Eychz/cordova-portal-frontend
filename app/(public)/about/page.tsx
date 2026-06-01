'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageTransition from '@/components/PageTransition';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Target, Rocket, Mail, Phone, MapPin, Users, History, Info, User } from 'lucide-react';
import { officialsApi, Official } from '@/lib/officialsApi';

const AboutPage = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'about' | 'officials' | 'history'>('about');
    const [municipalOfficials, setMunicipalOfficials] = useState<Official[]>([]);
    const [departmentHeads, setDepartmentHeads] = useState<Official[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [municipal, departments] = await Promise.all([
                    officialsApi.getAll('MUNICIPAL'),
                    officialsApi.getAll('DEPARTMENT')
                ]);
                setMunicipalOfficials(municipal);
                setDepartmentHeads(departments);
            } catch (err) {
                console.error('Failed to fetch officials', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    return (
        <PageTransition>
            <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors flex flex-col">
                <Navbar activePage="About" />

                <header className="bg-red-800 text-white pt-24 pb-16 border-b-8 border-red-950">
                    <div className="maximize-width px-4">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-2 bg-white text-red-800 px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em]">
                                    Institutional Profile
                                </div>
                                <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">
                                    About Cordova
                                </h1>
                                <p className="text-xl text-red-100 font-medium max-w-2xl">
                                    Official profile of the Municipality of Cordova, including our mandates, history, and the leadership serving our people.
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <div className="maximize-width px-4">
                        <div className="flex overflow-x-auto no-scrollbar">
                            <button
                                onClick={() => setActiveTab('about')}
                                className={`px-8 py-5 text-sm font-black uppercase tracking-widest whitespace-nowrap border-b-4 transition-all ${activeTab === 'about'
                                    ? 'border-red-700 text-red-700 bg-white dark:bg-gray-900'
                                    : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <Info className="w-4 h-4" />
                                    General Information
                                </div>
                            </button>
                            <button
                                onClick={() => setActiveTab('officials')}
                                className={`px-8 py-5 text-sm font-black uppercase tracking-widest whitespace-nowrap border-b-4 transition-all ${activeTab === 'officials'
                                    ? 'border-red-700 text-red-700 bg-white dark:bg-gray-900'
                                    : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    Municipal Leadership
                                </div>
                            </button>
                            <button
                                onClick={() => setActiveTab('history')}
                                className={`px-8 py-5 text-sm font-black uppercase tracking-widest whitespace-nowrap border-b-4 transition-all ${activeTab === 'history'
                                    ? 'border-red-700 text-red-700 bg-white dark:bg-gray-900'
                                    : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <History className="w-4 h-4" />
                                    History & Culture
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                <main className="flex-grow maximize-width px-4 py-16">
                    {activeTab === 'about' && (
                        <div className="space-y-2">
                            <div className="grid md:grid-cols-2 gap-2 bg-gray-200 dark:bg-gray-800 p-0">
                                <div className="bg-white dark:bg-gray-900 p-12 border border-gray-100 dark:border-gray-800">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-2 h-10 bg-red-700"></div>
                                        <h2 className="text-4xl font-black uppercase tracking-tight text-gray-900 dark:text-white">Vision</h2>
                                    </div>
                                    <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-medium italic">
                                        "A progressive, resilient, and sustainable coastal municipality where every resident enjoys quality life through good governance, economic prosperity, and environmental stewardship."
                                    </p>
                                </div>
                                <div className="bg-white dark:bg-gray-900 p-12 border border-gray-100 dark:border-gray-800">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-2 h-10 bg-red-700"></div>
                                        <h2 className="text-4xl font-black uppercase tracking-tight text-gray-900 dark:text-white">Mission</h2>
                                    </div>
                                    <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                                        To deliver efficient and effective public services, promote inclusive development, protect the environment, and empower communities through transparent governance and active citizen participation.
                                    </p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-2 bg-gray-200 dark:bg-gray-800 mt-2">
                                <div className="bg-white dark:bg-gray-900 p-10 border border-gray-100 dark:border-gray-800">
                                    <div className="flex items-center gap-3 mb-6">
                                        <MapPin className="w-6 h-6 text-red-700" />
                                        <h3 className="text-xl font-black uppercase tracking-widest text-gray-900 dark:text-white">Geography</h3>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                        Located on the southeastern tip of Mactan Island in the province of Cebu, Philippines. The municipality covers approximately 32.5 square kilometers and is composed of 13 barangays, including the island barangay of Gilutongan.
                                    </p>
                                </div>
                                <div className="bg-white dark:bg-gray-900 p-10 border border-gray-100 dark:border-gray-800">
                                    <div className="flex items-center gap-3 mb-6">
                                        <Users className="w-6 h-6 text-red-700" />
                                        <h3 className="text-xl font-black uppercase tracking-widest text-gray-900 dark:text-white">Population</h3>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                        Home to approximately 67,000 residents (2020 Census). The municipality has experienced steady growth due to its proximity to Cebu City and the development of the Mactan-Cebu International Airport area.
                                    </p>
                                </div>
                                <div className="bg-white dark:bg-gray-900 p-10 border border-gray-100 dark:border-gray-800">
                                    <div className="flex items-center gap-3 mb-6">
                                        <Target className="w-6 h-6 text-red-700" />
                                        <h3 className="text-xl font-black uppercase tracking-widest text-gray-900 dark:text-white">Economy</h3>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                        Primary industries include fishing, agriculture, manufacturing, and tourism. Known for rich marine resources and growing commercial sectors that contribute to the local economy.
                                    </p>
                                </div>
                                <div className="bg-white dark:bg-gray-900 p-10 border border-gray-100 dark:border-gray-800">
                                    <div className="flex items-center gap-3 mb-6">
                                        <Rocket className="w-6 h-6 text-red-700" />
                                        <h3 className="text-xl font-black uppercase tracking-widest text-gray-900 dark:text-white">Tourism</h3>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                        Notable attractions include the Gilutongan Marine Sanctuary, Nalusuan Island, and mangrove forests, offering diving and eco-tourism activities.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'officials' && (
                        <div className="space-y-16">
                            {/* Municipal Officials */}
                            <div>
                                <div className="flex items-center gap-4 mb-10 border-b-2 border-gray-100 dark:border-gray-800 pb-6">
                                    <div className="w-2 h-10 bg-red-700"></div>
                                    <h2 className="text-3xl font-black uppercase tracking-tight text-gray-900 dark:text-white">
                                        Sangguniang Bayan
                                    </h2>
                                </div>
                                {loading ? (
                                    <div className="h-64 flex items-center justify-center">
                                        <div className="w-8 h-8 border-4 border-red-700 border-t-transparent animate-spin rounded-full"></div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 bg-gray-150 dark:bg-gray-800">
                                        {municipalOfficials.map((official) => (
                                            <div
                                                key={official.id}
                                                onClick={() => router.push(`/about/leaders/${official.slug}`)}
                                                className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 group cursor-pointer overflow-hidden relative shadow-sm rounded-xl"
                                            >
                                                <div className="relative aspect-square bg-gray-50 dark:bg-gray-800 overflow-hidden">
                                                    {official.imageUrl ? (
                                                        <img
                                                            src={official.imageUrl}
                                                            alt={official.name}
                                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <User className="w-10 h-10 text-gray-200" />
                                                        </div>
                                                    )}
                                                    <div className="absolute top-0 right-0 bg-red-700 text-white px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest rounded-bl">
                                                        Official
                                                    </div>
                                                </div>
                                                <div className="p-4">
                                                    <h3 className="text-sm font-black text-gray-900 dark:text-white mb-1 uppercase tracking-tight leading-none group-hover:text-red-700 transition-colors">
                                                        {official.name}
                                                    </h3>
                                                    <p className="text-red-700 dark:text-red-400 font-bold text-[9px] uppercase tracking-widest">
                                                        {official.position}
                                                    </p>
                                                </div>
                                                <div className="absolute inset-0 bg-red-700/0 group-hover:bg-red-700/5 transition-colors pointer-events-none rounded-xl"></div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Department Heads */}
                            <div>
                                <div className="flex items-center gap-4 mb-10 border-b-2 border-gray-100 dark:border-gray-800 pb-6">
                                    <div className="w-2 h-10 bg-gray-900 dark:bg-gray-100"></div>
                                    <h2 className="text-3xl font-black uppercase tracking-tight text-gray-900 dark:text-white">
                                        Executive Departments
                                    </h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 bg-gray-200 dark:bg-gray-800">
                                    {departmentHeads.map((official) => (
                                        <div
                                            key={official.id}
                                            onClick={() => router.push(`/about/leaders/${official.slug}`)}
                                            className="bg-white dark:bg-gray-900 p-8 border border-gray-100 dark:border-gray-800 flex items-center gap-6 cursor-pointer group hover:bg-gray-50 dark:hover:bg-black transition-colors"
                                        >
                                            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 flex-shrink-0 overflow-hidden">
                                                {official.imageUrl ? (
                                                    <img
                                                        src={official.imageUrl || "./public/municipal-logo.jpg"}
                                                        alt={official.name}
                                                        className="w-full h-full object-cover transition-transform group-hover:scale-110 "
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <User className="w-8 h-8 text-gray-200" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="text-md font-black text-gray-900 dark:text-white mb-1 uppercase tracking-tight leading-none group-hover:text-red-700 transition-colors">
                                                    {official.name}
                                                </h3>
                                                <p className="text-red-700 dark:text-red-400 font-bold text-[10px] uppercase tracking-widest">
                                                    {official.position}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'history' && (
                        <div className="space-y-2 bg-gray-200 dark:bg-gray-800">
                            <div className="bg-white dark:bg-gray-900 p-12 border border-gray-100 dark:border-gray-800">
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="w-2 h-10 bg-red-700"></div>
                                    <h2 className="text-4xl font-black uppercase tracking-tight text-gray-900 dark:text-white">
                                        Historical Timeline
                                    </h2>
                                </div>
                                <div className="space-y-12">
                                    <div className="relative pl-12 border-l-4 border-gray-100 dark:border-gray-800">
                                        <div className="absolute -left-[10px] top-0 w-4 h-4 bg-red-700"></div>
                                        <h3 className="text-2xl font-black text-red-700 mb-4 uppercase tracking-widest">1864</h3>
                                        <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                                            Cordova was officially established as a municipality, separated from Opon (now Lapu-Lapu City). The name "Cordova" is believed to have originated from the Spanish city of Córdoba.
                                        </p>
                                    </div>
                                    <div className="relative pl-12 border-l-4 border-gray-100 dark:border-gray-800">
                                        <div className="absolute -left-[10px] top-0 w-4 h-4 bg-gray-900 dark:bg-white"></div>
                                        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4 uppercase tracking-widest">Pre-Colonial</h3>
                                        <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                                            Before Spanish colonization, the area was inhabited by seafaring communities who relied on fishing and trading.
                                        </p>
                                    </div>
                                    <div className="relative pl-12 border-l-4 border-gray-100 dark:border-gray-800">
                                        <div className="absolute -left-[10px] top-0 w-4 h-4 bg-gray-900 dark:bg-white"></div>
                                        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4 uppercase tracking-widest">Spanish & American Eras</h3>
                                        <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                                            Developed as a fishing village and agricultural community. The post-war period saw gradual modernization while preserving traditional fishing culture.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-900 p-12 border border-gray-100 dark:border-gray-800">
                                <div className="flex items-center gap-4 mb-10">
                                    <div className="w-2 h-10 bg-gray-900 dark:bg-white"></div>
                                    <h2 className="text-4xl font-black uppercase tracking-tight text-gray-900 dark:text-white">
                                        Cultural Identity
                                    </h2>
                                </div>
                                <div className="grid md:grid-cols-2 gap-12">
                                    <div className="space-y-6">
                                        <h3 className="text-xl font-black uppercase tracking-widest text-red-700">
                                            Festivals
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="border-l-4 border-red-700 pl-4">
                                                <p className="font-black text-gray-900 dark:text-white uppercase tracking-tight">Dinagat Festival</p>
                                                <p className="text-sm text-gray-500">Annual celebration of our rich fishing heritage and marine resources.</p>
                                            </div>
                                            <div className="border-l-4 border-gray-200 pl-4">
                                                <p className="font-black text-gray-900 dark:text-white uppercase tracking-tight">Town Fiesta</p>
                                                <p className="text-sm text-gray-500">A time-honored tradition celebrating our patron saint and community unity.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <h3 className="text-xl font-black uppercase tracking-widest text-red-700">
                                            Heritage
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-gray-50 dark:bg-gray-800 p-4 border border-gray-100 dark:border-gray-700">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Technique</p>
                                                <p className="font-bold text-gray-900 dark:text-white text-xs uppercase tracking-tight">Traditional Fishing</p>
                                            </div>
                                            <div className="bg-gray-50 dark:bg-gray-800 p-4 border border-gray-100 dark:border-gray-700">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Artistry</p>
                                                <p className="font-bold text-gray-900 dark:text-white text-xs uppercase tracking-tight">Local Weaving</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>

                <Footer />
            </div>
        </PageTransition>
    );
};

export default AboutPage;
