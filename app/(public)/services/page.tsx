'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageTransition from '@/components/PageTransition';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Building2, Construction, FileText, CheckCircle, Baby, Heart, Bird, Diamond, Home, Map, Hospital, DollarSign, Hammer, Fence, Pickaxe, Sprout, Search, ArrowRight, Info } from 'lucide-react';
import { slugify } from '@/utils/slugify';
import { useQuery } from '@tanstack/react-query';

export interface Service {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
  requirements?: string[];
  processingTime?: string;
  fee?: string;
  iconColor?: string;
}

import { servicesApi, Service as ApiService } from '@/lib/servicesApi';
import { getIconByName } from '@/utils/iconMapper';
import { ServiceCardSkeleton } from '@/components/Skeleton';

const getCategoryColor = (category: string) => {
  const cat = category?.toLowerCase() || '';
  if (cat.includes('business') || cat.includes('permit')) return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100', hover: 'hover:border-blue-500' };
  if (cat.includes('health') || cat.includes('medical')) return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-100', hover: 'hover:border-red-500' };
  if (cat.includes('social') || cat.includes('welfare')) return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100', hover: 'hover:border-emerald-500' };
  if (cat.includes('civil') || cat.includes('registry')) return { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-100', hover: 'hover:border-purple-500' };
  if (cat.includes('general')) return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-100', hover: 'hover:border-gray-500' };
  return { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-100', hover: 'hover:border-slate-500' };
};

const ServicesPage = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: services = [], isLoading: loading } = useQuery<ApiService[]>({
    queryKey: ['publicServices'],
    queryFn: () => servicesApi.getAll(),
    staleTime: 5 * 60 * 1000,
  });

  const categories = ['All', ...Array.from(new Set(services.map(s => s.category)))];

  const filteredServices = services.filter(service => {
    const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
    const searchLower = searchQuery.toLowerCase();
    const nameLower = (service.name || service.title || '').toLowerCase();
    const descLower = (service.description || '').toLowerCase();

    const matchesSearch = nameLower.includes(searchLower) || descLower.includes(searchLower);
    return matchesCategory && matchesSearch;
  });

  const handleServiceClick = (service: ApiService) => {
    let url = service.externalUrl || 'https://bpbc.ibpls.com/cordovacebu/';
    if (url && !/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors flex flex-col">
        <Navbar activePage="Services" />

        {/* Formal Header */}
        <header className="relative overflow-hidden bg-red-800 text-white pt-24 pb-16 border-b-8 border-red-700">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
            style={{ backgroundImage: "url('/bg-cordova.jpg')", opacity: 0.25 }}
          />
          <div className="relative maximize-width px-4 z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 bg-white text-red-800 px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em]">
                  Constituent Services
                </div>
                <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">
                  E-Services Portal
                </h1>
                <p className="text-xl text-white font-medium max-w-2xl">
                  Fast, transparent, and efficient access to all municipal services and regulatory requirements in Cordova.
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-grow maximize-width py-8 md:py-16">
          {/* Category Filter - Sticky & Horizontally Scrollable on Mobile */}
          <div className="sticky top-20 z-20 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md py-4 mb-8 border-b border-gray-100 dark:border-gray-800">
            <div className="flex overflow-x-auto w-full gap-2 pb-2 hide-scrollbar whitespace-nowrap md:flex-wrap md:whitespace-normal">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex-shrink-0 px-3 py-2 md:px-8 md:py-4 font-bold text-[10px] md:text-xs uppercase tracking-widest transition-all ${selectedCategory === category
                    ? 'bg-red-700 text-white'
                    : 'bg-white dark:bg-gray-900 text-gray-500 hover:text-red-700 hover:bg-gray-50'
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Services Grid and Empty State - Wrapped for static stability */}
          <div className="min-h-[300px]">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <ServiceCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredServices.map((service) => {
                  return (
                    <div
                      key={service.id}
                      onClick={() => handleServiceClick(service)}
                      className="group bg-none cursor-pointer min-w-0 h-full flex flex-col justify-between border border-gray-200 dark:border-gray-800 hover:border-red-700 dark:hover:border-red-500 transition-all duration-300 rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 bg-white dark:bg-gray-900"
                    >
                      <div className="p-3">
                        <div
                          className="h-48 bg-cover bg-center relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
                          style={service.imageUrl ? { backgroundImage: `url(${service.imageUrl})` } : undefined}
                        >
                          {!service.imageUrl && (
                            <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                          <span className="absolute top-4 left-4 bg-red-700 text-white px-3 py-0.5 rounded-none text-[10px] font-bold uppercase tracking-wider">
                            {service.category || 'General'}
                          </span>
                        </div>
                        <div className="p-5">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors break-words uppercase tracking-tight">
                            {service.name || service.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 font-medium">
                            {service.description}
                          </p>
                        </div>
                      </div>
                      <div className="p-5 pt-0">
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800 pt-4">
                          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Online Access</span>
                          <span className="text-red-700 dark:text-red-400 font-black flex items-center gap-1 uppercase tracking-widest text-[10px]">
                            Proceed to Service
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {filteredServices.length === 0 && !loading && (
              <div className="py-32 text-center bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-200 dark:border-gray-700 mt-6">
                <Info className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-black uppercase tracking-widest">No services found in this category</p>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default ServicesPage;