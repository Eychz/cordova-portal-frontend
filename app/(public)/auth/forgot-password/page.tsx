'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';
import { authApi } from '@/lib/authApi';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [code, setCode] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [step, setStep] = useState<number>(1);
    const router = useRouter();

    useEffect(() => {
        // Redirect if already logged in
        const token = localStorage.getItem('token');
        if (token) {
            router.push('/home');
        }
    }, [router]);

    const handleRequestCode = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            await authApi.forgotPassword(email);
            setSuccess('Password reset code sent! Check your email.');
            setStep(2);
        } catch (err: any) {
            const errorMsg = err.message || 'Request failed';
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            await authApi.resetPassword({
                email,
                code,
                newPassword,
            });

            setSuccess('Password reset successful! Redirecting to login...');
            setTimeout(() => router.push('/auth/login'), 1500);
        } catch (err: any) {
            const errorMsg = err.message || 'Password reset failed';
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col transition-colors">
            <Navbar />
            <div className="flex-1 flex flex-col md:flex-row relative">
                {/* Left Side - Logo and Details (50%) */}
                <div 
                    className="w-full md:w-1/2 relative flex flex-col items-center justify-center p-12 overflow-hidden hidden md:flex"
                    style={{
                        background: 'linear-gradient(135deg, rgba(100, 20, 0, 0.98) 0%, rgba(139, 25, 25, 0.95) 50%, rgba(100, 20, 0, 0.98) 100%)',
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
                        <Image
                            src="/municipal-logo.jpg"
                            alt="Municipality of Cordova Logo"
                            width={180}
                            height={180}
                            className="rounded-full shadow-2xl mb-6"
                            priority
                        />
                        <h3 className="text-white text-2xl font-bold text-center mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Municipality of Cordova
                        </h3>
                        <p className="text-white/80 text-center text-sm leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Secure your account and recover access to municipal services
                        </p>
                        <div className="mt-6 text-white/60 text-xs text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
                            24/7 Account Support
                        </div>
                    </div>
                </div>

                {/* Right Side - Form Section (50%) */}
                <div className="w-full md:w-1/2 flex flex-col justify-center p-8 sm:p-12 lg:p-24 bg-white dark:bg-gray-900 z-10 shadow-[-10px_0_30px_rgba(0,0,0,0.1)] overflow-y-auto">
                        <h2 
                            className="text-center text-4xl font-black mb-2 text-red-900 dark:text-white drop-shadow-sm"
                            style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                            FORGOT PASSWORD
                        </h2>
                        <p className="text-center text-gray-600 dark:text-gray-400 italic text-sm mb-8" style={{ fontFamily: 'Inter, sans-serif' }}>
                            {step === 1 ? 'Enter your email to receive a verification code' : 'Enter code and new password'}
                        </p>

                        {step === 1 ? (
                            <form onSubmit={handleRequestCode} className="space-y-5">
                                <div>
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        required
                                        className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-400 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
                                        value={email}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                        style={{ fontFamily: 'Inter, sans-serif' }}
                                    />
                                </div>

                                {error && (
                                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">
                                        {error}
                                    </div>
                                )}

                                {success && (
                                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg text-sm">
                                        {success}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-red-600 to-red-800 text-white py-3 rounded-full text-lg font-bold hover:shadow-lg transition-all duration-300 mt-8 disabled:opacity-50 hover:-translate-y-1"
                                    style={{ fontFamily: 'Inter, sans-serif' }}
                                >
                                    {loading ? 'Sending...' : 'Send Verification Code'}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleResetPassword} className="space-y-5">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="6-Digit Code"
                                        required
                                        maxLength={6}
                                        className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-400 bg-gray-50 dark:bg-gray-800 text-center text-2xl tracking-widest font-bold text-gray-900 dark:text-white transition-colors"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                    />
                                </div>

                                <div className="relative">
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        placeholder="New Password"
                                        required
                                        className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-400 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white transition-colors [&::-ms-reveal]:hidden [&::-webkit-contacts-auto-fill-button]:hidden"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        style={{ fontFamily: 'Inter, sans-serif' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors"
                                    >
                                        {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>

                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm Password"
                                        required
                                        className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-400 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white transition-colors [&::-ms-reveal]:hidden [&::-webkit-contacts-auto-fill-button]:hidden"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        style={{ fontFamily: 'Inter, sans-serif' }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>

                                {error && (
                                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">
                                        {error}
                                    </div>
                                )}

                                {success && (
                                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg text-sm">
                                        {success}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-red-600 to-red-800 text-white py-3 rounded-full text-lg font-bold hover:shadow-lg transition-all duration-300 mt-8 disabled:opacity-50 hover:-translate-y-1"
                                    style={{ fontFamily: 'Inter, sans-serif' }}
                                >
                                    {loading ? 'Resetting...' : 'Reset Password'}
                                </button>
                            </form>
                        )}

                        <p className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>
                            <a href="/auth/login" className="hover:underline font-semibold hover:text-red-600 dark:hover:text-red-400 transition-colors">
                                Back to Login
                            </a>
                        </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
