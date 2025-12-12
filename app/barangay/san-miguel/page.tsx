'use client';

import React from 'react';
import PageTransition from '../../../components/PageTransition';
import Navbar from '../../../components/Navbar';
import BarangayHeader from '../../../components/barangay/BarangayHeader';
import BarangayAbout from '../../../components/barangay/BarangayAbout';
import BarangayOfficials from '../../../components/barangay/BarangayOfficials';

const barangayInfo = {
    name: "San Miguel",
    tagline: "Faith and Community",
    info: {
        description: "Barangay San Miguel is a faith-based community with strong religious traditions and values.",
        population: "~2,950",
        mapIframe: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13205.88901274698!2d123.9435440748035!3d10.250751310191692!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a99a5af1c7e685%3A0x64a0b46710343631!2sSan%20Miguel%2C%20Cordova%2C%20Cebu!5e0!3m2!1sen!2sph!4v1764847808443!5m2!1sen!2sph" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>'
    },
    barangayOfficials: [
        { position: "Barangay Captain", name: "Fortunato Iglesias", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Asuncion Nunez", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Modesto Fuentes", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Milagros Molina", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Casimiro Carrillo", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Purificacion Delgado", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Lazaro Herrera", imageUrl: "/municipal-logo.jpg" }
    ],
    skOfficials: [
        { position: "SK Chairperson", name: "Isabela Mendez", imageUrl: "/municipal-logo.jpg" }
    ]
};

const SanMiguelPage: React.FC = () => {
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

export default SanMiguelPage;
