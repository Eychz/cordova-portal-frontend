'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';
import { authApi } from '@/lib/authApi';
import Navbar from '@/components/Navbar';

const RegisterPage: React.FC = () => {
    const [firstName, setFirstName] = useState<string>('');
    const [middleName, setMiddleName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [barangay, setBarangay] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [showVerification, setShowVerification] = useState<boolean>(false);
    const [userId, setUserId] = useState<number | null>(null);
    const [verificationCode, setVerificationCode] = useState<string>('');
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

    const barangays = [
        'Alegria', 'Bangbang', 'Buagsong', 'Catarman', 'Cogon', 
        'Dapitan', 'Day-as', 'Ibabao', 'Gabi', 'Gilutongan', 
        'Pilipog', 'Poblacion', 'San Miguel'
    ];

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const result = await authApi.register({
                email,
                password,
                firstName,
                middleName,
                lastName,
                barangay,
            });

            setUserId(result.userId);
            setShowVerification(true);
            setSuccess('Registration successful! Please check your email for the verification code.');
        } catch (err: any) {
            const errorMsg = err.message || 'Registration failed';
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleVerification = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const result = await authApi.verifyEmail({
                userId: userId!,
                code: verificationCode,
            });

            // Auto-login the user by storing token and user data
            if (result.token && result.user) {
                localStorage.setItem('token', result.token);
                localStorage.setItem('user', JSON.stringify(result.user));
            }

            setSuccess('Email verified successfully! Logging you in...');
            setTimeout(() => {
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

    const handleResendCode = async () => {
        if (!email) {
            setError('Email not found. Please register again.');
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
            setResendCountdown(60);
        } catch (err: any) {
            const errorMsg = err.message || 'Failed to resend verification code';
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
                            Join our community to access municipal services online
                        </p>
                        <div className="mt-6 text-white/60 text-xs text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Building a Better Tomorrow Together
                        </div>
                    </div>
                </div>

                {/* Right Side - Form Section (50%) */}
                <div className="w-full md:w-1/2 flex flex-col justify-center p-8 sm:p-12 lg:p-24 bg-white dark:bg-gray-900 z-10 shadow-[-10px_0_30px_rgba(0,0,0,0.1)] overflow-y-auto">
                        {!showVerification ? (
                            <>
                                <h2 
                                    className="text-center text-4xl font-black mb-2 text-red-900 dark:text-white drop-shadow-sm"
                                    style={{ fontFamily: 'Inter, sans-serif' }}
                                >
                                    REGISTER
                                </h2>
                                <p className="text-center text-gray-600 dark:text-gray-400 italic text-sm mb-8" style={{ fontFamily: 'Inter, sans-serif' }}>
                                    Fill up the requirements
                                </p>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            placeholder="First Name"
                                            required
                                            className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-400 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            style={{ fontFamily: 'Inter, sans-serif' }}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Middle Name"
                                            className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-400 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
                                            value={middleName}
                                            onChange={(e) => setMiddleName(e.target.value)}
                                            style={{ fontFamily: 'Inter, sans-serif' }}
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Last Name"
                                        required
                                        className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-400 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        style={{ fontFamily: 'Inter, sans-serif' }}
                                    />
                                    <input
                                        type="email"
                                        placeholder="Email Address"
                                        required
                                        className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-400 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        style={{ fontFamily: 'Inter, sans-serif' }}
                                    />
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Password"
                                            required
                                            className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-400 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            style={{ fontFamily: 'Inter, sans-serif' }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Confirm Password"
                                            required
                                            className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-400 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
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
                                    <select
                                        required
                                        className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white transition-colors"
                                        value={barangay}
                                        onChange={(e) => setBarangay(e.target.value)}
                                        style={{ fontFamily: 'Inter, sans-serif' }}
                                    >
                                        <option value="">Select Barangay</option>
                                        {barangays.map((brgy) => (
                                            <option key={brgy} value={brgy}>{brgy}</option>
                                        ))}
                                    </select>

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
                                        className="w-full bg-gradient-to-r from-red-600 to-red-800 text-white py-3 rounded-full text-lg font-bold hover:shadow-lg transition-all duration-300 mt-4 disabled:opacity-50 hover:-translate-y-1"
                                        style={{ fontFamily: 'Inter, sans-serif' }}
                                    >
                                        {loading ? 'Registering...' : 'Register'}
                                    </button>
                                </form>
                            </>
                        ) : (
                            <>
                                <h2 
                                    className="text-center text-4xl font-black mb-2 text-red-900 dark:text-white drop-shadow-sm"
                                    style={{ fontFamily: 'Inter, sans-serif' }}
                                >
                                    VERIFY EMAIL
                                </h2>
                                <p className="text-center text-gray-600 dark:text-gray-400 italic text-sm mb-8" style={{ fontFamily: 'Inter, sans-serif' }}>
                                    Enter the 6-digit code sent to your email
                                </p>

                                <form onSubmit={handleVerification} className="space-y-5">
                                    <input
                                        type="text"
                                        placeholder="6-Digit Code"
                                        required
                                        maxLength={6}
                                        className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-gray-400 bg-gray-50 dark:bg-gray-800 text-center text-2xl tracking-widest font-bold text-gray-900 dark:text-white transition-colors"
                                        value={verificationCode}
                                        onChange={(e) => setVerificationCode(e.target.value)}
                                    />
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
                                        {loading ? 'Verifying...' : 'Verify Email'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleResendCode}
                                        disabled={loading || resendCountdown > 0}
                                        className="w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-2 rounded-full text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 border border-gray-200 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                        style={{ fontFamily: 'Inter, sans-serif' }}
                                    >
                                        {loading ? 'Sending...' : resendCountdown > 0 ? `Resend in ${resendCountdown}s` : 'Resend Verification Code'}
                                    </button>
                                </form>
                            </>
                        )}

                        <p className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Already have an account?{' '}
                            <a href="/auth/login" className="hover:underline font-semibold hover:text-red-600 dark:hover:text-red-400 transition-colors">
                                Login
                            </a>
                        </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
