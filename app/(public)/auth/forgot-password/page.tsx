'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authApi } from '@/lib/authApi';
import { ForgotPasswordSchema, type ForgotPasswordInput } from '@/lib/validations';
import { useReCaptcha } from '@/hooks/useReCaptcha';

const ForgotPasswordPage: React.FC = () => {
    const { getReCaptchaToken, isVerifying, isReady } = useReCaptcha();
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

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<ForgotPasswordInput>({
        resolver: zodResolver(ForgotPasswordSchema),
    });

    const email = watch('email');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            router.push('/home');
        }
    }, [router]);

    const onRequestCodeSubmit = async (data: ForgotPasswordInput) => {
        setError('');
        setSuccess('');
        setLoading(true);

        // Safety check: reCAPTCHA initialization
        if (!isReady) {
            setError('Security check is still loading. Please wait a moment and try again.');
            setLoading(false);
            return;
        }

        try {
            // 1. Fetch reCAPTCHA token
            const token = await getReCaptchaToken('forgot_password_submit');
            if (!token) {
                setError('Security verification failed to initialize. Please refresh.');
                setLoading(false);
                return;
            }

            await authApi.forgotPassword(data.email, token);
            setSuccess('Reset code sent! Check your email.');
            setStep(2);
        } catch (err: any) {
            setError(err.message || 'Request failed');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters');
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
            setError(err.message || 'Password reset failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md w-full mx-auto">
            <h2 className="text-center text-4xl font-black mb-2 text-red-900 dark:text-white drop-shadow-sm uppercase tracking-tighter">
                RECOVERY
            </h2>
            <p className="text-center text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-10">
                {step === 1 ? 'Credential Reset Request' : 'Enter Authorization Code'}
            </p>

            {step === 1 ? (
                <form onSubmit={handleSubmit(onRequestCodeSubmit)} className="space-y-5">
                    <div className="space-y-1">
                        <input
                            {...register('email')}
                            type="email"
                            placeholder="Registered Email Address"
                            disabled={loading}
                            className={`w-full border rounded-none px-4 py-4 focus:outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-all premium-flag-container disabled:opacity-50 disabled:cursor-not-allowed ${
                                errors.email ? 'border-red-600' : 'border-gray-200 dark:border-gray-700'
                            }`}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1 flex items-center gap-1 font-bold uppercase tracking-tight">
                                <AlertCircle size={12} /> {errors.email.message}
                            </p>
                        )}
                    </div>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-600 p-4 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                            <p className="text-xs font-bold text-red-700 uppercase tracking-tight">{error}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || isVerifying}
                        className="w-full bg-red-700 text-white py-4 rounded-none text-sm font-black uppercase tracking-widest hover:bg-red-800 transition-all duration-300 mt-6 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        {loading || isVerifying ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-none animate-spin"></div>
                                <span>{isVerifying ? 'Securing Check...' : 'Requesting Code...'}</span>
                            </>
                        ) : 'Send Reset Code'}
                    </button>
                </form>
            ) : (
                <form onSubmit={handleResetPassword} className="space-y-5">
                    <div className="space-y-2">
                        <input
                            type="text"
                            placeholder="6-Digit Code"
                            required
                            maxLength={6}
                            disabled={loading}
                            className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-none px-4 py-4 text-center text-2xl tracking-[0.3em] font-black focus:outline-none focus:ring-2 focus:ring-red-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed premium-flag-container"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                        />
                    </div>

                    <div className="space-y-1">
                        <div className="relative">
                            <input
                                type={showNewPassword ? "text" : "password"}
                                placeholder="New Secure Password"
                                required
                                disabled={loading}
                                className="w-full border border-gray-200 dark:border-gray-700 rounded-none px-4 py-4 pr-12 focus:outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-all premium-flag-container disabled:opacity-50 disabled:cursor-not-allowed"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm New Password"
                                required
                                disabled={loading}
                                className="w-full border border-gray-200 dark:border-gray-700 rounded-none px-4 py-4 pr-12 focus:outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-all premium-flag-container disabled:opacity-50 disabled:cursor-not-allowed"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-600 p-4 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                            <p className="text-xs font-bold text-red-700 uppercase tracking-tight">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-50 border-l-4 border-green-600 p-4 flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                            <p className="text-xs font-bold text-green-700 uppercase tracking-tight">{success}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-red-700 text-white py-4 rounded-none text-sm font-black uppercase tracking-widest hover:bg-red-800 transition-all duration-300 mt-6 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-none animate-spin"></div>
                                <span>Updating...</span>
                            </>
                        ) : 'Reset Password'}
                    </button>
                </form>
            )}

            <button
                onClick={() => step === 2 ? setStep(1) : router.push('/auth/login')}
                className="text-center mt-8 w-full flex items-center justify-center gap-2 text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-red-700 transition-all"
            >
                <ArrowLeft size={12} />
                {step === 2 ? 'Back to Email' : 'Back to Login'}
            </button>
        </div>
    );
};

export default ForgotPasswordPage;
