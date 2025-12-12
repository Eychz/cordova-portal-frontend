'use client';

import React from 'react';
import PageTransition from '../../../components/PageTransition';
import Navbar from '../../../components/Navbar';
import BarangayHeader from '../../../components/barangay/BarangayHeader';
import BarangayAbout from '../../../components/barangay/BarangayAbout';
import BarangayOfficials from '../../../components/barangay/BarangayOfficials';

const barangayInfo = {
    name: "Ibabao",
    tagline: "Unity in Diversity",
    info: {
        description: "Barangay Ibabao is a diverse community that celebrates its multicultural heritage.",
        population: "~3,400",
        mapIframe: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31407.61277928365!2d123.93380599702881!3d10.265483806309566!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a99a155da6301f%3A0xeb8d517d8f7f6d04!2sIbabao%2C%20Cordova%2C%20Cebu!5e0!3m2!1sen!2sph!4v1764847753079!5m2!1sen!2sph" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>'
    },
    barangayOfficials: [
        { position: "Barangay Captain", name: "Gregorio Santos", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Aurora Reyes", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Lorenzo Garcia", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Pilar Lopez", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Benito Martinez", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Soledad Fernandez", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Fabian Rodriguez", imageUrl: "/municipal-logo.jpg" }
    ],
    skOfficials: [
        { position: "SK Chairperson", name: "Diego Herrera", imageUrl: "/municipal-logo.jpg" }
    ]
};

const IbabaoPage: React.FC = () => {
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

export default IbabaoPage;
