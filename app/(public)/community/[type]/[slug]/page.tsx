'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import PageTransition from '@/components/PageTransition';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowLeft, Calendar, User, Tag, MapPin, Clock, Plus, Bell } from 'lucide-react';
import toast from 'react-hot-toast';
import { usePostBySlug } from '@/hooks/usePosts';
import { Post } from '@/lib/postsApi';
import { DetailSkeleton } from '@/components/Skeleton';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function UnifiedPostDetailPage() {
  const params = useParams();
  const router = useRouter();

  const type = params.type as string;
  const slug = params.slug as string;

  const { data: post, isLoading: loading, error } = usePostBySlug(slug, type);
  const errorMessage = error ? (error.message || 'Failed to load content') : null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };



  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors">
          <Navbar activePage="Community" />
          <main className="flex-grow w-full maximize-width px-4 py-10 mt-5">
            <DetailSkeleton />
          </main>
          <Footer />
        </div>
      </PageTransition>
    );
  }

  if (errorMessage || !post) {
    return (
      <PageTransition>
        <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors">
          <Navbar />
          <main className="flex-grow w-full maximize-width px-4 py-20 mt-16 text-center">
            <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-6 uppercase">
              {type?.toUpperCase()} Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
              {errorMessage || `The requested ${type} could not be located or has been moved.`}
            </p>
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 px-10 py-4 bg-red-700 text-white font-bold hover:bg-red-800 transition uppercase tracking-widest text-sm"
            >
              <ArrowLeft className="w-5 h-5" />
              Return to Previous Page
            </button>
          </main>
          <Footer />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors">
        <Navbar activePage="Community" />
        <main className="flex-grow w-full maximize-width px-4 py-5 mt-5">
          <div className="w-full">
            {/* Back Button */}
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-red-700 dark:text-red-400 font-bold mb-8 hover:translate-x-[-4px] transition-transform uppercase text-xs tracking-widest"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to List
            </button>

            <style dangerouslySetInnerHTML={{
              __html: `
              .book-content p:first-of-type::first-letter {
                float: left;
                font-size: 3.5rem;
                line-height: 0.85;
                font-weight: 900;
                margin-right: 0.5rem;
                margin-top: 0.2rem;
                color: #b91c1c;
              }
              .dark .book-content p:first-of-type::first-letter {
                color: #ef4444;
              }
            `}} />

            <article className="bg-[#faf6ee] dark:bg-[#181614] border border-[#e5dec9] dark:border-[#2a2622] shadow-2xl relative overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-[#e5dec9] dark:divide-[#2a2622] min-h-[600px]">

              {/* LEFT PAGE */}
              <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-between h-full bg-[#fdfbf7] dark:bg-[#1c1b19]">
                <div>
                  {/* Header Banner */}
                  <div className="flex items-center gap-3 mb-6 border-b border-[#e5dec9]/60 dark:border-[#2a2622]/60 pb-4">
                    {post.type === 'announcement' && <Bell className="w-5 h-5 text-red-700" />}
                    {post.type === 'event' && <Calendar className="w-5 h-5 text-blue-750" />}
                    <span className="font-black text-xs tracking-widest uppercase text-gray-500">
                      Official {post.type}
                    </span>
                  </div>

                  {/* Metadata */}
                  <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-8 pb-4 border-b border-[#e5dec9]/30 dark:border-[#2a2622]/30">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-red-700" />
                      Published {formatDate(post.createdAt || '')}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-red-700" />
                      Category: {post.category}
                    </div>
                    {post.authorName && (
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-red-700" />
                        {post.authorName}
                      </div>
                    )}
                  </div>

                  {/* Featured Image */}
                  {post.imageUrl && (
                    <div className="w-full aspect-[4/3] relative border border-[#e5dec9] dark:border-[#2a2622] p-1 bg-white dark:bg-gray-900 shadow-sm mb-6">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/800x600?text=Cordova+Portal+Image';
                        }}
                      />
                    </div>
                  )}

                  {/* Operational details (for events) */}
                  {(post.eventDate || post.location) && (
                    <div className="bg-[#faf6ee]/50 dark:bg-gray-900/30 border border-[#e5dec9] dark:border-[#2a2622] p-4 md:p-6 mb-4">
                      <h3 className="text-xs font-black text-gray-900 dark:text-white mb-4 uppercase tracking-widest border-b border-[#e5dec9]/60 dark:border-[#2a2622]/60 pb-2">
                        Operational Details
                      </h3>
                      <div className="grid grid-cols-1 gap-4 text-xs">
                        {post.eventDate && (
                          <div className="flex items-center gap-3">
                            <Calendar className="w-4 h-4 text-red-700 flex-shrink-0" />
                            <div>
                              <span className="block text-[8px] font-bold text-gray-400 uppercase tracking-widest">Date of Event</span>
                              <span className="font-bold text-gray-800 dark:text-gray-200">{formatDate(post.eventDate)}</span>
                            </div>
                          </div>
                        )}
                        {post.eventTime && (
                          <div className="flex items-center gap-3">
                            <Clock className="w-4 h-4 text-red-700 flex-shrink-0" />
                            <div>
                              <span className="block text-[8px] font-bold text-gray-400 uppercase tracking-widest">Scheduled Time</span>
                              <span className="font-bold text-gray-800 dark:text-gray-200">{post.eventTime}</span>
                            </div>
                          </div>
                        )}
                        {post.location && (
                          <div className="flex items-center gap-3">
                            <MapPin className="w-4 h-4 text-red-700 flex-shrink-0" />
                            <div>
                              <span className="block text-[8px] font-bold text-gray-400 uppercase tracking-widest">Event Location</span>
                              <span className="font-bold text-gray-800 dark:text-gray-200">{post.location}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-4 border-t border-[#e5dec9]/60 dark:border-[#2a2622]/60 flex justify-between items-center text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest">
                  <span>Cordova Gazette</span>
                  <span>Page I</span>
                </div>
              </div>

              {/* RIGHT PAGE */}
              <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-between h-full bg-[#fdfbf7] dark:bg-[#1c1b19] relative md:shadow-[-10px_0_15px_-10px_rgba(0,0,0,0.15)] dark:md:shadow-[-10px_0_15px_-10px_rgba(0,0,0,0.5)]">
                <div className="absolute top-0 bottom-0 left-0 w-8 pointer-events-none bg-gradient-to-r from-black/5 via-transparent to-transparent hidden md:block" />

                <div>
                  {/* Title */}
                  <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-8 uppercase tracking-tight leading-tight">
                    {post.title}
                  </h1>

                  {/* Content Body */}
                  <div className="w-full text-left text-base md:text-lg text-gray-850 dark:text-gray-200 leading-relaxed font-medium">
                    <div
                      className="book-content"
                      dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-[#e5dec9]/60 dark:border-[#2a2622]/60 flex justify-between items-center text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest">
                  <span>Municipality of Cordova</span>
                  <span>Page II</span>
                </div>
              </div>

            </article>
          </div>
        </main>
      </div>
      <Footer />
    </PageTransition>


  );
}
