'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col transition-colors">
            <div className="flex-1 flex flex-col md:flex-row relative">
                {/* Left Side - Logo and Details (50%) */}
                <div
                    className="w-full md:w-1/2 relative flex flex-col items-center justify-center p-12 overflow-hidden hidden md:flex"
                    style={{
                        background: 'linear-gradient(135deg, #450a0a 0%, #7f1d1d 50%, #450a0a 100%)',
                    }}
                >
                    {/* Background Image overlay */}
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
                        style={{
                            backgroundImage: "url('/auth-background.jpg')",
                            opacity: 0.15,
                        }}
                    />
                    <div className="relative z-10 flex flex-col items-center">
                        <Link
                            href="/home"
                            className="group transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] transform hover:scale-110 hover:rotate-3 active:scale-95"
                        >
                            <Image
                                src="/municipal-logo.jpg"
                                alt="Municipality of Cordova Logo"
                                width={180}
                                height={180}
                                className="rounded-full shadow-2xl mb-6 border-4 border-white/20 transition-all duration-700 group-hover:border-white/40 group-hover:shadow-[0_0_50px_rgba(255,255,255,0.2)]"
                                priority
                            />
                        </Link>
                        <h3 className="text-white text-2xl font-bold text-center mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Municipality of Cordova
                        </h3>
                        <p className="text-white/80 text-center text-sm leading-relaxed max-w-xs" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Your Gateway to Municipal Services and Community Engagement
                        </p>
                        <div className="mt-8 flex flex-col items-center gap-2">
                            <div className="w-12 h-1 bg-white/30 rounded-full"></div>
                            <div className="text-white/60 text-xs text-center tracking-widest uppercase font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                                Established 1864
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form Section (50%) */}
                <div className="w-full md:w-1/2 flex flex-col justify-center p-8 sm:p-12 lg:p-24 bg-white dark:bg-gray-900 z-10 shadow-[-10px_0_30px_rgba(0,0,0,0.05)] overflow-y-auto min-h-screen md:min-h-0">
                    <div className="max-w-md w-full mx-auto">
                        {/* Mobile Logo - Only visible on small screens */}
                        <div className="md:hidden flex justify-center mb-8">
                            <Link href="/home" className="transition-transform active:scale-90">
                                <Image
                                    src="/municipal-logo.jpg"
                                    alt="Municipality of Cordova Logo"
                                    width={80}
                                    height={80}
                                    className="rounded-full shadow-lg border-2 border-red-100 dark:border-red-900/30"
                                />
                            </Link>
                        </div>
                        {children}
                        <p className="text-[10px] text-gray-500 py-5 text-center">
                            This site is protected by reCAPTCHA and the Google
                            <a href="https://policies.google.com/privacy" className="underline text-blue-600"> Privacy Policy </a> and
                            <a href="https://policies.google.com/terms" className="underline text-blue-600"> Terms of Service </a> apply.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
