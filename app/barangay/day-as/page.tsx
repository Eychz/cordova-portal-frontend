'use client';

import React from 'react';
import PageTransition from '../../../components/PageTransition';
import Navbar from '../../../components/Navbar';
import BarangayHeader from '../../../components/barangay/BarangayHeader';
import BarangayAbout from '../../../components/barangay/BarangayAbout';
import BarangayOfficials from '../../../components/barangay/BarangayOfficials';

const barangayInfo = {
    name: "Day-as",
    tagline: "Forward Together",
    info: {
        description: "Barangay Day-as is a progressive community focused on education and youth development.",
        population: "~2,900",
        mapIframe: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d9337.879255949323!2d123.94366431692232!3d10.253954254189914!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a99bb1ffecd115%3A0xe987885f85b392e4!2sDay-as%2C%20Cordova%2C%20Cebu!5e0!3m2!1sen!2sph!4v1764846978519!5m2!1sen!2sph" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>'
    },
    barangayOfficials: [
        { position: "Barangay Captain", name: "Arturo Campos", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Lidia Paredes", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Pablo Guerrero", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Silvia Vazquez", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Ignacio Pena", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Rafaela Mora", imageUrl: "/municipal-logo.jpg" },
        { position: "Kagawad", name: "Tomas Lara", imageUrl: "/municipal-logo.jpg" }
    ],
    skOfficials: [
        { position: "SK Chairperson", name: "Adriana Silva", imageUrl: "/municipal-logo.jpg" }
    ]
};

const DayAsPage: React.FC = () => {
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

export default DayAsPage;
