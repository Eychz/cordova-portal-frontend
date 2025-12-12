import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

interface HomeLayoutProps {
  children: React.ReactNode;
}

const HomeLayout: React.FC<HomeLayoutProps> = ({ children }) => {
    return (
        <>
            <Navbar />
            {children}
            <Footer />
        </>
    );
};

export default HomeLayout;