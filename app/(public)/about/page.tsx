'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageTransition from '@/components/PageTransition';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Target, Rocket, Mail, Phone, MapPin, Users, History, Info, User } from 'lucide-react';
import { officialsApi, Official } from '@/lib/officialsApi';
import { useQuery } from '@tanstack/react-query';

const AboutPage = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'about' | 'officials' | 'history'>('about');

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
    const mayor = municipalOfficials.find(o => o.position.toLowerCase().includes('vice-mayor') === false && o.position.toLowerCase().includes('mayor'));
    const viceMayor = municipalOfficials.find(o => o.position.toLowerCase().includes('vice-mayor'));
    const secretary = municipalOfficials.find(o => o.position.toLowerCase().includes('secretary'));
    const abcPresident = municipalOfficials.find(o => o.position.toLowerCase().includes('abc'));
    const skfPresident = municipalOfficials.find(o => o.position.toLowerCase().includes('skf') || o.position.toLowerCase().includes('sk president') || o.position.toLowerCase().includes('federation president'));
    const councilors = municipalOfficials.filter(o =>
        o.id !== mayor?.id &&
        o.id !== viceMayor?.id &&
        o.id !== secretary?.id &&
        o.id !== abcPresident?.id &&
        o.id !== skfPresident?.id
    );

    return (
        <PageTransition>
            <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors flex flex-col">
                <Navbar activePage="About" />

                <header className="relative overflow-hidden bg-red-800 text-white pt-24 pb-16 border-b-8 border-red-700">
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
                        style={{ backgroundImage: "url('/bg-cordova.jpg')", opacity: 0.25 }}
                    />
                    <div className="relative maximize-width px-4 z-10">
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
                                            <div className="bg-red-800 text-white font-black uppercase tracking-[0.2em] px-8 py-3 rounded-full text-xs shadow-md border-2 border-red-700 hover:scale-105 transition-transform duration-300">
                                                People of the Municipality of Cordova
                                            </div>

                                            {/* Connector Line 1-2 */}
                                            <div className="w-0.5 h-8 bg-red-700/40"></div>

                                            {/* Level 2: Mayor & Vice Mayor */}
                                            <div className="flex items-center justify-center gap-24 relative w-full mb-8">
                                                {/* Left-Right connecting line between Mayor and Vice Mayor */}
                                                <div className="absolute top-1/2 left-[calc(25%+120px)] right-[calc(25%+120px)] h-0.5 bg-red-700/20 -translate-y-1/2 z-0 hidden lg:block"></div>

                                                {/* Municipal Mayor */}
                                                {mayor && (
                                                    <div
                                                        onClick={() => router.push(`/about/leaders/${mayor.slug}`)}
                                                        className="relative z-10 bg-white dark:bg-gray-900 border-2 border-red-700 hover:border-red-600 rounded-xl p-4 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 w-72 cursor-pointer flex flex-col items-center group"
                                                    >
                                                        <div className="w-20 h-20 rounded-full border-4 border-red-700 overflow-hidden mb-3 -mt-10 bg-white">
                                                            {mayor.imageUrl ? (
                                                                <img src={mayor.imageUrl} alt={mayor.name} className="w-full h-full object-cover object-top" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-gray-300"><User className="w-8 h-8" /></div>
                                                            )}
                                                        </div>
                                                        <span className="text-[9px] font-black uppercase tracking-widest text-red-700 dark:text-red-400 mb-1">
                                                            {mayor.position}
                                                        </span>
                                                        <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase text-center group-hover:text-red-700 transition-colors">
                                                            {mayor.name}
                                                        </h3>
                                                    </div>
                                                )}

                                                {/* Municipal Vice Mayor */}
                                                {viceMayor && (
                                                    <div
                                                        onClick={() => router.push(`/about/leaders/${viceMayor.slug}`)}
                                                        className="relative z-10 bg-white dark:bg-gray-900 border-2 border-blue-900 hover:border-blue-800 rounded-xl p-4 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 w-72 cursor-pointer flex flex-col items-center group"
                                                    >
                                                        <div className="w-20 h-20 rounded-full border-4 border-blue-900 overflow-hidden mb-3 -mt-10 bg-white">
                                                            {viceMayor.imageUrl ? (
                                                                <img src={viceMayor.imageUrl} alt={viceMayor.name} className="w-full h-full object-cover object-top" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-gray-300"><User className="w-8 h-8" /></div>
                                                            )}
                                                        </div>
                                                        <span className="text-[9px] font-black uppercase tracking-widest text-blue-900 dark:text-blue-400 mb-1">
                                                            {viceMayor.position}
                                                        </span>
                                                        <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase text-center group-hover:text-blue-900 transition-colors">
                                                            {viceMayor.name}
                                                        </h3>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Connector Line 2-3 */}
                                            <div className="w-0.5 h-10 bg-red-700/40"></div>

                                            {/* Legislative Sangguniang Bayan Branch Title */}
                                            <div className="bg-gray-900 text-white font-black uppercase tracking-[0.2em] px-6 py-2 rounded text-[10px] mb-4">
                                                Sangguniang Bayan (Legislative Council)
                                            </div>

                                            {/* Horizontal bar for councilors */}
                                            <div className="w-[80%] h-0.5 bg-red-700/40 relative mb-8"></div>

                                            {/* Sangguniang Bayan Members Grid */}
                                            <div className="grid grid-cols-5 gap-6 max-w-6xl w-full px-6 relative">
                                                {councilors.map((c) => (
                                                    <div
                                                        key={c.id}
                                                        onClick={() => router.push(`/about/leaders/${c.slug}`)}
                                                        className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-red-700 rounded-xl p-3 shadow hover:shadow-md hover:scale-105 transition-all duration-300 cursor-pointer flex flex-col items-center group animate-fade-in"
                                                    >
                                                        {/* Top vertical connector hook */}
                                                        <div className="absolute -top-6 left-1/2 w-0.5 h-6 bg-red-700/40 -translate-x-1/2"></div>

                                                        <div className="w-16 h-16 rounded-full border-2 border-red-700 overflow-hidden mb-2 bg-white">
                                                            {c.imageUrl ? (
                                                                <img src={c.imageUrl} alt={c.name} className="w-full h-full object-cover object-top" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-gray-300"><User className="w-6 h-6" /></div>
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
                                                        <div className="absolute -top-8 left-1/2 w-0.5 h-8 bg-red-700/40 -translate-x-1/2"></div>

                                                        <div className="w-16 h-16 rounded-full border-2 border-gray-900 overflow-hidden mb-2 bg-white">
                                                            {secretary.imageUrl ? (
                                                                <img src={secretary.imageUrl} alt={secretary.name} className="w-full h-full object-cover object-top" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-gray-300"><User className="w-6 h-6" /></div>
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
                            </div>

                            {/* Department Heads */}
                            <div>
                                <div className="flex items-center gap-4 mb-10 border-b-2 border-gray-100 dark:border-gray-800 pb-6">
                                    <div className="w-2 h-10 bg-gray-900 dark:bg-gray-100"></div>
                                    <h2 className="text-3xl font-black uppercase tracking-tight text-gray-900 dark:text-white">
                                        Executive Departments
                                    </h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {departmentHeads.map((official) => (
                                        <div
                                            key={official.id}
                                            onClick={() => router.push(`/about/leaders/${official.slug}`)}
                                            className="bg-white dark:bg-gray-900 p-8 border border-gray-100 dark:border-gray-800 flex items-center gap-6 cursor-pointer group hover:bg-blue-300/20 dark:hover:bg-gray-800 transition-colors"
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
                                                <h3 className="text-md font-black text-blue-400 dark:text-white mb-1 uppercase tracking-tight leading-none group-hover:text-red-500 transition-colors">
                                                    {official.name}
                                                </h3>
                                                <p className="text-blue-600 dark:text-blue-400 font-bold text-[10px] uppercase tracking-widest">
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
