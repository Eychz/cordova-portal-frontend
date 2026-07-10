'use client';

import React from 'react';

interface BarangayHeaderProps {
    name: string;
    tagline: string;
    backgroundImage?: string;
    logoUrl?: string;
}

const BarangayHeader: React.FC<BarangayHeaderProps> = ({ name, tagline, backgroundImage = '/municipality-bg.jpg', logoUrl }) => {
    return (
        <header className="bg-red-800 text-white pt-32 pb-20 border-b-8 border-red-700 relative overflow-hidden">
            {/* Background Image Overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center opacity-10"
                style={{ backgroundImage: `url('${backgroundImage}')` }}
            />
            <div className="maximize-width relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 bg-white text-red-800 px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em]">
                            Village Authority Profile
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">
                            Barangay {name}
                        </h1>
                        <p className="text-xl text-white font-medium max-w-2xl">
                            {tagline}
                        </p>
                    </div>
                    {logoUrl && (
                        <div className="flex-shrink-0 bg-white/10 backdrop-blur-sm p-4 rounded-full border border-white/20 shadow-xl animate-fadeIn">
                            <img
                                src={logoUrl}
                                alt={`Logo of Barangay ${name}`}
                                className="w-28 h-28 md:w-36 md:h-36 object-contain"
                            />
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default BarangayHeader;
