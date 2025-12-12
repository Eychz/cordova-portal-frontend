'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PageTransition from '../../../../components/PageTransition';
import Navbar from '../../../../components/Navbar';
import Footer from '../../../../components/Footer';
import { ArrowLeft, Calendar, User, Tag, MapPin, Clock, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { addEventToCalendar } from '../../../../lib/apiClient';

interface Post {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  type: string;
  category?: string;
  priority: string;
  status: string;
  eventStatus?: string;
  location?: string;
  eventDate?: string;
  eventTime?: string;
  authorName?: string;
  createdAt: string;
  updatedAt: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingToCalendar, setAddingToCalendar] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/posts/${params.id}`);
        
        if (!response.ok) {
          throw new Error('Event not found');
        }
        
        const data = await response.json();
        setPost(data);
      } catch (err: any) {
        console.error('Error fetching event:', err);
        setError(err.message || 'Failed to load event');
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
      day: 'numeric'
    });
  };

  const handleAddToCalendar = async () => {
    if (!post) return;

    try {
      setAddingToCalendar(true);
      await addEventToCalendar({
        eventId: post.id,
        eventTitle: post.title,
        eventDate: post.eventDate || new Date().toISOString(),
        eventTime: post.eventTime,
        location: post.location,
        notifyBefore: 24
      });
      toast.success('Event added to your calendar!');
    } catch (err: any) {
      console.error('Failed to add event to calendar:', err);
      
      if (err.message.includes('already')) {
        toast.error('This event is already in your calendar');
      } else if (err.message.includes('not available') || err.message.includes('endpoint')) {
        toast.error('Calendar feature currently unavailable. Please try again later.');
      } else if (err.message.includes('authentication') || err.message.includes('log in')) {
        toast.error('Please log in to add events to your calendar');
      } else {
        toast.error('Failed to add event to calendar. Please try again.');
      }
    } finally {
      setAddingToCalendar(false);
    }
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
                Event Not Found
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {error || 'The event you are looking for does not exist.'}
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

            {/* Event Header */}
            <article className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              {/* Event Status Banner */}
              {post.eventStatus && (
                <div className={`px-6 py-3 flex items-center justify-between ${
                  post.eventStatus === 'upcoming' ? 'bg-green-600' : 'bg-gray-600'
                } text-white`}>
                  <span className="font-semibold">
                    {post.eventStatus === 'upcoming' ? 'UPCOMING EVENT' : 'PAST EVENT'}
                  </span>
                  {post.eventStatus === 'upcoming' && (
                    <button
                      onClick={handleAddToCalendar}
                      disabled={addingToCalendar}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white text-green-600 rounded-lg hover:bg-gray-100 transition disabled:opacity-50"
                    >
                      <Plus className="w-4 h-4" />
                      {addingToCalendar ? 'Adding...' : 'Add to Calendar'}
                    </button>
                  )}
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
                  <span className="inline-block px-3 py-1 text-sm font-semibold text-purple-600 bg-purple-100 dark:bg-purple-900 dark:text-purple-300 rounded-full mb-4">
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
                    Posted {formatDate(post.createdAt)}
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

                {/* Event Details */}
                {(post.eventDate || post.location) && (
                  <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6 mb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                      Event Details
                    </h3>
                    <div className="space-y-3">
                      {post.eventDate && (
                        <div className="flex items-start gap-3">
                          <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">Date</p>
                            <p className="text-gray-700 dark:text-gray-300">
                              {formatDate(post.eventDate)}
                            </p>
                          </div>
                        </div>
                      )}
                      {post.eventTime && (
                        <div className="flex items-start gap-3">
                          <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">Time</p>
                            <p className="text-gray-700 dark:text-gray-300">{post.eventTime}</p>
                          </div>
                        </div>
                      )}
                      {post.location && (
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">Location</p>
                            <p className="text-gray-700 dark:text-gray-300">{post.location}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

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
