'use client';

import React from 'react';
import PageTransition from '../../../components/PageTransition';
import Navbar from '../../../components/Navbar';
import BarangayHeader from '../../../components/barangay/BarangayHeader';
import BarangayAbout from '../../../components/barangay/BarangayAbout';
import BarangayOfficials from '../../../components/barangay/BarangayOfficials';

const barangayInfo = {
    name: "Gilutongan",
    tagline: "Island Paradise",
    info: {
        description: "Barangay Gilutongan is a beautiful island community known for its marine resources and tourism.",
        population: "~1,800",
        mapIframe: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15707.053208522226!2d123.98326011052752!3d10.199867438654453!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a98fe63a570ed1%3A0xc9b8275ad45a525a!2sGilutongan%2C%20Cordova%2C%20Cebu!5e0!3m2!1sen!2sph!4v1764847742621!5m2!1sen!2sph" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>'
    },
    barangayOfficials: [
        { position: "Barangay Captain", name: "Rodrigo Navarro", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Estrella Mendoza", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Manuel Rivera", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Josefa Ramos", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Felipe Gonzalez", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Remedios Torres", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Emilio Castro", imageUrl: "/municipal-logo.jpg" }
    ],
    skOfficials: [
        { position: "SK Chairperson", name: "Luna Martinez", imageUrl: "/municipal-logo.jpg" }
    ]
};

const GilutonganPage: React.FC = () => {
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

export default GilutonganPage;
