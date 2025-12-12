'use client';

import React from 'react';
import PageTransition from '../../../components/PageTransition';
import Navbar from '../../../components/Navbar';
import BarangayHeader from '../../../components/barangay/BarangayHeader';
import BarangayAbout from '../../../components/barangay/BarangayAbout';
import BarangayOfficials from '../../../components/barangay/BarangayOfficials';

const barangayInfo = {
    name: "Dapitan",
    tagline: "Community First",
    info: {
        description: "Barangay Dapitan prides itself on strong community bonds and active civic participation.",
        population: "~3,500",
        mapIframe: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5552.207294667368!2d123.94746190076421!3d10.261306296805186!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a99a439515d5c1%3A0x97d4d49651fd71b!2sDapitan%2C%20Cordova%2C%20Cebu!5e0!3m2!1sen!2sph!4v1764846964708!5m2!1sen!2sph" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>'
    },
    barangayOfficials: [
        { position: "Barangay Captain", name: "Alfredo Iglesias", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Dolores Nunez", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Marcos Fuentes", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Angelica Molina", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Sergio Carrillo", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Victoria Delgado", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Hector Herrera", imageUrl: "/municipal-logo.jpg" }
    ],
    skOfficials: [
        { position: "SK Chairperson", name: "Sebastian Mendez", imageUrl: "/municipal-logo.jpg" }
    ]
};

const DapitanPage: React.FC = () => {
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

export default DapitanPage;
