'use client';

import React from 'react';
import PageTransition from '@/components/PageTransition';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    BarChart,
    Bar,
    Cell,
    Legend
} from 'recharts';
import {
    TrendingUp,
    Coins,
    MapPin,
    Users,
    Map,
    Activity,
    Building2,
    School,
    HeartPulse,
    ShieldCheck,
    Globe,
    Compass,
    Navigation,
    Info,
    ArrowUpRight,
    Eye,
    Target
} from 'lucide-react';

import {
    incomeData,
    growthData,
    salesData,
    CustomDot,
    CustomActiveDot,
    CustomTooltip,
    CompareTooltip
} from '@/data/aboutGeneralData';

export default function GeneralInfoPage() {
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
                                    Municipal Gazette
                                </div>
                                <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">
                                    General Info
                                </h1>
                                <p className="text-xl text-white font-medium max-w-2xl">
                                    Fast, transparent, and comprehensive profile of the Municipality of Cordova, Cebu.
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-grow maximize-width px-4 py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                        {/* LEFT COLUMN: Main Sections */}
                        <div className="lg:col-span-8 space-y-20">

                            {/* Section 0: Vision & Mission */}
                            <section id="vision-mission" className="space-y-8">
                                <div className="flex items-center gap-4 border-b-2 border-gray-100 dark:border-gray-800 pb-6">
                                    <div className="w-2 h-10 bg-red-700"></div>
                                    <h2 className="text-3xl font-black uppercase tracking-tight text-gray-900 dark:text-white">
                                        Vision & Mission
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Vision Card */}
                                    <div className="bg-gradient-to-br from-red-50/50 via-white to-gray-50 dark:from-red-950/20 dark:via-gray-800/40 dark:to-gray-800/20 p-8 border border-red-100 dark:border-red-900/30 rounded-xl space-y-4 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex items-center gap-3 text-red-700 dark:text-red-400">
                                            <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
                                                <Eye className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-red-600 dark:text-red-400 block">LGU Cordova</span>
                                                <h3 className="text-xl font-black uppercase tracking-wider text-gray-900 dark:text-white">Vision</h3>
                                            </div>
                                        </div>
                                        <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed font-medium pt-2 border-t border-gray-100 dark:border-gray-700/60">
                                            Cordova - a competitive and sustainable <strong className="text-red-700 dark:text-red-400 font-bold uppercase">ECO-TOURISM GATEWAY AND GETAWAY IN THE VISAYAS</strong>, industrially and commercially attuned through a pro-active and responsive governance constituted by an empowered, culturally-rich, and God-centered citizenry by 2032.
                                        </p>
                                    </div>

                                    {/* Mission Card */}
                                    <div className="bg-gradient-to-br from-blue-50/50 via-white to-gray-50 dark:from-blue-950/20 dark:via-gray-800/40 dark:to-gray-800/20 p-8 border border-blue-100 dark:border-blue-900/30 rounded-xl space-y-4 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex items-center gap-3 text-blue-700 dark:text-blue-400">
                                            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                                                <Target className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 block">LGU Cordova</span>
                                                <h3 className="text-xl font-black uppercase tracking-wider text-gray-900 dark:text-white">Mission</h3>
                                            </div>
                                        </div>
                                        <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed font-medium pt-2 border-t border-gray-100 dark:border-gray-700/60">
                                            Paving the way to a world-class eco-tourism hub through economically-viable and socially acceptable investments and pursuits.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Section 1: General Info & Demographics */}
                            <section id="general-demographics" className="space-y-10">
                                <div className="flex items-center gap-4 border-b-2 border-gray-100 dark:border-gray-800 pb-6">
                                    <div className="w-2 h-10 bg-red-700"></div>
                                    <h2 className="text-3xl font-black uppercase tracking-tight text-gray-900 dark:text-white">
                                        General Profile & Demographics
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* General Information Card */}
                                    <div className="bg-gray-50 dark:bg-gray-800/40 p-8 border border-gray-100 dark:border-gray-800/80 rounded-xl space-y-6">
                                        <div className="flex items-center gap-3 text-red-700 dark:text-red-400">
                                            <Info className="w-6 h-6" />
                                            <h3 className="text-lg font-black uppercase tracking-wider">Quick Facts</h3>
                                        </div>
                                        <div className="space-y-4 text-sm">
                                            <div className="flex justify-between py-2 border-b border-gray-200/50 dark:border-gray-700/50">
                                                <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Name</span>
                                                <span className="font-bold text-gray-800 dark:text-white">Cordova</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b border-gray-200/50 dark:border-gray-700/50">
                                                <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Province</span>
                                                <span className="font-bold text-gray-800 dark:text-white">Cebu</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b border-gray-200/50 dark:border-gray-700/50">
                                                <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Region</span>
                                                <span className="font-bold text-gray-800 dark:text-white">Region VII (Central Visayas)</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b border-gray-200/50 dark:border-gray-700/50">
                                                <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">District</span>
                                                <span className="font-bold text-gray-800 dark:text-white">6th Congressional District</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b border-gray-200/50 dark:border-gray-700/50">
                                                <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Income Class</span>
                                                <span className="font-bold text-gray-850 dark:text-red-400 text-xs bg-red-50 dark:bg-red-950/20 px-2.5 py-0.5 rounded-full uppercase">1st Class (Reclassified 2024)</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b border-gray-200/50 dark:border-gray-700/50">
                                                <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Tagline</span>
                                                <span className="font-bold text-gray-800 dark:text-white italic">"Lambo Cordova, Asenso, Cordovanhon!"</span>
                                            </div>
                                            <div className="flex flex-col gap-1 py-2">
                                                <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Legal Basis</span>
                                                <span className="font-medium text-gray-600 dark:text-gray-400 leading-normal">
                                                    Created effective January 1, 1913, by Executive Order No. 96 signed by Gov. Gen. Newton Gilbert.
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Demographic Profile Card */}
                                    <div className="bg-gray-50 dark:bg-gray-800/40 p-8 border border-gray-100 dark:border-gray-800/80 rounded-xl space-y-6">
                                        <div className="flex items-center gap-3 text-red-700 dark:text-red-400">
                                            <Users className="w-6 h-6" />
                                            <h3 className="text-lg font-black uppercase tracking-wider">Demographic Profile</h3>
                                        </div>
                                        <div className="space-y-4 text-sm">
                                            <div className="flex justify-between py-2 border-b border-gray-200/50 dark:border-gray-700/50">
                                                <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Total Population</span>
                                                <span className="font-black text-gray-800 dark:text-white">72,915 (2024 PSA)</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b border-gray-200/50 dark:border-gray-700/50">
                                                <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Growth Rate</span>
                                                <span className="font-bold text-gray-800 dark:text-white">3.59% (2020-2024 Average)</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b border-gray-200/50 dark:border-gray-700/50">
                                                <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Households</span>
                                                <span className="font-bold text-gray-800 dark:text-white">18,023</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b border-gray-200/50 dark:border-gray-700/50">
                                                <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Avg Household Size</span>
                                                <span className="font-bold text-gray-800 dark:text-white">3.94 persons</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b border-gray-200/50 dark:border-gray-700/50">
                                                <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Population Density</span>
                                                <span className="font-bold text-gray-800 dark:text-white text-right leading-tight max-w-[200px]">
                                                    7,926 / km² (Higher than prov. avg)
                                                </span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b border-gray-200/50 dark:border-gray-700/50">
                                                <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Labor Force (15+)</span>
                                                <span className="font-bold text-gray-800 dark:text-white">49,342 (67.67% of population)</span>
                                            </div>
                                            <div className="flex justify-between py-2">
                                                <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Poverty Incidence</span>
                                                <span className="font-bold text-red-700 dark:text-red-400">23.76% (4,283 households)</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Geo-Physical & Climate Card */}
                                <div className="bg-gray-50 dark:bg-gray-800/40 p-8 border border-gray-100 dark:border-gray-800/80 rounded-xl space-y-6">
                                    <div className="flex items-center gap-3 text-red-700 dark:text-red-400">
                                        <Compass className="w-6 h-6" />
                                        <h3 className="text-lg font-black uppercase tracking-wider">Geo-Physical Characteristics</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                                        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-100 dark:border-gray-800">
                                            <span className="text-gray-400 font-bold uppercase tracking-wider text-[9px] block mb-1">Land Area</span>
                                            <span className="font-black text-gray-800 dark:text-white text-base">956.24 Hectares</span>
                                            <span className="text-xs text-gray-400 block mt-1">(9.56 km² incl. islets)</span>
                                        </div>
                                        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-100 dark:border-gray-800">
                                            <span className="text-gray-400 font-bold uppercase tracking-wider text-[9px] block mb-1">Municipal Waters</span>
                                            <span className="font-black text-gray-800 dark:text-white text-base">17,199.74 Hectares</span>
                                            <span className="text-xs text-gray-400 block mt-1">Vast marine territory</span>
                                        </div>
                                        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-100 dark:border-gray-800">
                                            <span className="text-gray-400 font-bold uppercase tracking-wider text-[9px] block mb-1">Elevation & Slope</span>
                                            <span className="font-black text-gray-800 dark:text-white text-base">33m Avg (0-3% Slope)</span>
                                            <span className="text-xs text-gray-400 block mt-1">Remarkably flat coastal terrain</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm pt-2">
                                        <div className="space-y-1">
                                            <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block">Climate (Type III classification)</span>
                                            <p className="text-gray-600 dark:text-gray-400 leading-normal">
                                                Characterized by a short dry season from February to May and no pronounced maximum rain period throughout the year.
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block">Mangrove Defense Assets</span>
                                            <p className="text-gray-600 dark:text-gray-400 leading-normal">
                                                Encompasses 287 hectares of lush mangroves that serve as the primary eco-shield and coastal defense against storms.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Section 2: Fiscal & Economic Data */}
                            <section id="fiscal-economic" className="space-y-10">
                                <div className="flex items-center gap-4 border-b-2 border-gray-100 dark:border-gray-800 pb-6">
                                    <div className="w-2 h-10 bg-red-700"></div>
                                    <h2 className="text-3xl font-black uppercase tracking-tight text-gray-900 dark:text-white">
                                        Fiscal & Economic Overview
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                                    <div className="bg-gray-50 dark:bg-gray-800/40 p-6 border border-gray-100 dark:border-gray-800/80 rounded-xl">
                                        <span className="text-gray-400 font-bold uppercase tracking-wider text-[9px] block mb-1">National Tax Allotment (NTA)</span>
                                        <span className="font-black text-gray-900 dark:text-white text-xl">₱296.87M</span>
                                        <span className="text-xs text-red-600 dark:text-red-400 font-bold block mt-2">80.4% Dependency Rate</span>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-800/40 p-6 border border-gray-100 dark:border-gray-800/80 rounded-xl">
                                        <span className="text-gray-400 font-bold uppercase tracking-wider text-[9px] block mb-1">20% Development Fund</span>
                                        <span className="font-black text-gray-900 dark:text-white text-xl">₱60.00M (2026)</span>
                                        <span className="text-xs text-green-600 dark:text-green-400 font-semibold block mt-2">₱65.5M Proposed for 2027</span>
                                    </div>
                                    <div className="bg-gray-50 dark:bg-gray-800/40 p-6 border border-gray-100 dark:border-gray-800/80 rounded-xl">
                                        <span className="text-gray-400 font-bold uppercase tracking-wider text-[9px] block mb-1">5% Local DRRM Fund (2023)</span>
                                        <span className="font-black text-gray-900 dark:text-white text-xl">₱12.88M</span>
                                        <span className="text-xs text-gray-400 block mt-2">Ready emergency response reserve</span>
                                    </div>
                                </div>

                                {/* Recharts Area/Line Graph: Annual Income Overview */}
                                <div className="bg-white dark:bg-gray-900 p-8 border border-gray-100 dark:border-gray-800/80 rounded-xl space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <h3 className="text-md font-black uppercase tracking-wider text-gray-900 dark:text-white">Annual Income Trend</h3>
                                            <p className="text-xs text-gray-400">Actual (2024-2025) and Projected/Proposed (2026-2027) revenues</p>
                                        </div>
                                        <div className="flex gap-4 text-[10px] font-bold uppercase tracking-wider">
                                            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-green-700 rounded-sm"></span>Actual</span>
                                            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-blue-700 rounded-sm"></span>Projected</span>
                                            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-red-700 rounded-sm"></span>Proposed</span>
                                        </div>
                                    </div>

                                    {/* Recharts Container styled like shadcn */}
                                    <div className="w-full h-80">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={incomeData} margin={{ top: 20, right: 10, left: 10, bottom: 0 }}>
                                                <defs>
                                                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#000000ff" stopOpacity={0.2} />
                                                        <stop offset="95%" stopColor="#000000ff" stopOpacity={0} />
                                                    </linearGradient>
                                                    <linearGradient id="strokeIncome" x1="0" y1="0" x2="1" y2="0">
                                                        <stop offset="0%" stopColor="#15803d" />
                                                        <stop offset="33.3%" stopColor="#15803d" />
                                                        <stop offset="33.3%" stopColor="#1e3a8a" />
                                                        <stop offset="66.6%" stopColor="#1e3a8a" />
                                                        <stop offset="66.6%" stopColor="#b91c1c" />
                                                        <stop offset="100%" stopColor="#b91c1c" />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#000000ff" opacity={0.2} vertical={false} />
                                                <XAxis
                                                    dataKey="year"
                                                    stroke="#000000ff"
                                                    fontSize={11}
                                                    tickLine={false}
                                                    axisLine={false}
                                                    dy={10}
                                                />
                                                <YAxis
                                                    stroke="#000000ff"
                                                    fontSize={10}
                                                    tickLine={false}
                                                    axisLine={false}
                                                    tickFormatter={(value) => `₱${(value / 1000000).toFixed(0)}M`}
                                                    dx={-10}
                                                />
                                                <Tooltip content={<CustomTooltip />} />
                                                <Area
                                                    type="monotone"
                                                    dataKey="amount"
                                                    stroke="url(#strokeIncome)"
                                                    strokeWidth={3}
                                                    fillOpacity={1}
                                                    fill="url(#colorIncome)"
                                                    dot={<CustomDot />}
                                                    activeDot={<CustomActiveDot />}
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Economic Growth Recharts Bar Graphs */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white dark:bg-gray-900 p-6 border border-gray-100 dark:border-gray-800 rounded-xl space-y-4">
                                        <div className="space-y-1">
                                            <h4 className="text-xs font-black uppercase tracking-wider text-gray-500">Active Business Establishments</h4>
                                            <p className="text-2xl font-black text-gray-900 dark:text-white">1,468 <span className="text-xs text-green-500 font-bold uppercase tracking-wider ml-1">+64% growth</span></p>
                                        </div>
                                        <div className="w-full h-48">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                                                    <XAxis dataKey="name" hide />
                                                    <YAxis stroke="#9ca3af" fontSize={9} tickLine={false} axisLine={false} />
                                                    <Tooltip content={<CompareTooltip />} />
                                                    <Bar dataKey="2023" fill="#9ca3af" radius={[4, 4, 0, 0]} barSize={40} />
                                                    <Bar dataKey="2025" fill="#1e3a8a" radius={[4, 4, 0, 0]} barSize={40} />
                                                    <Legend wrapperStyle={{ fontSize: 10, paddingTop: 10 }} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    <div className="bg-white dark:bg-gray-900 p-6 border border-gray-100 dark:border-gray-800 rounded-xl space-y-4">
                                        <div className="space-y-1">
                                            <h4 className="text-xs font-black uppercase tracking-wider text-gray-500">Gross Sales of Registered Firms</h4>
                                            <p className="text-2xl font-black text-gray-900 dark:text-white">₱3.97 Billion <span className="text-xs text-green-500 font-bold uppercase tracking-wider ml-1">+57.6% growth</span></p>
                                        </div>
                                        <div className="w-full h-48">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                                                    <XAxis dataKey="name" hide />
                                                    <YAxis stroke="#9ca3af" fontSize={9} tickLine={false} axisLine={false} />
                                                    <Tooltip content={<CompareTooltip />} />
                                                    <Bar dataKey="2023" fill="#9ca3af" radius={[4, 4, 0, 0]} barSize={40} />
                                                    <Bar dataKey="2024" fill="#1e3a8a" radius={[4, 4, 0, 0]} barSize={40} />
                                                    <Legend wrapperStyle={{ fontSize: 10, paddingTop: 10 }} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>

                                {/* Economic Indicators Metric Matrix */}
                                <div className="bg-gray-50 dark:bg-gray-800/40 p-8 border border-gray-100 dark:border-gray-800/80 rounded-xl space-y-6">
                                    <h4 className="text-sm font-black uppercase tracking-wider text-gray-900 dark:text-white">Other Core Economic Indicators (2024)</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                                        <div className="bg-white dark:bg-gray-900 p-4 border border-gray-100 dark:border-gray-800">
                                            <span className="text-gray-400 font-bold uppercase tracking-wider text-[9px] block mb-1">New Business Capitalization</span>
                                            <span className="font-black text-gray-800 dark:text-white">₱47,827,600.00</span>
                                        </div>
                                        <div className="bg-white dark:bg-gray-900 p-4 border border-gray-100 dark:border-gray-800">
                                            <span className="text-gray-400 font-bold uppercase tracking-wider text-[9px] block mb-1">Business Tax Collected</span>
                                            <span className="font-black text-gray-850 dark:text-green-500">₱15,736,074.07</span>
                                        </div>
                                        <div className="bg-white dark:bg-gray-900 p-4 border border-gray-100 dark:border-gray-800">
                                            <span className="text-gray-400 font-bold uppercase tracking-wider text-[9px] block mb-1">Real Property Tax Collected</span>
                                            <span className="font-black text-gray-850 dark:text-green-500">₱73,458,508.35</span>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Section 3: Infrastructures */}
                            <section id="infrastructures" className="space-y-10">
                                <div className="flex items-center gap-4 border-b-2 border-gray-100 dark:border-gray-800 pb-6">
                                    <div className="w-2 h-10 bg-red-700"></div>
                                    <h2 className="text-3xl font-black uppercase tracking-tight text-gray-900 dark:text-white">
                                        Key Infrastructure & Utilities
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                                    {/* Utilities & Connectivity Card */}
                                    <div className="bg-white dark:bg-gray-900 p-8 border border-gray-100 dark:border-gray-800 rounded-xl space-y-6">
                                        <div className="flex items-center gap-3 text-red-700 dark:text-red-400">
                                            <Globe className="w-6 h-6" />
                                            <h3 className="text-md font-black uppercase tracking-wider">Public Utilities & Links</h3>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="border-l-4 border-red-700 pl-4 space-y-1">
                                                <p className="font-black uppercase text-xs tracking-wide">CCLEX Expressway Link</p>
                                                <p className="text-gray-500 leading-normal text-xs">8.25-km strategic link bridge connecting Cordova directly to Cebu City.</p>
                                            </div>
                                            <div className="border-l-4 border-gray-300 dark:border-gray-700 pl-4 space-y-1">
                                                <p className="font-black uppercase text-xs tracking-wide">Cordova RORO Port</p>
                                                <p className="text-gray-500 leading-normal text-xs">Maritime terminal in Camolinas serving direct routes to Olango Island and Bohol.</p>
                                            </div>
                                            <div className="border-l-4 border-gray-300 dark:border-gray-700 pl-4 space-y-1">
                                                <p className="font-black uppercase text-xs tracking-wide">Grid Power Access</p>
                                                <p className="text-gray-500 leading-normal text-xs">100% of barangays have electrical access, with 87.43% of households connected.</p>
                                            </div>
                                            <div className="border-l-4 border-gray-300 dark:border-gray-700 pl-4 space-y-1">
                                                <p className="font-black uppercase text-xs tracking-wide">MCWD Clean Water</p>
                                                <p className="text-gray-500 leading-normal text-xs">Approximately 20% of households are currently serviced by the Metropolitan Cebu Water District.</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Social Institutions Card */}
                                    <div className="bg-white dark:bg-gray-900 p-8 border border-gray-100 dark:border-gray-800 rounded-xl space-y-6">
                                        <div className="flex items-center gap-3 text-red-700 dark:text-red-400">
                                            <Building2 className="w-6 h-6" />
                                            <h3 className="text-md font-black uppercase tracking-wider">Social Services & Institutions</h3>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex items-start gap-4">
                                                <div className="p-2 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 rounded-lg">
                                                    <School className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-black uppercase text-xs">Education Profile</p>
                                                    <p className="text-gray-500 text-xs mt-1 leading-normal">27 total schools (16 public, 11 private) and the LGU-operated Cordova Public College (CPC).</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-4">
                                                <div className="p-2 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 rounded-lg">
                                                    <HeartPulse className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-black uppercase text-xs">Health Infrastructure</p>
                                                    <p className="text-gray-500 text-xs mt-1 leading-normal">1 Rural Health Unit (RHU), 13 Barangay Health Stations, 1 birthing center, and the newly built 8-bed Cordova Public Hospital in Pilipog.</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-4">
                                                <div className="p-2 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 rounded-lg">
                                                    <ShieldCheck className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-black uppercase text-xs">Protective Services</p>
                                                    <p className="text-gray-500 text-xs mt-1 leading-normal">1 Police Station and 1 Bureau of Fire Protection (BFP) station located in Poblacion.</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-4">
                                                <div className="p-2 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 rounded-lg">
                                                    <Activity className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-black uppercase text-xs">National Agencies</p>
                                                    <p className="text-gray-500 text-xs mt-1 leading-normal">Six key national offices: PNP, BFP, COMELEC, BIR, DILG, and Philippine Post Office.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Economic Infrastructure Metrics */}
                                <div className="bg-gray-50 dark:bg-gray-800/40 p-8 border border-gray-100 dark:border-gray-800/80 rounded-xl space-y-6 text-sm">
                                    <h4 className="text-sm font-black uppercase tracking-wider text-gray-900 dark:text-white">Commercial Infrastructure Matrix</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                                        <div className="bg-white dark:bg-gray-900 p-4 border border-gray-100 dark:border-gray-800">
                                            <span className="font-black text-gray-900 dark:text-white text-xl">1,468</span>
                                            <span className="text-gray-400 font-bold uppercase tracking-wider text-[8px] block mt-1">Active Firms</span>
                                        </div>
                                        <div className="bg-white dark:bg-gray-900 p-4 border border-gray-100 dark:border-gray-800">
                                            <span className="font-black text-gray-900 dark:text-white text-xl">10+</span>
                                            <span className="text-gray-400 font-bold uppercase tracking-wider text-[8px] block mt-1">Resorts / Hotels</span>
                                        </div>
                                        <div className="bg-white dark:bg-gray-900 p-4 border border-gray-100 dark:border-gray-800">
                                            <span className="font-black text-gray-900 dark:text-white text-xl">12 - 22</span>
                                            <span className="text-gray-400 font-bold uppercase tracking-wider text-[8px] block mt-1">Subdivisions</span>
                                        </div>
                                        <div className="bg-white dark:bg-gray-900 p-4 border border-gray-100 dark:border-gray-800">
                                            <span className="font-black text-gray-900 dark:text-white text-xl">25+</span>
                                            <span className="text-gray-400 font-bold uppercase tracking-wider text-[8px] block mt-1">Cellular Sites</span>
                                        </div>
                                    </div>
                                    <div className="bg-white dark:bg-gray-900 p-6 border border-gray-100 dark:border-gray-800 space-y-2">
                                        <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px] block">Major Commercial Players</span>
                                        <p className="font-bold text-gray-850 text-xs">
                                            Wilcon Depot, Gaisano Grand Cordova, McDonald's, Watsons, Solea Mactan Resort, Mr. DIY, and more.
                                        </p>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* RIGHT COLUMN: Sidebar Navigation Links & Barangay List */}
                        <div className="lg:col-span-4 space-y-12">

                            {/* Navigation Sidebar */}
                            <div className="bg-gray-50 dark:bg-gray-800/40 p-8 border border-gray-100 dark:border-gray-800/80 rounded-xl space-y-6">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-red-700 dark:text-red-400">On this page</h3>
                                <div className="flex flex-col space-y-3 font-bold text-xs uppercase tracking-wider">
                                    <a href="#vision-mission" className="text-gray-700 dark:text-gray-300 hover:text-red-700 flex items-center justify-between group">
                                        Vision & Mission
                                        <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </a>
                                    <a href="#general-demographics" className="text-gray-700 dark:text-gray-300 hover:text-red-700 flex items-center justify-between group">
                                        General & Demographics
                                        <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </a>
                                    <a href="#fiscal-economic" className="text-gray-700 dark:text-gray-300 hover:text-red-700 flex items-center justify-between group">
                                        Fiscal & Economic Data
                                        <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </a>
                                    <a href="#infrastructures" className="text-gray-700 dark:text-gray-300 hover:text-red-700 flex items-center justify-between group">
                                        Key Infrastructure
                                        <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </a>
                                </div>
                            </div>

                            {/* Political Subdivisions: Barangay Directory Lists */}
                            <div className="bg-gray-50 dark:bg-gray-800/40 p-8 border border-gray-100 dark:border-gray-800/80 rounded-xl space-y-6">
                                <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                                    <Map className="w-5 h-5" />
                                    <h3 className="text-xs font-black uppercase tracking-[0.2em]">13 Barangays</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-xs font-bold uppercase tracking-tight text-gray-700 dark:text-gray-300">
                                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-red-700 rounded-full"></span>Alegria</span>
                                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-red-700 rounded-full"></span>Bangbang</span>
                                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-red-700 rounded-full"></span>Buagsong</span>
                                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-red-700 rounded-full"></span>Catarman</span>
                                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-red-700 rounded-full"></span>Cogon (Interior)</span>
                                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-red-700 rounded-full"></span>Dapitan</span>
                                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-red-700 rounded-full"></span>Day-as</span>
                                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-red-700 rounded-full"></span>Gabi</span>
                                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-red-700 rounded-full"></span>Gilutongan (Island)</span>
                                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-red-700 rounded-full"></span>Ibabao (Largest)</span>
                                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-red-700 rounded-full"></span>Pilipog</span>
                                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-red-700 rounded-full"></span>Poblacion</span>
                                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-red-700 rounded-full"></span>San Miguel</span>
                                </div>
                                <div className="border-t border-gray-250/50 dark:border-gray-700/50 pt-4 space-y-2 text-xs">
                                    <span className="text-gray-400 font-bold uppercase tracking-wider text-[9px] block">Offshore Islets</span>
                                    <p className="font-semibold text-gray-800 dark:text-gray-300 leading-normal">
                                        Nalusuan, Shell, Tongo, Lava, and Luking Island.
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        </PageTransition>
    );
}
