'use client';

import React from 'react';

interface BarangayHeaderProps {
    name: string;
    tagline: string;
    backgroundImage?: string;
}

const BarangayHeader: React.FC<BarangayHeaderProps> = ({ name, tagline, backgroundImage = '/municipality-bg.jpg' }) => {
    return (
        <header className="bg-red-800 text-white pt-32 pb-20 border-b-8 border-red-700 relative overflow-hidden">
            {/* Background Image Overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center opacity-10"
                style={{ backgroundImage: `url('${backgroundImage}')` }}
            />
            <div className="maximize-width px-4 relative z-10">
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
            </div>
        </header>
    );
};

export default BarangayHeader;
