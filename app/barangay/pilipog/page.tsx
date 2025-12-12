'use client';

import React from 'react';
import PageTransition from '../../../components/PageTransition';
import Navbar from '../../../components/Navbar';
import BarangayHeader from '../../../components/barangay/BarangayHeader';
import BarangayAbout from '../../../components/barangay/BarangayAbout';
import BarangayOfficials from '../../../components/barangay/BarangayOfficials';

const barangayInfo = {
    name: "Pilipog",
    tagline: "Thriving Community",
    info: {
        description: "Barangay Pilipog is a dynamic community with strong economic activity and social cohesion.",
        population: "~2,700",
        mapIframe: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d22208.392020185493!2d123.94304904909185!3d10.267534276250975!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a99a45e5dccb5d%3A0x7d145ada76f0672c!2sPilipog%2C%20Cordova%2C%20Cebu!5e0!3m2!1sen!2sph!4v1764847764453!5m2!1sen!2sph" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>'
    },
    barangayOfficials: [
        { position: "Barangay Captain", name: "Mariano Jimenez", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Felicidad Ortega", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Alejandro Valdez", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Delia Gutierrez", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Raul Romero", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Leonor Ramirez", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Claudio Suarez", imageUrl: "/municipal-logo.jpg" }
    ],
    skOfficials: [
        { position: "SK Chairperson", name: "Aurora Velasco", imageUrl: "/municipal-logo.jpg" }
    ]
};

const PilipogPage: React.FC = () => {
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

export default PilipogPage;
