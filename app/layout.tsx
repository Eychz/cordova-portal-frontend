import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '../contexts/ThemeContext';
import { Toaster } from 'react-hot-toast';
import ScrollToTop from '../components/ScrollToTop';
import Providers from '../components/Providers';

export const metadata: Metadata = {
    title: 'eCordova Portal',
    description: 'Official Portal of the Municipality of Cordova, Cebu',
    icons: {
        icon: '/municipal-logo.jpg',
        shortcut: '/municipal-logo.jpg',
        apple: '/municipal-logo.jpg',
    },
};

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <title>eCordova Portal</title>
                <link rel="icon" href="/municipal-logo.jpg" type="image/jpeg" />
                <link rel="shortcut icon" href="/municipal-logo.jpg" type="image/jpeg" />
                <link rel="apple-touch-icon" href="/municipal-logo.jpg" />
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            try {
                                const theme = localStorage.getItem('theme');
                                if (theme === 'dark') {
                                    document.documentElement.classList.add('dark');
                                } else {
                                    document.documentElement.classList.remove('dark');
                                }
                            } catch (e) {}
                        `,
                    }}
                />
            </head>
            <body className="bg-white dark:bg-gray-900 transition-colors duration-300">
                <Providers>
                    <ThemeProvider>
                        <ScrollToTop />
                        {children}
                        <Toaster 
                            position="top-right"
                            toastOptions={{
                                duration: 4000,
                                style: {
                                    background: '#363636',
                                    color: '#fff',
                                },
                                success: {
                                    duration: 3000,
                                    iconTheme: {
                                        primary: '#4ade80',
                                        secondary: '#fff',
                                    },
                                },
                                error: {
                                    duration: 4000,
                                    iconTheme: {
                                        primary: '#ef4444',
                                        secondary: '#fff',
                                    },
                                },
                            }}
                        />
                    </ThemeProvider>
                </Providers>
            </body>
        </html>
    );
};

export default Layout;