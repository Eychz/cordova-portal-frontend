'use client';

import React from 'react';
import { notFound } from 'next/navigation';
import PageTransition from '@/components/PageTransition';
import Navbar from '@/components/Navbar';
import BarangayHeader from '@/components/barangay/BarangayHeader';
import BarangayAbout from '@/components/barangay/BarangayAbout';
import BarangayOfficials from '@/components/barangay/BarangayOfficials';
import { barangays } from '@/data/barangays';

export default function BarangaySlugPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = React.use(params);
    const data = barangays.find(b => b.id === slug);

    if (!data) {
        notFound();
    }

    return (
        <>
            <Navbar activePage="" barangay={data.name} />
            <PageTransition>
                <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
                    <BarangayHeader name={data.name} tagline={data.tagline} />

                    <div className="max-w-7xl mx-auto px-4 py-12">
                        <BarangayAbout info={data.info} />
                        
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
}
