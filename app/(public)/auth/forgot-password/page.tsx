'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authApi } from '@/lib/authApi';
import { ForgotPasswordSchema, type ForgotPasswordInput } from '@/lib/validations';

const ForgotPasswordPage: React.FC = () => {
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

        try {
            await authApi.forgotPassword(data.email);
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
            setError(err.message || 'Password reset failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <h2 className="text-center text-4xl font-black mb-2 text-red-900 dark:text-white drop-shadow-sm">
                FORGOT PASSWORD
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400 italic text-sm mb-8">
                {step === 1 ? 'Enter your email to receive a verification code' : 'Enter code and new password'}
            </p>

            {step === 1 ? (
                <form onSubmit={handleSubmit(onRequestCodeSubmit)} className="space-y-5">
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
                        {loading ? 'Sending...' : 'Send Verification Code'}
                    </button>
                </form>
            ) : (
                <form onSubmit={handleResetPassword} className="space-y-5">
                    <input
                        type="text"
                        placeholder="6-Digit Code"
                        required
                        maxLength={6}
                        className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 text-center text-2xl tracking-widest font-bold focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white transition-all"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />

                    <div className="relative">
                        <input
                            type={showNewPassword ? "text" : "password"}
                            placeholder="New Password"
                            required
                            className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white transition-all"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
                        >
                            {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            required
                            className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white transition-all"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
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
                    >
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
            )}

            <p className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
                <a href="/auth/login" className="hover:underline font-semibold hover:text-red-600 dark:hover:text-red-400 transition-colors">
                    Back to Login
                </a>
            </p>
        </>
    );
};

export default ForgotPasswordPage;
