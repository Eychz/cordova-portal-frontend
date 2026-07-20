'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authApi } from '@/lib/authApi';
import { LoginSchema, type LoginInput } from '@/lib/validations';
import { useReCaptcha } from '@/hooks/useReCaptcha';

const LoginPage: React.FC = () => {
    const { getReCaptchaToken, isVerifying, isReady } = useReCaptcha();
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginInput>({
        resolver: zodResolver(LoginSchema),
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            router.push('/home');
        }
    }, [router]);

    const onLoginSubmit = async (data: LoginInput) => {
        setError('');
        setSuccess('');
        setLoading(true);

        if (!isReady) {
            setError('Security check is still loading. Please wait a moment and try again.');
            setLoading(false);
            return;
        }

        try {
            const token = await getReCaptchaToken('login_submit');
            if (!token) {
                setError('Security verification failed to initialize. Please refresh.');
                setLoading(false);
                return;
            }

            const result = await authApi.login(data, token);

            localStorage.setItem('token', result.token);
            localStorage.setItem('user', JSON.stringify(result.user));

            setSuccess('Login successful! Redirecting...');

            setTimeout(() => {
                if (result.user.role === 'admin') {
                    router.push('/admin/dashboard');
                } else {
                    router.push('/home');
                }
            }, 800);
        } catch (err: any) {
            setError(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <h2 className="text-center text-4xl font-black mb-2 text-red-900 dark:text-white drop-shadow-sm">
                LOGIN
            </h2>
            <p className="text-center text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-10">
                Official Portal Access
            </p>

            <form onSubmit={handleSubmit(onLoginSubmit)} className="space-y-5">
                <div className="space-y-1">
                    <input
                        {...register('email')}
                        type="email"
                        placeholder="Contact Email"
                        disabled={loading}
                        className={`w-full border rounded-none px-4 py-4 focus:outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-all premium-flag-container disabled:opacity-50 disabled:cursor-not-allowed ${errors.email ? 'border-red-600' : 'border-gray-200 dark:border-gray-700'
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
                            disabled={loading}
                            className={`w-full border rounded-none px-4 py-4 pr-12 focus:outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-all premium-flag-container disabled:opacity-50 disabled:cursor-not-allowed ${errors.password ? 'border-red-600' : 'border-gray-200 dark:border-gray-700'
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
                    disabled={loading || isVerifying}
                    className="w-full bg-red-700 text-white py-4 rounded-none text-sm font-black uppercase tracking-widest hover:bg-red-800 transition-all duration-300 mt-6 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] flex items-center justify-center gap-2"
                >
                    {loading || isVerifying ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-none animate-spin"></div>
                            <span>{isVerifying ? 'Securing Check...' : 'Authorizing...'}</span>
                        </>
                    ) : 'Login'}
                </button>
            </form>
        </>
    );
};

export default LoginPage;