'use client';

import React from 'react';
import PageTransition from '../../../components/PageTransition';
import Navbar from '../../../components/Navbar';
import BarangayHeader from '../../../components/barangay/BarangayHeader';
import BarangayAbout from '../../../components/barangay/BarangayAbout';
import BarangayOfficials from '../../../components/barangay/BarangayOfficials';

const barangayInfo = {
    name: "Poblacion",
    tagline: "Heart of Cordova",
    info: {
        description: "Barangay Poblacion serves as the municipal center and administrative hub of Cordova.",
        population: "~5,200",
        mapIframe: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7852.277863509059!2d123.94642079448623!3d10.250377009472736!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a99af518835cd9%3A0x9b54201fef660c0b!2sPoblacion%2C%20Cordova%2C%20Cebu!5e0!3m2!1sen!2sph!4v1764847799314!5m2!1sen!2sph" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>'
    },
    barangayOfficials: [
        { position: "Barangay Captain", name: "Augusto Hernandez", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Carmela Castro", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Esteban Perez", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Guadalupe Alvarez", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Pascual Medina", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Teresita Ruiz", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Valentin Sanchez", imageUrl: "/municipal-logo.jpg" }
    ],
    skOfficials: [
        { position: "SK Chairperson", name: "Nicolas Cortez", imageUrl: "/municipal-logo.jpg" }
    ]
};

const PoblacionPage: React.FC = () => {
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

export default PoblacionPage;
