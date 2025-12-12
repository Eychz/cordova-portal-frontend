'use client';

import React, { useState } from 'react';
import { Calendar, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { eventApi } from '../lib/eventApi';

interface AddToCalendarButtonProps {
  eventId: string;
  eventTitle: string;
  eventDate: string; // ISO string or Date string
  eventTime?: string;
  location?: string;
  notifyBefore?: number;
  className?: string;
}

const AddToCalendarButton: React.FC<AddToCalendarButtonProps> = ({
  eventId,
  eventTitle,
  eventDate,
  eventTime,
  location,
  notifyBefore = 24,
  className = '',
}) => {
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAddToCalendar = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to save events to your calendar');
      return;
    }

    setLoading(true);

    try {
      await eventApi.saveEvent({
        eventId,
        eventTitle,
        eventDate,
        eventTime,
        location,
        notifyBefore,
      });

      setIsSaved(true);
      toast.success('Event added to your calendar!');
    } catch (error: any) {
      if (error.message.includes('already saved')) {
        setIsSaved(true);
        toast.error('Event already in your calendar');
      } else {
        toast.error(error.message || 'Failed to save event');
      }
    } finally {
      setLoading(false);
    }
  };

  if (isSaved) {
    return (
      <button
        disabled
        className={`flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg cursor-not-allowed ${className}`}
      >
        <Check className="w-4 h-4" />
        Saved to Calendar
      </button>
    );
  }

  return (
    <button
      onClick={handleAddToCalendar}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 bg-[#641400] hover:bg-[#8B1919] text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      <Calendar className="w-4 h-4" />
      {loading ? 'Saving...' : 'Add to Calendar'}
    </button>
  );
};

export default AddToCalendarButton;
