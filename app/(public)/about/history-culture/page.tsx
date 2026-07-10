'use client';

import React from 'react';
import PageTransition from '@/components/PageTransition';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
    History,
    Palette,
    Ship,
    Gem,
    MapPin,
    Compass,
    Layers,
    TrendingUp,
    Building,
    Store,
    Milestone
} from 'lucide-react';

const timelineEvents = [
    {
        year: 'Pre-Colonial',
        title: 'Day-as Settlements',
        description: 'Originally comprised the barrios of Gabi, Day-as, and Pilipul (now Pilipog) on Mactan Island. Known as "Day-as" (an acronym referring to settlements), its traditional fishing grounds covered Mactan\'s entire southern waters.',
        icon: 'MapPin'
    },
    {
        year: '1864',
        title: 'San Roque Parish Church',
        description: 'Constructed from old brick stones in the Poblacion, establishing the town\'s oldest physical landmark and religious heritage sanctuary.',
        icon: 'Building'
    },
    {
        year: '1883',
        title: 'The Independence Manifesto',
        description: 'Day-as residents issued a manifesto to Spanish authorities seeking separation from Opon, sending emissaries directly to Spain to lobby for independence.',
        icon: 'Milestone'
    },
    {
        year: '1884',
        title: 'First Capitan Appointed',
        description: 'The separation was granted. Benedicto Wahing was appointed as Cordova\'s very first Capitan (Mayor) to run the new local government.',
        icon: 'Palette'
    },
    {
        year: 'Spanish Era',
        title: 'Freedom Plaza Heroism',
        description: 'Pablo Bioncog ceremonially tore his tax certificate (cedula) and was executed alongside Bernardo Nuñez by Spanish forces, commemorated at Cordova Freedom Plaza.',
        icon: 'History'
    },
    {
        year: 'Post-Republic',
        title: 'American Era Transition',
        description: 'During the transition of sovereignty from Spain to the United States, Cordova temporarily lost its municipal status and was re-annexed to Opon.',
        icon: 'History'
    },
    {
        year: '1902 - 1903',
        title: 'The Independence Drive',
        description: 'Martin Jumao-as (1902) and Bernardo Nuñez (1903) led delegations to the provincial assembly, driving the petition to restore Cordova\'s independence.',
        icon: 'Ship'
    },
    {
        year: 'Dec 17, 1912',
        title: 'Executive Order No. 96',
        description: 'Signed by Governor-General Newton Gilbert, officially creating the Municipality of Cordova (effective Jan 1, 1913). Bernardo Nuñez was elected first President.',
        icon: 'Milestone'
    },
    {
        year: '1946',
        title: 'Old Municipal Hall',
        description: 'Constructed to serve as the post-war seat of municipal government, later preserved and transformed into the Cordova Public Museum.',
        icon: 'Building'
    },
    {
        year: '1999',
        title: 'Dinagat Festival Inception',
        description: 'Established the annual Dinagat Festival, showcasing Cordova\'s rich maritime fishing culture and traditional heritage.',
        icon: 'Palette'
    },
    {
        year: '2024 & Beyond',
        title: 'Gateway to Visayas',
        description: 'Cordova overcomes rocky soil and small land mass to become a vital economic gateway and officially classified first-class municipality.',
        icon: 'TrendingUp'
    }
];

const getIcon = (iconName: string) => {
    switch (iconName) {
        case 'MapPin': return <MapPin className="w-5 h-5" />;
        case 'Building': return <Building className="w-5 h-5" />;
        case 'Milestone': return <Milestone className="w-5 h-5" />;
        case 'Palette': return <Palette className="w-5 h-5" />;
        case 'History': return <History className="w-5 h-5" />;
        case 'Ship': return <Ship className="w-5 h-5" />;
        case 'TrendingUp': return <TrendingUp className="w-5 h-5" />;
        default: return <History className="w-5 h-5" />;
    }
};

