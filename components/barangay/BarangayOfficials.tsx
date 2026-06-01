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
    captainDescription = 'Dedicated public servant leading the community with integrity and excellence.',
    featuredColor = 'red'
}) => {
    const colorStyles = {
        red: {
            headerBg: 'bg-red-700',
            accentText: 'text-red-700',
            accentBorder: 'border-red-700'
        },
        blue: {
            headerBg: 'bg-gray-900',
            accentText: 'text-gray-900 dark:text-gray-100',
            accentBorder: 'border-gray-900 dark:border-gray-100'
        }
    };

    const styles = colorStyles[featuredColor];

    if (!officials || officials.length === 0) {
        return (
            <section className="mb-24">
                <div className="flex items-center gap-4 mb-12">
                    <div className="w-2 h-10 bg-gray-900 dark:bg-white"></div>
                    <h2 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">{title}</h2>
                </div>
                <div className="py-20 text-center border-2 border-dashed border-gray-200 dark:border-gray-800">
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Registry updating in progress</p>
                </div>
            </section>
        );
    }

    return (
        <section className="mb-24">
            <div className="flex items-center gap-4 mb-12">
                <div className="w-2 h-10 bg-gray-900 dark:bg-white"></div>
                <h2 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">{title}</h2>
            </div>

            {/* Featured Official (Captain/Chairperson) - Formal Layout */}
            <div className="mb-12 border-4 dark:border-gray-100 p-10">
                <div className="grid md:grid-cols-12 gap-0">
                    <div className="md:col-span-4 aspect-square md:aspect-auto h-full relative">
                        <img
                            src={officials[0]?.imageUrl || "/municipal-logo.jpg"}
                            alt={officials[0]?.name || "Official"}
                            className="w-full h-full object-cover transition-all"
                        />
                    </div>
                    <div className="md:col-span-8 p-12 bg-white dark:bg-gray-900 flex flex-col justify-center">
                        <div className={`text-xs font-black uppercase tracking-[0.3em] ${styles.accentText} mb-4`}>
                            {officials[0]?.position}
                        </div>
                        <h3 className="text-5xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-6 leading-none">
                            {officials[0]?.name}
                        </h3>
                        <p className="text-lg text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-2xl">
                            {captainDescription}
                        </p>
                        <div className="mt-10 pt-10 border-t border-gray-100 dark:border-gray-800">
                            <div className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                <div className="w-12 h-[1px] bg-gray-300"></div>
                                Official Representative
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Other Officials Grid - Institutional Style */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-gray-100 dark:bg-gray-800 border border-gray-100 dark:border-gray-800">
                {officials.slice(1).map((official, index) => (
                    <div key={index} className="bg-white dark:bg-gray-900 group">
                        <div className="aspect-[3/4] overflow-hidden transition-all duration-500 border-b border-gray-100 dark:border-gray-800">
                            <img
                                src={official.imageUrl}
                                alt={official.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                        </div>
                        <div className="p-8">
                            <div className={`text-[10px] font-black uppercase tracking-widest ${styles.accentText} mb-2`}>
                                {official.position}
                            </div>
                            <h4 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight leading-tight">
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
