'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, ArrowLeft, Camera, UploadCloud, CheckCircle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { uploadFile } from 'lib/apiClient';

const VerificationPage = () => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [idFile, setIdFile] = useState<File | null>(null);
    const [faceFile, setFaceFile] = useState<File | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!idFile || !faceFile) {
            toast.error('Please provide both your Valid ID and Face Verification photo.');
            return;
        }

        setIsSubmitting(true);
        toast.loading('Uploading documents securely...', { id: 'verifyUpload' });

        try {
            // Upload ID Document
            const idDocUrl = await uploadFile(idFile);
            
            // Upload Face Verification
            const faceDocUrl = await uploadFile(faceFile);

            // Update user profile in backend
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/users/me`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    frontIdDocumentUrl: idDocUrl,
                    faceVerificationUrl: faceDocUrl
                })
            });

            if (!response.ok) {
                throw new Error('Failed to submit verification data');
            }

            toast.success('Verification documents submitted successfully!', { id: 'verifyUpload' });
            setIsSuccess(true);
            
            setTimeout(() => {
                router.push('/dashboard');
            }, 3000);

        } catch (error) {
            console.error('Verification error:', error);
            toast.error('Failed to submit verification. Please try again.', { id: 'verifyUpload' });
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
                <CheckCircle className="w-24 h-24 text-green-500 mb-6" />
                <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight mb-4">Submission Successful</h1>
                <p className="text-gray-600 max-w-md">Your identity documents have been securely uploaded and are pending review by the Cordova municipal administration. You will be redirected shortly.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-20">
            <Toaster position="top-right" />
            
            {/* Header */}
            <div className="w-full bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-3xl mx-auto px-6 py-6 flex items-center gap-4">
                    <button 
                        onClick={() => router.back()}
                        className="p-2 -ml-2 text-gray-400 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                            <ShieldCheck className="text-red-600" />
                            IDENTITY VERIFICATION
                        </h1>
                    </div>
                </div>
            </div>

            <main className="max-w-3xl mx-auto px-6 py-10">
                <div className="bg-white border border-gray-200 p-8 md:p-12 shadow-sm">
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tighter mb-2">Secure Submission</h2>
                        <p className="text-sm text-gray-500">Please provide clear photos of your valid identification and a current selfie to verify your citizen account.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-10">
                        
                        {/* Valid ID Section */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-900 uppercase tracking-widest mb-1">
                                    1. Valid ID Document
                                </label>
                                <p className="text-xs text-gray-500 mb-4">Upload a clear photo of your School ID, Driver's License, PhilID, or any valid government-issued ID.</p>
                            </div>
                            
                            <label className={`block w-full border-2 border-dashed ${idFile ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-red-500 hover:bg-gray-50'} transition-all cursor-pointer p-8 text-center`}>
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => setIdFile(e.target.files?.[0] || null)}
                                />
                                {idFile ? (
                                    <div className="flex flex-col items-center gap-2 text-green-700">
                                        <CheckCircle size={32} />
                                        <span className="font-bold text-sm">{idFile.name}</span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-3 text-gray-500">
                                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                                            <UploadCloud size={24} className="text-gray-400" />
                                        </div>
                                        <span className="font-bold text-sm uppercase tracking-wide text-gray-900">Click to upload ID</span>
                                        <span className="text-xs">PNG, JPG up to 10MB</span>
                                    </div>
                                )}
                            </label>
                        </div>

                        {/* Face Verification Section */}
                        <div className="space-y-4 pt-6 border-t border-gray-100">
                            <div>
                                <label className="block text-sm font-bold text-gray-900 uppercase tracking-widest mb-1">
                                    2. Face Verification (Selfie)
                                </label>
                                <p className="text-xs text-gray-500 mb-4">Take a clear photo of your face. Ensure you are in a well-lit area without sunglasses or hats.</p>
                            </div>
                            
                            <label className={`block w-full border-2 border-dashed ${faceFile ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-red-500 hover:bg-gray-50'} transition-all cursor-pointer p-8 text-center`}>
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    capture="user"
                                    className="hidden"
                                    onChange={(e) => setFaceFile(e.target.files?.[0] || null)}
                                />
                                {faceFile ? (
                                    <div className="flex flex-col items-center gap-2 text-green-700">
                                        <CheckCircle size={32} />
                                        <span className="font-bold text-sm">{faceFile.name}</span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-3 text-gray-500">
                                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                                            <Camera size={24} className="text-gray-400" />
                                        </div>
                                        <span className="font-bold text-sm uppercase tracking-wide text-gray-900">Take a Photo / Upload</span>
                                        <span className="text-xs">PNG, JPG up to 10MB</span>
                                    </div>
                                )}
                            </label>
                        </div>

                        <div className="pt-8 flex justify-end gap-4">
                            <button 
                                type="button"
                                onClick={() => router.back()}
                                className="px-6 py-3 border border-gray-200 hover:border-gray-400 text-gray-600 font-bold text-xs uppercase tracking-widest transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                disabled={isSubmitting || !idFile || !faceFile}
                                className="px-8 py-3 bg-red-700 hover:bg-red-800 disabled:opacity-50 disabled:hover:bg-red-700 text-white font-bold text-xs uppercase tracking-widest transition-colors flex items-center gap-2"
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Documents'}
                            </button>
                        </div>

                    </form>
                </div>
            </main>
        </div>
    );
};

export default VerificationPage;
