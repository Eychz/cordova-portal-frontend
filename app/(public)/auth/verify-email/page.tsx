'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { authApi } from '@/lib/authApi';

const VerifyEmailContent = () => {
    const [verificationCode, setVerificationCode] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [resendCountdown, setResendCountdown] = useState<number>(0);
    
    const router = useRouter();
    const searchParams = useSearchParams();
    const userId = searchParams.get('userId');
    const email = searchParams.get('email');

    useEffect(() => {
        if (resendCountdown > 0) {
            const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCountdown]);

    const handleVerification = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) {
            setError('Missing user information. Please register again.');
            return;
        }

        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const result = await authApi.verifyEmail({
                userId: parseInt(userId),
                code: verificationCode,
            });

            if (result.token && result.user) {
                localStorage.setItem('token', result.token);
                localStorage.setItem('user', JSON.stringify(result.user));
            }

            setSuccess('Email verified successfully! Redirecting...');
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
            setError('Email not found. Please try logging in again.');
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
        <div className="max-w-md w-full mx-auto">
            <h2 className="text-center text-4xl font-black mb-2 text-red-900 dark:text-white drop-shadow-sm uppercase tracking-tighter">
                Verify Email
            </h2>
            <p className="text-center text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-10">
                Identity Confirmation Required
            </p>

            <form onSubmit={handleVerification} className="space-y-6">
                <div className="space-y-2">
                    <input
                        type="text"
                        placeholder="6-Digit Verification Code"
                        required
                        maxLength={6}
                        disabled={loading}
                        className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-none px-4 py-5 text-center text-3xl tracking-[0.5em] font-black focus:outline-none focus:ring-2 focus:ring-red-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed premium-flag-container"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                    />
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center">
                        Check your inbox for the authorization code
                    </p>
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
                    disabled={loading || verificationCode.length < 6}
                    className="w-full bg-red-700 text-white py-4 rounded-none text-sm font-black uppercase tracking-widest hover:bg-red-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                    {loading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-none animate-spin"></div>
                            <span>Verifying...</span>
                        </>
                    ) : 'Confirm Verification'}
                </button>

                <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={loading || resendCountdown > 0}
                    className="w-full bg-transparent text-gray-500 hover:text-red-600 py-2 text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50"
                >
                    {resendCountdown > 0 ? `Resend Available in ${resendCountdown}s` : 'Request New Code'}
                </button>
            </form>
        </div>
    );
};

const VerifyEmailPage = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyEmailContent />
        </Suspense>
    );
};

export default VerifyEmailPage;
