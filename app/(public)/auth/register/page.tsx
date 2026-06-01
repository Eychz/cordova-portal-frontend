'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
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
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterInput>({
        resolver: zodResolver(RegisterSchema),
    });

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

            setSuccess('Registration successful! Redirecting to verification...');
            setTimeout(() => {
                router.push(`/auth/verify-email?userId=${result.userId}&email=${encodeURIComponent(data.email)}`);
            }, 1000);
        } catch (err: any) {
            setError(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <h2 className="text-center text-4xl font-black mb-2 text-red-900 dark:text-white drop-shadow-sm uppercase tracking-tighter">
                REGISTER
            </h2>
            <p className="text-center text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-10">
                Official Citizen Registration
            </p>

            <form onSubmit={handleSubmit(onRegisterSubmit)} className="space-y-4">
                <div className="space-y-1">
                    <input
                        {...register('email')}
                        type="email"
                        placeholder="Email Address"
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

                <div className="space-y-1">
                    <div className="relative">
                        <input
                            {...register('password')}
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            disabled={loading}
                            className={`w-full border rounded-none px-4 py-4 pr-12 focus:outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-all premium-flag-container disabled:opacity-50 disabled:cursor-not-allowed ${
                                errors.password ? 'border-red-600' : 'border-gray-200 dark:border-gray-700'
                            }`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1 font-bold uppercase tracking-tight">
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
                            disabled={loading}
                            className={`w-full border rounded-none px-4 py-4 pr-12 focus:outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-all premium-flag-container disabled:opacity-50 disabled:cursor-not-allowed ${
                                errors.confirmPassword ? 'border-red-600' : 'border-gray-200 dark:border-gray-700'
                            }`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                    {errors.confirmPassword && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1 font-bold uppercase tracking-tight">
                            <AlertCircle size={12} /> {errors.confirmPassword.message}
                        </p>
                    )}
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
                            <span>Processing Registry...</span>
                        </>
                    ) : 'Create Account'}
                </button>
            </form>

            <p className="text-center mt-8 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                Already registered?{' '}
                <a href="/auth/login" className="text-red-700 hover:underline transition-all">
                    Access Portal
                </a>
            </p>
        </>
    );
};

export default RegisterPage;
