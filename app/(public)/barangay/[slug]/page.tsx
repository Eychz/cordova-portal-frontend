'use client';

import React, { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import PageTransition from '@/components/PageTransition';
import Navbar from '@/components/Navbar';
import BarangayHeader from '@/components/barangay/BarangayHeader';
import BarangayAbout from '@/components/barangay/BarangayAbout';
import BarangayOfficials from '@/components/barangay/BarangayOfficials';
import { barangays } from '@/data/barangays';
import { officialsApi } from '@/lib/officialsApi';
import { BarangayOfficialsSkeleton } from '@/components/Skeleton';

export default function BarangaySlugPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = React.use(params);
    const data = barangays.find(b => b.id === slug);

    const [barangayOfficials, setBarangayOfficials] = useState<any[]>([]);
    const [skOfficials, setSkOfficials] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!data) return;

        const fetchOfficials = async () => {
            try {
                const [bOfficials, sOfficials] = await Promise.all([
                    officialsApi.getAll('BARANGAY', data.name),
                    officialsApi.getAll('SK', data.name)
                ]);

                const formatOfficials = (list: any[]) => list.map(o => ({
                    position: o.position || '',
                    name: o.name || '',
                    imageUrl: o.imageUrl || '/municipal-logo.jpg'
                }));

                setBarangayOfficials(formatOfficials(bOfficials));
                setSkOfficials(formatOfficials(sOfficials));
            } catch (err) {
                console.error("Failed to load barangay officials:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOfficials();
    }, [data]);

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

                        {loading ? (
                            <div className="space-y-12">
                                <BarangayOfficialsSkeleton />
                                <BarangayOfficialsSkeleton />
                            </div>
                        ) : (
                            <>
                                <BarangayOfficials 
                                    officials={barangayOfficials}
                                    title="Barangay Officials"
                                    featuredColor="red"
                                />

                                <BarangayOfficials 
                                    officials={skOfficials}
                                    title="Sangguniang Kabataan (SK) Officials"
                                    captainDescription="Empowering the youth and leading programs for the development of young people in our barangay."
                                    featuredColor="blue"
                                />
                            </>
                        )}
                    </div>
                </div>
            </PageTransition>
        </>
    );
}
