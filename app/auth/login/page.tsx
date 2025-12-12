'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';
import { authApi } from '../../../lib/authApi';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [showVerification, setShowVerification] = useState<boolean>(false);
    const [verificationCode, setVerificationCode] = useState<string>('');
    const [userId, setUserId] = useState<number | null>(null);
    const [resendCountdown, setResendCountdown] = useState<number>(0);
    const router = useRouter();

    // Countdown timer for resend button
    useEffect(() => {
        if (resendCountdown > 0) {
            const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCountdown]);

    useEffect(() => {
        // Redirect if already logged in
        const token = localStorage.getItem('token');
        if (token) {
            router.push('/home');
        }
    }, [router]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const result = await authApi.login({ email, password });
            
            // Store token in localStorage
            localStorage.setItem('token', result.token);
            localStorage.setItem('user', JSON.stringify(result.user));

            setSuccess('Login successful! Redirecting...');
            
            // Redirect based on user role
            setTimeout(() => {
                if (result.user.role === 'admin') {
                    router.push('/admin/dashboard');
                } else {
                    router.push('/dashboard');
                }
            }, 800);
        } catch (err: any) {
            const errorMsg = err.message || 'Login failed';
            
            // Check if error is about email not being verified
            if (err.requiresVerification || errorMsg === 'Email not verified') {
                setError('Please verify your email before logging in. Check your email for the verification code.');
                setShowVerification(true);
                if (err.userId) {
                    setUserId(err.userId);
                }
            } else {
                setError(errorMsg);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleVerification = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        if (!userId) {
            setError('User ID not found. Please try logging in again.');
            setLoading(false);
            return;
        }

        try {
            const result = await authApi.verifyEmail({
                userId,
                code: verificationCode,
            });

            // Auto-login the user
            if (result.token && result.user) {
                localStorage.setItem('token', result.token);
                localStorage.setItem('user', JSON.stringify(result.user));
                console.log('Email verified and user logged in:', result.user);
            }

            setSuccess('Email verified! Redirecting to login...');
            setTimeout(() => {
                setShowVerification(false);
                setVerificationCode('');
                setUserId(null);
                // Redirect to home as the user is now logged in
                if (result.user.role === 'admin') {
                    router.push('/admin/dashboard');
                } else {
                    router.push('/dashboard');
                }
            }, 1500);
        } catch (err: any) {
            const errorMsg = err.message || 'Verification failed';
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleResendVerificationCode = async () => {
        if (!email) {
            setError('Email not found. Please try logging in again.');
            return;
        }

        if (resendCountdown > 0) {
            setError(`Please wait ${resendCountdown} seconds before requesting a new code`);
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/resend-verification`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Failed to resend code');

            setSuccess('Verification code resent to your email! Check your inbox.');
            setError('');
            setResendCountdown(60); // Start 60 second countdown
        } catch (err: any) {
            const errorMsg = err.message || 'Failed to resend verification code';
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
                            Your Gateway to Municipal Services and Community Engagement
                        </p>
                        <div className="mt-6 text-white/60 text-xs text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Established 1864
                        </div>
                    </div>

                    {/* Right Side - Form Section (60%) */}
                    <div className="md:w-3/5 p-12 flex flex-col justify-center">
                        {!showVerification ? (
                            <>
                                <h2 
                                    className="text-center text-4xl font-black mb-2 text-white drop-shadow-lg"
                                    style={{ fontFamily: 'Inter, sans-serif' }}
                                >
                                    LOGIN
                                </h2>
                                <p className="text-center text-white/90 italic text-sm mb-8" style={{ fontFamily: 'Inter, sans-serif' }}>
                                    Enter your credentials
                                </p>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div>
                                        <input
                                            type="email"
                                            placeholder="Contact Email"
                                            required
                                            disabled={showVerification}
                                            className="w-full border-2 border-white/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/50 placeholder-gray-400 bg-white/95 backdrop-blur-sm disabled:opacity-50 text-black"
                                            value={email}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                            style={{ fontFamily: 'Inter, sans-serif' }}
                                        />
                                    </div>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Password"
                                            required
                                            disabled={showVerification}
                                            className="w-full border-2 border-white/30 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-white/50 placeholder-gray-400 bg-white/95 backdrop-blur-sm disabled:opacity-50 text-black [&::-ms-reveal]:hidden [&::-webkit-contacts-auto-fill-button]:hidden"
                                            value={password}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                            style={{ fontFamily: 'Inter, sans-serif' }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors"
                                            disabled={showVerification}
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
                                        className="w-full bg-white/95 text-[#641400] py-3 rounded-full text-lg font-bold hover:bg-white hover:shadow-lg transition-all duration-300 mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
                                        style={{ fontFamily: 'Inter, sans-serif' }}
                                    >
                                        {loading ? 'Logging in...' : 'Login'}
                                    </button>
                                </form>
                            </>
                        ) : (
                            <>
                                <h2 
                                    className="text-center text-4xl font-black mb-2 text-white drop-shadow-lg"
                                    style={{ fontFamily: 'Inter, sans-serif' }}
                                >
                                    VERIFY EMAIL
                                </h2>
                                <p className="text-center text-white/90 italic text-sm mb-8" style={{ fontFamily: 'Inter, sans-serif' }}>
                                    Enter the verification code sent to your email
                                </p>

                                <form onSubmit={handleVerification} className="space-y-5">
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Verification Code"
                                            required
                                            className="w-full border-2 border-white/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/50 placeholder-gray-400 bg-white/95 backdrop-blur-sm"
                                            value={verificationCode}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVerificationCode(e.target.value)}
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
                                        className="w-full bg-white/95 text-[#641400] py-3 rounded-full text-lg font-bold hover:bg-white hover:shadow-lg transition-all duration-300 mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
                                        style={{ fontFamily: 'Inter, sans-serif' }}
                                    >
                                        {loading ? 'Verifying...' : 'Verify Email'}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleResendVerificationCode}
                                        disabled={loading || resendCountdown > 0}
                                        className="w-full bg-white/20 text-white py-2 rounded-full text-sm font-semibold hover:bg-white/30 transition-all duration-300 border border-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
                                        style={{ fontFamily: 'Inter, sans-serif' }}
                                    >
                                        {loading ? 'Sending...' : resendCountdown > 0 ? `Resend in ${resendCountdown}s` : 'Resend Verification Code'}
                                    </button>
                                </form>

                                <button
                                    onClick={() => {
                                        setShowVerification(false);
                                        setVerificationCode('');
                                        setError('');
                                        setSuccess('');
                                    }}
                                    className="text-sm text-white/90 hover:text-white font-semibold mt-4 text-center"
                                    style={{ fontFamily: 'Inter, sans-serif' }}
                                >
                                    Back to Login
                                </button>
                            </>
                        )}

                        <div className="text-center mt-6 space-y-2">
                            <p className="text-sm text-white/90" style={{ fontFamily: 'Inter, sans-serif' }}>
                                <a href="/auth/forgot-password" className="hover:underline font-semibold hover:text-white transition-colors">
                                    Forgot Password?
                                </a>
                            </p>
                            <p className="text-sm text-white/90" style={{ fontFamily: 'Inter, sans-serif' }}>
                                Don't have an account?{' '}
                                <a href="/auth/register" className="hover:underline font-semibold hover:text-white transition-colors">
                                    Register
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;