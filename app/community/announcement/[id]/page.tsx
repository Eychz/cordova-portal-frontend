'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PageTransition from '../../../../components/PageTransition';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';
import { ArrowLeft, Calendar, User, Tag, Bell } from 'lucide-react';

interface Post {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  type: string;
  category?: string;
  priority: string;
  status: string;
  authorName?: string;
  createdAt: string;
  updatedAt: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AnnouncementDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/posts/${params.id}`);
        
        if (!response.ok) {
          throw new Error('Announcement not found');
        }
        
        const data = await response.json();
        setPost(data);
      } catch (err: any) {
        console.error('Error fetching announcement:', err);
        setError(err.message || 'Failed to load announcement');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchPost();
    }
  }, [params.id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </PageTransition>
    );
  }

  if (error || !post) {
    return (
      <PageTransition>
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Announcement Not Found
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {error || 'The announcement you are looking for does not exist.'}
              </p>
              <button
                onClick={() => router.back()}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <ArrowLeft className="w-5 h-5" />
                Go Back
              </button>
            </div>
          </main>
          <Footer />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-6"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>

            {/* Announcement Header */}
            <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              {/* Priority Banner */}
              {post.priority === 'high' && (
                <div className="bg-red-600 text-white px-6 py-3 flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  <span className="font-semibold">IMPORTANT ANNOUNCEMENT</span>
                </div>
              )}

              {/* Featured Image */}
              {post.imageUrl && (
                <div className="w-full h-96 relative">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/800x400?text=Image+Not+Available';
                    }}
                  />
                </div>
              )}

              <div className="p-8">
                {/* Category Badge */}
                {post.category && (
                  <span className="inline-block px-3 py-1 text-sm font-semibold text-amber-600 bg-amber-100 dark:bg-amber-900 dark:text-amber-300 rounded-full mb-4">
                    {post.category}
                  </span>
                )}

                {/* Title */}
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {post.title}
                </h1>

                {/* Meta Information */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {formatDate(post.createdAt)}
                  </div>
                  {post.authorName && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {post.authorName}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    {post.priority} Priority
                  </div>
                </div>

                {/* Content */}
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <div
                    className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                </div>
              </div>
            </article>
          </div>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
}
