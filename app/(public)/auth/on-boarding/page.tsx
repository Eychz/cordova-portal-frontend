'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userApi } from '@/lib/userApi';
import { OnboardingSchema, type OnboardingInput } from '@/lib/validations';

const OnBoardingPage: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<OnboardingInput>({
        resolver: zodResolver(OnboardingSchema),
    });

    const barangays = [
        'Alegria', 'Bangbang', 'Buagsong', 'Catarman', 'Cogon', 
        'Dapitan', 'Day-as', 'Ibabao', 'Gabi', 'Gilutongan', 
        'Pilipog', 'Poblacion', 'San Miguel'
    ];

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/auth/login');
        }
    }, [router]);

    const onOnboardingSubmit = async (data: OnboardingInput) => {
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const updatedUser = await userApi.updateProfile(data);

            localStorage.setItem('user', JSON.stringify(updatedUser));

            setSuccess('Profile completed! Redirecting...');
            setTimeout(() => {
                if (updatedUser.role === 'admin') {
                    router.push('/admin/dashboard');
                } else {
                    router.push('/dashboard');
                }
            }, 1500);
        } catch (err: any) {
            setError(err.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <h2 className="text-center text-4xl font-black mb-2 text-red-900 dark:text-white drop-shadow-sm">
                COMPLETE PROFILE
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400 italic text-sm mb-8">
                Tell us more about yourself
            </p>

            <form onSubmit={handleSubmit(onOnboardingSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <input
                            {...register('firstName')}
                            type="text"
                            placeholder="First Name"
                            className={`w-full border-2 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white transition-all ${
                                errors.firstName ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                            }`}
                        />
                        {errors.firstName && (
                            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                <AlertCircle size={12} /> {errors.firstName.message}
                            </p>
                        )}
                    </div>
                    <div className="space-y-1">
                        <input
                            {...register('middleName')}
                            type="text"
                            placeholder="Middle Name (Optional)"
                            className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white transition-all"
                        />
                    </div>
                </div>
                
                <div className="space-y-1">
                    <input
                        {...register('lastName')}
                        type="text"
                        placeholder="Last Name"
                        className={`w-full border-2 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white transition-all ${
                            errors.lastName ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                        }`}
                    />
                    {errors.lastName && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                            <AlertCircle size={12} /> {errors.lastName.message}
                        </p>
                    )}
                </div>

                <div className="space-y-1">
                    <select
                        {...register('barangay')}
                        className={`w-full border-2 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white transition-all ${
                            errors.barangay ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                        }`}
                    >
                        <option value="">Select Barangay</option>
                        {barangays.map((brgy) => (
                            <option key={brgy} value={brgy}>{brgy}</option>
                        ))}
                    </select>
                    {errors.barangay && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                            <AlertCircle size={12} /> {errors.barangay.message}
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
                    {loading ? 'Saving Profile...' : 'Complete Registration'}
                </button>
            </form>
        </>
    );
};

export default OnBoardingPage;
