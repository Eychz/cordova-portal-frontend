'use client';

import React from 'react';
import PageTransition from '../../../components/PageTransition';
import Navbar from '../../../components/Navbar';
import BarangayHeader from '../../../components/barangay/BarangayHeader';
import BarangayAbout from '../../../components/barangay/BarangayAbout';
import BarangayOfficials from '../../../components/barangay/BarangayOfficials';

const barangayInfo = {
    name: "Buagsong",
    tagline: "Prosperity Through Unity",
    info: {
        name: "Buagsong",
        established: "1950", // Replace with actual year if available
        area: "2.5 km²",     // Replace with actual area if available
        zipCode: "6017",     // Replace with actual zip code if available
        keyFeatures: [
            { title: "Tight-knit community", description: "Strong bonds and cooperation among residents." },
            { title: "Commitment to sustainable development", description: "Focus on environmental conservation and responsible growth." }
        ],
        description: "Barangay Buagsong is known for its tight-knit community and commitment to sustainable development.",
        population: "~2,800",
        mapIframe: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d9337.860322000963!2d123.93949745974561!3d10.254596441610097!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a99af8d918f469%3A0xa335cfedefab4537!2sBuagsong%2C%20Cordova%2C%20Cebu!5e0!3m2!1sen!2sph!4v1764846907127!5m2!1sen!2sph" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>'
    },
    barangayOfficials: [
        { position: "Barangay Captain", name: "Ernesto Aguilar", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Lucia Navarro", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Ramon Pascual", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Rosario Santos", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Alberto Fernandez", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Margarita Jimenez", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Vicente Ortega", imageUrl: "/municipal-logo.jpg" }
    ],
    skOfficials: [
        { position: "SK Chairperson", name: "Gabriel Valdez", imageUrl: "/municipal-logo.jpg" }
    ]
};

const BuagsongPage: React.FC = () => {
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

export default BuagsongPage;