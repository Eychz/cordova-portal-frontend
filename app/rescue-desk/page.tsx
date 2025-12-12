'use client';

import React, { useState, useRef } from 'react';
import PageTransition from '../../components/PageTransition';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import Link from 'next/link';
import { Cross, LampDesk, ShieldCheck, Flame, Hospital, Ambulance, Heart, Anchor, Siren, Phone, Search, MapPin, Users, Package, Landmark, LandPlot, Waves, IdCard, FishSymbol, Handshake, Accessibility, UserStar } from 'lucide-react';
import { button, div } from 'framer-motion/client';

const RescueDeskPage: React.FC = () => {
    const [selectedLostItem, setSelectedLostItem] = useState<number>(0);
    const emergencyHotlinesRef = useRef<HTMLDivElement>(null);
    const lostAndFoundRef = useRef<HTMLDivElement>(null);

    const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
        ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const emergencyContacts = [
        {
            id: 1,
            name: 'Office of the Municipal Mayor',
            contact: '(032) 236-8702',
            description: 'General inquiries, municipal services, and local governance assistance. Contact for any municipal concerns or support.',
            icon: Landmark,
            category: 'Municipal Services'
        },
        {
            id: 2,
            name: 'Bureau of Fire Protection',
            contact: '0933-394-9073',
            description: 'Fire emergencies, rescue operations, and fire prevention services. Rapid response team available.',
            icon: Flame,
            category: 'Fire & Rescue'
        },
        {
            id: 3,
            name: 'Philippine Red Cross - Cordova Chapter',
            contact: '0969-450-8482',
            description: 'Medical emergencies, first aid, and disaster response services. Providing healthcare support to the community.',
            icon: Cross,
            category: 'Healthcare'
        },
        {
            id: 4,
            name: 'MDRRMO Ambulance',
            contact: '0917-116-9891',
            description: 'Emergency medical services and ambulance dispatch. For medical emergencies requiring immediate transport.',
            icon: Ambulance,
            category: 'Emergency Medical'
        },
        {
            id: 5,
            name: 'Roro Port Admin Office',
            contact: '0956-5007-963',
            description: 'Assistance with maritime emergencies, ferry services, and port security. Ensuring safe travel to and from the island.',
            icon: Waves,
            category: 'Maritime Safety'
        },
        {
            id: 6,
            name: 'Philippine Coast Guard',
            contact: '0927-941-2486',
            description: 'Maritime emergencies, sea rescue operations, and coastal security. Protecting our island community.',
            icon: Anchor,
            category: 'Maritime Safety'
        },
        {
            id: 7,
            name: 'Cordova Post Office',
            contact: '0997-4091-364',
            description: 'Lost mail assistance, postal emergencies, and package tracking support. Helping you stay connected.',
            icon: Package,
            category: 'Postal Services'
        },
        {
            id: 8,
            name: 'Cordova Tourism Office',
            contact: '0943-4571-925',
            description: 'Tourist assistance, emergency support for visitors, and local attraction information. Ensuring a safe and enjoyable visit.',
            icon: LampDesk,
            category: 'Tourism'
        },
        {
            id: 9,
            name: 'PhilSys Cordova Branch',
            contact: '0906-3222-185',
            description: 'Assistance with national ID registration emergencies and inquiries. Helping residents with their PhilSys concerns.',
            icon: IdCard,
            category: 'Government Services'
        },
        {
            id: 10,
            name: 'Cordova Marine Watch',
            contact: '0935-0164-855',
            description: 'Maritime emergencies, sea rescue operations, and coastal security. Protecting our island community.',
            icon: FishSymbol,
            category: 'Maritime Safety'
        },
        {
            id: 11,
            name: 'Business Permits and Licensing Office',
            contact: '0967-2268-066',
            description: 'Assistance with business permit emergencies and licensing inquiries. Supporting local entrepreneurs and businesses.',
            icon: Handshake,
            category: 'Business Services'
        },
        {
            id: 12,
            name: 'Office of the Senior Citizen Affairs',
            contact: '0932-3044-661',
            description: 'Assistance and support for senior citizens, including emergency services and welfare programs. Advocating for the elderly community.',
            icon: Users,
            category: 'Social Services'
        },
        {
            id: 13,
            name: 'Persons with Disabilities Affairs Office',
            contact: '0943-5272-548',
            description: 'Assistance and support for persons with disabilities, including emergency services and welfare programs. Advocating for the differently-abled community.',
            icon: Accessibility,
            category: 'Social Services'
        },
        {
            id: 14,
            name: 'Cordova Police Station',
            contact: '0998-5986-392',
            description: 'Law enforcement, crime reporting, and public safety services. Available 24/7 for emergencies and assistance.',
            icon: ShieldCheck,
            category: 'Law Enforcement'
        },
        {
            id: 15,
            name: 'Office of the 6th District Representative',
            contact: '0920-5228-643',
            description: 'Constituent services, legislative assistance, and emergency support. Helping residents with government-related concerns.',
            icon: UserStar,
            category: 'Government Services'
        },
        {
            id: 16,
            name: 'Philippine Coast Guard',
            contact: '0927-941-2486',
            description: 'Maritime emergencies, sea rescue operations, and coastal security. Protecting our island community.',
            icon: Anchor,
            category: 'Maritime Safety'
        }
    ];

    const lostAndFoundItems = [
        {
            id: 1,
            status: 'Missing',
            name: 'IPHONE 13 PRO',
            description: 'Space Gray iPhone 13 Pro with cracked screen protector. Lost near Gaisano Island Mall parking area. Contains important work files and family photos.',
            imageUrl: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=400&q=80',
            date: 'Nov 20, 2025',
            location: 'Gaisano Island Mall',
            contactPerson: 'Maria Santos'
        },
        {
            id: 2,
            status: 'Found',
            name: 'BLACK WALLET',
            description: 'Brown leather wallet found near the public market. Contains ID cards and some cash. Please contact us to claim with valid identification.',
            imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&q=80',
            date: 'Nov 22, 2025',
            location: 'Public Market',
            contactPerson: 'Juan Dela Cruz'
        },
        {
            id: 3,
            status: 'Missing',
            name: 'GOLD NECKLACE',
            description: 'Gold necklace with heart pendant lost at the beach area. Sentimental value as it was a gift from grandmother. Reward offered for safe return.',
            imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80',
            date: 'Nov 18, 2025',
            location: 'Day-as Beach',
            contactPerson: 'Ana Reyes'
        },
        {
            id: 4,
            status: 'Found',
            name: 'BLUE BACKPACK',
            description: 'Navy blue Jansport backpack found at the barangay hall. Contains school books and notebooks. Owner can claim at the municipal office.',
            imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80',
            date: 'Nov 23, 2025',
            location: 'Poblacion Barangay Hall',
            contactPerson: 'Admin Office'
        },
        {
            id: 5,
            status: 'Missing',
            name: 'PRESCRIPTION EYEGLASSES',
            description: 'Black rectangular frame eyeglasses in brown case. Lost near the church area during Sunday mass. Urgently needed for daily activities.',
            imageUrl: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&q=80',
            date: 'Nov 24, 2025',
            location: 'Our Lady of Guadalupe Church',
            contactPerson: 'Roberto Cruz'
        },
        {
            id: 6,
            status: 'Found',
            name: 'CAR KEYS WITH REMOTE',
            description: 'Toyota car keys with black rubber remote. Found in the parking area of the municipal building. Owner can identify by describing key chain.',
            imageUrl: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=400&q=80',
            date: 'Nov 21, 2025',
            location: 'Municipal Building Parking',
            contactPerson: 'Security Guard'
        },
        {
            id: 7,
            status: 'Missing',
            name: 'CHILD\'S STUFFED TOY',
            description: 'Brown teddy bear with red ribbon. Child\'s favorite toy lost at the playground. Answers to the name "Brownie". Family is very worried.',
            imageUrl: 'https://images.unsplash.com/photo-1551361415-69c87624334f?w=400&q=80',
            date: 'Nov 19, 2025',
            location: 'Municipal Playground',
            contactPerson: 'Lisa Mendoza'
        },
        {
            id: 8,
            status: 'Found',
            name: 'SILVER WATCH',
            description: 'Men\'s silver wristwatch with leather strap. Found on the bench near the plaza. Has engraving on the back that owner can verify.',
            imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=400&q=80',
            date: 'Nov 20, 2025',
            location: 'Town Plaza',
            contactPerson: 'Park Maintenance'
        },
        {
            id: 9,
            status: 'Missing',
            name: 'BIRTH CERTIFICATE DOCUMENTS',
            description: 'Brown envelope containing original birth certificate and other important documents. Lost between municipal hall and xerox center.',
            imageUrl: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=400&q=80',
            date: 'Nov 23, 2025',
            location: 'Near Municipal Hall',
            contactPerson: 'Pedro Garcia'
        },
        {
            id: 10,
            status: 'Found',
            name: 'LADIES UMBRELLA',
            description: 'Pink floral umbrella found at the waiting shed. Owner can claim by providing detailed description or any identifying marks.',
            imageUrl: 'https://images.unsplash.com/photo-1508873881324-c92a3fc536ba?w=400&q=80',
            date: 'Nov 24, 2025',
            location: 'Bus Waiting Shed',
            contactPerson: 'Barangay Tanod'
        }
    ];

    return (
        <>
            <Navbar activePage="" />
            <PageTransition>
                <div className="min-h-screen bg-gradient-to-br from-pink-50 via-red-50 to-orange-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-colors">
                    {/* Hero Section */}
                    <div className="relative py-20 px-4 overflow-hidden">
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-10 left-10 w-72 h-72 bg-red-600 rounded-full blur-3xl"></div>
                            <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-600 rounded-full blur-3xl"></div>
                        </div>
                        
                        <div className="max-w-7xl mx-auto relative z-10">
                            <div className="text-center mb-12">
                                <div className="inline-flex items-center gap-3 bg-red-100 dark:bg-red-900/30 px-6 py-3 rounded-full mb-6">
                                    <Siren className="w-8 h-8 text-red-600 dark:text-red-400" fill="currentColor" stroke="white" strokeWidth="1.5" />
                                    <span className="text-red-900 dark:text-red-300 font-bold">24/7 Emergency Response</span>
                                </div>
                                <h1 className="text-5xl md:text-6xl font-black text-red-900 dark:text-white mb-6">
                                    Emergency Rescue Desk
                                </h1>
                                <p className="text-xl text-red-800 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                                    Quick access to emergency services and assistance. Our dedicated teams are ready to respond to your needs 24 hours a day, 7 days a week.
                                </p>
                            </div>

                            {/* Quick Emergency Banner */}
                            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-3xl p-8 shadow-2xl mb-1">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                                            <Phone className="w-10 h-10 text-white" fill="currentColor" stroke="currentColor" strokeWidth="1.5" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black mb-1">IN CASE OF EMERGENCY</h3>
                                            <p className="text-white/90">Call the appropriate emergency hotline immediately</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <a href="tel:0998-598-6392" className="bg-white text-red-600 px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors flex items-center gap-2">
                                            <Phone className="w-5 h-5" /> Police
                                        </a>
                                        <a href="tel:0933-394-9073" className="bg-white text-red-600 px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors flex items-center gap-2">
                                            <Flame className="w-5 h-5" /> Fire
                                        </a>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Emergency Contacts Section */}
                    <div ref={emergencyHotlinesRef} className="px-4">
                        <div className="max-w-7xl mx-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {emergencyContacts.map((contact) => (
                                    <div 
                                        key={contact.id}
                                        className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border-2 border-transparent hover:border-red-500 dark:hover:border-red-400"
                                    >
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className="text-red-600 dark:text-red-400">
                                                <contact.icon className="w-12 h-12" fill="currentColor" stroke="white" strokeWidth="1.5" />
                                            </div>
                                            <div className="flex-1">
                                                <span className="inline-block px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-900 dark:text-red-300 text-xs font-semibold rounded-full mb-2">
                                                    {contact.category}
                                                </span>
                                                <h3 className="text-xl font-bold text-red-900 dark:text-white mb-2">
                                                    {contact.name}
                                                </h3>
                                            </div>
                                        </div>
                                        <a 
                                            href={`tel:${contact.contact.replace(/-/g, '')}`}
                                            className="block text-3xl font-black text-red-600 dark:text-red-400 mb-4 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                                        >
                                            {contact.contact}
                                        </a>
                                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                                            {contact.description}
                                        </p>
                                        <button className="mt-4 w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                                            <Phone className="w-5 h-5" /> Call Now
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Lost and Found Section */}

                    {/* Safety Tips Section */}
                    <div className="py-16 px-4">
                        <div className="max-w-7xl mx-auto">
                            <h2 className="text-4xl font-black text-red-900 dark:text-white mb-12 text-center">
                                Safety Tips & Guidelines
                            </h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                                    <div className="text-red-600 dark:text-red-400 mb-4">
                                        <Siren className="w-10 h-10" fill="currentColor" stroke="white" strokeWidth="1.5" />
                                    </div>
                                    <h3 className="text-xl font-bold text-red-900 dark:text-white mb-3">
                                        Stay Calm
                                    </h3>
                                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                                        In emergencies, remain calm and assess the situation before taking action.
                                    </p>
                                </div>
                                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                                    <div className="text-red-600 dark:text-red-400 mb-4">
                                        <Phone className="w-10 h-10" fill="currentColor" stroke="white" strokeWidth="1.5" />
                                    </div>
                                    <h3 className="text-xl font-bold text-red-900 dark:text-white mb-3">
                                        Call Early
                                    </h3>
                                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                                        Don't hesitate to call emergency services. Quick response can save lives.
                                    </p>
                                </div>
                                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                                    <div className="text-red-600 dark:text-red-400 mb-4">
                                        <MapPin className="w-10 h-10" fill="currentColor" stroke="white" strokeWidth="1.5" />
                                    </div>
                                    <h3 className="text-xl font-bold text-red-900 dark:text-white mb-3">
                                        Know Location
                                    </h3>
                                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                                        Always be aware of your exact location and landmarks nearby.
                                    </p>
                                </div>
                                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                                    <div className="text-red-600 dark:text-red-400 mb-4">
                                        <Users className="w-10 h-10" fill="currentColor" stroke="white" strokeWidth="1.5" />
                                    </div>
                                    <h3 className="text-xl font-bold text-red-900 dark:text-white mb-3">
                                        Follow Instructions
                                    </h3>
                                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                                        Listen carefully to emergency responders and follow their guidance.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </PageTransition>
        </>
    );
};

export default RescueDeskPage;
