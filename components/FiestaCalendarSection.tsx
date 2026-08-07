'use client';

import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Sparkles, X, ChevronRight, PartyPopper, Trophy, Flame, Music, Church } from 'lucide-react';

export interface FiestaEvent {
    title: string;
    time: string;
    venue: string;
    coordinators?: string;
    category?: 'Festival' | 'Religious' | 'Pageant' | 'Sports' | 'Social' | 'Ceremony';
}

export interface FiestaDay {
    id: string;
    dayOfWeek: string;
    dateStr: string;
    dayNum: number;
    monthStr: string;
    highlightTitle: string;
    isFeastDay?: boolean;
    bannerImage?: string;
    events: FiestaEvent[];
}

export const FIESTA_SCHEDULE_2026: FiestaDay[] = [
    {
        id: 'aug-07',
        dayOfWeek: 'FRIDAY',
        monthStr: 'AUG',
        dayNum: 7,
        dateStr: 'AUGUST 7, 2026',
        highlightTitle: 'Opening Salvo & Food Fest',
        events: [
            { title: 'OPENING SALVO: DIANA', time: '3:00 AM', venue: 'CORDOVA MAJOR THOROUGHFARES', coordinators: 'SB Office', category: 'Ceremony' },
            { title: 'OPENING SALVO: FOOT PROCESSION', time: '3:00 PM', venue: 'Pilipog Highway to San Roque Parish', coordinators: 'Hon. Jerome Laplen, SRP Parish Council, Mayang Estaniel, & Dr. Marza Tajantang', category: 'Religious' },
            { title: 'CORDOVA FOOD FESTIVAL 2026 (AUG 7-16)', time: '5:00 PM', venue: 'In Front of Municipal Building', coordinators: "Mayor's Office & Tourism Office", category: 'Festival' },
            { title: 'SAN ROQUE PARISH NIGHT', time: '7:00 PM', venue: 'Cordova Sports and Cultural Center', coordinators: 'San Roque Parish Council', category: 'Religious' }
        ]
    },
    {
        id: 'aug-08',
        dayOfWeek: 'SATURDAY',
        monthStr: 'AUG',
        dayNum: 8,
        dateStr: 'AUGUST 8, 2026',
        highlightTitle: 'Boat Racing & DJ Rave Party',
        events: [
            { title: 'CORDOVA FISHING BOAT RACING COMPETITION', time: '6:00 AM', venue: '10K Roses (Coastal Area)', coordinators: 'Hon. Lemuel Pogoy and Mildred Uy', category: 'Sports' },
            { title: 'RAVE PARTY WITH DISC JOCKEY', time: '8:00 PM', venue: 'Cordova Sports and Cultural Center', coordinators: "Mayor's Office", category: 'Social' }
        ]
    },
    {
        id: 'aug-09',
        dayOfWeek: 'SUNDAY',
        monthStr: 'AUG',
        dayNum: 9,
        dateStr: 'AUGUST 9, 2026',
        highlightTitle: '27th Dinagat Festival & Fireworks',
        isFeastDay: false,
        events: [
            { title: '27TH CORDOVA DINAGAT FESTIVAL 2026 (Street Dancing)', time: '2:00 PM - 5:00 PM', venue: 'Pilipog-Ibabao Coastal Road to Centennial Avenue Grounds', coordinators: 'Hon. Chito Bentazal and Tourism Office', category: 'Festival' },
            { title: '27TH CORDOVA DINAGAT FESTIVAL 2026 (Grand Ritual Showdown & Fireworks Display)', time: '5:30 PM - 8:00 PM', venue: 'Centennial Avenue Grounds', coordinators: 'Tourism Office & LGU Cordova', category: 'Festival' }
        ]
    },
    {
        id: 'aug-10',
        dayOfWeek: 'MONDAY',
        monthStr: 'AUG',
        dayNum: 10,
        dateStr: 'AUGUST 10, 2026',
        highlightTitle: "Cordova's Got Talent Season 1",
        events: [
            { title: "CORDOVA'S GOT TALENT SEASON 1", time: '7:00 PM', venue: 'Centennial Avenue Grounds', coordinators: "Hon. Jet Wahing, Mayor's Office, & Tourism Office", category: 'Pageant' }
        ]
    },
    {
        id: 'aug-11',
        dayOfWeek: 'TUESDAY',
        monthStr: 'AUG',
        dayNum: 11,
        dateStr: 'AUGUST 11, 2026',
        highlightTitle: "LGU Employees' & Lagon's Night",
        events: [
            { title: "LGU CORDOVA EMPLOYEES' NIGHT", time: '5:30 PM - 7:00 PM', venue: 'Cordova Townsquare Rooftop', coordinators: "HRMO, Mayor's Office, & Tourism Office", category: 'Social' },
            { title: "LAGON'S NIGHT AND SK & ABC NIGHT (Featuring Rowell Divina & Elias J.TV Band)", time: '7:00 PM', venue: 'Centennial Avenue Grounds', coordinators: 'Hon. Dason Paroc Lagon, Hon. Jess Plando, Hon. Francisco Ando Jr. & Hon. Nats Sitoy', category: 'Social' }
        ]
    },
    {
        id: 'aug-12',
        dayOfWeek: 'WEDNESDAY',
        monthStr: 'AUG',
        dayNum: 12,
        dateStr: 'AUGUST 12, 2026',
        highlightTitle: 'Miss Cordova Eco-Tourism 2026',
        events: [
            { title: 'MISS CORDOVA ECO-TOURISM 2026', time: '8:00 PM', venue: 'Cordova Sports & Cultural Center', coordinators: 'Hon. Liera Casquejo, Hon. Nats Sitoy, & Tourism Office', category: 'Pageant' }
        ]
    },
    {
        id: 'aug-13',
        dayOfWeek: 'THURSDAY',
        monthStr: 'AUG',
        dayNum: 13,
        dateStr: 'AUGUST 13, 2026',
        highlightTitle: 'Dyosa ng Cordova 2026',
        events: [
            { title: 'DYOSA NG CORDOVA 2026 (Celebrity Guests: Nang Adoracion & Inday Ligaya)', time: '8:00 PM', venue: 'Cordova Sports & Cultural Center', coordinators: 'Hon. Lemuel Pogoy and Tourism Office', category: 'Pageant' }
        ]
    },
    {
        id: 'aug-14',
        dayOfWeek: 'FRIDAY',
        monthStr: 'AUG',
        dayNum: 14,
        dateStr: 'AUGUST 14, 2026',
        highlightTitle: "Educators' Night",
        events: [
            { title: "EDUCATORS' NIGHT", time: '7:00 PM', venue: 'Cordova Sports & Cultural Center', coordinators: 'Hon. Remar Baguio, Dr. Danilo Manguilimotan, & Dr. Romeo Macan', category: 'Social' }
        ]
    },
    {
        id: 'aug-15',
        dayOfWeek: 'SATURDAY',
        monthStr: 'AUG',
        dayNum: 15,
        dateStr: 'AUGUST 15, 2026',
        highlightTitle: 'Foot Procession & Basketball Cup',
        events: [
            { title: 'FOOT PROCESSION', time: 'After 5:00 PM Mass', venue: 'Pilipog Highway to San Roque Parish', coordinators: 'San Roque Parish Council', category: 'Religious' },
            { title: 'MAYOR CESAR "DIDOY" SUAN INVITATIONAL BASKETBALL CUP 2026', time: '9:00 PM', venue: 'Cordova Sports & Cultural Center', coordinators: 'Sangguniang Bayan & Tourism Office', category: 'Sports' }
        ]
    },
    {
        id: 'aug-16',
        dayOfWeek: 'SUNDAY',
        monthStr: 'AUG',
        dayNum: 16,
        dateStr: 'AUGUST 16, 2026',
        highlightTitle: 'Street Party w/ Car Show',
        events: [
            { title: 'STREET PARTY W/ CAR SHOW', time: '2:00 PM', venue: 'Cordova Roro Port', coordinators: 'Vice Mayor Boyet Tago, Mr. Myles Siao, & Tourism Office', category: 'Social' }
        ]
    },
    {
        id: 'aug-17',
        dayOfWeek: 'MONDAY',
        monthStr: 'AUG',
        dayNum: 17,
        dateStr: 'AUGUST 17, 2026',
        highlightTitle: 'FEAST DAY OF SN̄R. SAN ROQUE',
        isFeastDay: true,
        events: [
            { title: 'PONTIFICAL MASS / FIESTA HIGH MASS (Archbishop Most Rev. Jose S. Palma, D.D.)', time: '6:00 PM', venue: 'San Roque Parish Church', coordinators: 'San Roque Parish Council', category: 'Religious' },
            { title: 'GRAND FIREWORKS DISPLAY', time: '7:00 PM', venue: 'Municipal Roof Deck', coordinators: "Mayor's Office & Tourism Office", category: 'Festival' },
            { title: 'CELEBRITY EXHIBITION BASKETBALL GAME', time: '8:00 PM', venue: 'Cordova Sports & Cultural Center', coordinators: "Mayor's Office & Tourism Office", category: 'Sports' }
        ]
    }
];

