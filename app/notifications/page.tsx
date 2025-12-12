'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import PageTransition from '../../components/PageTransition';
import { Bell, CheckCircle, XCircle, AlertCircle, Megaphone, Info, Zap, Recycle } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface Notification {
    id: number;
    type: string;
    title: string;
    message: string;
    relatedId?: number | null;
    isRead: boolean;
    createdAt: string;
}

const NotificationsPage: React.FC = () => {
    const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    const mockNotifications = [
        {
            id: 1,
            type: 'emergency',
            title: 'New Emergency Alert',
            message: 'Typhoon warning for coastal areas. Residents are advised to prepare emergency kits and stay updated.',
            time: '2 hours ago',
            read: false,
            icon: '🚨',
            color: 'red'
        },
        {
            id: 2,
            type: 'event',
            title: 'Upcoming Event',
            message: 'Community meeting this Friday at 2:00 PM. All residents are encouraged to attend.',
            time: '5 hours ago',
            read: false,
            icon: '📅',
            color: 'blue'
        },
        {
            id: 3,
            type: 'health',
            title: 'Health Advisory',
            message: 'Free vaccination program starts next week at the Rural Health Unit. Register now!',
            time: '1 day ago',
            read: false,
            icon: '💉',
            color: 'green'
        },
        {
            id: 4,
            type: 'announcement',
            title: 'New Municipal Service',
            message: 'Online application for business permits is now available. Visit the services page to apply.',
            time: '2 days ago',
            read: true,
            icon: '📢',
            color: 'yellow'
        },
        {
            id: 5,
            type: 'update',
            title: 'Road Repair Update',
            message: 'Main road construction in Poblacion is 75% complete. Expected completion by end of month.',
            time: '3 days ago',
            read: true,
            icon: '🚧',
            color: 'orange'
        },
        {
            id: 6,
            type: 'event',
            title: 'Sports Festival',
            message: 'Annual Cordova Sports Festival registration is now open. Join your barangay team!',
            time: '4 days ago',
            read: true,
            icon: '🏆',
            color: 'purple'
        },
        {
            id: 7,
            type: 'emergency',
            title: 'Power Interruption Notice',
            message: 'Scheduled power interruption on Saturday, 6:00 AM - 12:00 PM for maintenance.',
            time: '5 days ago',
            read: true,
            icon: '⚡',
            color: 'red'
        },
        {
            id: 8,
            type: 'announcement',
            title: 'Garbage Collection Schedule',
            message: 'New garbage collection schedule implemented. Check your barangay for details.',
            time: '1 week ago',
            read: true,
            icon: '♻️',
            color: 'green'
        }
    ];

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            const response = await fetch(`${API_BASE_URL}/notifications`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setNotifications(data);
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteNotification = async (id: number) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/notifications/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setNotifications(prev => prev.filter(n => n.id !== id));
                console.log('Notification deleted successfully');
            } else {
                console.error('Failed to delete notification');
            }
        } catch (error) {
            console.error('Failed to delete notification:', error);
        }
    };

    const markAsRead = async (id: number) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setNotifications(prev => prev.map(n => 
                    n.id === id ? { ...n, isRead: true } : n
                ));
            }
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/notifications/mark-all-read`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
                console.log('All notifications marked as read');
            }
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    const handleNotificationClick = (notif: Notification) => {
        // Mark as read if unread
        if (!notif.isRead) {
            markAsRead(notif.id);
        }

        // Navigate based on notification type
        if (notif.type === 'featured_post' || notif.type === 'post') {
            // Try to determine the post type from the notification message or metadata
            // For now, map common notification patterns
            if (notif.message.toLowerCase().includes('event')) {
                window.location.href = `/community/events`;
            } else if (notif.message.toLowerCase().includes('announcement')) {
                window.location.href = `/community/announcements`;
            } else {
                window.location.href = `/community/news`;
            }
        } else if (notif.type === 'event') {
            window.location.href = `/community/events`;
        } else if (notif.type === 'announcement') {
            window.location.href = `/community/announcements`;
        } else if (notif.type === 'news') {
            window.location.href = `/community/news`;
        } else {
            // Default to community page
            window.location.href = `/community`;
        }
    };

    const getTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
        return date.toLocaleDateString();
    };

    const getNotificationIcon = (type: string) => {
        const iconMap: Record<string, React.ReactNode> = {
            'featured_post': <Megaphone className="w-full h-full" />,
            'verification_approved': <CheckCircle className="w-full h-full" />,
            'verification_rejected': <XCircle className="w-full h-full" />,
            'service_request_update': <Bell className="w-full h-full" />,
            'emergency': <AlertCircle className="w-full h-full" />,
            'event': <Bell className="w-full h-full" />,
            'health': <AlertCircle className="w-full h-full" />,
            'announcement': <Megaphone className="w-full h-full" />,
            'update': <Info className="w-full h-full" />
        };
        return iconMap[type] || <Bell className="w-full h-full" />;
    };

    const getNotificationColor = (type: string) => {
        const colors: Record<string, string> = {
            'featured_post': 'blue',
            'verification_approved': 'green',
            'verification_rejected': 'red',
            'service_request_update': 'yellow',
            'emergency': 'red',
            'event': 'blue',
            'health': 'green',
            'announcement': 'yellow',
            'update': 'orange'
        };
        return colors[type] || 'blue';
    };

    const filteredNotifications = notifications.filter(notif => {
        if (filter === 'unread') return !notif.isRead;
        if (filter === 'read') return notif.isRead;
        return true;
    });

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const getColorClasses = (color: string, isRead: boolean) => {
        if (isRead) {
            return {
                bg: 'bg-gray-100 dark:bg-gray-700',
                dot: 'bg-gray-400',
                icon: 'bg-gray-200 dark:bg-gray-600'
            };
        }
        
        const colorMap: Record<string, any> = {
            red: {
                bg: 'bg-red-50 dark:bg-red-900/20',
                dot: 'bg-red-600',
                icon: 'bg-red-100 dark:bg-red-900/40'
            },
            blue: {
                bg: 'bg-blue-50 dark:bg-blue-900/20',
                dot: 'bg-blue-600',
                icon: 'bg-blue-100 dark:bg-blue-900/40'
            },
            green: {
                bg: 'bg-green-50 dark:bg-green-900/20',
                dot: 'bg-green-600',
                icon: 'bg-green-100 dark:bg-green-900/40'
            },
            yellow: {
                bg: 'bg-yellow-50 dark:bg-yellow-900/20',
                dot: 'bg-yellow-600',
                icon: 'bg-yellow-100 dark:bg-yellow-900/40'
            },
            orange: {
                bg: 'bg-orange-50 dark:bg-orange-900/20',
                dot: 'bg-orange-600',
                icon: 'bg-orange-100 dark:bg-orange-900/40'
            },
            purple: {
                bg: 'bg-purple-50 dark:bg-purple-900/20',
                dot: 'bg-purple-600',
                icon: 'bg-purple-100 dark:bg-purple-900/40'
            }
        };
        
        return colorMap[color] || colorMap.blue;
    };

    return (
        <>
            <Navbar />
            <PageTransition>
                <div className="min-h-screen bg-gradient-to-br from-pink-50 via-red-50 to-orange-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-colors py-8">
                    <div className="max-w-4xl mx-auto px-4">
                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-4xl md:text-5xl font-black text-red-900 dark:text-white mb-2">
                                Notifications
                            </h1>
                            <p className="text-gray-700 dark:text-gray-300">
                                Stay updated with the latest announcements and alerts
                            </p>
                        </div>

                        {/* Filter Tabs */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 mb-6">
                            <div className="flex gap-3 flex-wrap">
                                <button 
                                    onClick={() => setFilter('all')}
                                    className={`px-6 py-2 rounded-full font-semibold transition-all ${
                                        filter === 'all' 
                                            ? 'bg-red-900 text-white shadow-lg' 
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                                >
                                    All ({notifications.length})
                                </button>
                                <button 
                                    onClick={() => setFilter('unread')}
                                    className={`px-6 py-2 rounded-full font-semibold transition-all ${
                                        filter === 'unread' 
                                            ? 'bg-red-900 text-white shadow-lg' 
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                                >
                                    Unread ({unreadCount})
                                </button>
                                <button 
                                    onClick={() => setFilter('read')}
                                    className={`px-6 py-2 rounded-full font-semibold transition-all ${
                                        filter === 'read' 
                                            ? 'bg-red-900 text-white shadow-lg' 
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                                >
                                    Read ({notifications.length - unreadCount})
                                </button>
                            </div>
                        </div>

                        {/* Notifications List */}
                        <div className="space-y-3">
                            {loading ? (
                                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
                                    <div className="animate-spin w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                                    <p className="text-gray-600 dark:text-gray-400">Loading notifications...</p>
                                </div>
                            ) : filteredNotifications.length === 0 ? (
                                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
                                    <div className="text-6xl mb-4">📭</div>
                                    <p className="text-gray-600 dark:text-gray-400 text-lg">No notifications in this category</p>
                                </div>
                            ) : (
                                filteredNotifications.map((notif) => {
                                    const color = getNotificationColor(notif.type);
                                    const colors = getColorClasses(color, notif.isRead);
                                    return (
                                        <div 
                                            key={notif.id}
                                            onClick={() => handleNotificationClick(notif)}
                                            className={`${colors.bg} rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all cursor-pointer border-2 ${
                                                notif.isRead ? 'border-transparent' : 'border-red-200 dark:border-red-800'
                                            }`}
                                        >
                                            <div className="flex gap-4">
                                                <div className={`w-14 h-14 ${colors.icon} rounded-full flex items-center justify-center flex-shrink-0 text-red-600 dark:text-red-400`}>
                                                    {getNotificationIcon(notif.type)}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                                                            {notif.title}
                                                        </h3>
                                                        {!notif.isRead && (
                                                            <div className={`w-3 h-3 ${colors.dot} rounded-full animate-pulse`}></div>
                                                        )}
                                                    </div>
                                                    <p className="text-gray-700 dark:text-gray-300 mb-3">
                                                        {notif.message}
                                                    </p>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                                            {getTimeAgo(notif.createdAt)}
                                                        </span>
                                                        <button 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                deleteNotification(notif.id);
                                                            }}
                                                            className="text-sm text-red-600 dark:text-red-400 hover:underline font-semibold"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Action Buttons */}
                        {!loading && filteredNotifications.length > 0 && unreadCount > 0 && (
                            <div className="mt-8 flex justify-center gap-4">
                                <button 
                                    onClick={markAllAsRead}
                                    className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full font-bold hover:bg-gray-100 dark:hover:bg-gray-700 transition shadow-lg"
                                >
                                    Mark All as Read
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </PageTransition>
            <Footer />
        </>
    );
};
export default NotificationsPage;
