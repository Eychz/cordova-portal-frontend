'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';
import { authApi } from '../../../lib/authApi';

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
            // Debug log to verify data before sending
            console.log('Registration data:', {
                email,
                password: '***',
                firstName,
                middleName,
                lastName,
                barangay,
            });
            
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
                console.log('User auto-logged in after email verification:', result.user);
            }

            setSuccess('Email verified successfully! Logging you in and redirecting to home...');
            setTimeout(() => router.push('/home'), 1500);
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
            // Call the backend to resend verification code
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
        <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4 py-8 transition-colors relative">
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
                            Join our community and access exclusive services for Cordova residents
                        </p>
                        <div className="mt-6 text-white/60 text-xs text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Building a Better Tomorrow Together
                        </div>
                    </div>

                    {/* Right Side - Form Section (60%) */}
                    <div className="md:w-3/5 p-12 flex flex-col justify-center">
                        <h2 
                            className="text-center text-4xl font-black mb-2 text-white drop-shadow-lg"
                            style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                            REGISTER AS CORDOVANHON
                        </h2>
                        <p className="text-center text-white/90 italic text-sm mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Fill up the following requirements
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <input
                                    type="text"
                                    placeholder="First Name"
                                    required
                                    className="w-full border-2 border-white/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/50 placeholder-gray-400 bg-white/95 backdrop-blur-sm text-sm black text-black"
                                    value={firstName}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
                                    style={{ fontFamily: 'Inter, sans-serif' }}
                                />
                            </div>

                            <div>
                                <input
                                    type="text"
                                    placeholder="Middle Name"
                                    className="w-full border-2 border-white/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/50 placeholder-gray-400 bg-white/95 backdrop-blur-sm text-sm text-black"
                                    value={middleName}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMiddleName(e.target.value)}
                                    style={{ fontFamily: 'Inter, sans-serif' }}
                                />
                            </div>

                            <div>
                                <input
                                    type="text"
                                    placeholder="Last Name"
                                    required
                                    className="w-full border-2 border-white/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/50 placeholder-gray-400 bg-white/95 backdrop-blur-sm text-sm text-black"
                                    value={lastName}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
                                    style={{ fontFamily: 'Inter, sans-serif' }}
                                />
                            </div>

                            <div>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    required
                                    className="w-full border-2 border-white/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/50 placeholder-gray-400 bg-white/95 backdrop-blur-sm text-sm text-black"
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
                                    className="w-full border-2 border-white/30 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-white/50 placeholder-gray-400 bg-white/95 backdrop-blur-sm text-sm text-black [&::-ms-reveal]:hidden [&::-webkit-contacts-auto-fill-button]:hidden"
                                    value={password}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
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
                                    className="w-full border-2 border-white/30 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-white/50 placeholder-gray-400 bg-white/95 backdrop-blur-sm text-sm text-black [&::-ms-reveal]:hidden [&::-webkit-contacts-auto-fill-button]:hidden"
                                    value={confirmPassword}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
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

                            <div>
                                <select
                                    required
                                    className="w-full border-2 border-white/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/50 text-gray-400 bg-white/95 backdrop-blur-sm text-sm text-black" 
                                    value={barangay}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                        console.log('Barangay selected:', e.target.value);
                                        setBarangay(e.target.value);
                                    }}
                                    style={{ fontFamily: 'Inter, sans-serif' }}
                                >
                                    <option value="">Select Barangay</option>
                                    {barangays.map((brgy) => (
                                        <option key={brgy} value={brgy} className="text-gray-900">
                                            {brgy}
                                        </option>
                                    ))}
                                </select>
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
                                className="w-full bg-white/95 text-[#641400] py-3 rounded-full text-lg font-bold hover:bg-white hover:shadow-lg transition-all duration-300 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ fontFamily: 'Inter, sans-serif' }}
                            >
                                {loading ? 'Registering...' : 'Register'}
                            </button>
                        </form>

                        {showVerification && (
                            <div className="mt-6 p-4 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20 ">
                                <h3 className="text-white font-bold text-center mb-3">Verify Your Email</h3>
                                <p className="text-white/80 text-sm text-center mb-4">
                                    Please enter the 6-digit code sent to your email
                                </p>
                                <form onSubmit={handleVerification} className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder="Enter 6-digit code"
                                        required
                                        maxLength={6}
                                        className="w-full border-2 border-white/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/50 placeholder-gray-400 bg-white/95 backdrop-blur-sm text-center text-2xl tracking-widest font-bold text-black"
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
                                        className="w-full bg-green-500 text-white py-3 rounded-full text-lg font-bold hover:bg-green-600 transition-all duration-300 disabled:opacity-50"
                                    >
                                        {loading ? 'Verifying...' : 'Verify Email'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleResendCode}
                                        disabled={loading || resendCountdown > 0}
                                        className="w-full bg-white/20 text-white py-2 rounded-full text-sm font-semibold hover:bg-white/30 transition-all duration-300 border border-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Sending...' : resendCountdown > 0 ? `Resend in ${resendCountdown}s` : 'Resend Verification Code'}
                                    </button>
                                </form>
                            </div>
                        )}

                        <p className="text-center mt-4 text-sm text-white/90" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Already have an account?{' '}
                            <a href="/auth/login" className="hover:underline font-semibold hover:text-white transition-colors">
                                Login
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;