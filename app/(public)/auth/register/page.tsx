'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authApi } from '@/lib/authApi';
import { RegisterSchema, type RegisterInput } from '@/lib/validations';

const RegisterPage: React.FC = () => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [showVerification, setShowVerification] = useState<boolean>(false);
    const [userId, setUserId] = useState<number | null>(null);
    const [verificationCode, setVerificationCode] = useState<string>('');
    const [resendCountdown, setResendCountdown] = useState<number>(0);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<RegisterInput>({
        resolver: zodResolver(RegisterSchema),
    });

    const email = watch('email');

    // Countdown timer for resend button
    useEffect(() => {
        if (resendCountdown > 0) {
            const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCountdown]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            router.push('/home');
        }
    }, [router]);

    const onRegisterSubmit = async (data: RegisterInput) => {
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const result = await authApi.register({
                email: data.email,
                password: data.password,
            });

            setUserId(result.userId);
            setShowVerification(true);
            setSuccess('Registration successful! Please check your email.');
        } catch (err: any) {
            setError(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const handleVerification = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const result = await authApi.verifyEmail({
                userId: userId!,
                code: verificationCode,
            });

            if (result.token && result.user) {
                localStorage.setItem('token', result.token);
                localStorage.setItem('user', JSON.stringify(result.user));
            }

            setSuccess('Email verified successfully!');
            setTimeout(() => {
                router.push('/auth/on-boarding');
            }, 1500);
        } catch (err: any) {
            setError(err.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    const handleResendCode = async () => {
        if (!email) {
            setError('Email not found. Please register again.');
            return;
        }

        if (resendCountdown > 0) return;

        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/resend-verification`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Failed to resend code');

            setSuccess('Verification code resent! Check your inbox.');
            setError('');
            setResendCountdown(60);
        } catch (err: any) {
            setError(err.message || 'Failed to resend verification code');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {!showVerification ? (
                <>
                    <h2 className="text-center text-4xl font-black mb-2 text-red-900 dark:text-white drop-shadow-sm">
                        REGISTER
                    </h2>
                    <p className="text-center text-gray-600 dark:text-gray-400 italic text-sm mb-8">
                        Create your account
                    </p>

                    <form onSubmit={handleSubmit(onRegisterSubmit)} className="space-y-4">
                        <div className="space-y-1">
                            <input
                                {...register('email')}
                                type="email"
                                placeholder="Email Address"
                                className={`w-full border-2 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white transition-all ${
                                    errors.email ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                                }`}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                    <AlertCircle size={12} /> {errors.email.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <div className="relative">
                                <input
                                    {...register('password')}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    className={`w-full border-2 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white transition-all ${
                                        errors.password ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                    <AlertCircle size={12} /> {errors.password.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <div className="relative">
                                <input
                                    {...register('confirmPassword')}
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm Password"
                                    className={`w-full border-2 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white transition-all ${
                                        errors.confirmPassword ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                    <AlertCircle size={12} /> {errors.confirmPassword.message}
                                </p>
                            )}
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
                            className="w-full bg-gradient-to-r from-red-600 to-red-800 text-white py-3 rounded-full text-lg font-bold hover:shadow-lg transition-all duration-300 mt-4 disabled:opacity-50 hover:-translate-y-1"
                        >
                            {loading ? 'Registering...' : 'Register'}
                        </button>
                    </form>
                </>
            ) : (
                <>
                    <h2 className="text-center text-4xl font-black mb-2 text-red-900 dark:text-white drop-shadow-sm">
                        VERIFY EMAIL
                    </h2>
                    <p className="text-center text-gray-600 dark:text-gray-400 italic text-sm mb-8">
                        Enter the 6-digit code sent to your email
                    </p>

                    <form onSubmit={handleVerification} className="space-y-5">
                        <input
                            type="text"
                            placeholder="6-Digit Code"
                            required
                            maxLength={6}
                            className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-center text-2xl tracking-widest font-bold focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white transition-all"
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
                        >
                            {loading ? 'Verifying...' : 'Verify Email'}
                        </button>
                        <button
                            type="button"
                            onClick={handleResendCode}
                            disabled={loading || resendCountdown > 0}
                            className="w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-2 rounded-full text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all border border-gray-200 dark:border-gray-700 disabled:opacity-50"
                        >
                            {loading ? 'Sending...' : resendCountdown > 0 ? `Resend in ${resendCountdown}s` : 'Resend Verification Code'}
                        </button>
                    </form>
                </>
            )}

            <p className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <a href="/auth/login" className="hover:underline font-semibold hover:text-red-600 dark:hover:text-red-400 transition-colors">
                    Login
                </a>
            </p>
        </>
    );
};

export default RegisterPage;
