'use client';

import React from 'react';

interface BarangayHeaderProps {
    name: string;
    tagline: string;
    backgroundImage?: string;
}

const BarangayHeader: React.FC<BarangayHeaderProps> = ({ name, tagline, backgroundImage = '/municipality-bg.jpg' }) => {
    return (
        <div className="relative bg-gradient-to-r from-red-900 to-red-800 text-white py-16 overflow-hidden">
            {/* Background Image Overlay */}
            <div 
                className="absolute inset-0 bg-cover bg-center opacity-20"
                style={{ backgroundImage: `url('${backgroundImage}')` }}
            />
            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <h1 className="text-6xl md:text-7xl font-black mb-4">BARANGAY {name.toUpperCase()}</h1>
                <p className="text-xl text-white/80">{tagline}</p>
            </div>
        </div>
    );
};

export default BarangayHeader;
