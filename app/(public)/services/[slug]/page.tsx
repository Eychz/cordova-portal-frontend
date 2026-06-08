'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PageTransition from '@/components/PageTransition';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowLeft, CheckCircle2, Clock, DollarSign, Info, Building2, Construction, FileText, CheckCircle, Baby, Heart, Bird, Diamond, Home, Map, Hospital, Hammer, Fence, Pickaxe, Sprout, PhilippinePeso, PhoneCallIcon } from 'lucide-react';
import { servicesApi, Service as ApiService } from '@/lib/servicesApi';
import { getIconByName } from '@/utils/iconMapper';
import { Skeleton } from '@/components/Skeleton';

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [service, setService] = useState<ApiService | null>(null);
  const [loading, setLoading] = useState(true);

  const slug = params.slug as string;

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const data = await servicesApi.getBySlug(slug);
        setService(data);
      } catch (err) {
        console.error('Failed to fetch service:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [slug]);

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors flex flex-col">
          <Navbar activePage="Services" />
          <main className="flex-grow maximize-width px-4 py-12 mt-16">
            <div className="max-w-[1200px] mx-auto">
              {/* Back button skeleton */}
              <Skeleton className="h-4 w-40 mb-10" />

              <div className="grid lg:grid-cols-3 gap-12 items-start">
                {/* Left side details skeleton */}
                <div className="lg:col-span-2 space-y-12">
                  <div className="space-y-6">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-16 w-3/4" />
                    <Skeleton className="h-24 w-full" />
                  </div>

                  <div className="pt-8 border-t border-gray-100 dark:border-gray-800 space-y-4">
                    <Skeleton className="h-8 w-48" />
                    <div className="space-y-3">
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-6 w-11/12" />
                      <Skeleton className="h-6 w-5/6" />
                    </div>
                  </div>
                </div>

                {/* Right side info card skeleton */}
                <div className="space-y-6 bg-gray-50 dark:bg-gray-850 p-8 border border-gray-100 dark:border-gray-800">
                  <Skeleton className="h-8 w-32" />
                  <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-28" />
                    </div>
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </PageTransition>
    );
  }

  if (!service) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors flex flex-col">
          <Navbar />
          <main className="flex-grow maximize-width px-4 py-32 mt-16 text-center">
            <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-6 uppercase">Service Not Found</h1>
            <button
              onClick={() => router.push('/services')}
              className="px-10 py-4 bg-red-700 text-white font-bold uppercase tracking-widest text-sm"
            >
              Back to Services
            </button>
          </main>
          <Footer />
        </div>
      </PageTransition>
    );
  }

  const Icon = getIconByName(service.icon);

  return (
    <PageTransition>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors flex flex-col">
        <Navbar activePage="Services" />
        <main className="flex-grow maximize-width py-5 mt-5">
          <div className="max-w-[1200px] mx-auto">
            {/* Back Button */}
            <button
              onClick={() => router.push('/services')}
              className="inline-flex items-center gap-2 text-red-700 dark:text-red-400 font-bold mb-10 hover:translate-x-[-4px] transition-transform uppercase text-xs tracking-widest"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Services Portal
            </button>

            <div className="grid lg:grid-cols-3 gap-12 items-start">
              {/* Left Content - Main Info */}
              <div className="lg:col-span-2 space-y-12">
                <div className="space-y-6">
                  <div className="inline-block bg-gray-100 dark:bg-gray-800 px-4 py-1 text-[10px] font-black uppercase bg-red-700 text-white tracking-widest text-gray-500">
                    {service.category}
                  </div>
                  <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-none">
                    {service.name || service.title}
                  </h1>
                  <p className="text-xl text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Requirements Section - Uniform Border */}
                <div className="bg-white dark:bg-gray-900 p-10 border-l-8 border-red-700 shadow-xl">
                  <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-8 border-b border-gray-100 dark:border-gray-800 pb-6 flex items-center gap-4">
                    <CheckCircle2 className="w-8 h-8 text-red-700" />
                    Documentary Requirements
                  </h2>
                  <div className="space-y-6">
                    {Array.isArray(service.requirements) ? (
                      service.requirements.map((req: string, i: number) => (
                        <div key={i} className="flex items-start gap-4 text-gray-700 dark:text-gray-300 group hover:translate-x-1 transition-transform">
                          <span className="w-6 h-6 flex-shrink-0 bg-red-700 text-white text-[10px] flex items-center justify-center font-bold">
                            {i + 1}
                          </span>
                          <span className="font-semibold">{req}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap font-semibold italic bg-gray-50 dark:bg-gray-800/50">
                        {service.requirements || 'No requirements specified.'}
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-10 border-l-8 border-red-700 bg-gray-50 dark:bg-gray-800/50 shadow-inner">
                  <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-10">Step-by-Step Procedure</h2>
                  <div className="space-y-8">
                    {Array.isArray(service.processSteps || service.steps) && (service.processSteps || service.steps).length > 0 ? (
                      (service.processSteps || service.steps).map((step: string, index: number) => (
                        <div key={index} className={`relative pl-12 ${index !== (service.processSteps || service.steps).length - 1 ? 'border-l-2 border-dashed border-red-700/30 pb-10' : ''}`}>
                          <div className="absolute left-[-6px] top-0 w-3 h-3 bg-red-700 rotate-45"></div>
                          <h4 className="font-black text-red-700 dark:text-red-400 uppercase text-xs tracking-widest mb-3">Phase {index + 1}</h4>
                          <p className="text-gray-900 dark:text-gray-200 font-bold leading-relaxed">{step}</p>
                        </div>
                      ))
                    ) : typeof (service.processSteps || service.steps) === 'string' ? (
                      <p className="text-gray-900 dark:text-gray-200 font-bold whitespace-pre-wrap p-6 border-l-2 border-red-700 bg-white dark:bg-gray-900">{service.processSteps || service.steps}</p>
                    ) : (
                      <p className="text-gray-500 italic">No specific steps provided for this service.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Content - Operational Info */}
              <div className="space-y-6">
                <div className="bg-[#450a0a] text-white p-10 space-y-10 shadow-2xl border-l-8 border-red-600">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-red-500 mb-4 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Estimated Processing Time
                    </h3>
                    <p className="text-3xl font-black uppercase tracking-tighter">
                      {service.processingTime}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-red-500 mb-4 flex items-center gap-2">
                      Service Fees
                    </h3>
                    <p className="text-3xl font-black uppercase tracking-tighter">
                      <span className="flex items-center font-bold"><PhilippinePeso className="w-8 h-8" />{service.fee}</span>
                    </p>
                  </div>

                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-8 border-l-8 border-red-700 shadow-sm">
                  <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Info className="w-4 h-4 text-red-700" />
                    Help Desk
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    For inquiries regarding this specific service, you may contact the relevant department directly.
                  </p>
                  <div className="space-y-4">
                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase">Hotline</div>
                      <div className="font-bold text-gray-900 dark:text-white flex">{service.hotline || '(032) 496-0000'}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase">Email</div>
                      <div className="font-bold text-gray-900 dark:text-white">{service.email || 'services@cordova.gov.ph'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
}
