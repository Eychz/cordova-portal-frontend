'use client';

import React from 'react';
import PageTransition from '../../../components/PageTransition';
import Navbar from '../../../components/Navbar';
import BarangayHeader from '../../../components/barangay/BarangayHeader';
import BarangayAbout from '../../../components/barangay/BarangayAbout';
import BarangayOfficials from '../../../components/barangay/BarangayOfficials';

const barangayInfo = {
    name: "Bangbang",
    tagline: "United in Progress",
    info: {
        established: "1950", // Replace with actual year if available
        zipCode: "6017", // Replace with actual zip code if available
        keyFeatures: [
            { title: "Strong agricultural foundation", description: "A community built on farming traditions and agricultural excellence." },
            { title: "Dedicated residents", description: "Committed community members working together for progress." },
            { title: "Growing community", description: "Steadily developing infrastructure and services for residents." }
        ],
        description: "Barangay Bangbang is a growing community with a strong agricultural foundation and dedicated residents.",
        population: "~9,200",
        area: "3.1 km²",
        mapIframe: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3926.027524439499!2d123.9393458757952!3d10.25936363985969!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a99a59f99abe83%3A0x2df86bef56d58830!2sBangbang%2C%20Cordova%2C%20Cebu!5e0!3m2!1sen!2sph!4v1764845821894!5m2!1sen!2sph" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>'
    },
    barangayOfficials: [
        { position: "Barangay Captain", name: "Roberto Silva", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Elena Cruz", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Carlos Mendoza", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Teresa Flores", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Francisco Diaz", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Gloria Morales", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Antonio Castillo", imageUrl: "/municipal-logo.jpg" }
    ],
    skOfficials: [
        { position: "SK Chairperson", name: "Isabella Gomez", imageUrl: "/municipal-logo.jpg" },
        { position: "SK Kagawad", name: "Daniel Vargas", imageUrl: "/municipal-logo.jpg" }
    ]
};

const BangbangPage: React.FC = () => {
    const data = barangayInfo;

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
};

export default BangbangPage;