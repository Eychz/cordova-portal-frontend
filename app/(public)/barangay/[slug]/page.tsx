'use client';

import React from 'react';
import { notFound } from 'next/navigation';
import PageTransition from '@/components/PageTransition';
import Navbar from '@/components/Navbar';
import BarangayHeader from '@/components/barangay/BarangayHeader';
import BarangayAbout from '@/components/barangay/BarangayAbout';
import BarangayOfficials from '@/components/barangay/BarangayOfficials';
import { barangays } from '@/data/barangays';
import { officialsApi } from '@/lib/officialsApi';
import { BarangayOfficialsSkeleton } from '@/components/Skeleton';
import { useQuery } from '@tanstack/react-query';

export default function BarangaySlugPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = React.use(params);
    const data = barangays.find(b => b.id === slug);

    const { data: barangayOfficials = [], isLoading: loadingBarangay } = useQuery<any[]>({
        queryKey: ['publicOfficials', 'BARANGAY', data?.name],
        queryFn: async () => {
            const list = await officialsApi.getAll('BARANGAY', data?.name);
            return list.map(o => ({
                position: o.position || '',
                name: o.name || '',
                imageUrl: o.imageUrl || '/municipal-logo.jpg'
            }));
        },
        enabled: !!data?.name,
        staleTime: 5 * 60 * 1000,
    });

    const { data: skOfficials = [], isLoading: loadingSk } = useQuery<any[]>({
        queryKey: ['publicOfficials', 'SK', data?.name],
        queryFn: async () => {
            const list = await officialsApi.getAll('SK', data?.name);
            return list.map(o => ({
                position: o.position || '',
                name: o.name || '',
                imageUrl: o.imageUrl || '/municipal-logo.jpg'
            }));
        },
        enabled: !!data?.name,
        staleTime: 5 * 60 * 1000,
    });

    const loading = loadingBarangay || loadingSk;

    if (!data) {
        notFound();
    }

    return (
        <>
            <Navbar activePage="" barangay={data.name} />
            <PageTransition>
                <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
                    <BarangayHeader name={data.name} tagline={data.tagline} />

                    <div className="maximize-width py-12">
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
