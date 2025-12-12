'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Landmark, MapPin, Phone, Mail, Clock, Siren, X } from 'lucide-react';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [showSitemapModal, setShowSitemapModal] = useState(false);

    const quickLinks = [
        { name: 'Home', href: '/home' },
        { name: 'About', href: '/about' },
        { name: 'Services', href: '/services' },
        { name: 'Community', href: '/community' },
        { name: 'Barangays', href: '/barangay' },
        { name: 'Rescue Desk', href: '/rescue-desk' }
    ];

    const services = [
        { name: 'Business Permit', href: '/services' },
        { name: 'Building Permit', href: '/services' },
        { name: 'Birth Certificate', href: '/services' },
        { name: 'Marriage Certificate', href: '/services' },
        { name: 'Barangay Clearance', href: '/services' }
    ];

    return (
        <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-red-900 text-white pt-16 pb-8 transition-colors">
            <div className="max-w-7xl mx-auto px-4">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* About Section */}
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                                <Landmark className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white">Cordova</h3>
                                <p className="text-xs text-gray-300">Municipality Portal</p>
                            </div>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed mb-4">
                            Your gateway to government services, community updates, and local information for the Municipality of Cordova, Cebu.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-black text-white mb-6">Quick Links</h4>
                        <ul className="space-y-3">
                            {quickLinks.map((link, index) => (
                                <li key={index}>
                                    <Link href={link.href} className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 group">
                                        <span className="text-red-400 group-hover:translate-x-1 transition-transform">›</span>
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="text-lg font-black text-white mb-6">Services</h4>
                        <ul className="space-y-3">
                            {services.map((service, index) => (
                                <li key={index}>
                                    <Link href={service.href} className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 group">
                                        <span className="text-red-400 group-hover:translate-x-1 transition-transform">›</span>
                                        {service.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact & Community */}
                    <div>
                        <h4 className="text-lg font-black text-white mb-6">Contact Us</h4>
                        <div className="space-y-4 mb-6">
                            <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                <div className="text-sm text-gray-300">
                                    <p className="font-semibold text-white mb-1">Municipal Hall</p>
                                    <p>Poblacion, Cordova</p>
                                    <p>Cebu 6017, Philippines</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Phone className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                <div className="text-sm text-gray-300">
                                    <p className="font-semibold text-white mb-1">Phone</p>
                                    <p>(032) 236-8702</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Mail className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                <div className="text-sm text-gray-300">
                                    <p className="font-semibold text-white mb-1">Email</p>
                                    <p>info@cordova.gov.ph</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Clock className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                                <div className="text-sm text-gray-300">
                                    <p className="font-semibold text-white mb-1">Office Hours</p>
                                    <p>Mon-Fri: 8:00 AM - 5:00 PM</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Emergency Hotlines Banner */}
                <div className="bg-red-600/20 border border-red-500/30 rounded-2xl p-6 mb-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <Siren className="w-10 h-10 text-red-400" />
                            <div>
                                <h5 className="text-lg font-bold text-white">Emergency Hotlines</h5>
                                <p className="text-sm text-gray-300">Available 24/7 for emergencies</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-6 text-center">
                            <div>
                                <p className="text-xs text-gray-300 mb-1">Police</p>
                                <p className="text-lg font-bold text-white">0998-5986-392</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-300 mb-1">Fire</p>
                                <p className="text-lg font-bold text-white">0933-394-9073</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-300 mb-1">Medical</p>
                                <p className="text-lg font-bold text-white">0967-491-5579</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-gray-400">
                            © {currentYear} Municipality of Cordova. All rights reserved.
                        </p>
                        <div className="flex gap-6 text-sm text-gray-400">
                            <button onClick={() => setShowPrivacyModal(true)} className="hover:text-white transition-colors">Privacy Policy</button>
                            <button onClick={() => setShowTermsModal(true)} className="hover:text-white transition-colors">Terms of Service</button>
                            <button onClick={() => setShowSitemapModal(true)} className="hover:text-white transition-colors">Sitemap</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Privacy Policy Modal */}
            {showPrivacyModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowPrivacyModal(false)}>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
                            <h2 className="text-2xl font-black text-red-900 dark:text-white">Privacy Policy</h2>
                            <button onClick={() => setShowPrivacyModal(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4 text-gray-700 dark:text-gray-300">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Effective Date: November 26, 2025</p>
                            
                            <section>
                                <h3 className="text-lg font-bold text-red-900 dark:text-white mb-2">1. Information We Collect</h3>
                                <p>The Municipality of Cordova collects personal information necessary to provide government services, including:</p>
                                <ul className="list-disc ml-6 mt-2 space-y-1">
                                    <li>Name, address, and contact information</li>
                                    <li>Government-issued identification numbers</li>
                                    <li>Service request details and transaction history</li>
                                    <li>Website usage data and cookies</li>
                                </ul>
                            </section>

                            <section>
                                <h3 className="text-lg font-bold text-red-900 dark:text-white mb-2">2. How We Use Your Information</h3>
                                <p>Your information is used to:</p>
                                <ul className="list-disc ml-6 mt-2 space-y-1">
                                    <li>Process government service requests and applications</li>
                                    <li>Communicate important updates and announcements</li>
                                    <li>Improve our services and website functionality</li>
                                    <li>Comply with legal obligations and maintain public records</li>
                                </ul>
                            </section>

                            <section>
                                <h3 className="text-lg font-bold text-red-900 dark:text-white mb-2">3. Data Protection</h3>
                                <p>We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. All data is stored securely and access is limited to authorized personnel only.</p>
                            </section>

                            <section>
                                <h3 className="text-lg font-bold text-red-900 dark:text-white mb-2">4. Your Rights</h3>
                                <p>Under the Data Privacy Act of 2012, you have the right to:</p>
                                <ul className="list-disc ml-6 mt-2 space-y-1">
                                    <li>Access your personal information</li>
                                    <li>Request corrections to inaccurate data</li>
                                    <li>Object to certain data processing activities</li>
                                    <li>Request data deletion (subject to legal requirements)</li>
                                </ul>
                            </section>

                            <section>
                                <h3 className="text-lg font-bold text-red-900 dark:text-white mb-2">5. Contact Us</h3>
                                <p>For privacy concerns or data protection inquiries, contact our Data Protection Officer at:</p>
                                <p className="mt-2">Email: dpo@cordova.gov.ph<br/>Phone: (032) 495-9090</p>
                            </section>
                        </div>
                    </div>
                </div>
            )}

            {/* Terms of Service Modal */}
            {showTermsModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowTermsModal(false)}>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
                            <h2 className="text-2xl font-black text-red-900 dark:text-white">Terms of Service</h2>
                            <button onClick={() => setShowTermsModal(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4 text-gray-700 dark:text-gray-300">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Last Updated: November 26, 2025</p>
                            
                            <section>
                                <h3 className="text-lg font-bold text-red-900 dark:text-white mb-2">1. Acceptance of Terms</h3>
                                <p>By accessing and using the Cordova Municipality Portal, you agree to comply with these Terms of Service. If you do not agree, please discontinue use of this website.</p>
                            </section>

                            <section>
                                <h3 className="text-lg font-bold text-red-900 dark:text-white mb-2">2. Use of Services</h3>
                                <p>This portal provides access to government services and information. You agree to:</p>
                                <ul className="list-disc ml-6 mt-2 space-y-1">
                                    <li>Provide accurate and truthful information</li>
                                    <li>Use services only for lawful purposes</li>
                                    <li>Not interfere with portal operations or security</li>
                                    <li>Respect intellectual property rights</li>
                                </ul>
                            </section>

                            <section>
                                <h3 className="text-lg font-bold text-red-900 dark:text-white mb-2">3. Account Responsibilities</h3>
                                <p>If you create an account, you are responsible for maintaining the confidentiality of your credentials and all activities under your account. Notify us immediately of any unauthorized access.</p>
                            </section>

                            <section>
                                <h3 className="text-lg font-bold text-red-900 dark:text-white mb-2">4. Service Availability</h3>
                                <p>We strive to maintain continuous service availability but do not guarantee uninterrupted access. Services may be temporarily unavailable due to maintenance, updates, or technical issues.</p>
                            </section>

                            <section>
                                <h3 className="text-lg font-bold text-red-900 dark:text-white mb-2">5. Limitation of Liability</h3>
                                <p>The Municipality of Cordova is not liable for any indirect, incidental, or consequential damages arising from the use of this portal. Information provided is for general purposes and should not be considered as legal advice.</p>
                            </section>

                            <section>
                                <h3 className="text-lg font-bold text-red-900 dark:text-white mb-2">6. Changes to Terms</h3>
                                <p>We reserve the right to modify these terms at any time. Continued use of the portal after changes constitutes acceptance of the updated terms.</p>
                            </section>

                            <section>
                                <h3 className="text-lg font-bold text-red-900 dark:text-white mb-2">7. Governing Law</h3>
                                <p>These terms are governed by the laws of the Republic of the Philippines. Any disputes shall be resolved in the appropriate courts of Cebu.</p>
                            </section>
                        </div>
                    </div>
                </div>
            )}

            {/* Sitemap Modal */}
            {showSitemapModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowSitemapModal(false)}>
                    <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
                            <h2 className="text-2xl font-black text-red-900 dark:text-white">Sitemap</h2>
                            <button onClick={() => setShowSitemapModal(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6">
                            {/* Map Section */}
                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-red-900 dark:text-white mb-4">Cordova, Cebu Location</h3>
                                <div className="w-full h-96 bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62834.14904857935!2d123.92915347910158!3d10.253564400000007!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a999258575e66d%3A0x6a3d33be73271790!2sCordova%2C%20Cebu!5e0!3m2!1sen!2sph!4v1732614000000!5m2!1sen!2sph"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    ></iframe>
                                </div>
                            </div>

                            {/* Site Navigation Links */}
                            <div className="grid md:grid-cols-3 gap-8">
                                <div>
                                    <h3 className="text-lg font-bold text-red-900 dark:text-white mb-4">Main Pages</h3>
                                    <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                                        <li><Link href="/home" className="hover:text-red-600 dark:hover:text-red-400">Home</Link></li>
                                        <li><Link href="/about" className="hover:text-red-600 dark:hover:text-red-400">About</Link></li>
                                        <li><Link href="/services" className="hover:text-red-600 dark:hover:text-red-400">Services</Link></li>
                                        <li><Link href="/community" className="hover:text-red-600 dark:hover:text-red-400">Community</Link></li>
                                        <li><Link href="/rescue-desk" className="hover:text-red-600 dark:hover:text-red-400">Rescue Desk</Link></li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-red-900 dark:text-white mb-4">Barangays</h3>
                                    <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                                        <li><Link href="/barangay/poblacion" className="hover:text-red-600 dark:hover:text-red-400">Poblacion</Link></li>
                                        <li><Link href="/barangay/alegria" className="hover:text-red-600 dark:hover:text-red-400">Alegria</Link></li>
                                        <li><Link href="/barangay/bangbang" className="hover:text-red-600 dark:hover:text-red-400">Bangbang</Link></li>
                                        <li><Link href="/barangay/buagsong" className="hover:text-red-600 dark:hover:text-red-400">Buagsong</Link></li>
                                        <li><Link href="/barangay/catarman" className="hover:text-red-600 dark:hover:text-red-400">Catarman</Link></li>
                                        <li><Link href="/barangay/cogon" className="hover:text-red-600 dark:hover:text-red-400">Cogon</Link></li>
                                        <li><Link href="/barangay/dapitan" className="hover:text-red-600 dark:hover:text-red-400">Dapitan</Link></li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-red-900 dark:text-white mb-4">More Barangays</h3>
                                    <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                                        <li><Link href="/barangay/day-as" className="hover:text-red-600 dark:hover:text-red-400">Day-as</Link></li>
                                        <li><Link href="/barangay/gabi" className="hover:text-red-600 dark:hover:text-red-400">Gabi</Link></li>
                                        <li><Link href="/barangay/gilutongan" className="hover:text-red-600 dark:hover:text-red-400">Gilutongan</Link></li>
                                        <li><Link href="/barangay/ibabao" className="hover:text-red-600 dark:hover:text-red-400">Ibabao</Link></li>
                                        <li><Link href="/barangay/pilipog" className="hover:text-red-600 dark:hover:text-red-400">Pilipog</Link></li>
                                        <li><Link href="/barangay/san-miguel" className="hover:text-red-600 dark:hover:text-red-400">San Miguel</Link></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </footer>
    );
};

export default Footer;