export default function HistoryCulturePage() {
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
                                    History & Heritage
                                </div>
                                <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">
                                    History & Culture
                                </h1>
                                <p className="text-xl text-white font-medium max-w-2xl">
                                    Explore Cordova's journey from a historic fishing village to a vibrant, culturally rich coastal municipality.
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-grow maximize-width px-4 py-16 space-y-24">

                    {/* SECTION 1: Historical Timeline */}
                    <section className="space-y-16">
                        <div className="flex items-center gap-4 border-b-2 border-gray-100 dark:border-gray-800 pb-6">
                            <div className="w-2 h-10 bg-red-700"></div>
                            <h2 className="text-3xl font-black uppercase tracking-tight text-gray-900 dark:text-white">
                                Historical Timeline
                            </h2>
                        </div>

                        <div className="space-y-12 relative">
                            {/* Central track line */}
                            <div className="absolute left-6 md:left-1/2 top-2 bottom-2 w-0.5 bg-red-700/20 -translate-x-1/2 z-0"></div>

                            {timelineEvents.map((event, idx) => {
                                const isLeft = idx % 2 === 0;
                                return (
                                    <div key={idx} className={`flex flex-col md:flex-row items-start md:items-center justify-between w-full relative z-10 ${isLeft ? 'md:flex-row-reverse' : ''}`}>
                                        
                                        {/* Visual marker dot */}
                                        <div className="absolute left-6 md:left-1/2 w-10 h-10 rounded-full bg-white dark:bg-gray-900 border-4 border-red-700 -translate-x-1/2 flex items-center justify-center text-red-700 dark:text-red-400 shadow-md">
                                            {getIcon(event.icon)}
                                        </div>

                                        {/* Content Card */}
                                        <div className="w-[calc(100%-3rem)] md:w-[44%] ml-12 md:ml-0 bg-gray-50 dark:bg-gray-800/40 p-6 border border-gray-150/60 dark:border-gray-800/80 rounded-xl hover:-translate-y-1 hover:shadow-lg hover:border-red-750 dark:hover:border-red-750 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 group">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-red-700 dark:text-red-400 block mb-1">
                                                {event.year}
                                            </span>
                                            <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase mb-2 group-hover:text-red-700 transition-colors">
                                                {event.title}
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                                {event.description}
                                            </p>
                                        </div>

                                        {/* Empty placeholder space to balance the grid on desktop */}
                                        <div className="hidden md:block w-[44%]"></div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* SECTION 2: Cultural Identity & Tourism */}
                    <section className="space-y-12">
                        <div className="flex items-center gap-4 border-b-2 border-gray-100 dark:border-gray-800 pb-6">
                            <div className="w-2 h-10 bg-red-700"></div>
                            <h2 className="text-3xl font-black uppercase tracking-tight text-gray-900 dark:text-white">
                                Culture & Tourism (Gazette Profile)
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                            {/* Cultural Highlights Card */}
                            <div className="bg-gray-50 dark:bg-gray-800/40 p-8 border border-gray-100 dark:border-gray-800/80 rounded-xl space-y-6">
                                <div className="flex items-center gap-3 text-red-700 dark:text-red-400">
                                    <Palette className="w-6 h-6" />
                                    <h3 className="text-lg font-black uppercase tracking-wider">Identity & Values</h3>
                                </div>
                                <div className="space-y-4 text-sm">
                                    <div className="flex justify-between py-2 border-b border-gray-250/30 dark:border-gray-700/50">
                                        <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Primary Dialect</span>
                                        <span className="font-bold text-gray-800 dark:text-white">Cebuano-Visayan</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-gray-250/30 dark:border-gray-700/50">
                                        <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Religion</span>
                                        <span className="font-bold text-gray-800 dark:text-white">95% Roman Catholic</span>
                                    </div>
                                    <div className="flex flex-col gap-1 py-2">
                                        <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block">Major Festival</span>
                                        <span className="font-black text-red-700 dark:text-red-400 uppercase tracking-tight">Cordova Dinagat Festival</span>
                                        <p className="text-gray-600 dark:text-gray-400 leading-normal mt-1">
                                            Established in 1999 to celebrate and preserve the town's unique fishing culture, highlighting the local waters' rich bounty.
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 pt-2">
                                        <div className="bg-white dark:bg-gray-900 p-4 border border-gray-100 dark:border-gray-700">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Weaving Heritage</p>
                                            <p className="font-bold text-gray-900 dark:text-white text-xs uppercase">Local Basketry</p>
                                        </div>
                                        <div className="bg-white dark:bg-gray-900 p-4 border border-gray-100 dark:border-gray-700">
                                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Traditional Art</p>
                                            <p className="font-bold text-gray-900 dark:text-white text-xs uppercase">Artisanal Crafting</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tourism Attractions Card */}
                            <div className="bg-gray-50 dark:bg-gray-800/40 p-8 border border-gray-100 dark:border-gray-800/80 rounded-xl space-y-6">
                                <div className="flex items-center gap-3 text-red-700 dark:text-red-400">
                                    <Compass className="w-6 h-6" />
                                    <h3 className="text-lg font-black uppercase tracking-wider">Tourism Hotspots</h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="border-l-4 border-red-700 pl-4 space-y-1">
                                        <p className="font-black uppercase text-xs tracking-wide">Marine Sanctuaries</p>
                                        <p className="text-gray-500 text-xs leading-normal">Gilutongan and Nalusuan islands represent major eco-tourism zones with vibrant diving, snorkeling, and marine protection programs.</p>
                                    </div>
                                    <div className="border-l-4 border-gray-200 dark:border-gray-800 pl-4 space-y-1">
                                        <p className="font-black uppercase text-xs tracking-wide">10,000 Roses Cafe</p>
                                        <p className="text-gray-500 text-xs leading-normal">A highly popular modern tourist attraction featuring thousands of glowing led roses adjacent to the CCLEX link.</p>
                                    </div>
                                    <div className="border-l-4 border-gray-200 dark:border-gray-800 pl-4 space-y-1">
                                        <p className="font-black uppercase text-xs tracking-wide">Floating Restaurants</p>
                                        <p className="text-gray-500 text-xs leading-normal">Specialty seaside and floating restaurants in Day-as offering authentic fresh seafood experiences.</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </section>

                    {/* SECTION 3: Major Economic Activities */}
                    <section className="space-y-12">
                        <div className="flex items-center gap-4 border-b-2 border-gray-100 dark:border-gray-800 pb-6">
                            <div className="w-2 h-10 bg-red-700"></div>
                            <h2 className="text-3xl font-black uppercase tracking-tight text-gray-900 dark:text-white">
                                Major Economic Activities
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                            <div className="bg-white dark:bg-gray-900 p-8 border border-gray-100 dark:border-gray-850 rounded-xl space-y-4 shadow-sm hover:shadow transition-all group">
                                <div className="w-12 h-12 rounded-lg bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 flex items-center justify-center">
                                    <Ship className="w-6 h-6" />
                                </div>
                                <h3 className="font-black uppercase text-sm group-hover:text-red-700 transition-colors">Primary Fisheries Sector</h3>
                                <p className="text-gray-500 leading-normal text-xs">
                                    Traditional core livelihood involving 10% of Cordova's population. Acclaimed as Cebu's "seafood basket" for specialty delicacies like *bakasi* (eel) and fresh danggit.
                                </p>
                            </div>

                            <div className="bg-white dark:bg-gray-900 p-8 border border-gray-100 dark:border-gray-850 rounded-xl space-y-4 shadow-sm hover:shadow transition-all group">
                                <div className="w-12 h-12 rounded-lg bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 flex items-center justify-center">
                                    <Compass className="w-6 h-6" />
                                </div>
                                <h3 className="font-black uppercase text-sm group-hover:text-red-700 transition-colors">Eco-Tourism Gateway</h3>
                                <p className="text-gray-500 leading-normal text-xs">
                                    Branded as the "Eco-tourism Gateway in the Visayas," anchored by marine conservation parks, island hopping, and waterfront specialty dining.
                                </p>
                            </div>

                            <div className="bg-white dark:bg-gray-900 p-8 border border-gray-100 dark:border-gray-850 rounded-xl space-y-4 shadow-sm hover:shadow transition-all group">
                                <div className="w-12 h-12 rounded-lg bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 flex items-center justify-center">
                                    <Building className="w-6 h-6" />
                                </div>
                                <h3 className="font-black uppercase text-sm group-hover:text-red-700 transition-colors">Real Estate & Commerce</h3>
                                <p className="text-gray-500 leading-normal text-xs">
                                    Rapidly transforming into a prime residential and commercial hub for Metro Cebu. Supported by key retail zones like Cordova Town Square.
                                </p>
                            </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-800/40 p-8 border border-gray-100 dark:border-gray-800/80 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 font-black uppercase text-xs text-gray-900 dark:text-white">
                                    <Store className="w-4 h-4 text-red-700 dark:text-red-400" />
                                    Commerce & Trade Expansion
                                </div>
                                <p className="text-gray-500 leading-normal text-xs">
                                    Cordova is experiencing rapid commercial development, anchored by a three-story public market and major national retailers, capitalizing on the CCLEX expressway traffic.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 font-black uppercase text-xs text-gray-900 dark:text-white">
                                    <Layers className="w-4 h-4 text-red-700 dark:text-red-400" />
                                    Light Industry & IT Parks
                                </div>
                                <p className="text-gray-500 leading-normal text-xs">
                                    The local administration is aggressively preparing zones to accommodate non-pollutive light industries, Information Technology (IT) parks, and high-growth BPO operations.
                                </p>
                            </div>
                        </div>
                    </section>

                </main>

                <Footer />
            </div>
        </PageTransition>
    );
}
