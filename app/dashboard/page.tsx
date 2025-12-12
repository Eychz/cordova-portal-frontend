'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import PageTransition from '../../components/PageTransition';
import ConfirmDialog from '../../components/ConfirmDialog';
import { Star, Gift, TrendingUp, Award, ShoppingBag, Heart, Calendar, FileText, AlertTriangle, Package, Users, CheckCircle, Coins, Trophy, Zap } from 'lucide-react';
import { div } from 'framer-motion/m';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Rewards Component Interfaces
interface PointActivity {
  id: number;
  title: string;
  description: string;
  points: number;
  icon: React.ComponentType<{ className?: string }>;
  category: 'events' | 'community' | 'reporting' | 'services';
  difficulty: 'easy' | 'medium' | 'hard';
}

interface Voucher {
  id: number;
  title: string;
  description: string;
  pointsCost: number;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  category: 'shopping' | 'donation' | 'services';
  available: number;
}

interface RewardTransaction {
  id: number;
  type: 'earned' | 'redeemed';
  description: string;
  points: number;
  date: string;
}

// Rewards Content Component
const RewardsContent: React.FC = () => {
  const [selectedRewardTab, setSelectedRewardTab] = useState<'earn' | 'redeem' | 'history'>('earn');
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [userPoints] = useState(847);

  const pointActivities: PointActivity[] = [
    { id: 1, title: 'Attend Community Event', description: 'Participate in municipality-organized events and activities', points: 25, icon: Calendar, category: 'events', difficulty: 'medium' },
    { id: 2, title: 'Read Daily News', description: 'Stay informed by reading community news and announcements', points: 2, icon: FileText, category: 'community', difficulty: 'easy' },
    { id: 3, title: 'Report Valid Issue', description: 'Submit verified reports of community issues needing attention', points: 50, icon: AlertTriangle, category: 'reporting', difficulty: 'hard' },
    { id: 4, title: 'Report Lost & Found Item', description: 'Help reunite lost items with their owners', points: 30, icon: Package, category: 'reporting', difficulty: 'medium' },
    { id: 5, title: 'Volunteer for Community Service', description: 'Join volunteer programs and community initiatives', points: 75, icon: Users, category: 'events', difficulty: 'hard' },
    { id: 6, title: 'Complete Service Request', description: 'Successfully process a municipal service application', points: 15, icon: CheckCircle, category: 'services', difficulty: 'medium' },
    { id: 7, title: 'Share Important Announcements', description: 'Help spread community information to others', points: 5, icon: TrendingUp, category: 'community', difficulty: 'easy' },
    { id: 8, title: 'Environmental Cleanup Participation', description: 'Join barangay cleanup drives and eco-programs', points: 40, icon: Award, category: 'events', difficulty: 'medium' }
  ];

  const vouchers: Voucher[] = [
    { id: 1, title: 'Grocery Voucher', description: '₱500 grocery voucher for local markets', pointsCost: 3500, value: '₱500', icon: ShoppingBag, category: 'shopping', available: 25 },
    { id: 2, title: 'Meal Voucher', description: '₱300 dining voucher at local restaurants', pointsCost: 2200, value: '₱300', icon: Gift, category: 'shopping', available: 40 },
    { id: 3, title: 'Donate to Community Pantry', description: 'Donate ₱200 worth of goods to those in need', pointsCost: 1500, value: '₱200', icon: Heart, category: 'donation', available: 100 },
    { id: 4, title: 'School Supplies Donation', description: 'Provide ₱500 school supplies to students', pointsCost: 3800, value: '₱500', icon: Heart, category: 'donation', available: 30 },
    { id: 5, title: 'Free Document Processing', description: 'Waive fees for one municipal document', pointsCost: 1200, value: 'Free Service', icon: FileText, category: 'services', available: 50 },
    { id: 6, title: 'Health & Wellness Package', description: '₱800 health screening and consultation', pointsCost: 6000, value: '₱800', icon: Award, category: 'shopping', available: 15 },
    { id: 7, title: 'Senior Citizen Care Package', description: 'Donate ₱400 care package to elderly', pointsCost: 3000, value: '₱400', icon: Heart, category: 'donation', available: 20 },
    { id: 8, title: 'Transportation Voucher', description: '₱200 transportation voucher', pointsCost: 1500, value: '₱200', icon: Coins, category: 'shopping', available: 60 }
  ];

  const rewardTransactions: RewardTransaction[] = [
    { id: 1, type: 'earned', description: 'Attended Barangay Fiesta', points: 25, date: '2025-11-20' },
    { id: 2, type: 'earned', description: 'Read 10 Community News Articles', points: 20, date: '2025-11-19' },
    { id: 3, type: 'redeemed', description: 'Meal Voucher (₱300)', points: -2200, date: '2025-11-18' },
    { id: 4, type: 'earned', description: 'Reported Lost Item - Reunited', points: 30, date: '2025-11-17' },
    { id: 5, type: 'earned', description: 'Volunteer Community Cleanup', points: 40, date: '2025-11-15' },
    { id: 6, type: 'redeemed', description: 'Donated to Community Pantry', points: -1500, date: '2025-11-14' }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'hard': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <Trophy className="w-8 h-8 text-amber-600 dark:text-amber-400" />
        Citizen Rewards Program
      </h1>

      {/* Coming Soon Message */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-8 shadow-lg mb-6 text-center">
        <div className="text-white">
          <Trophy className="w-20 h-20 mx-auto mb-4 opacity-80" />
          <div className="text-4xl font-black mb-3">Coming Soon!</div>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Our Citizen Rewards Program is currently under development. Soon you'll be able to earn points by participating in community activities and redeem them for exciting rewards!
          </p>
          <div className="mt-6 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-sm font-semibold">
            <Zap className="w-5 h-5" />
            Stay tuned for updates
          </div>
        </div>
      </div>

      {/* Feature Preview */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
            <Zap className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Earn Points</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Participate in community events, volunteer programs, and civic activities
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
            <Gift className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Redeem Rewards</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Exchange points for vouchers, discounts, and exclusive community benefits
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-full mb-4">
            <Heart className="w-6 h-6 text-pink-600 dark:text-pink-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Give Back</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Donate your points to community programs and help those in need
          </p>
        </div>
      </div>
    </div>
  );
};

// Calendar Event Interface
interface CalendarEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  category: 'community' | 'government' | 'emergency' | 'cultural';
  addedDate: string;
    uuid?: string;
}

// Calendar Content Component
const CalendarContent: React.FC = () => {
    const generateUuid = () => (typeof crypto !== 'undefined' && (crypto as any).randomUUID)
        ? (crypto as any).randomUUID()
        : `${Date.now()}-${Math.floor(Math.random() * 1e9)}`;

    const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
    const [isLoadingEvents, setIsLoadingEvents] = useState(true);

    // Fetch user calendar events from database
    useEffect(() => {
        const fetchUserEvents = async () => {
            try {
                const { eventApi } = await import('../../lib/eventApi');
                const events = await eventApi.getUserEvents();
                
                // Check if events is an array
                if (!Array.isArray(events)) {
                    console.warn('No events returned from API');
                    setCalendarEvents([]);
                    return;
                }
                
                // Transform API data to match CalendarEvent interface
                const transformedEvents = events.map((event: any) => ({
                    id: event.id,
                    title: event.eventTitle,
                    date: event.eventDate,
                    time: event.eventTime || 'TBA',
                    location: event.location || 'TBA',
                    description: event.description || '',
                    category: event.category || 'event',
                    addedDate: event.createdAt || new Date().toISOString(),
                    uuid: generateUuid()
                }));
                
                setCalendarEvents(transformedEvents);
            } catch (error) {
                console.error('Failed to fetch user events:', error);
                // Don't show error toast if API endpoint doesn't exist yet
                setCalendarEvents([]);
            } finally {
                setIsLoadingEvents(false);
            }
        };

        fetchUserEvents();
    }, []);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'government': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'community': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'emergency': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'cultural': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const removeEvent = async (id: number) => {
    try {
      const { eventApi } = await import('../../lib/eventApi');
      await eventApi.removeEvent(id);
      setCalendarEvents(calendarEvents.filter(event => event.id !== id));
      toast.success('Event removed from calendar');
    } catch (error) {
      console.error('Failed to remove event:', error);
      toast.error('Failed to remove event from calendar');
    }
  };

  const upcomingEvents = calendarEvents.filter(event => new Date(event.date) >= new Date());
  const pastEvents = calendarEvents.filter(event => new Date(event.date) < new Date());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <Calendar className="w-8 h-8 text-red-600" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">My Calendar</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-400">Track events you've added to your calendar</p>
      </div>

      {/* Upcoming Events */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          Upcoming Events ({upcomingEvents.length})
        </h3>
        {isLoadingEvents ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center shadow-lg">
            <div className="animate-spin w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">Loading calendar events...</p>
          </div>
        ) : upcomingEvents.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center shadow-lg">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">No upcoming events in your calendar</p>
            <Link href="/community/events" className="inline-block mt-4 text-red-600 hover:text-red-700 font-semibold">
              Browse Events →
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
                        {upcomingEvents.map((event, index) => (
                            <div key={`${event.uuid ?? event.id}-${index}`} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white">{event.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(event.category)}`}>
                        {event.category}
                      </span>
                    </div>
                    <div className="space-y-2 text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        <span className="font-semibold">{formatDate(event.date)} at {event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <p className="mt-3 text-gray-700 dark:text-gray-300">{event.description}</p>
                  </div>
                  <button
                    onClick={() => removeEvent(event.id)}
                    className="ml-4 p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Remove from calendar"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  Added to calendar on {new Date(event.addedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            Past Events ({pastEvents.length})
          </h3>
          <div className="grid gap-4">
                        {pastEvents.map((event, index) => (
                            <div key={`${event.uuid ?? event.id}-${index}`} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg opacity-60">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white line-through">{event.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(event.category)}`}>
                        {event.category}
                      </span>
                    </div>
                    <div className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                      <p>{formatDate(event.date)} at {event.time}</p>
                      <p>{event.location}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeEvent(event.id)}
                    className="ml-4 p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Remove from calendar"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const DashboardPage: React.FC = () => {
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState('account');
    const [userRole, setUserRole] = useState<'Citizen' | 'Visitor' | 'Unverified'>('Citizen');
    const [isVerified, setIsVerified] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [userServiceRequests, setUserServiceRequests] = useState<any[]>([]);
    const [serviceRequestsLoading, setServiceRequestsLoading] = useState(true);
    const isVisitor = userRole === 'Visitor';
    const isUnverified = !isVerified || userRole === 'Unverified';
    
    // Route protection - redirect to login if not authenticated
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Please log in to access the dashboard');
            window.location.href = '/auth/login';
        }
    }, []);
    
    // Check for tab parameter in URL
    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab && ['account', 'messages', 'calendar', 'transactions', 'rewards', 'settings'].includes(tab)) {
            setActiveTab(tab);
        }
    }, [searchParams]);
    
    // Fetch user's service requests
    useEffect(() => {
        const fetchServiceRequests = async () => {
            try {
                const token = localStorage.getItem('token');
                const userStr = localStorage.getItem('user');
                if (!token || !userStr) return;
                
                const currentUser = JSON.parse(userStr);
                const userId = currentUser.id;
                
                const response = await fetch(`${API_BASE_URL}/service-requests/my-requests`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    // Filter to ensure only current user's requests (in case backend returns all)
                    const filteredData = Array.isArray(data) 
                        ? data.filter((req: any) => req.userId === userId)
                        : data;
                    setUserServiceRequests(filteredData);
                } else {
                    console.warn('Service requests endpoint returned non-OK status');
                    setUserServiceRequests([]);
                }
            } catch (error) {
                console.error('Failed to fetch service requests:', error);
                setUserServiceRequests([]);
            } finally {
                setServiceRequestsLoading(false);
            }
        };
        
        fetchServiceRequests();
    }, []);
    const [isEditing, setIsEditing] = useState(false);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedContact, setSelectedContact] = useState(0);
    const [messageText, setMessageText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedTransaction, setSelectedTransaction] = useState<number | null>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [showArchived, setShowArchived] = useState(false);
    const [showChatOptions, setShowChatOptions] = useState(false);
    const [messageSearch, setMessageSearch] = useState('');
    const [settingsSection, setSettingsSection] = useState<'profile' | 'security'>('profile');
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [pendingNavigation, setPendingNavigation] = useState<{type: 'tab' | 'section', value: string} | null>(null);
    const [emailVerified, setEmailVerified] = useState(false);
    const [phoneVerified, setPhoneVerified] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [showEmailVerification, setShowEmailVerification] = useState(false);
    const [showPhoneVerification, setShowPhoneVerification] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [phoneCode, setPhoneCode] = useState('');
    const [verificationError, setVerificationError] = useState('');
    const [showResidentVerification, setShowResidentVerification] = useState(false);
    const [validIdFront, setValidIdFront] = useState<string | null>(null);
    const [validIdBack, setValidIdBack] = useState<string | null>(null);
    const [currentPicture, setCurrentPicture] = useState<string | null>(null);
    const [showCamera, setShowCamera] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [cameraError, setCameraError] = useState('');
    const [showImageUrlModal, setShowImageUrlModal] = useState(false);
    const [tempImageUrl, setTempImageUrl] = useState('');
    const [passwordResetStep, setPasswordResetStep] = useState<'initial' | 'code-sent' | 'resetting'>('initial');
    const [resetCode, setResetCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [passwordResetLoading, setPasswordResetLoading] = useState(false);
    const validIdFrontRef = useRef<HTMLInputElement>(null);
    const validIdBackRef = useRef<HTMLInputElement>(null);
    const currentPictureRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    // Transform service requests from database to transactions format
    const getServiceIcon = (serviceType: string) => {
        const type = serviceType?.toLowerCase() || '';
        if (type.includes('medical') || type.includes('health')) return '🏥';
        if (type.includes('vaccination') || type.includes('vaccine')) return '💉';
        if (type.includes('clearance') || type.includes('certificate')) return '📄';
        if (type.includes('permit')) return '📋';
        if (type.includes('assistance') || type.includes('financial')) return '💰';
        if (type.includes('repair') || type.includes('maintenance')) return '🔧';
        if (type.includes('complaint') || type.includes('report')) return '⚠️';
        return '📦';
    };

    const getServiceCategory = (serviceType: string) => {
        const type = serviceType?.toLowerCase() || '';
        if (type.includes('permit') || type.includes('clearance') || type.includes('certificate')) return 'permits';
        if (type.includes('assistance') || type.includes('medical') || type.includes('financial')) return 'assistance';
        return 'community';
    };

    const getStatusDisplay = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'completed':
                return { label: '✓ Completed', color: 'green', iconColor: 'from-green-500 to-green-600' };
            case 'processing':
                return { label: '⏳ Processing', color: 'blue', iconColor: 'from-blue-500 to-blue-600' };
            case 'rejected':
                return { label: '✗ Rejected', color: 'red', iconColor: 'from-red-500 to-red-600' };
            default:
                return { label: '⏳ Pending Review', color: 'yellow', iconColor: 'from-yellow-500 to-yellow-600' };
        }
    };

    const transactions = userServiceRequests.map((request: any) => {
        const statusInfo = getStatusDisplay(request.status);
        return {
            id: request.id,
            title: request.serviceType || 'Service Request',
            requestId: `#SR${request.id}`,
            icon: getServiceIcon(request.serviceType),
            category: getServiceCategory(request.serviceType),
            description: request.description || 'No description provided',
            submittedDate: request.submittedAt ? new Date(request.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A',
            completedDate: request.status === 'completed' && request.updatedAt ? new Date(request.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : null,
            status: request.status?.toLowerCase() || 'pending',
            statusLabel: statusInfo.label,
            statusColor: statusInfo.color,
            iconColor: statusInfo.iconColor,
            actionLabel: request.status === 'processing' ? 'Track Progress' : undefined,
            adminNote: request.adminNote
        };
    });

    // Filter transactions based on selected category
    const filteredTransactions = selectedCategory === 'all' 
        ? transactions 
        : transactions.filter(t => t.category === selectedCategory);
    
    // Profile form state
    const [profileData, setProfileData] = useState({
        firstName: '',
        middleName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        barangay: '',
        birthdate: '',
        civilStatus: 'Single'
    });

    // Fetch user profile on mount
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const { userApi } = await import('../../lib/userApi');
                const profile = await userApi.getProfile();
                
                setProfileData({
                    firstName: profile.firstName || '',
                    middleName: profile.middleName || '',
                    lastName: profile.lastName || '',
                    email: profile.email || '',
                    phone: profile.contactNumber || '',
                    address: profile.barangay || '',
                    barangay: profile.barangay || '',
                    birthdate: '',
                    civilStatus: 'Single'
                });
                
                setIsVerified(profile.isVerified);
                setUserRole(profile.role === 'admin' ? 'Citizen' : 'Citizen');
                
                // Load profile image from backend (user-specific)
                // TODO: Once GCS is set up, this will load from profile.profileImageUrl
                if (profile.profileImageUrl) {
                    setProfileImage(profile.profileImageUrl);
                } else {
                    // Temporary: Use localStorage with user-specific key
                    const userImageKey = `profileImage_${profile.id}`;
                    const savedImage = localStorage.getItem(userImageKey);
                    if (savedImage) {
                        setProfileImage(savedImage);
                    }
                }
                
                setIsLoading(false);
            } catch (error) {
                console.error('Failed to fetch user profile:', error);
                setIsLoading(false);
            }
        };
        
        fetchUserProfile();
    }, []);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleProfilePictureClick = () => {
        // Open modal to input profile image URL
        setShowImageUrlModal(true);
    };
    
    const handleImageUrlChange = async () => {
        if (!tempImageUrl.trim()) {
            toast.error('Please enter a valid image URL');
            return;
        }
        
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Authentication required');
                return;
            }
            
            const { userApi } = await import('../../lib/userApi');
            const updatedProfile = await userApi.updateProfile({
                profileImageUrl: tempImageUrl
            });
            
            setProfileImage(tempImageUrl);
            setProfileData(prev => ({
                ...prev,
                profileImageUrl: tempImageUrl,
            }));
            
            setShowImageUrlModal(false);
            setTempImageUrl('');
            toast.success('Profile image updated successfully!');
        } catch (error: any) {
            console.error('Error updating profile image:', error);
            toast.error(error.message || 'Failed to update profile image');
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        // This function is no longer used, but keeping it for backward compatibility
        // Users should now use URL input instead
        toast('Please use the edit icon to enter an image URL', { icon: 'ℹ️' });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveProfile = () => {
        // Save profile logic here (e.g., API call)
        console.log('Saving profile:', profileData);
        setIsEditing(false);
        // You can add a success notification here
    };

    const handleCancelEdit = () => {
        // Reset to original data if needed
        setIsEditing(false);
    };

    const handleSendMessage = () => {
        if (messageText.trim()) {
            console.log('Sending message:', messageText);
            // Add message sending logic here
            setMessageText('');
        }
    };

    const handleSendResetCode = async () => {
        setPasswordResetLoading(true);
        try {
            const { authApi } = await import('../../lib/authApi');
            await authApi.forgotPassword(profileData.email);
            setPasswordResetStep('code-sent');
            toast.success('Reset code sent to your email!');
        } catch (error: any) {
            toast.error(error.message || 'Failed to send reset code');
        } finally {
            setPasswordResetLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (newPassword !== confirmNewPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setPasswordResetLoading(true);
        try {
            const { authApi } = await import('../../lib/authApi');
            await authApi.resetPassword({
                email: profileData.email,
                code: resetCode,
                newPassword: newPassword,
            });

            toast.success('Password updated successfully!');
            setPasswordResetStep('initial');
            setResetCode('');
            setNewPassword('');
            setConfirmNewPassword('');
        } catch (error: any) {
            toast.error(error.message || 'Failed to reset password');
        } finally {
            setPasswordResetLoading(false);
        }
    };

    const handleViewTransaction = (id: number) => {
        setSelectedTransaction(id);
        console.log('Viewing transaction:', id);
        // Add transaction view logic here
    };

    const handleContactSelect = (idx: number) => {
        if (idx === selectedContact) return;
        setIsTransitioning(true);
        setTimeout(() => {
            setSelectedContact(idx);
            setIsTransitioning(false);
        }, 150);
    };

    const handleNavigationConfirm = () => {
        setIsEditing(false);
        setShowConfirmDialog(false);
        if (pendingNavigation) {
            if (pendingNavigation.type === 'tab') {
                if (pendingNavigation.value === 'home') {
                    window.location.href = '/home';
                } else {
                    setActiveTab(pendingNavigation.value);
                }
            } else {
                setSettingsSection(pendingNavigation.value as 'profile' | 'security');
            }
            setPendingNavigation(null);
        }
    };

    const handleNavigationCancel = () => {
        setShowConfirmDialog(false);
        setPendingNavigation(null);
    };

    const handleSendVerificationEmail = () => {
        // Simulate sending verification email
        setEmailSent(true);
        setShowEmailVerification(true);
        console.log('Verification email sent to:', profileData.email);
        // In real app, call API to send email
    };

    const handleVerifyEmailCode = () => {
        // Simulate code verification (real code would be sent via email)
        const correctCode = '123456'; // In real app, this comes from backend
        if (verificationCode === correctCode) {
            setEmailVerified(true);
            setShowEmailVerification(false);
            setVerificationError('');
            setVerificationCode('');
        } else {
            setVerificationError('Invalid verification code. Please try again.');
        }
    };

    const handleVerifyPhone = () => {
        setShowPhoneVerification(true);
        console.log('Sending SMS code to:', profileData.phone);
        // In real app, call API to send SMS
    };

    const handleVerifyPhoneCode = () => {
        // Simulate SMS code verification
        const correctCode = '654321'; // In real app, this comes from backend
        if (phoneCode === correctCode) {
            setPhoneVerified(true);
            setShowPhoneVerification(false);
            setVerificationError('');
            setPhoneCode('');
        } else {
            setVerificationError('Invalid code. Please try again.');
        }
    };

    const handleResendEmail = () => {
        setVerificationCode('');
        setVerificationError('');
        console.log('Resending verification email...');
        // In real app, call API to resend email
    };

    const handleResendSMS = () => {
        setPhoneCode('');
        setVerificationError('');
        console.log('Resending SMS code...');
        // In real app, call API to resend SMS
    };

    const handleResidentVerificationClick = () => {
        setShowResidentVerification(true);
    };

    const handleValidIdFrontChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setValidIdFront(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleValidIdBackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setValidIdBack(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCurrentPictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCurrentPicture(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmitResidentVerification = async () => {
        if (validIdFront && validIdBack && currentPicture) {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    toast.error('Authentication required. Please log in again.');
                    return;
                }

                const response = await fetch(`${API_BASE_URL}/users/profile`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        frontIdDocumentUrl: validIdFront,
                        backIdDocumentUrl: validIdBack,
                        faceVerificationUrl: currentPicture
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to submit verification');
                }

                const updatedUser = await response.json();
                setProfileData(updatedUser);
                setShowResidentVerification(false);
                setValidIdFront(null);
                setValidIdBack(null);
                setCurrentPicture(null);
                toast.success('Verification request submitted successfully! Please wait for admin approval.');
            } catch (error) {
                console.error('Error submitting verification:', error);
                toast.error(error instanceof Error ? error.message : 'Failed to submit verification request');
            }
        } else {
            toast.error('Please provide all required documents');
        }
    };

    const handleOpenCamera = async () => {
        setCameraError('');
        
        // Check if mediaDevices is supported
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            setCameraError('Camera is not supported on this browser. Please use a modern browser like Chrome, Firefox, or Safari.');
            return;
        }

        try {
            // First, check if any video devices are available
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            
            if (videoDevices.length === 0) {
                setCameraError('No camera found on your device. Please use a device with a camera or contact support for alternative verification methods.');
                return;
            }

            const mediaStream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'user' },
                audio: false 
            });
            setStream(mediaStream);
            setShowCamera(true);
            
            // Wait for video element to be ready
            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
            }, 100);
        } catch (error: any) {
            console.error('Camera error:', error);
            console.error('Error name:', error.name);
            console.error('Error message:', error.message);
            
            if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
                setCameraError('No camera found on your device. Please use a device with a camera or contact support for alternative verification methods.');
            } else if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
                setCameraError('Camera access was denied. Please allow camera permissions in your browser settings and try again.');
            } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
                // NotReadableError with "Could not start video source" means no camera available
                if (error.message && error.message.toLowerCase().includes('could not start video source')) {
                    setCameraError('No camera found on your device. Please use a device with a camera or contact support for alternative verification methods.');
                } else {
                    setCameraError('Camera is already in use by another application. Please close other apps using the camera and try again.');
                }
            } else if (error.name === 'OverconstrainedError' || error.name === 'ConstraintNotSatisfiedError') {
                setCameraError('Camera constraints could not be satisfied. Your device camera may not support the required settings.');
            } else {
                setCameraError(`Unable to access camera: ${error.message || 'Unknown error'}. Please check your device settings or try using a different device.`);
            }
        }
    };

    const handleCapturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            const context = canvas.getContext('2d');
            if (context) {
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const photoData = canvas.toDataURL('image/jpeg');
                setCurrentPicture(photoData);
                handleCloseCamera();
            }
        }
    };

    const handleCloseCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setShowCamera(false);
        setCameraError('');
    };

    // Contact data with messages
    const contacts = [
        { 
            name: 'Office of the Mayor', 
            message: 'We received your request...', 
            unread: 2, 
            time: '10:30 AM', 
            avatar: '🏛️',
            archived: false,
            messages: [
                { from: 'them', text: 'Good morning, Mr. Doe! How can I assist you today?', time: '10:30 AM' },
                { from: 'me', text: 'Hi! I would like to inquire about the requirements for obtaining a Business Permit.', time: '10:32 AM' },
                { from: 'them', text: 'Sure! You\'ll need: Valid ID, DTI/SEC Registration, Barangay Clearance, and Occupancy Permit. Would you like more details?', time: '10:33 AM' }
            ]
        },
        { 
            name: 'Engineering Dept.', 
            message: 'Your building permit is ready', 
            unread: 1, 
            time: '9:45 AM', 
            avatar: '🏗️',
            archived: false,
            messages: [
                { from: 'them', text: 'Hello! Your building permit application has been approved.', time: '9:45 AM' },
                { from: 'me', text: 'That\'s great news! When can I pick it up?', time: '9:46 AM' },
                { from: 'them', text: 'You can claim it at our office from Monday to Friday, 8AM-5PM. Please bring a valid ID.', time: '9:47 AM' },
                { from: 'me', text: 'Perfect, I\'ll come by tomorrow. Thank you!', time: '9:48 AM' }
            ]
        },
        { 
            name: 'Brgy. Day-as Captain', 
            message: 'Barangay clearance approved', 
            unread: 3, 
            time: 'Yesterday', 
            avatar: '👤',
            archived: true,
            messages: [
                { from: 'them', text: 'Good day! Your barangay clearance has been processed and approved.', time: 'Yesterday' },
                { from: 'me', text: 'Thank you! How much is the fee?', time: 'Yesterday' },
                { from: 'them', text: 'The clearance fee is ₱50. You can pay at the barangay hall.', time: 'Yesterday' }
            ]
        },
        { 
            name: 'Police Station', 
            message: 'Community watch schedule', 
            unread: 0, 
            time: 'Yesterday', 
            avatar: '👮',
            archived: true,
            messages: [
                { from: 'them', text: 'Reminder: Community watch duty schedule for this month is now available.', time: 'Yesterday' },
                { from: 'me', text: 'Noted. Where can I view the complete schedule?', time: 'Yesterday' },
                { from: 'them', text: 'You can check it at our bulletin board or download it from our website.', time: 'Yesterday' }
            ]
        },
        { 
            name: 'Rural Health Unit', 
            message: 'Vaccination schedule available', 
            unread: 1, 
            time: '2 days ago', 
            avatar: '🏥',
            archived: false,
            messages: [
                { from: 'them', text: 'Free vaccination program is available! Schedule your appointment now.', time: '2 days ago' },
                { from: 'me', text: 'What vaccines are available?', time: '2 days ago' },
                { from: 'them', text: 'We have COVID-19 boosters, flu shots, and child immunizations. Walk-ins welcome!', time: '2 days ago' }
            ]
        }
    ];

    return (
        <>
            <PageTransition>
                <div className="min-h-screen bg-gradient-to-br from-pink-50 via-red-50 to-orange-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-colors py-8">
                    <div className="max-w-7xl mx-auto px-4">
                        {/* Back to Home Button */}
                        <button 
                            onClick={(e) => {
                                if (isEditing && activeTab === 'settings') {
                                    e.preventDefault();
                                    setPendingNavigation({type: 'tab', value: 'home'});
                                    setShowConfirmDialog(true);
                                } else {
                                    window.location.href = '/home';
                                }
                            }}
                            className="inline-flex items-center gap-2 text-red-900 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-semibold mb-6 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Home
                        </button>

                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-4xl md:text-5xl font-black text-red-900 dark:text-white mb-2">
                                My Dashboard
                            </h1>
                            <p className="text-gray-700 dark:text-gray-300">
                                Manage your account, messages, and transactions
                            </p>
                                </div>

                        {/* Main Layout */}
                        <div className="flex flex-col lg:flex-row gap-6">
                            {/* Left Sidebar Navigation */}
                            <aside className="lg:w-72 space-y-3">
                                <div className="bg-gradient-to-br from-red-900 to-red-800 text-white p-6 rounded-2xl shadow-lg mb-4">
                                    <div className="flex items-center gap-3">
                                        <Image
                                            src="/municipal-logo.jpg"
                                            alt="Municipality Logo"
                                            width={50}
                                            height={50}
                                            className="rounded-full border-2 border-white"
                                        />
                                        <div>
                                            <span className="font-bold text-lg block">Cordova Portal</span>
                                            <span className="text-white/80 text-xs">Citizen Dashboard</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        if (isEditing && activeTab === 'settings') {
                                            setPendingNavigation({type: 'tab', value: 'account'});
                                            setShowConfirmDialog(true);
                                        } else {
                                            setActiveTab('account');
                                        }
                                    }}
                                    className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl transition-all font-semibold ${
                                        activeTab === 'account'
                                            ? 'bg-red-900 text-white shadow-lg transform scale-105'
                                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-gray-700 hover:transform hover:scale-102'
                                    }`}
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                    <span>My Account</span>
                                </button>

                                {!isUnverified && (
                                    <button
                                        onClick={() => {
                                            if (isEditing && activeTab === 'settings') {
                                                setPendingNavigation({type: 'tab', value: 'messages'});
                                                setShowConfirmDialog(true);
                                            } else {
                                                setActiveTab('messages');
                                            }
                                        }}
                                        className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl transition-all font-semibold relative ${
                                            activeTab === 'messages'
                                                ? 'bg-red-900 text-white shadow-lg transform scale-105'
                                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-gray-700 hover:transform hover:scale-102'
                                        }`}
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                        </svg>
                                        <span>Messages</span>
                                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                                    </button>
                                )}

                                {!isUnverified && (
                                    <button
                                        onClick={() => {
                                            if (isEditing && activeTab === 'settings') {
                                                setPendingNavigation({type: 'tab', value: 'calendar'});
                                                setShowConfirmDialog(true);
                                            } else {
                                                setActiveTab('calendar');
                                            }
                                        }}
                                        className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl transition-all font-semibold ${
                                            activeTab === 'calendar'
                                                ? 'bg-red-900 text-white shadow-lg transform scale-105'
                                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-gray-700 hover:transform hover:scale-102'
                                        }`}
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                        </svg>
                                        <span>My Calendar</span>
                                    </button>
                                )}

                                {!isVisitor && !isUnverified && (
                                    <button
                                        onClick={() => {
                                            if (isEditing && activeTab === 'settings') {
                                                setPendingNavigation({type: 'tab', value: 'transactions'});
                                                setShowConfirmDialog(true);
                                            } else {
                                                setActiveTab('transactions');
                                            }
                                        }}
                                        className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl transition-all font-semibold ${
                                            activeTab === 'transactions'
                                                ? 'bg-red-900 text-white shadow-lg transform scale-105'
                                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-gray-700 hover:transform hover:scale-102'
                                        }`}
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                                        </svg>
                                        <span>Transactions</span>
                                    </button>
                                )}

                                {!isVisitor && !isUnverified && (
                                    <button
                                        onClick={() => {
                                            if (isEditing && activeTab === 'settings') {
                                                setPendingNavigation({type: 'tab', value: 'rewards'});
                                                setShowConfirmDialog(true);
                                            } else {
                                                setActiveTab('rewards');
                                            }
                                        }}
                                        className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl transition-all font-semibold ${
                                            activeTab === 'rewards'
                                                ? 'bg-red-900 text-white shadow-lg transform scale-105'
                                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-gray-700 hover:transform hover:scale-102'
                                        }`}
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <span>Rewards</span>
                                    </button>
                                )}

                                <button
                                    onClick={() => {
                                        if (isEditing && activeTab !== 'settings') {
                                            setPendingNavigation({type: 'tab', value: 'settings'});
                                            setShowConfirmDialog(true);
                                        } else {
                                            setActiveTab('settings');
                                        }
                                    }}
                                    className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl transition-all font-semibold ${
                                        activeTab === 'settings'
                                            ? 'bg-red-900 text-white shadow-lg transform scale-105'
                                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-gray-700 hover:transform hover:scale-102'
                                    }`}
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                    </svg>
                                    <span>Settings</span>
                                </button>

                                {/* Settings Subsections */}
                                {activeTab === 'settings' && (
                                    <div className="ml-4 space-y-2">
                                        <button
                                            onClick={() => {
                                                if (isEditing && settingsSection !== 'profile') {
                                                    setPendingNavigation({type: 'section', value: 'profile'});
                                                    setShowConfirmDialog(true);
                                                } else {
                                                    setSettingsSection('profile');
                                                }
                                            }}
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-semibold ${
                                                settingsSection === 'profile'
                                                    ? 'bg-red-100 dark:bg-red-900/30 text-red-900 dark:text-red-400'
                                                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                            }`}
                                        >
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                            </svg>
                                            <span>Profile & Address</span>
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (isEditing && settingsSection !== 'security') {
                                                    setPendingNavigation({type: 'section', value: 'security'});
                                                    setShowConfirmDialog(true);
                                                } else {
                                                    setSettingsSection('security');
                                                }
                                            }}
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-semibold ${
                                                settingsSection === 'security'
                                                    ? 'bg-red-100 dark:bg-red-900/30 text-red-900 dark:text-red-400'
                                                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                            }`}
                                        >
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                            </svg>
                                            <span>Security & Verification</span>
                                        </button>
                                    </div>
                                )}
                            </aside>

                            {/* Main Content Area */}
                            <main className="flex-1">
                        {/* Unverified User Notice Banner */}
                        {isUnverified && !isVisitor && (
                            <div className="mb-6 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-2 border-red-400 dark:border-red-600 rounded-2xl p-6 shadow-lg">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-red-400 dark:bg-red-600 rounded-full flex items-center justify-center">
                                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-red-900 dark:text-red-200 mb-2">Verification Required</h3>
                                        <p className="text-red-800 dark:text-red-300 text-sm mb-3">
                                            Your account is not yet verified. Most features including messages, calendar, transactions, and rewards are currently restricted and will be unlocked once your resident verification is approved.
                                        </p>
                                        <button
                                            onClick={() => setActiveTab('settings')}
                                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold text-sm transition-colors"
                                        >
                                            Complete Verification Now →
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Visitor Notice Banner */}
                        {isVisitor && isVerified && (
                            <div className="mb-6 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-2 border-yellow-400 dark:border-yellow-600 rounded-2xl p-6 shadow-lg">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-yellow-400 dark:bg-yellow-600 rounded-full flex items-center justify-center">
                                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-yellow-900 dark:text-yellow-200 mb-2">Visitor Account</h3>
                                        <p className="text-yellow-800 dark:text-yellow-300 text-sm">
                                            You're currently using a verified Visitor account. Some features like transactions and reward points are only available to Cordova residents as they are specifically designed for local community members.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* Account Tab */}
                        {activeTab === 'account' && (
                            <div>
                                <h1 className="text-3xl font-black text-red-900 dark:text-red-400 mb-6">MY ACCOUNT</h1>
                                
                                {/* Profile Card */}
                                <div className="bg-gradient-to-br from-red-900 via-red-800 to-orange-700 rounded-3xl p-8 shadow-2xl mb-8 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
                                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-500/20 rounded-full -ml-24 -mb-24"></div>
                                    
                                    <div className="relative flex flex-col md:flex-row items-center gap-6">
                                        <div className="relative">
                                            <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center shadow-2xl ring-4 ring-white/30 overflow-hidden">
                                                {profileImage ? (
                                                    <Image
                                                        src={profileImage}
                                                        alt="Profile"
                                                        width={128}
                                                        height={128}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <svg className="w-20 h-20 text-red-900" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                            </div>
                                            </div>
                                        <div className="flex-1 text-white text-center md:text-left">
                                            <p className="text-sm mb-1 text-white/80 font-medium">Good Day!</p>
                                            <h2 className="text-4xl font-black mb-3 text-shadow">{profileData.firstName} {profileData.middleName} {profileData.lastName}</h2>
                                            <div className="flex flex-col md:flex-row gap-4 text-sm">
                                                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                    </svg>
                                                    <span className="font-semibold">{profileData.barangay}, Cordova</span>
                                                </div>
                                                {isVerified ? (
                                                    <div className="flex items-center gap-2 bg-green-500/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                                        <span className="text-green-200">✓</span>
                                                        <span className="font-semibold text-green-100">Cordovanhon</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 bg-red-500/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                                        <span className="text-red-200">⚠</span>
                                                        <span className="font-semibold text-red-100">Unverified User</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Explore More Section */}
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                        Quick Access Services
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        <Link href="/rescue-desk" className="group">
                                            <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2">
                                                <div className="h-40 bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center relative overflow-hidden">
                                                    <div className="absolute inset-0 bg-blue-600/10 group-hover:bg-blue-600/20 transition-all"></div>
                                                    <svg className="w-20 h-20 text-blue-600 dark:text-blue-300 transform group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <div className="p-5">
                                                    <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-2">Lost & Found</h4>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">Report or search for lost items in your community</p>
                                                </div>
                                            </div>
                                        </Link>

                                        <Link href="/rescue-desk" className="group">
                                            <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2">
                                                <div className="h-40 bg-gradient-to-br from-red-100 via-red-200 to-red-300 dark:from-red-900 dark:to-red-800 flex items-center justify-center relative overflow-hidden">
                                                    <div className="absolute inset-0 bg-red-600/10 group-hover:bg-red-600/20 transition-all"></div>
                                                    <svg className="w-20 h-20 text-red-600 dark:text-red-300 transform group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <div className="p-5">
                                                    <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-2">Emergency Desk</h4>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">Quick access to emergency hotlines and services</p>
                                                </div>
                                            </div>
                                        </Link>

                                        <Link href="/community/news" className="group">
                                            <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2">
                                                <div className="h-40 bg-gradient-to-br from-amber-100 via-amber-200 to-amber-300 dark:from-amber-900 dark:to-amber-800 flex items-center justify-center relative overflow-hidden">
                                                    <div className="absolute inset-0 bg-amber-600/10 group-hover:bg-amber-600/20 transition-all"></div>
                                                    <svg className="w-20 h-20 text-amber-600 dark:text-amber-300 transform group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                                                    </svg>
                                                </div>
                                                <div className="p-5">
                                                    <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-2">News Hub</h4>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">Stay updated with latest news and announcements</p>
                                                </div>
                                            </div>
                                        </Link>

                                        <Link href="/community/events" className="group">
                                            <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2">
                                                <div className="h-40 bg-gradient-to-br from-purple-100 via-purple-200 to-purple-300 dark:from-purple-900 dark:to-purple-800 flex items-center justify-center relative overflow-hidden">
                                                    <div className="absolute inset-0 bg-purple-600/10 group-hover:bg-purple-600/20 transition-all"></div>
                                                    <svg className="w-20 h-20 text-purple-600 dark:text-purple-300 transform group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <div className="p-5">
                                                    <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-2">Events Calendar</h4>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">Discover upcoming community events and activities</p>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Messages Tab */}
                        {activeTab === 'messages' && (
                            <div>
                                <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                    <span className="text-red-900 dark:text-red-400">💬</span>
                                    Messages & Inquiries
                                </h1>
                                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
                                    <div className="flex h-[600px]">
                                        {/* Contact List Sidebar */}
                                        <div className="w-80 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col">
                                            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                                <div className="flex gap-2 mb-4">
                                                    <button 
                                                        onClick={() => setShowArchived(false)}
                                                        className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                                                            !showArchived 
                                                                ? 'bg-red-900 text-white' 
                                                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                                        }`}
                                                    >
                                                        All Chats
                                                    </button>
                                                    <button 
                                                        onClick={() => setShowArchived(true)}
                                                        className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                                                            showArchived 
                                                                ? 'bg-red-900 text-white' 
                                                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                                        }`}
                                                    >
                                                        Archived
                                                    </button>
                                                </div>
                                                <input
                                                    type="text"
                                                    value={messageSearch}
                                                    onChange={(e) => setMessageSearch(e.target.value)}
                                                    placeholder="Search messages..."
                                                    className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                                                />
                                            </div>
                                            
                                            <div className="flex-1 overflow-y-auto p-2">
                                                {contacts
                                                    .map((contact, idx) => ({ ...contact, originalIdx: idx }))
                                                    .filter(contact => contact.archived === showArchived)
                                                    .filter(contact => 
                                                        messageSearch.trim() === '' || 
                                                        contact.name.toLowerCase().includes(messageSearch.toLowerCase()) ||
                                                        contact.message.toLowerCase().includes(messageSearch.toLowerCase())
                                                    )
                                                    .map((contact) => (
                                                    <button
                                                        key={contact.originalIdx}
                                                        onClick={() => handleContactSelect(contact.originalIdx)}
                                                        className={`w-full p-3 rounded-xl text-left transition-all duration-300 mb-1 border-2 ${
                                                            selectedContact === contact.originalIdx
                                                                ? 'bg-red-50 dark:bg-red-900/20 border-red-500'
                                                                : 'border-transparent hover:bg-gray-100 dark:hover:bg-gray-800'
                                                        }`}
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-2xl flex-shrink-0">
                                                                {contact.avatar}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center justify-between mb-1">
                                                                    <p className="font-bold text-gray-900 dark:text-white text-sm truncate">{contact.name}</p>
                                                                    <span className="text-xs text-gray-500 dark:text-gray-400">{contact.time}</span>
                                                                </div>
                                                                <div className="flex items-center justify-between">
                                                                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{contact.message}</p>
                                                                    {contact.unread > 0 && (
                                                                        <span className="ml-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">
                                                                            {contact.unread}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Chat Window */}
                                        <div className="flex-1 flex flex-col">
                                            {/* Chat Header */}
                                            <div className={`p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-red-50 to-orange-50 dark:from-gray-800 dark:to-gray-800 transition-all duration-300 ${
                                                isTransitioning ? 'opacity-0' : 'opacity-100'
                                            }`}>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-2xl">
                                                            {contacts[selectedContact].avatar}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-gray-900 dark:text-white">{contacts[selectedContact].name}</p>
                                                            <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                                                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                                                Online
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="relative">
                                                        <button 
                                                            onClick={() => setShowChatOptions(!showChatOptions)}
                                                            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition"
                                                        >
                                                            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                                            </svg>
                                                        </button>
                                                        {showChatOptions && (
                                                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 py-2">
                                                                <button
                                                                    onClick={() => {
                                                                        contacts[selectedContact].archived = !contacts[selectedContact].archived;
                                                                        setShowChatOptions(false);
                                                                        // Force re-render
                                                                        setSelectedContact(selectedContact);
                                                                    }}
                                                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                                                    </svg>
                                                                    {contacts[selectedContact].archived ? 'Unarchive' : 'Archive'} Chat
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        console.log('Mute conversation');
                                                                        setShowChatOptions(false);
                                                                    }}
                                                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                                                                    </svg>
                                                                    Mute Notifications
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        console.log('Mark as unread');
                                                                        setShowChatOptions(false);
                                                                    }}
                                                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                                    </svg>
                                                                    Mark as Unread
                                                                </button>
                                                                <hr className="my-2 border-gray-200 dark:border-gray-700" />
                                                                <button
                                                                    onClick={() => {
                                                                        if (confirm('Are you sure you want to delete this conversation?')) {
                                                                            console.log('Delete conversation');
                                                                            setShowChatOptions(false);
                                                                        }
                                                                    }}
                                                                    className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                                                                >
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                    </svg>
                                                                    Delete Conversation
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Messages Area */}
                                            <div className={`flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-gray-900/50 transition-all duration-300 ${
                                                isTransitioning ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'
                                            }`}>
                                                {contacts[selectedContact].messages.map((msg, idx) => (
                                                    <div 
                                                        key={idx} 
                                                        className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                                                        style={{ animationDelay: `${idx * 50}ms` }}
                                                    >
                                                        <div className="max-w-md">
                                                            <div className={`px-4 py-3 rounded-2xl shadow-md ${
                                                                msg.from === 'me'
                                                                    ? 'bg-gradient-to-br from-red-900 to-red-800 rounded-tr-none'
                                                                    : 'bg-white dark:bg-gray-800 rounded-tl-none'
                                                            }`}>
                                                                <p className={`text-sm ${
                                                                    msg.from === 'me'
                                                                        ? 'text-white'
                                                                        : 'text-gray-900 dark:text-white'
                                                                }`}>{msg.text}</p>
                                                            </div>
                                                            <p className={`text-xs text-gray-500 mt-1 ${
                                                                msg.from === 'me' ? 'mr-2 text-right' : 'ml-2'
                                                            }`}>{msg.time}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Message Input */}
                                            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                                <div className="flex gap-3">
                                                    <button className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition">
                                                        <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                    <input
                                                        type="text"
                                                        value={messageText}
                                                        onChange={(e) => setMessageText(e.target.value)}
                                                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                                        placeholder="Type your message..."
                                                        className="flex-1 px-4 py-3 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                                                    />
                                                    <button 
                                                        onClick={handleSendMessage}
                                                        className="bg-gradient-to-r from-red-900 to-red-800 text-white p-3 rounded-full hover:from-red-800 hover:to-red-700 transition transform hover:scale-105 shadow-lg"
                                                    >
                                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Transactions Tab */}
                        {activeTab === 'transactions' && (
                            <div>
                                <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                    <span className="text-red-900 dark:text-red-400">📋</span>
                                    My Transactions & Requests
                                </h1>
                                
                                {/* Category Tabs */}
                                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 mb-6">
                                    <div className="flex gap-3 flex-wrap">
                                        <button 
                                            onClick={() => setSelectedCategory('all')}
                                            className={`px-6 py-2 rounded-full font-semibold shadow-lg transition-all ${
                                                selectedCategory === 'all'
                                                    ? 'bg-red-900 text-white'
                                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                            }`}
                                        >
                                            All Requests
                                        </button>
                                        <button 
                                            onClick={() => setSelectedCategory('permits')}
                                            className={`px-6 py-2 rounded-full font-semibold transition-all ${
                                                selectedCategory === 'permits'
                                                    ? 'bg-red-900 text-white shadow-lg'
                                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                            }`}
                                        >
                                            Permits & Clearances
                                        </button>
                                        <button 
                                            onClick={() => setSelectedCategory('assistance')}
                                            className={`px-6 py-2 rounded-full font-semibold transition-all ${
                                                selectedCategory === 'assistance'
                                                    ? 'bg-red-900 text-white shadow-lg'
                                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                            }`}
                                        >
                                            Assistance Programs
                                        </button>
                                        <button 
                                            onClick={() => setSelectedCategory('community')}
                                            className={`px-6 py-2 rounded-full font-semibold transition-all ${
                                                selectedCategory === 'community'
                                                    ? 'bg-red-900 text-white shadow-lg'
                                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                            }`}
                                        >
                                            Community Services
                                        </button>
                                    </div>
                                </div>

                                {/* Transaction List */}
                                <div className="space-y-4">
                                    {serviceRequestsLoading ? (
                                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
                                            <div className="animate-spin w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                                            <p className="text-gray-500 dark:text-gray-400 text-lg">Loading your transactions...</p>
                                        </div>
                                    ) : filteredTransactions.length === 0 ? (
                                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
                                            <div className="text-6xl mb-4">📭</div>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Transactions Found</h3>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                You don't have any transactions in this category yet.
                                            </p>
                                        </div>
                                    ) : (
                                        filteredTransactions.map((transaction) => (
                                            <div 
                                                key={transaction.id}
                                                className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all ${
                                                    transaction.status === 'processing' ? 'border-2 border-blue-200 dark:border-blue-800' : ''
                                                }`}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <div className={`w-12 h-12 bg-gradient-to-br ${transaction.iconColor} rounded-xl flex items-center justify-center text-white text-xl`}>
                                                                {transaction.icon}
                                                            </div>
                                                            <div>
                                                                <h3 className="font-bold text-gray-900 dark:text-white text-lg">{transaction.title}</h3>
                                                                <p className="text-sm text-gray-600 dark:text-gray-400">Request ID: {transaction.requestId}</p>
                                                            </div>
                                                        </div>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 ml-15">{transaction.description}</p>
                                                        <div className="flex items-center gap-4 ml-15">
                                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                                                </svg>
                                                                <span>Submitted: {transaction.submittedDate}</span>
                                                            </div>
                                                            {transaction.completedDate && (
                                                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                                    </svg>
                                                                    <span>Completed: {transaction.completedDate}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-2">
                                                        <span className={`bg-${transaction.statusColor}-100 text-${transaction.statusColor}-800 dark:bg-${transaction.statusColor}-900 dark:text-${transaction.statusColor}-200 px-4 py-2 rounded-full font-bold text-sm ${
                                                            transaction.status === 'processing' ? 'flex items-center gap-2' : ''
                                                        }`}>
                                                            {transaction.status === 'processing' && (
                                                                <svg className="w-4 h-4 animate-spin" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                                                                </svg>
                                                            )}
                                                            {transaction.statusLabel}
                                                        </span>
                                                        <button 
                                                            onClick={() => handleViewTransaction(transaction.id)}
                                                            className="text-red-900 dark:text-red-400 hover:underline text-sm font-semibold"
                                                        >
                                                            {transaction.actionLabel}
                                                        </button>
                                                    </div>
                                                </div>
                                                {transaction.adminNote && (
                                                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 rounded">
                                                        <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">Admin Note:</p>
                                                        <p className="text-sm text-blue-800 dark:text-blue-400">{transaction.adminNote}</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Rewards Tab */}
                        {activeTab === 'rewards' && <RewardsContent />}

                        {/* Calendar Tab */}
                        {activeTab === 'calendar' && <CalendarContent />}

                        {/* Settings Tab */}
                        {activeTab === 'settings' && (
                            <div>
                                <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                    <span className="text-red-900 dark:text-red-400">⚙️</span>
                                    {settingsSection === 'profile' ? 'Profile & Address Settings' : 'Security & Verification'}
                                </h1>

                                {settingsSection === 'profile' && (
                                <>
                                {/* Profile Header Card */}
                                <div className="bg-gradient-to-br from-red-900 via-red-800 to-orange-700 rounded-3xl p-8 shadow-2xl mb-6 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48"></div>
                                    
                                    <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
                                        <div className="flex items-center gap-6">
                                            <div className="relative group">
                                                <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center shadow-2xl ring-4 ring-white/30 overflow-hidden">
                                                    {profileImage ? (
                                                        <Image
                                                            src={profileImage}
                                                            alt="Profile"
                                                            width={128}
                                                            height={128}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <svg className="w-20 h-20 text-red-900" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                </div>
                                                {isEditing && (
                                                    <>
                                                        <button 
                                                            onClick={handleProfilePictureClick}
                                                            className="absolute bottom-0 right-0 bg-white text-red-900 p-3 rounded-full shadow-lg hover:bg-gray-100 transition transform hover:scale-110 animate-in fade-in zoom-in duration-200"
                                                        >
                                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                            </svg>
                                                        </button>
                                                        <input
                                                            ref={fileInputRef}
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={handleFileChange}
                                                            className="hidden"
                                                        />
                                                    </>
                                                )}
                                            </div>
                                            <div className="flex-1 text-white text-center md:text-left">
                                                <p className="text-sm mb-1 text-white/80 font-medium">Profile Settings</p>
                                                <h2 className="text-4xl font-black mb-3">{profileData.firstName} {profileData.middleName} {profileData.lastName}</h2>
                                                <div className="flex flex-col md:flex-row gap-3 text-sm">
                                                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                        </svg>
                                                        <span className="font-semibold">{profileData.barangay}, Cordova, Cebu</span>
                                                    </div>
                                                    {isVerified ? (
                                                        <div className="flex items-center gap-2 bg-green-500/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                                            <span className="text-green-200">✓</span>
                                                            <span className="font-semibold text-green-100">Verified Resident</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-2 bg-yellow-500/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                                            <span className="text-yellow-200">⚠</span>
                                                            <span className="font-semibold text-yellow-100">Verification Pending</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={handleEditToggle}
                                            className={`px-6 py-3 rounded-full font-bold transition-all transform hover:scale-105 shadow-lg whitespace-nowrap ${
                                                isEditing 
                                                    ? 'bg-white/20 text-white hover:bg-white/30' 
                                                    : 'bg-white text-red-900 hover:bg-gray-100'
                                            }`}
                                        >
                                            {isEditing ? 'Cancel Editing' : 'Edit Profile'}
                                        </button>
                                    </div>
                                </div>

                                {/* Settings Forms */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Personal Information */}
                                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                            <svg className="w-5 h-5 text-red-900 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                            </svg>
                                            Personal Information
                                        </h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">First Name</label>
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    value={profileData.firstName}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing || isVerified}
                                                    className={`w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 ${
                                                        (isEditing && !isVerified) ? 'bg-white dark:bg-gray-700' : 'bg-gray-100 dark:bg-gray-900 cursor-not-allowed'
                                                    }`}
                                                />
                                                {isVerified && (
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Cannot be changed once verified</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Middle Name</label>
                                                <input
                                                    type="text"
                                                    name="middleName"
                                                    value={profileData.middleName}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing || isVerified}
                                                    className={`w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 ${
                                                        (isEditing && !isVerified) ? 'bg-white dark:bg-gray-700' : 'bg-gray-100 dark:bg-gray-900 cursor-not-allowed'
                                                    }`}
                                                />
                                                {isVerified && (
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Cannot be changed once verified</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    value={profileData.lastName}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing || isVerified}
                                                    className={`w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 ${
                                                        (isEditing && !isVerified) ? 'bg-white dark:bg-gray-700' : 'bg-gray-100 dark:bg-gray-900 cursor-not-allowed'
                                                    }`}
                                                />
                                                {isVerified && (
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Cannot be changed once verified</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={profileData.email}
                                                    onChange={handleInputChange}
                                                    disabled={true}
                                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-100 dark:bg-gray-900 cursor-not-allowed"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={profileData.phone}
                                                    onChange={handleInputChange}
                                                    disabled={true}
                                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-100 dark:bg-gray-900 cursor-not-allowed"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Date of Birth</label>
                                                <input
                                                    type="date"
                                                    name="birthdate"
                                                    value={profileData.birthdate}
                                                    onChange={handleInputChange}
                                                    disabled={true}
                                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 bg-gray-100 dark:bg-gray-900 cursor-not-allowed"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Civil Status</label>
                                                <select
                                                    name="civilStatus"
                                                    value={profileData.civilStatus}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                    className={`w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 ${
                                                        isEditing ? 'bg-white dark:bg-gray-700' : 'bg-gray-100 dark:bg-gray-900 cursor-not-allowed'
                                                    }`}
                                                >
                                                    <option>Single</option>
                                                    <option>Married</option>
                                                    <option>Widowed</option>
                                                    <option>Divorced</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Address Information */}
                                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                            <svg className="w-5 h-5 text-red-900 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                            </svg>
                                            Address Details
                                        </h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Barangay</label>
                                                <select 
                                                    name="barangay"
                                                    value={profileData.barangay}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing || isVerified}
                                                    className={`w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 ${
                                                        (isEditing && !isVerified) ? 'bg-white dark:bg-gray-700' : 'bg-gray-100 dark:bg-gray-900 cursor-not-allowed'
                                                    }`}
                                                >
                                                    <option>Day-as</option>
                                                    <option>Alegria</option>
                                                    <option>Bangbang</option>
                                                    <option>Buagsong</option>
                                                    <option>Catarman</option>
                                                    <option>Cogon</option>
                                                    <option>Dapitan</option>
                                                    <option>Gabi</option>
                                                    <option>Gilutongan</option>
                                                    <option>Ibabao</option>
                                                    <option>Pilipog</option>
                                                    <option>Poblacion</option>
                                                    <option>San Miguel</option>
                                                </select>
                                                {isVerified && (
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Cannot be changed once verified</p>
                                                )}
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Street Address</label>
                                                <input
                                                    type="text"
                                                    name="address"
                                                    value={profileData.address}
                                                    onChange={handleInputChange}
                                                    disabled={!isEditing}
                                                    className={`w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 ${
                                                        isEditing ? 'bg-white dark:bg-gray-700' : 'bg-gray-100 dark:bg-gray-900 cursor-not-allowed'
                                                    }`}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Municipality</label>
                                                <input
                                                    type="text"
                                                    value="Cordova"
                                                    readOnly
                                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Province</label>
                                                <input
                                                    type="text"
                                                    value="Cebu"
                                                    readOnly
                                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                </>
                                )}

                                {settingsSection === 'security' && (
                                <>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Security Settings - Password Reset with Email Code */}
                                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                            <svg className="w-5 h-5 text-red-900 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                            </svg>
                                            Change Password
                                        </h3>
                                        
                                        {passwordResetStep === 'initial' && (
                                            <div className="space-y-4">
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    To reset your password, we'll send a verification code to your email: <strong>{profileData.email}</strong>
                                                </p>
                                                <button 
                                                    onClick={handleSendResetCode}
                                                    disabled={passwordResetLoading}
                                                    className="w-full bg-red-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-800 transition transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {passwordResetLoading ? 'Sending...' : 'Send Verification Code'}
                                                </button>
                                            </div>
                                        )}

                                        {passwordResetStep === 'code-sent' && (
                                            <div className="space-y-4">
                                                <div className="bg-green-50 dark:bg-green-900/20 border border-green-500 rounded-lg p-3">
                                                    <p className="text-sm text-green-700 dark:text-green-400">
                                                        ✓ Verification code sent to {profileData.email}
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Verification Code</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Enter 6-digit code"
                                                        value={resetCode}
                                                        onChange={(e) => setResetCode(e.target.value)}
                                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                                        maxLength={6}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">New Password</label>
                                                    <input
                                                        type="password"
                                                        placeholder="Enter new password"
                                                        value={newPassword}
                                                        onChange={(e) => setNewPassword(e.target.value)}
                                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Confirm Password</label>
                                                    <input
                                                        type="password"
                                                        placeholder="Confirm new password"
                                                        value={confirmNewPassword}
                                                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                                    />
                                                </div>
                                                <div className="flex gap-3">
                                                    <button 
                                                        onClick={() => {
                                                            setPasswordResetStep('initial');
                                                            setResetCode('');
                                                            setNewPassword('');
                                                            setConfirmNewPassword('');
                                                        }}
                                                        className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button 
                                                        onClick={handleResetPassword}
                                                        disabled={passwordResetLoading || !resetCode || !newPassword || !confirmNewPassword}
                                                        className="flex-1 bg-red-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-800 transition transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {passwordResetLoading ? 'Updating...' : 'Update Password'}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Verification Status */}
                                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                            <svg className="w-5 h-5 text-red-900 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            Resident Verification
                                        </h3>
                                        <div className="space-y-4">
                                            {/* Resident Verification - Show different UI based on user verification status */}
                                            {isUnverified ? (
                                                <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-500 rounded-xl p-4">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center gap-3">
                                                            <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                            </svg>
                                                            <div className="flex-1">
                                                                <p className="font-bold text-yellow-800 dark:text-yellow-300">Resident Verification</p>
                                                                <p className="text-xs text-yellow-600 dark:text-yellow-400">Not Applied</p>
                                                            </div>
                                                        </div>
                                                        <button 
                                                            onClick={handleResidentVerificationClick}
                                                            className="text-xs bg-yellow-600 text-white px-3 py-1 rounded-full font-semibold hover:bg-yellow-700"
                                                        >
                                                            Apply
                                                        </button>
                                                    </div>
                                                    <p className="text-sm text-yellow-700 dark:text-yellow-400">Prove you are a verified Cordovanhon resident</p>
                                                </div>
                                            ) : (
                                                <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-xl p-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                            </svg>
                                                            <div className="flex-1">
                                                                <p className="font-bold text-green-800 dark:text-green-300">Resident Verification</p>
                                                                <p className="text-xs text-green-600 dark:text-green-400">Verified</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                </>
                                )}

                                {/* Action Buttons - Show when editing */}
                                {isEditing && settingsSection === 'profile' && (
                                    <div className="flex justify-end gap-3 mt-6">
                                        <button 
                                            onClick={handleCancelEdit}
                                            className="px-8 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all hover:scale-105"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            onClick={handleSaveProfile}
                                            className="px-8 py-3 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white rounded-full font-bold transition-all hover:scale-105 shadow-lg flex items-center gap-2"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Save Changes
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                            </main>
                        </div>
                    </div>
                </div>
            </PageTransition>
            <Footer />
            <ConfirmDialog
                isOpen={showConfirmDialog}
                title="Unsaved Changes"
                message="You have unsaved changes. Do you want to discard them and continue?"
                onConfirm={handleNavigationConfirm}
                onCancel={handleNavigationCancel}
                confirmText="Discard Changes"
                cancelText="Keep Editing"
            />

            {/* Email Verification Modal */}
            {showEmailVerification && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-zoom-in">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Verify Your Email</h3>
                            <button 
                                onClick={() => {
                                    setShowEmailVerification(false);
                                    setVerificationCode('');
                                    setVerificationError('');
                                }}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                        
                        <div className="mb-6">
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-4">
                                <div className="flex gap-3">
                                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                    </svg>
                                    <div>
                                        <p className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1">
                                            Verification code sent!
                                        </p>
                                        <p className="text-xs text-blue-600 dark:text-blue-400">
                                            We've sent a 6-digit code to <span className="font-semibold">{profileData.email}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Enter Verification Code
                            </label>
                            <input
                                type="text"
                                value={verificationCode}
                                onChange={(e) => {
                                    setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                                    setVerificationError('');
                                }}
                                placeholder="000000"
                                maxLength={6}
                                className="w-full px-4 py-3 text-center text-2xl font-bold tracking-widest border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            />
                            
                            {verificationError && (
                                <p className="text-sm text-red-600 dark:text-red-400 mt-2 flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    {verificationError}
                                </p>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleResendEmail}
                                className="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold transition-colors"
                            >
                                Resend Code
                            </button>
                            <button
                                onClick={handleVerifyEmailCode}
                                disabled={verificationCode.length !== 6}
                                className="flex-1 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                Verify Email
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Phone Verification Modal */}
            {showPhoneVerification && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-zoom-in">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Verify Your Phone</h3>
                            <button 
                                onClick={() => {
                                    setShowPhoneVerification(false);
                                    setPhoneCode('');
                                    setVerificationError('');
                                }}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                        
                        <div className="mb-6">
                            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 mb-4">
                                <div className="flex gap-3">
                                    <svg className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                    </svg>
                                    <div>
                                        <p className="text-sm font-semibold text-green-800 dark:text-green-300 mb-1">
                                            SMS code sent!
                                        </p>
                                        <p className="text-xs text-green-600 dark:text-green-400">
                                            We've sent a 6-digit code to <span className="font-semibold">{profileData.phone}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Enter SMS Code
                            </label>
                            <input
                                type="text"
                                value={phoneCode}
                                onChange={(e) => {
                                    setPhoneCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                                    setVerificationError('');
                                }}
                                placeholder="000000"
                                maxLength={6}
                                className="w-full px-4 py-3 text-center text-2xl font-bold tracking-widest border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            />
                            
                            {verificationError && (
                                <p className="text-sm text-red-600 dark:text-red-400 mt-2 flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    {verificationError}
                                </p>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleResendSMS}
                                className="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold transition-colors"
                            >
                                Resend SMS
                            </button>
                            <button
                                onClick={handleVerifyPhoneCode}
                                disabled={phoneCode.length !== 6}
                                className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                Verify Phone
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Resident Verification Modal */}
            {showResidentVerification && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col my-8 animate-zoom-in">
                        {/* Header - Fixed at top */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Resident Verification</h3>
                            <button 
                                onClick={() => {
                                    setShowResidentVerification(false);
                                    setValidIdFront(null);
                                    setValidIdBack(null);
                                    setCurrentPicture(null);
                                }}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                        
                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto px-6 py-6">
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6">
                                <div className="flex gap-3">
                                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                    <div>
                                        <p className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1">
                                            Requirements for Verification
                                        </p>
                                        <ul className="text-xs text-blue-600 dark:text-blue-400 list-disc list-inside space-y-1">
                                            <li>Upload a clear photo of your valid ID (front side)</li>
                                            <li>Upload a clear photo of your valid ID (back side)</li>
                                            <li>Upload a recent/current photo of yourself</li>
                                            <li>Accepted IDs: National ID, Driver's License, Passport, Voter's ID</li>
                                            <li>Photos must be clear and readable</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Valid ID Front URL */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Valid ID (Front Side) URL <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="url"
                                    placeholder="https://example.com/id-front.jpg"
                                    value={validIdFront || ''}
                                    onChange={(e) => setValidIdFront(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                />
                                {validIdFront && (
                                    <div className="mt-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl p-4">
                                        <img 
                                            src={validIdFront} 
                                            alt="Valid ID Front Preview" 
                                            className="max-h-48 mx-auto rounded-lg"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'none';
                                            }}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Valid ID Back URL */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Valid ID (Back Side) URL <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="url"
                                    placeholder="https://example.com/id-back.jpg"
                                    value={validIdBack || ''}
                                    onChange={(e) => setValidIdBack(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                />
                                {validIdBack && (
                                    <div className="mt-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl p-4">
                                        <img 
                                            src={validIdBack} 
                                            alt="Valid ID Back Preview" 
                                            className="max-h-48 mx-auto rounded-lg"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'none';
                                            }}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Current Picture URL */}
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Current/Recent Photo URL <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="url"
                                    placeholder="https://example.com/face-photo.jpg"
                                    value={currentPicture || ''}
                                    onChange={(e) => setCurrentPicture(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                />
                                {currentPicture && (
                                    <div className="mt-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl p-4">
                                        <img 
                                            src={currentPicture} 
                                            alt="Face Photo Preview" 
                                            className="max-h-48 mx-auto rounded-lg"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'none';
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Fixed Footer with Buttons */}
                        <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
                            <button
                                onClick={() => {
                                    setShowResidentVerification(false);
                                    setValidIdFront(null);
                                    setValidIdBack(null);
                                    setCurrentPicture(null);
                                }}
                                className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitResidentVerification}
                                disabled={!validIdFront || !validIdBack || !currentPicture}
                                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                            >
                                Submit Application
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Camera Modal */}
            {showCamera && (
                <div className="fixed inset-0 bg-black z-[60] flex flex-col">
                    <div className="flex-1 relative">
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover"
                        />
                        <canvas ref={canvasRef} className="hidden" />
                        
                        {/* Camera Controls */}
                        <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-4 px-4">
                            <button
                                onClick={handleCloseCamera}
                                className="bg-gray-600 hover:bg-gray-700 text-white p-4 rounded-full transition"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            
                            <button
                                onClick={handleCapturePhoto}
                                className="bg-white hover:bg-gray-200 p-6 rounded-full transition shadow-lg ring-4 ring-white/30"
                            >
                                <div className="w-4 h-4 bg-red-600 rounded-full"></div>
                            </button>
                            
                            <div className="w-14 h-14"></div>
                        </div>

                        {/* Camera Instructions */}
                        <div className="absolute top-8 left-0 right-0 px-4">
                            <div className="bg-black/50 backdrop-blur-sm text-white text-center py-3 px-4 rounded-lg">
                                <p className="text-sm font-semibold">Position your face in the frame</p>
                                <p className="text-xs mt-1">Make sure your face is clearly visible</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Profile Image URL Modal */}
            {showImageUrlModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                            Update Profile Picture
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            Enter the URL of your profile image below:
                        </p>
                        <input
                            type="url"
                            placeholder="https://example.com/image.jpg"
                            value={tempImageUrl}
                            onChange={(e) => setTempImageUrl(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg mb-4 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowImageUrlModal(false);
                                    setTempImageUrl('');
                                }}
                                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleImageUrlChange}
                                className="flex-1 px-4 py-2 bg-red-900 text-white rounded-lg font-semibold hover:bg-red-800 transition-colors"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
export default DashboardPage;
