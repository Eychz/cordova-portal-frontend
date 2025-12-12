'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';
import { authApi } from '../../../lib/authApi';
import { useRouter } from 'next/navigation';

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
        <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4 transition-colors relative">
            {/* Background Image */}
            <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: "url('/auth-background.jpg')",
                    opacity: 0.15,
                    zIndex: 0
                }}
            />
            {/* Form Container with 4:3 ratio */}
            <div 
                className="relative z-10 rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, rgba(100, 20, 0, 0.98) 0%, rgba(139, 25, 25, 0.95) 50%, rgba(100, 20, 0, 0.98) 100%)',
                    boxShadow: '0 8px 32px 0 rgba(100, 20, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                }}
            >
                <div className="flex flex-col md:flex-row">
                    {/* Left Side - Logo Section (40%) */}
                    <div className="md:w-2/5 p-12 flex flex-col items-center justify-center border-r border-white/10">
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

                    {/* Right Side - Form Section (60%) */}
                    <div className="md:w-3/5 p-12 flex flex-col justify-center">
                        <h2 
                            className="text-center text-4xl font-black mb-2 text-white drop-shadow-lg"
                            style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                            FORGOT PASSWORD
                        </h2>
                        <p className="text-center text-white/90 italic text-sm mb-8" style={{ fontFamily: 'Inter, sans-serif' }}>
                            {step === 1 ? 'Enter your email to receive a verification code' : 'Enter code and new password'}
                        </p>

                        {step === 1 ? (
                            <form onSubmit={handleRequestCode} className="space-y-5">
                                <div>
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        required
                                        className="w-full border-2 border-white/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/50 placeholder-gray-400 bg-white/95 backdrop-blur-sm text-black"
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
                                    className="w-full bg-white/95 text-[#641400] py-3 rounded-full text-lg font-bold hover:bg-white hover:shadow-lg transition-all duration-300 mt-8 disabled:opacity-50"
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
                                        className="w-full border-2 border-white/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/50 placeholder-gray-400 bg-white/95 backdrop-blur-sm text-center text-2xl tracking-widest font-bold text-black"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                    />
                                </div>

                                <div className="relative">
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        placeholder="New Password"
                                        required
                                        className="w-full border-2 border-white/30 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-white/50 placeholder-gray-400 bg-white/95 backdrop-blur-sm text-black [&::-ms-reveal]:hidden [&::-webkit-contacts-auto-fill-button]:hidden"
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
                                        className="w-full border-2 border-white/30 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-white/50 placeholder-gray-400 bg-white/95 backdrop-blur-sm text-black [&::-ms-reveal]:hidden [&::-webkit-contacts-auto-fill-button]:hidden"
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
                                    className="w-full bg-white/95 text-[#641400] py-3 rounded-full text-lg font-bold hover:bg-white hover:shadow-lg transition-all duration-300 mt-8 disabled:opacity-50"
                                    style={{ fontFamily: 'Inter, sans-serif' }}
                                >
                                    {loading ? 'Resetting...' : 'Reset Password'}
                                </button>
                            </form>
                        )}

                        <p className="text-center mt-6 text-sm text-white/90" style={{ fontFamily: 'Inter, sans-serif' }}>
                            <a href="/auth/login" className="hover:underline font-semibold hover:text-white transition-colors">
                                Back to Login
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;