'use client';

import React from 'react';
import PageTransition from '../../../components/PageTransition';
import Navbar from '../../../components/Navbar';
import BarangayHeader from '../../../components/barangay/BarangayHeader';
import BarangayAbout from '../../../components/barangay/BarangayAbout';
import BarangayOfficials from '../../../components/barangay/BarangayOfficials';

const barangayInfo = {
    name: "Gabi",
    tagline: "Strong Roots, Bright Future",
    info: {
        description: "Barangay Gabi maintains its cultural heritage while embracing modern progress.",
        population: "~3,100",
        mapIframe: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7851.968057036929!2d123.95534179448677!3d10.262870109425403!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a99a6e4a6232d9%3A0x1b88bab83cf73fb1!2sGabi%2C%20Cordova%2C%20Cebu!5e0!3m2!1sen!2sph!4v1764846997865!5m2!1sen!2sph" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>'
    },
    barangayOfficials: [
        { position: "Barangay Captain", name: "Domingo Rojas", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Amparo Salazar", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Cesar Aguilera", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Esperanza Vargas", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Baltazar Mendoza", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Concepcion Ortiz", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Salvador Diaz", imageUrl: "/municipal-logo.jpg" }
    ],
    skOfficials: [
        { position: "SK Chairperson", name: "Mateo Cruz", imageUrl: "/municipal-logo.jpg" }
    ]
};

const GabiPage: React.FC = () => {
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

export default GabiPage;
