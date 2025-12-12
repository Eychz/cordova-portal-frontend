'use client';

import React, { useState } from 'react';
import PageTransition from '../../components/PageTransition';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Target, Rocket, Mail, Phone } from 'lucide-react';

interface Official {
    name: string;
    position: string;
    department?: string;
    imageUrl: string;
    email?: string;
    phone?: string;
    description?: string;
}

const AboutPage = () => {
    const [activeTab, setActiveTab] = useState<'about' | 'officials' | 'history'>('about');

    const municipalOfficials: Official[] = [
        {
            name: 'Hon. Cesar Y. Suan',
            position: 'Municipal Mayor',
            imageUrl: '/municipal-logo.jpg',
            email: 'mayor@cordova.gov.ph',
            phone: '(032) 236-8702',
            description: 'Leading Cordova towards progress and sustainable development'
        },
        {
            name: 'Hon. Boyet Tago III',
            position: 'Vice Mayor',
            imageUrl: '/municipal-logo.jpg',
            email: 'vicemayor@cordova.gov.ph',
            phone: '(032) 236-8702',
            description: 'Supporting initiatives for community welfare and growth'
        },
        {
            name: 'Hon. Jerome Lepiten',
            position: 'Councilor',
            imageUrl: '/municipal-logo.jpg',
            email: 'councilor3@cordova.gov.ph',
            phone: '(032) 236-8702',
            description: ''
        },
        {
            name: 'Hon. Patric Lagon',
            position: 'Councilor',
            imageUrl: '/municipal-logo.jpg',
            email: 'councilor3@cordova.gov.ph',
            phone: '(032) 236-8702',
            description: ''
        },
        {
            name: 'Hon. Nats Sitoy',
            position: 'Councilor',
            imageUrl: '/municipal-logo.jpg',
            email: 'councilor3@cordova.gov.ph',
            phone: '(032) 236-8702',
            description: ''
        },
        {
            name: 'Hon. Remar Baguio',
            position: 'Councilor',
            imageUrl: '/municipal-logo.jpg',
            email: 'councilor3@cordova.gov.ph',
            phone: '(032) 236-8702',
            description: ''
        },
        {
            name: 'Hon. Jet Wahing',
            position: 'Councilor',
            imageUrl: '/municipal-logo.jpg',
            email: 'councilor3@cordova.gov.ph',
            phone: '(032) 236-8702',
            description: ''
        },
        {
            name: 'Hon. Leira Mae Casquejo',
            position: 'Councilor',
            imageUrl: '/municipal-logo.jpg',
            email: 'councilor3@cordova.gov.ph',
            phone: '(032) 236-8702',
            description: ''
        },
        {
            name: 'Hon. Chito Bentazal',
            position: 'Councilor',
            imageUrl: '/municipal-logo.jpg',
            email: 'councilor3@cordova.gov.ph',
            phone: '(032) 236-8702',
            description: ''
        },
        {
            name: 'Hon. Lemuel Pogoy',
            position: 'Councilor',
            imageUrl: '/municipal-logo.jpg',
            email: 'councilor3@cordova.gov.ph',
            phone: '(032) 236-8702',
            description: ''
        }
    ];

    const departmentHeads: Official[] = [
        {
            name: 'Atty. Roberto Garcia',
            position: 'Municipal Administrator',
            department: 'Office of the Municipal Administrator',
            imageUrl: '/municipal-logo.jpg'
        },
        {
            name: 'Engr. Juan Santos',
            position: 'Municipal Engineer',
            department: 'Engineering Office',
            imageUrl: '/municipal-logo.jpg'
        },
        {
            name: 'Dr. Maria Cruz',
            position: 'Municipal Health Officer',
            department: 'Rural Health Unit',
            imageUrl: '/municipal-logo.jpg'
        },
        {
            name: 'Ms. Teresa Ramos',
            position: 'Municipal Treasurer',
            department: 'Treasury Office',
            imageUrl: '/municipal-logo.jpg'
        },
        {
            name: 'Mr. Antonio Flores',
            position: 'Municipal Accountant',
            department: 'Accounting Office',
            imageUrl: '/municipal-logo.jpg'
        },
        {
            name: 'Ms. Carmen Lopez',
            position: 'Municipal Assessor',
            department: 'Assessor\'s Office',
            imageUrl: '/municipal-logo.jpg'
        }
    ];

    return (
        <PageTransition>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-pink-50 via-red-50 to-orange-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-20 px-4 transition-colors">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-black text-red-900 dark:text-white mb-4">
                            About Cordova
                        </h1>
                        <p className="text-lg text-red-800 dark:text-gray-300 max-w-3xl mx-auto">
                            Learn more about the Municipality of Cordova, its history, vision, and the dedicated officials serving the community.
                        </p>
                    </div>

                    {/* Tabs */}
                    <div className="flex justify-center gap-4 mb-12 flex-wrap">
                        <button
                            onClick={() => setActiveTab('about')}
                            className={`px-8 py-3 rounded-full font-bold transition-all ${
                                activeTab === 'about'
                                    ? 'bg-red-900 text-white shadow-lg transform scale-105'
                                    : 'bg-white dark:bg-gray-800 text-red-900 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-gray-700'
                            }`}
                        >
                            About Municipality
                        </button>
                        <button
                            onClick={() => setActiveTab('officials')}
                            className={`px-8 py-3 rounded-full font-bold transition-all ${
                                activeTab === 'officials'
                                    ? 'bg-red-900 text-white shadow-lg transform scale-105'
                                    : 'bg-white dark:bg-gray-800 text-red-900 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-gray-700'
                            }`}
                        >
                            Municipal Officials
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`px-8 py-3 rounded-full font-bold transition-all ${
                                activeTab === 'history'
                                    ? 'bg-red-900 text-white shadow-lg transform scale-105'
                                    : 'bg-white dark:bg-gray-800 text-red-900 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-gray-700'
                            }`}
                        >
                            History & Culture
                        </button>
                    </div>

                    {/* About Tab */}
                    {activeTab === 'about' && (
                        <div className="space-y-8">
                            {/* Vision & Mission */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg">
                                    <div className="mb-4">
                                        <Target className="w-12 h-12 text-red-600 dark:text-red-400" />
                                    </div>
                                    <h2 className="text-3xl font-black text-red-900 dark:text-white mb-4">Vision</h2>
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                        A progressive, resilient, and sustainable coastal municipality where every resident enjoys quality life through good governance, economic prosperity, and environmental stewardship.
                                    </p>
                                </div>
                                <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg">
                                    <div className="mb-4">
                                        <Rocket className="w-12 h-12 text-red-600 dark:text-red-400" />
                                    </div>
                                    <h2 className="text-3xl font-black text-red-900 dark:text-white mb-4">Mission</h2>
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                        To deliver efficient and effective public services, promote inclusive development, protect the environment, and empower communities through transparent governance and active citizen participation.
                                    </p>
                                </div>
                            </div>

                            {/* Key Features */}
                            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg">
                                <h2 className="text-3xl font-black text-red-900 dark:text-white mb-6">About Cordova</h2>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-xl font-bold text-red-900 dark:text-red-400 mb-3">Geography</h3>
                                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                                            Located on the southeastern tip of Mactan Island in the province of Cebu, Philippines. The municipality covers approximately 32.5 square kilometers and is composed of 13 barangays, including the island barangay of Gilutongan.
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-red-900 dark:text-red-400 mb-3">Population</h3>
                                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                                            Home to approximately 67,000 residents (2020 Census). The municipality has experienced steady growth due to its proximity to Cebu City and the development of the Mactan-Cebu International Airport area.
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-red-900 dark:text-red-400 mb-3">Economy</h3>
                                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                                            Primary industries include fishing, agriculture, manufacturing, and tourism. The municipality is known for its marine resources, particularly the rich fishing grounds around Gilutongan Island. Growing commercial and industrial sectors contribute to local economy.
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-red-900 dark:text-red-400 mb-3">Tourism</h3>
                                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                                            Notable attractions include the Gilutongan Marine Sanctuary, Nalusuan Island, mangrove forests, and cultural heritage sites. The municipality offers island hopping, diving, and eco-tourism activities.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Officials Tab */}
                    {activeTab === 'officials' && (
                        <div className="space-y-12">
                            {/* Municipal Officials */}
                            <div>
                                <h2 className="text-3xl font-black text-red-900 dark:text-white mb-8 text-center">
                                    Municipal Officials
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {municipalOfficials.map((official, index) => (
                                        <div
                                            key={index}
                                            className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
                                        >
                                            <div className="relative h-64 bg-gradient-to-br from-red-900 to-red-700">
                                                <img
                                                    src={official.imageUrl}
                                                    alt={official.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="p-6">
                                                <h3 className="text-xl font-bold text-red-900 dark:text-white mb-2">
                                                    {official.name}
                                                </h3>
                                                <p className="text-red-700 dark:text-red-400 font-semibold mb-3">
                                                    {official.position}
                                                </p>
                                                {official.description && (
                                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                                                        {official.description}
                                                    </p>
                                                )}
                                                {(official.email || official.phone) && (
                                                    <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                                                        {official.email && (
                                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                                <Mail className="w-4 h-4" />
                                                                <span>{official.email}</span>
                                                            </div>
                                                        )}
                                                        {official.phone && (
                                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                                <Phone className="w-4 h-4" />
                                                                <span>{official.phone}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Department Heads */}
                            <div>
                                <h2 className="text-3xl font-black text-red-900 dark:text-white mb-8 text-center">
                                    Department Heads
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {departmentHeads.map((official, index) => (
                                        <div
                                            key={index}
                                            className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
                                        >
                                            <div className="relative h-48 bg-gradient-to-br from-gray-700 to-gray-600">
                                                <img
                                                    src={official.imageUrl}
                                                    alt={official.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="p-6">
                                                <h3 className="text-lg font-bold text-red-900 dark:text-white mb-1">
                                                    {official.name}
                                                </h3>
                                                <p className="text-red-700 dark:text-red-400 font-semibold text-sm mb-2">
                                                    {official.position}
                                                </p>
                                                {official.department && (
                                                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                                                        {official.department}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* History Tab */}
                    {activeTab === 'history' && (
                        <div className="space-y-8">
                            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg">
                                <h2 className="text-3xl font-black text-red-900 dark:text-white mb-6">
                                    History of Cordova
                                </h2>
                                <div className="space-y-6 text-gray-700 dark:text-gray-300">
                                    <p className="leading-relaxed">
                                        <strong className="text-red-900 dark:text-red-400">1864:</strong> Cordova was officially established as a municipality, separated from Opon (now Lapu-Lapu City). The name "Cordova" is believed to have originated from the Spanish city of Córdoba, reflecting the colonial influence of the period.
                                    </p>
                                    <p className="leading-relaxed">
                                        <strong className="text-red-900 dark:text-red-400">Pre-Colonial Era:</strong> Before Spanish colonization, the area was inhabited by seafaring communities who relied on fishing and trading. Archaeological evidence suggests early settlements dating back several centuries.
                                    </p>
                                    <p className="leading-relaxed">
                                        <strong className="text-red-900 dark:text-red-400">Spanish Period:</strong> Under Spanish rule, Cordova developed as a fishing village and agricultural community. The Spanish introduced Catholicism, which remains the predominant religion today, and established the foundations of local governance.
                                    </p>
                                    <p className="leading-relaxed">
                                        <strong className="text-red-900 dark:text-red-400">American Period & Beyond:</strong> During American colonization and through Philippine independence, Cordova maintained its identity as a coastal municipality. The post-war period saw gradual modernization while preserving traditional fishing culture.
                                    </p>
                                    <p className="leading-relaxed">
                                        <strong className="text-red-900 dark:text-red-400">Modern Development:</strong> In recent decades, Cordova has experienced significant growth due to its strategic location near the Mactan-Cebu International Airport and the expansion of Metro Cebu. Despite urbanization, the municipality has worked to preserve its natural resources and cultural heritage.
                                    </p>
                                </div>
                            </div>

                            {/* Cultural Heritage */}
                            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg">
                                <h2 className="text-3xl font-black text-red-900 dark:text-white mb-6">
                                    Cultural Heritage
                                </h2>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-xl font-bold text-red-900 dark:text-red-400 mb-3">
                                            Festivals & Celebrations
                                        </h3>
                                        <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                                            <li>• <strong>Dinagat Festival</strong> - Annual celebration of fishing heritage</li>
                                            <li>• <strong>Town Fiesta</strong> - Honoring the patron saint</li>
                                            <li>• <strong>Christmas Festivities</strong> - Community celebrations and parades</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-red-900 dark:text-red-400 mb-3">
                                            Traditional Practices
                                        </h3>
                                        <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                                            <li>• Traditional fishing methods passed down through generations</li>
                                            <li>• Local handicrafts and weaving</li>
                                            <li>• Folk songs and dances</li>
                                            <li>• Community bayanihan spirit</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </PageTransition>
    );
};

export default AboutPage;