export const FiestaCalendarSection: React.FC = () => {
    const [selectedDay, setSelectedDay] = useState<FiestaDay | null>(null);

    return (
        <section className="py-20 px-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 transition-colors">
            <div className="maximize-width space-y-12">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-2 border-gray-100 dark:border-gray-800 pb-6">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-red-200 dark:border-red-900/40">
                            <Sparkles className="w-3.5 h-3.5" />
                            Official Municipal Celebration
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-gray-900 dark:text-white">
                            Cordova Fiesta Calendar 2026
                        </h2>
                        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-3xl font-medium leading-relaxed">
                            <span className="text-red-700 dark:text-red-400 font-bold uppercase tracking-wider">Theme:</span> "Thankful to the Almighty for His Grace and Prosperity, guided by San Roque toward Sustainable Progress and Unity."
                        </p>
                    </div>

                    <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 px-5 py-3 rounded-2xl self-start md:self-end">
                        <Calendar className="w-5 h-5 text-red-700 dark:text-red-400" />
                        <div>
                            <p className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wider">Celebration Period</p>
                            <p className="text-sm font-black text-gray-900 dark:text-white">August 7 – 17, 2026</p>
                        </div>
                    </div>
                </div>

                {/* Interactive 11-Date Calendar Grid (Tourism Hover Effect) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {FIESTA_SCHEDULE_2026.map((day) => (
                        <div
                            key={day.id}
                            onClick={() => setSelectedDay(day)}
                            className={`relative group overflow-hidden rounded-2xl aspect-square cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 border ${
                                day.isFeastDay
                                    ? 'border-amber-500 ring-2 ring-amber-400/50'
                                    : 'border-blue-900/30'
                            }`}
                        >
                            {/* Background Image (Reveals & Scales on Hover - Tourism Effect) */}
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-all duration-700 transform group-hover:scale-110 opacity-0 group-hover:opacity-100"
                                style={{
                                    backgroundImage: day.isFeastDay
                                        ? "url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop')"
                                        : "url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop')"
                                }}
                            />

                            {/* Dark Gradient Overlay on Hover */}
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-slate-950/90 to-red-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

                            {/* Default Background Layer: Dark Red / Blue (Tourism Square Card Default Style) */}
                            <div className={`absolute inset-0 transition-opacity duration-500 backdrop-blur-sm ${
                                day.isFeastDay
                                    ? 'bg-gradient-to-br from-red-800 via-amber-900 to-red-950 group-hover:opacity-0'
                                    : 'bg-red-700 dark:bg-blue-950/85 group-hover:opacity-0'
                            }`} />

                            {/* Card Content Layer */}
                            <div className="relative z-20 p-6 h-full flex flex-col justify-between text-white">
                                {/* Top Header Category Badge */}
                                <div className="flex items-center justify-between">
                                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${
                                        day.isFeastDay
                                            ? 'bg-amber-500/30 text-amber-200 border-amber-300/50'
                                            : 'bg-white/20 backdrop-blur-md text-white border-white/30'
                                    }`}>
                                        {day.dayOfWeek}
                                    </span>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-white bg-black/30 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/20">
                                        {day.events.length} {day.events.length === 1 ? 'EVENT' : 'EVENTS'}
                                    </span>
                                </div>

                                {/* DEFAULT CENTER VIEW: Calendar Date Number & Teaser */}
                                <div className="flex flex-col items-center justify-center text-center my-auto transition-all duration-500 group-hover:opacity-0 group-hover:translate-y-4">
                                    <span className="text-xs font-black tracking-widest uppercase text-white/80 mb-1">
                                        {day.monthStr} 2026
                                    </span>
                                    <h3 className="text-6xl font-black uppercase tracking-tighter text-white drop-shadow-md">
                                        {day.dayNum}
                                    </h3>
                                    <p className="text-xs font-bold text-white/90 uppercase tracking-wider mt-2 line-clamp-2 px-2">
                                        {day.highlightTitle}
                                    </p>
                                </div>

                                {/* HOVER OVERLAY VIEW: Full Detailed Events Breakdown (Tourism Style) */}
                                <div className="absolute inset-x-0 bottom-0 top-14 p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 overflow-y-auto space-y-3 z-30 scrollbar-none">
                                    <div className="border-b border-white/20 pb-2 mb-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-amber-400">
                                            {day.dateStr}
                                        </p>
                                        <h4 className="text-sm font-black uppercase text-white tracking-tight line-clamp-1">
                                            {day.highlightTitle}
                                        </h4>
                                    </div>

                                    <div className="space-y-2.5">
                                        {day.events.map((evt, idx) => (
                                            <div key={idx} className="bg-white/10 backdrop-blur-md p-2.5 rounded-xl border border-white/10 space-y-1">
                                                <h5 className="text-xs font-black uppercase text-white leading-snug line-clamp-2">
                                                    {evt.title}
                                                </h5>
                                                <div className="flex items-center gap-2 text-[10px] text-amber-300 font-bold">
                                                    <Clock className="w-3 h-3 flex-shrink-0" />
                                                    <span>{evt.time}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] text-gray-300 truncate">
                                                    <MapPin className="w-3 h-3 flex-shrink-0 text-red-400" />
                                                    <span className="truncate">{evt.venue}</span>
                                                </div>
                                                {evt.coordinators && (
                                                    <div className="flex items-center gap-2 text-[9px] text-gray-400 truncate">
                                                        <Users className="w-3 h-3 flex-shrink-0 text-blue-400" />
                                                        <span className="truncate">{evt.coordinators}</span>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Bottom Tap Action Label */}
                                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-white/80 group-hover:text-amber-400 transition-colors pt-2 border-t border-white/10">
                                    <span>{day.isFeastDay ? '🌟 FEAST DAY' : 'FIESTA 2026'}</span>
                                    <span className="flex items-center gap-1">
                                        View Details <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Event Day Detail Modal */}
            {selectedDay && (
                <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
                    <div className="bg-gradient-to-r from-red-950 via-red-900 to-red-950 text-white border border-red-800/80 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto shadow-2xl">
                        <button
                            onClick={() => setSelectedDay(null)}
                            className="absolute top-6 right-6 p-2 rounded-full bg-red-950/80 hover:bg-red-800/80 border border-red-700 text-red-200 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="space-y-2 border-b border-red-800/60 pb-4">
                            <span className="inline-block bg-red-700 text-white px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em] rounded">
                                {selectedDay.dateStr}
                            </span>
                            <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                                {selectedDay.highlightTitle}
                            </h3>
                            <p className="text-xs text-red-200 font-medium">
                                Cordova Fiesta 2026 Official Timetable & Event Roster
                            </p>
                        </div>

                        <div className="space-y-4">
                            {selectedDay.events.map((evt, index) => (
                                <div key={index} className="bg-red-950/60 border border-red-800/60 rounded-2xl p-5 space-y-3 hover:border-amber-500/60 transition-colors">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <h4 className="text-base font-black uppercase text-amber-300 tracking-tight">
                                            {evt.title}
                                        </h4>
                                        <span className="text-[10px] font-bold uppercase tracking-widest bg-red-900/90 text-amber-200 px-2.5 py-1 rounded-md border border-red-700">
                                            {evt.category || 'Event'}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-red-100 pt-2 border-t border-red-900/40">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                                            <div>
                                                <p className="text-[9px] uppercase font-bold text-red-300/80">Schedule Time</p>
                                                <p className="font-semibold text-white">{evt.time}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-amber-300 flex-shrink-0" />
                                            <div>
                                                <p className="text-[9px] uppercase font-bold text-red-300/80">Location / Venue</p>
                                                <p className="font-semibold text-white">{evt.venue}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {evt.coordinators && (
                                        <div className="flex items-start gap-2 text-xs text-red-200 pt-2 border-t border-red-900/40">
                                            <Users className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-[9px] uppercase font-bold text-red-300/80">Event Coordinators & Committee</p>
                                                <p className="font-medium text-red-100">{evt.coordinators}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="pt-4 border-t border-red-800/60 flex justify-end">
                            <button
                                onClick={() => setSelectedDay(null)}
                                className="bg-white text-red-950 hover:bg-gray-100 font-black px-8 py-3 rounded-xl text-xs uppercase tracking-widest transition-colors shadow-lg"
                            >
                                Close Details
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default FiestaCalendarSection;
