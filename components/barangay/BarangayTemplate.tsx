'use client';

import React from 'react';
import PageTransition from '../PageTransition';
import Navbar from '../Navbar';
import BarangayHeader from './BarangayHeader';
import BarangayAbout from './BarangayAbout';
import BarangayOfficials from './BarangayOfficials';
import { barangayData } from '../../data/barangayData';

const BarangayTemplate: React.FC = () => {
    // Change 'alegria' to the barangay slug
    const data = barangayData.alegria;

    return (
        <>
            <Navbar activePage="" barangay={data.name} />
            <PageTransition>
                <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
                    <BarangayHeader name={data.name} tagline={data.tagline} />

                    <div className="max-w-7xl mx-auto px-4 py-12">
                        <BarangayAbout info={{ 
                            ...data.info, 
                            name: data.name, 
                            description: data.info.description,
                            population: data.info.population || 'N/A',
                            area: data.info.area,
                            established: data.info.established,
                            coordinates: data.info.coordinates,
                            keyFeatures: data.info.keyFeatures
                        }} />
                        
                        <BarangayOfficials 
                            officials={data.barangayOfficials}
                            title="Barangay Officials"
                            featuredColor="red"
                        />
                        
                        <BarangayOfficials 
                            officials={data.skOfficials}
                            title="Sangguniang Kabataan (SK) Officials"
                            captainDescription="Empowering the youth and leading programs for the development of young people in our barangay."
                            featuredColor="blue"
                        />
                    </div>
                </div>
            </PageTransition>
        </>
    );
};

export default BarangayTemplate;
