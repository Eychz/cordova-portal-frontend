'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PageTransition from '@/components/PageTransition';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowLeft, Calendar, User, Tag, MapPin, Clock, Plus, Bell } from 'lucide-react';
import toast from 'react-hot-toast';
import { postsApi, Post } from '@/lib/postsApi';
import { DetailSkeleton } from '@/components/Skeleton';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function UnifiedPostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const type = params.type as string;
  const slug = params.slug as string;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        // Using preparation code: getBySlug
        const data = await postsApi.getBySlug(slug, type);
        setPost(data);
      } catch (err: any) {
        console.error('Error fetching post:', err);
        setError(err.message || 'Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug, type]);

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
          <main className="flex-grow w-full maximize-width px-4 py-12 mt-16">
            <DetailSkeleton />
          </main>
          <Footer />
        </div>
      </PageTransition>
    );
  }

  if (error || !post) {
    return (
      <PageTransition>
        <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors">
          <Navbar />
          <main className="flex-grow w-full maximize-width px-4 py-20 mt-16 text-center">
            <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-6 uppercase">
              {type?.toUpperCase()} Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
              {error || `The requested ${type} could not be located or has been moved.`}
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
        <main className="flex-grow w-full maximize-width px-4 py-12 mt-16">
          <div className="max-w-[1200px] mx-auto">
            {/* Back Button */}
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-red-700 dark:text-red-400 font-bold mb-8 hover:translate-x-[-4px] transition-transform uppercase text-xs tracking-widest"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to List
            </button>

            <article className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Header Banner Based on Type */}
              <div className={`px-8 py-4 flex items-center justify-between ${post.type === 'event' ? 'bg-blue-700' :
                post.type === 'announcement' ? 'bg-red-700' : 'bg-gray-700'
                } text-white`}>
                <div className="flex items-center gap-3">
                  {post.type === 'announcement' && <Bell className="w-5 h-5" />}
                  {post.type === 'event' && <Calendar className="w-5 h-5" />}
                  <span className="font-black text-sm tracking-widest uppercase">
                    Official {post.type}
                  </span>
                </div>
              </div>

              {/* Featured Image - Large Rectangle */}
              {post.imageUrl && (
                <div className="w-full h-[500px] relative border-b border-gray-200 dark:border-gray-700">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/1200x600?text=Cordova+Portal+Image';
                    }}
                  />
                </div>
              )}

              <div className="p-8 md:p-12 lg:p-16">
                {/* Meta Information Row */}
                <div className="flex flex-wrap items-center gap-6 mb-10 text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700 pb-8">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-red-700 dark:text-red-500" />
                    Published {formatDate(post.createdAt || '')}
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-red-700 dark:text-red-500" />
                    Category: {post.category}
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-red-700 dark:text-red-500" />
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{post.authorName}</span>
                  </div>
                </div>
                {/* Title */}
                <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-10 leading-tight uppercase tracking-tight">
                  {post.title}
                </h1>

                {/* Event Specific Details Section */}
                {(post.eventDate || post.location) && (
                  <div className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 p-8 mb-12">
                    <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6 uppercase tracking-widest border-b border-gray-200 dark:border-gray-700 pb-2">
                      Operational Details
                    </h3>
                    <div className="grid md:grid-cols-3 gap-8">
                      {post.eventDate && (
                        <div className="flex flex-col gap-2">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date of Event</span>
                          <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold">
                            <Calendar className="w-5 h-5 text-red-700" />
                            {formatDate(post.eventDate)}
                          </div>
                        </div>
                      )}
                      {post.eventTime && (
                        <div className="flex flex-col gap-2">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Scheduled Time</span>
                          <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold">
                            <Clock className="w-5 h-5 text-red-700" />
                            {post.eventTime}
                          </div>
                        </div>
                      )}
                      {post.location && (
                        <div className="flex flex-col gap-2">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Event Location</span>
                          <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold">
                            <MapPin className="w-5 h-5 text-red-700" />
                            {post.location}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Content Body */}
                <div className="prose prose-xl dark:prose-invert max-w-none">
                  <div
                    className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap font-medium"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                </div>
              </div>

              {/* Footer Banner */}
              <div className="bg-gray-100 dark:bg-gray-900 px-8 py-6 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Cordova Municipality © 2026
                </p>
              </div>
            </article>
          </div>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
}
