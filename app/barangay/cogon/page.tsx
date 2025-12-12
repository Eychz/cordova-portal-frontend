'use client';

import React from 'react';
import PageTransition from '../../../components/PageTransition';
import Navbar from '../../../components/Navbar';
import BarangayHeader from '../../../components/barangay/BarangayHeader';
import BarangayAbout from '../../../components/barangay/BarangayAbout';
import BarangayOfficials from '../../../components/barangay/BarangayOfficials';

const barangayInfo = {
    name: "Cogon",
    tagline: "Green and Growing",
    info: {
        description: "Barangay Cogon is characterized by its lush greenery and agricultural productivity.",
        population: "~2,600",
        mapIframe: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d9337.78454266438!2d123.94616176516813!3d10.257166269979667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a99a680757ebaf%3A0xb46a42ef293f0fc3!2sCogon%2C%20Cordova%2C%20Cebu!5e0!3m2!1sen!2sph!4v1764846944443!5m2!1sen!2sph" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>'
    },
    barangayOfficials: [
        { position: "Barangay Captain", name: "Eduardo Hernandez", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Irene Castro", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Jorge Perez", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Nora Alvarez", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Rodolfo Medina", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Cristina Ruiz", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Guillermo Sanchez", imageUrl: "/municipal-logo.jpg" }
    ],
    skOfficials: [
        { position: "SK Chairperson", name: "Valentina Cortez", imageUrl: "/municipal-logo.jpg" }
    ]
};

const CogonPage: React.FC = () => {
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

export default CogonPage;
