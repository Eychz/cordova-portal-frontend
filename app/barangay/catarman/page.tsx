'use client';

import React from 'react';
import PageTransition from '../../../components/PageTransition';
import Navbar from '../../../components/Navbar';
import BarangayHeader from '../../../components/barangay/BarangayHeader';
import BarangayAbout from '../../../components/barangay/BarangayAbout';
import BarangayOfficials from '../../../components/barangay/BarangayOfficials';

const barangayInfo = {
    name: "Catarman",
    tagline: "Heritage and Progress",
    info: {
        description: "Barangay Catarman balances tradition with modern development, creating a unique community atmosphere.",
        population: "~4,100",
        mapIframe: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d9338.03486717473!2d123.94611665043998!3d10.24867484161633!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a99af12c93c837%3A0x672133904d36ffe1!2sCatarman%2C%20Cordova%2C%20Cebu!5e0!3m2!1sen!2sph!4v1764846930480!5m2!1sen!2sph" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>'
    },
    barangayOfficials: [
        { position: "Barangay Captain", name: "Leonardo Ramos", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Patricia Gutierrez", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Miguel Romero", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Sandra Ramirez", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Enrique Torres", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Beatriz Suarez", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Fernando Velasco", imageUrl: "/municipal-logo.jpg" }
    ],
    skOfficials: [
        { position: "SK Chairperson", name: "Camila Reyes", imageUrl: "/municipal-logo.jpg" }
    ]
};

const CatarmanPage: React.FC = () => {
    const data = barangayInfo;

    if (!data) {
        return <div>Loading...</div>;
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
};

export default CatarmanPage;
