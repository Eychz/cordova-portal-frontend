'use client';

import React from 'react';

export interface Official {
    position: string;
    name: string;
    imageUrl: string;
}

interface BarangayOfficialsProps {
    officials: Official[];
    title?: string;
    captainDescription?: string;
    featuredColor?: 'red' | 'blue';
}

const BarangayOfficials: React.FC<BarangayOfficialsProps> = ({ 
    officials, 
    title = 'Barangay Officials',
    captainDescription = 'Leading our barangay with dedication and commitment to serve our community with integrity and excellence.',
    featuredColor = 'red'
}) => {
    const colorClasses = {
        red: {
            gradient: 'from-red-900 to-red-800',
            bgOverlay: 'bg-red-950/30',
            borderColor: 'border-white/20',
            textAccent: 'text-red-300',
            cardAccent: 'text-red-600 dark:text-red-400'
        },
        blue: {
            gradient: 'from-blue-900 to-blue-800',
            bgOverlay: 'bg-blue-950/30',
            borderColor: 'border-white/20',
            textAccent: 'text-blue-300',
            cardAccent: 'text-blue-600 dark:text-blue-400'
        }
    };

    const colors = colorClasses[featuredColor];

    return (
        <section className="mb-16">
            <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-8">{title}</h2>
            
            {/* Featured Official (Captain/Chairperson) */}
            <div className={`bg-gradient-to-br ${colors.gradient} rounded-3xl overflow-hidden shadow-2xl mb-8`}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                    <div className={`md:col-span-1 flex items-center justify-center p-8 ${colors.bgOverlay}`}>
                        <div className="relative">
                            <div className={`w-48 h-48 rounded-full overflow-hidden border-8 ${colors.borderColor} shadow-2xl`}>
                                <img 
                                    src={officials[0].imageUrl}
                                    alt={officials[0].name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="md:col-span-2 p-8 md:p-12 flex flex-col justify-center text-white">
                        <div className={`text-sm font-bold ${colors.textAccent} mb-2`}>
                            {officials[0].position}
                        </div>
                        <h3 className="text-4xl font-black mb-4">
                            {officials[0].name}
                        </h3>
                        <p className="text-white/80 text-lg">
                            {captainDescription}
                        </p>
                    </div>
                </div>
            </div>

            {/* Other Officials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {officials.slice(1).map((official, index) => (
                    <div 
                        key={index}
                        className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-gray-200 dark:border-gray-700"
                    >
                        <div className="aspect-square overflow-hidden bg-gray-200 dark:bg-gray-700">
                            <img 
                                src={official.imageUrl}
                                alt={official.name}
                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                            />
                        </div>
                        <div className="p-4 text-center">
                            <div className={`text-xs font-bold ${colors.cardAccent} mb-1`}>
                                {official.position}
                            </div>
                            <h4 className="font-black text-gray-900 dark:text-white">
                                {official.name}
                            </h4>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default BarangayOfficials;
