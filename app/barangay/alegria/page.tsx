'use client';

import React, { useState } from 'react';
import PageTransition from '../../../components/PageTransition';
import Navbar from '../../../components/Navbar';
import BarangayHeader from '../../../components/barangay/BarangayHeader';
import BarangayAbout from '../../../components/barangay/BarangayAbout';
import BarangayOfficials from '../../../components/barangay/BarangayOfficials';
import type { Official } from '../../../components/barangay/BarangayOfficials';

// Embedded barangay data (no external dependencies)
const barangayInfo = {
    name: "Alegria",
    tagline: "A Joyful Community",
    info: {
        description: "Barangay Alegria is a vibrant coastal community known for its friendly residents and beautiful natural scenery.",
        population: "~7,500",
        area: "4.2 km²",
        established: "1950",
        mapIframe: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7852.158865123446!2d123.95539124448648!3d10.255177459454531!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a99a6399e7265f%3A0x11728c272f93469d!2sAlegria%2C%20Cordova%2C%20Cebu!5e0!3m2!1sen!2sph!4v1764845797564!5m2!1sen!2sph" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
        keyFeatures: [
            { title: "Beachfront Park", description: "A popular spot for families and tourists to relax and enjoy the sea breeze." },
            { title: "Annual Fiesta", description: "A week-long celebration featuring parades, food fairs, and cultural performances." }
        ],
        zipCode: "6017"
    },
    barangayOfficials: [
        { position: "Barangay Captain", name: "Juan Dela Cruz", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Maria Santos", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Pedro Reyes", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Ana Garcia", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Jose Rodriguez", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Carmen Lopez", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Ricardo Martinez", imageUrl: "/municipal-logo.jpg" },
        { position: "SK Chairperson", name: "Miguel Torres", imageUrl: "/municipal-logo.jpg" }
    ],
    skOfficials: [
        { position: "SK Chairperson", name: "Miguel Torres", imageUrl: "/municipal-logo.jpg" },
        { position: "SK Kagawad", name: "Sofia Ramos", imageUrl: "/municipal-logo.jpg" },
        { position: "SK Kagawad", name: "Luis Hernandez", imageUrl: "/municipal-logo.jpg" }
    ]
};

const AlegriaPage: React.FC = () => {
    const data = barangayInfo;
    const [barangayOfficials] = useState<Official[]>(data.barangayOfficials);
    const [skOfficials] = useState<Official[]>(data.skOfficials);

    return (
        <>
            <Navbar activePage="" barangay={data.name} />
            <PageTransition>
                <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
                    <BarangayHeader name={data.name} tagline={data.tagline} />

                    <div className="max-w-7xl mx-auto px-4 py-12">
                        <BarangayAbout info={data.info} />
                        
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
                    </div>
                </div>
            </PageTransition>
        </>
    );
};

export default AlegriaPage;