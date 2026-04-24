'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import * as apiClient from 'lib/apiClient';
import { postsApi } from 'lib/postsApi';
import { statsApi } from 'lib/statsApi';
import { Bell, Users, FileText, Calendar, Package, Shield, Plus, Search, Filter, Check, X, Edit, Trash2, Eye, AlertCircle, UserCheck, IdCard, Camera } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import {
    initialUsers,
    initialPosts,
    initialServiceRequests,
    loadData,
    loadDataAsync,
    saveData,
    STORAGE_KEYS,
    type User,
    type Post,
    type ServiceRequest,
    type BarangayOfficial
} from 'data/adminData';
import Navbar from 'components/Navbar';

interface Notification {
    id: number;
    title: string;
    message: string;
    timestamp: string;
    read?: boolean;
    type?: string;
}

// Admin component wrapper: re-introduced so hooks and handlers have correct scope
const AdminDashboard = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'overview' | 'posts' | 'users' | 'verification' | 'services'>('overview');
    const [users, setUsers] = useState<User[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [adminActivities, setAdminActivities] = useState<any[]>([]);
    const [selectedRequests, setSelectedRequests] = useState<number[]>([]);
    const [bulkEditMode, setBulkEditMode] = useState(false);
    const [bulkEditData, setBulkEditData] = useState<{status?: string; note?: string}>({});
    const [serviceRequestStatusFilter, setServiceRequestStatusFilter] = useState<string>('all');
    const [userSearch, setUserSearch] = useState<string>('');
    const [userFilters, setUserFilters] = useState<{barangay: string; role: string; status: string; sortBy?: string}>({barangay: 'All', role: 'All', status: 'All', sortBy: 'registeredAt'});
    const [postTypeFilter, setPostTypeFilter] = useState<string>('all');
    const [postSearch, setPostSearch] = useState<string>('');
    const [postStatusFilter, setPostStatusFilter] = useState<string>('all');
    const [postPriorityFilter, setPostPriorityFilter] = useState<string>('all');
    const [showCreatePostModal, setShowCreatePostModal] = useState<boolean>(false);
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<{type: string; id: number} | null>(null);

    // Admin role protection
    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            toast.error('Please login to access admin dashboard');
            router.push('/auth/login');
            return;
        }

        const user = JSON.parse(userStr);
        if (user.role !== 'admin') {
            toast.error('Access denied. Admin privileges required.');
            router.push('/');
        }
    }, [router]);

    type DetailModalType =
        | { type: 'user'; data: User }
        | { type: 'post'; data: Post }
        | { type: 'service'; data: ServiceRequest & { isEditing?: boolean } }
        | { type: 'verification'; data: User & { docType?: 'id' | 'face' } }
        | { type: 'official'; data: BarangayOfficial }
        | { type: null; data: null };
    const [detailModal, setDetailModal] = useState<DetailModalType>({ type: null, data: null });
    // Preview modal & barangay filter removed (Barangay officials are read-only and not managed from admin UI)
    const [serviceNotes, setServiceNotes] = useState<Record<number, string>>({});
    const [newPost, setNewPost] = useState<Partial<Post>>({ type: 'news', title: '', content: '', author: 'Admin', createdAt: new Date().toISOString(), status: 'draft', isFeatured: false });
    // Barangay officials are intentionally static; admin dashboard does not manage these
    const [stats, setStats] = useState({ totalUsers: 0, verificationRequests: 0, serviceRequests: 0, publishedPosts: 0 });

    // Helper functions for role/status colors
    const getRoleColor = (role: string) => {
        switch (role?.toLowerCase?.()) {
            case 'admin':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
            case 'mayor':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
            case 'barangay captain':
            case 'barangay kagawad':
            case 'official':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
            case 'news publisher':
                return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400';
            case 'event creator':
                return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400';
            case 'visitor':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'citizen':
            default:
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase?.()) {
            case 'processing':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'completed':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            case 'rejected':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
        }
    };

    // Helper: generate next unique numeric ID for posts
    const getNextPostId = () => Math.max(0, ...posts.map(p => p.id)) + 1;

    // Helper: generate a UUID (uses Web Crypto API if available, otherwise fallback)
    const generateUuid = () => (typeof crypto !== 'undefined' && (crypto as any).randomUUID)
        ? (crypto as any).randomUUID()
        : `${Date.now()}-${Math.floor(Math.random() * 1e9)}`;

    // Always use API mode when authenticated
    const isDbMode = true;

    // CRUD Handlers
    const handleDeletePost = async (id: number) => {
        const post = posts.find(p => p.id === id);
        const previous = posts;
        setPosts(posts.filter(p => p.id !== id));
        setShowDeleteConfirm(null);
        try {
            await postsApi.delete(id);
            toast.success(`Post "${post?.title}" deleted successfully`);
        } catch (err: any) {
            setPosts(previous);
            console.error('Failed to delete post via API:', err);
            toast.error(err.message || 'Failed to delete post from server');
        }
    };

    const handleDeleteUser = async (id: number) => {
        const user = users.find(u => u.id === id);
        const previous = users;
        setUsers(users.filter(u => u.id !== id));
        setShowDeleteConfirm(null);
        try {
            if (isDbMode) await apiClient.deleteUser(id);
            toast.success(`User "${user?.name}" deleted successfully`);
        } catch (err) {
            setUsers(previous);
            console.error('Failed to delete user via API:', err);
            toast.error('Failed to delete user from server');
        }
    };

    // handleDeleteOfficial removed because officials are static and cannot be managed via admin dashboard

    const handleDeleteServiceRequest = async (id: number) => {
        console.log(`[Admin] Deleting service request ID: ${id}`);
        const previous = serviceRequests;
        setServiceRequests(serviceRequests.filter(r => r.id !== id));
        setShowDeleteConfirm(null);
        try {
            console.log(`[Admin] Calling apiClient.deleteServiceRequest(${id})`);
            const result = await apiClient.deleteServiceRequest(id);
            console.log(`[Admin] Delete successful, response:`, result);
            toast.success('Service request deleted successfully');
        } catch (err) {
            setServiceRequests(previous);
            console.error(`[Admin] Failed to delete service request ${id}:`, err);
            toast.error('Failed to delete service request from server');
        }
    };

    const handleUpdateUserRole = async (userId: number, newRole: User['role']) => {
        const previous = users;
        const user = users.find(u => u.id === userId);
        setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
        try {
            if (isDbMode && userId) await apiClient.updateUser(userId, { ...user, role: newRole });
            toast.success(`Updated ${user?.name}'s role to ${newRole}`);
        } catch (err) {
            setUsers(previous);
            console.error('Failed to update user role via API:', err);
            toast.error('Failed to update user role on server');
        }
    };

    const handleUpdatePost = async (updatedPost: Post) => {
        const previous = posts;
        setPosts(posts.map(p => p.id === updatedPost.id ? updatedPost : p));
        setEditingPost(null);
        try {
            await postsApi.update(updatedPost.id, updatedPost);
            toast.success(`Post "${updatedPost.title}" updated successfully`);
        } catch (err: any) {
            setPosts(previous);
            console.error('Failed to update post via API:', err);
            toast.error(err.message || 'Failed to update post on server');
        }
    };

    // Repair duplicate IDs for posts: unify duplicates into unique numeric IDs
    const repairDuplicatePostIds = async () => {
        // Count occurrences
        const idCounts: Record<number, number> = {};
        for (const p of posts) idCounts[p.id] = (idCounts[p.id] || 0) + 1;

        const duplicates = Object.entries(idCounts).filter(([id, count]) => count > 1);
        if (duplicates.length === 0) {
            toast.success('No duplicate post ids found.');
            return;
        }

        if (!confirm(`Found ${duplicates.length} duplicate post ids. Proceed to repair and assign new IDs?`)) return;

        let maxId = Math.max(0, ...posts.map(p => p.id));
        const seen = new Set<number>();
        const updatedPosts: Post[] = posts.map(p => {
            if (!seen.has(p.id)) {
                seen.add(p.id);
                return p;
            }
            // Duplicate - assign new id
            maxId += 1;
            const newPost = { ...p, id: maxId };
            seen.add(newPost.id);
            return newPost;
        });

        setPosts(updatedPosts);
        try {
            await saveData(STORAGE_KEYS.POSTS, updatedPosts);
            toast.success(`Repaired duplicate post ids; assigned ${duplicates.reduce((acc, [_id, c]) => acc + (c - 1), 0)} new ids.`);
        } catch (err) {
            toast.error('Failed to persist repaired posts to storage.');
            console.error('Failed to save repaired posts:', err);
        }
    };

    // Migrate posts to include UUIDs (non-destructive). Adds uuid to posts that don't have one yet.
    const migratePostsToUuid = async () => {
        if (!confirm('This will add UUID fields to posts that are missing them. Proceed?')) return;
        const updated = posts.map(p => {
            if (p.uuid) return p;
            const uuid = (typeof crypto !== 'undefined' && (crypto as any).randomUUID)
                ? (crypto as any).randomUUID()
                : `${Date.now()}-${Math.floor(Math.random()*1e9)}`;
            return { ...p, uuid };
        });
        setPosts(updated);
        try {
            await saveData(STORAGE_KEYS.POSTS, updated);
            toast.success('Post UUID migration completed.');
        } catch (err) {
            toast.error('Failed to persist UUIDs to storage.');
            console.error('Failed to save migrated posts:', err);
        }
    };

    // handleCreateOfficial removed - officials are static and cannot be edited via Admin Dashboard

    const handleUpdateServiceStatus = async (requestId: number, newStatus: 'pending' | 'processing' | 'rejected' | 'completed', note?: string) => {
        console.log(`[Admin] Updating service request ID: ${requestId}, newStatus: ${newStatus}`);
        const previous = serviceRequests;
        setServiceRequests(serviceRequests.map(r => 
            r.id === requestId 
                ? { ...r, status: newStatus, adminNote: note, updatedAt: new Date().toISOString() } 
                : r
        ));
        
        try {
            console.log(`[Admin] Calling apiClient.updateServiceRequest(${requestId}, { status: "${newStatus}", adminNote: "${note}" })`);
            const result = await apiClient.updateServiceRequest(requestId, { status: newStatus, adminNote: note });
            console.log(`[Admin] Update successful, response:`, result);
            toast.success(
            <div>
                <p className="font-semibold">Status updated to "{newStatus}"</p>
                <p className="text-sm">Request #{requestId} • User's request updated</p>
                {note && <p className="text-xs mt-1 italic">Note: {note}</p>}
            </div>,
            { duration: 4000 }
            );
        } catch (err) {
            setServiceRequests(previous);
            console.error(`[Admin] Failed to update service request ${requestId}:`, err);
            toast.error(`Failed to update service request on server: ${err instanceof Error ? err.message : String(err)}`);
        }
    };

    const handleBulkUpdate = () => {
        if (selectedRequests.length === 0) {
            toast.error('Please select at least one request to update.');
            return;
        }
        if (!bulkEditData.status && !bulkEditData.note) {
            toast.error('Please select a status or add a note.');
            return;
        }

        const updatedRequests = serviceRequests.map(r => {
            if (selectedRequests.includes(r.id)) {
                return {
                    ...r,
                    status: bulkEditData.status ? bulkEditData.status as any : r.status,
                    adminNote: bulkEditData.note || r.adminNote,
                    updatedAt: new Date().toISOString()
                };
            }
            return r;
        });

        setServiceRequests(updatedRequests);
        
        // Show success toast
        toast.success(
            <div>
                <p className="font-semibold">Updated {selectedRequests.length} request(s) successfully!</p>
                {bulkEditData.status && <p className="text-sm">Status: {bulkEditData.status}</p>}
                {bulkEditData.note && <p className="text-sm italic">Note: {bulkEditData.note}</p>}
                <p className="text-xs mt-1">Affected users will be notified via email</p>
            </div>,
            { duration: 5000 }
        );
        
        // In DB mode, persist updates immediately
        if (isDbMode) {
            (async () => {
                try {
                    for (const r of updatedRequests) {
                        if (r.id) await apiClient.updateServiceRequest(r.id, r);
                    }
                    toast.success(`Bulk-save complete`);
                } catch (err) {
                    console.error('Failed bulk update via API:', err);
                    toast.error('Failed to save some requests on server');
                }
            })();
        }

        // Reset bulk edit mode
        setBulkEditMode(false);
        setSelectedRequests([]);
        setBulkEditData({});
    };

    // Helper to update only the service detail within a detailModal safely
    const updateServiceDetail = (patch: Partial<ServiceRequest>) => {
        if (detailModal?.type === 'service') {
            setDetailModal({ type: 'service', data: { ...detailModal.data, ...patch } });
        }
    };

    const toggleSelectRequest = (id: number) => {
        setSelectedRequests(prev => 
            prev.includes(id) ? prev.filter(rid => rid !== id) : [...prev, id]
        );
    };

    const selectAllRequests = () => {
        if (selectedRequests.length === serviceRequests.length) {
            setSelectedRequests([]);
        } else {
            setSelectedRequests(serviceRequests.map(r => r.id));
        }
    };

    const handleApproveVerification = async (userId: number) => {
        const previous = users;
        const user = users.find(u => u.id === userId);
        const barangay = user?.verifiedBarangay || user?.barangay;
        
        // Update both verified and isVerified fields
        setUsers(users.map(u => u.id === userId ? { 
            ...u, 
            verified: true, 
            isVerified: true, 
            barangay: barangay 
        } : u));
        
        try {
            await apiClient.verifyUser(userId, { isVerified: true, barangay });
            toast.success('User verification approved and synced to database');
            
            // Reload users from database to get fresh data
            const dbUsers = await statsApi.getAllUsers();
            const mappedUsers = dbUsers.map(u => ({
                id: u.id,
                name: `${u.firstName || ''} ${u.middleName || ''} ${u.lastName || ''}`.trim() || u.email,
                firstName: u.firstName,
                middleName: u.middleName,
                lastName: u.lastName,
                email: u.email,
                barangay: u.barangay || 'Not specified',
                role: u.role as any,
                verified: u.isVerified,
                isVerified: u.isVerified,
                points: 0,
                registeredAt: new Date(u.createdAt).toLocaleDateString(),
                contactNumber: u.contactNumber || 'Not provided',
                profileImageUrl: u.profileImageUrl,
                frontIdDocumentUrl: u.frontIdDocumentUrl,
                backIdDocumentUrl: u.backIdDocumentUrl,
                faceVerificationUrl: u.faceVerificationUrl
            }));
            setUsers(mappedUsers);
        } catch (err: any) {
            setUsers(previous);
            console.error('Failed to approve verification via API:', err);
            toast.error(err.message || 'Failed to update verification status on server');
        }
    };

    const handleRejectVerification = async (userId: number) => {
        const previous = users;
        const user = users.find(u => u.id === userId);
        
        // Update user to remove verification documents and keep account
        setUsers(users.map(u => u.id === userId ? { 
            ...u, 
            isVerified: false,
            verified: false,
            frontIdDocumentUrl: null,
            backIdDocumentUrl: null,
            faceVerificationUrl: null
        } : u));
        setShowDeleteConfirm(null);
        setDetailModal({ type: null, data: null });
        try {
            if (isDbMode && userId) {
                // Update user to clear verification documents instead of deleting
                await apiClient.updateUser(userId, {
                    isVerified: false,
                    frontIdDocumentUrl: null,
                    backIdDocumentUrl: null,
                    faceVerificationUrl: null
                });
                toast.success(`Verification request rejected for ${user?.name}. User account preserved.`);
                
                // Reload users from database to get fresh data
                const dbUsers = await statsApi.getAllUsers();
                const mappedUsers = dbUsers.map(u => ({
                    id: u.id,
                    name: `${u.firstName || ''} ${u.middleName || ''} ${u.lastName || ''}`.trim() || u.email,
                    firstName: u.firstName,
                    middleName: u.middleName,
                    lastName: u.lastName,
                    email: u.email,
                    barangay: u.barangay || 'Not specified',
                    role: u.role as any,
                    verified: u.isVerified,
                    isVerified: u.isVerified,
                    points: 0,
                    registeredAt: new Date(u.createdAt).toLocaleDateString(),
                    contactNumber: u.contactNumber || 'Not provided',
                    profileImageUrl: u.profileImageUrl,
                    frontIdDocumentUrl: u.frontIdDocumentUrl,
                    backIdDocumentUrl: u.backIdDocumentUrl,
                    faceVerificationUrl: u.faceVerificationUrl
                }));
                setUsers(mappedUsers);
            }
        } catch (err: any) {
            setUsers(previous);
            const errorMsg = err.message || 'Failed to reject verification';
            console.error('Failed to delete verification via API:', err);
            
            // Provide more specific error messages
            if (errorMsg.includes('not available') || errorMsg.includes('404')) {
                toast.error('User deletion endpoint not available. Please contact administrator.');
            } else if (errorMsg.includes('authentication') || errorMsg.includes('token')) {
                toast.error('Authentication failed. Please log in again.');
            } else {
                toast.error(errorMsg);
            }
        }
    };

    const barangays = ['Alegria', 'Bangbang', 'Buagsong', 'Catarman', 'Cogon', 'Dapitan', 'Day-as', 'Gabi', 'Gilutongan', 'Ibabao', 'Pilipog', 'Poblacion', 'San Miguel'];

    // Load data from API on mount
    useEffect(() => {
        const initData = async () => {
            try {
                // Load posts from API
                const apiPosts = await postsApi.getAll();
                setPosts(apiPosts || []);
                
                // Load real statistics from database
                const realStats = await statsApi.getAdminStats();
                
                // Get actual service requests count
                const apiRequests = await apiClient.getServiceRequests();
                const serviceRequestsCount = apiRequests.length;
                
                setStats({
                    ...realStats,
                    serviceRequests: serviceRequestsCount
                });
                
                // Load users from database
                const dbUsers = await statsApi.getAllUsers();
                const mappedUsers = dbUsers.map(u => ({
                    id: u.id,
                    name: `${u.firstName || ''} ${u.middleName || ''} ${u.lastName || ''}`.trim() || u.email,
                    firstName: u.firstName,
                    middleName: u.middleName,
                    lastName: u.lastName,
                    email: u.email,
                    barangay: u.barangay || 'Not specified',
                    role: u.role as any,
                    verified: u.isVerified,
                    isVerified: u.isVerified,
                    points: 0,
                    registeredAt: new Date(u.createdAt).toLocaleDateString(),
                    contactNumber: u.contactNumber || 'Not provided',
                    profileImageUrl: u.profileImageUrl,
                    frontIdDocumentUrl: u.frontIdDocumentUrl,
                    backIdDocumentUrl: u.backIdDocumentUrl,
                    faceVerificationUrl: u.faceVerificationUrl
                }));
                setUsers(mappedUsers);
                
                // Load service requests from API
                try {
                    const apiRequests = await apiClient.getServiceRequests();
                    const mappedRequests = apiRequests.map((r: any) => ({
                        id: r.id,
                        type: r.serviceType,
                        serviceType: r.serviceType,
                        description: r.description,
                        status: r.status,
                        createdAt: new Date(r.createdAt).toLocaleDateString(),
                        submittedAt: new Date(r.createdAt).toLocaleDateString(),
                        userId: r.userId,
                        userName: r.userName || 'Unknown User',
                        adminNote: r.adminNote || '',
                        details: r.description
                    }));
                    setServiceRequests(mappedRequests);
                } catch (err) {
                    console.error('Failed to load service requests from API:', err);
                    // Fallback to localStorage
                    const loadedRequests = await loadDataAsync(STORAGE_KEYS.SERVICE_REQUESTS, initialServiceRequests);
                    setServiceRequests(loadedRequests);
                }
                
                // Load admin activities
                try {
                    const activities = await apiClient.getAdminActivities(50);
                    setAdminActivities(activities);
                } catch (err) {
                    console.error('Failed to load admin activities:', err);
                }
                
                toast.success('Dashboard data loaded successfully');
            } catch (err: any) {
                console.error('Failed to load dashboard data:', err);
                toast.error('Failed to load data from server. Please check your connection.');
                // Don't fallback to localStorage for users - keep empty to avoid showing stale data
                setPosts([]);
                setUsers([]);
            }
        };
        initData();
    }, []);

    // Listen for fallback storage events to inform the admin
    useEffect(() => {
        const handleFallback = (e: any) => {
            const { key, fallback } = e.detail || {};
            toast.error(`Local storage limit reached. Data for ${key} was saved to ${fallback}.`);
        };
        window.addEventListener('adminDataStorageFallback', handleFallback);
        return () => window.removeEventListener('adminDataStorageFallback', handleFallback);
    }, []);

    // Users are now managed via API only, no localStorage sync needed
    // Posts are now managed via API, no localStorage sync needed

    useEffect(() => {
        if (serviceRequests.length > 0) {
            saveData(STORAGE_KEYS.SERVICE_REQUESTS, serviceRequests).catch((err) => console.error('Failed to save service requests', err));
        }
    }, [serviceRequests]);

    // Barangay officials are intentionally static; don't persist to admin storage from the dashboard.

    const markNotificationAsRead = (id: number) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    };

    function toLowerCase(role: string): string | number | readonly string[] | undefined {
        throw new Error('Function not implemented.');
    }

    return (
        
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar/>
            <Toaster 
                position="top-right"
                toastOptions={{
                    className: 'dark:bg-gray-800 dark:text-white',
                    success: {
                        iconTheme: {
                            primary: '#10B981',
                            secondary: 'white',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#EF4444',
                            secondary: 'white',
                        },
                    },
                }}
            />
            {/* Header */}
            <div className="relative bg-gradient-to-r from-red-900 to-red-800 text-white py-6 overflow-hidden">
                {/* Background Image Overlay */}
                <div 
                    className="absolute inset-0 bg-cover opacity-20"
                    style={{ backgroundImage: "url('/municipality-bg.jpg')", backgroundPosition: 'center top 30%' }}
                />
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-black">Admin Dashboard</h1>
                            <p className="text-sm text-white/80">Municipality of Cordova Management System</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex gap-1 overflow-x-auto">
                        {[
                            { id: 'overview', label: 'Overview', icon: Shield },
                            { id: 'posts', label: 'Posts Management', icon: FileText },
                            { id: 'users', label: 'User Management', icon: Users },
                            { id: 'verification', label: 'Verification Requests', icon: UserCheck },
                            { id: 'services', label: 'Service Requests', icon: Package },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-2 px-4 py-3 font-semibold border-b-2 transition-colors whitespace-nowrap ${
                                    activeTab === tab.id
                                        ? 'border-red-600 text-red-600 dark:text-red-400'
                                        : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white">Dashboard Overview</h2>
                        
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                        <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">Live</span>
                                </div>
                                <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-1">{stats.totalUsers}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                                        <UserCheck className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                                    </div>
                                    <span className="text-xs font-semibold text-yellow-600 dark:text-yellow-400">Pending</span>
                                </div>
                                <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-1">{users.filter(u => !u.isVerified).length}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Unverified Users</p>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                        <Package className="w-6 h-6 text-green-600 dark:text-green-400" />
                                    </div>
                                    <span className="text-xs font-semibold text-green-600 dark:text-green-400">Live</span>
                                </div>
                                <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-1">{stats.serviceRequests}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Service Requests</p>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                                        <FileText className="w-6 h-6 text-red-600 dark:text-red-400" />
                                    </div>
                                    <span className="text-xs font-semibold text-red-600 dark:text-red-400">Live</span>
                                </div>
                                <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-1">{stats.publishedPosts}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Published Posts</p>
                            </div>
                        </div>

                        {/* Admin Activities */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-black text-gray-900 dark:text-white">Admin Activity Log</h3>
                                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Last 50 actions</span>
                            </div>
                            <div className="space-y-2 max-h-96 overflow-y-auto">
                                {adminActivities.length === 0 ? (
                                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No admin activities yet</p>
                                ) : (
                                    adminActivities.map((activity, index) => (
                                        <div key={activity.id || index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-l-2 border-blue-500">
                                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                                                <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-semibold text-gray-900 dark:text-white">{activity.adminName}</p>
                                                <p className="text-xs text-gray-600 dark:text-gray-400">{activity.description}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                                                        {activity.action}
                                                    </span>
                                                    <span className="text-xs text-gray-500 dark:text-gray-500">
                                                        {new Date(activity.createdAt).toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Posts Management Tab */}
                {activeTab === 'posts' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white">Posts Management</h2>
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={postSearch}
                                        onChange={(e) => setPostSearch(e.target.value)}
                                        placeholder="Search by title, category, author..."
                                        className="pl-10 pr-4 py-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white"
                                    />
                                </div>
                                <button 
                                    onClick={() => setShowCreatePostModal(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all"
                                >
                                    <Plus className="w-5 h-5" />
                                    Create Post
                                </button>
                            </div>
                        </div>

                        {/* Filter Tabs */}
                        <div className="grid grid-cols-4 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Type</label>
                                <select
                                    value={postTypeFilter}
                                    onChange={(e) => setPostTypeFilter(e.target.value)}
                                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white"
                                >
                                    <option value="all">All Types</option>
                                    <option value="news">News</option>
                                    <option value="announcement">Announcements</option>
                                    <option value="event">Events</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Status</label>
                                <select
                                    value={postStatusFilter}
                                    onChange={(e) => setPostStatusFilter(e.target.value)}
                                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white"
                                >
                                    <option value="all">All Status</option>
                                    <option value="published">Published</option>
                                    <option value="draft">Draft</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Priority</label>
                                <select
                                    value={postPriorityFilter}
                                    onChange={(e) => setPostPriorityFilter(e.target.value)}
                                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white"
                                >
                                    <option value="all">All Priorities</option>
                                    <option value="high">High</option>
                                    <option value="normal">Normal</option>
                                    <option value="low">Low</option>
                                </select>
                            </div>
                            <div className="flex items-end">
                                <button
                                    onClick={repairDuplicatePostIds}
                                    className="w-full px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg border border-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 text-sm"
                                    title="Fix duplicate numeric IDs in posts"
                                >
                                    Fix Duplicate IDs
                                </button>
                            </div>
                        </div>

                        {/* Posts List */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-900">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Title</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Category</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Author</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Featured</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {posts.filter(post => {
                                        const matchesType = postTypeFilter === 'all' || post.type === postTypeFilter;
                                        const matchesStatus = postStatusFilter === 'all' || post.status === postStatusFilter;
                                        const matchesPriority = postPriorityFilter === 'all' || post.priority === postPriorityFilter;
                                        const matchesSearch = postSearch === '' || 
                                            post.title?.toLowerCase().includes(postSearch.toLowerCase()) ||
                                            post.category?.toLowerCase().includes(postSearch.toLowerCase()) ||
                                            post.authorName?.toLowerCase().includes(postSearch.toLowerCase()) ||
                                            post.author?.toLowerCase().includes(postSearch.toLowerCase());
                                        return matchesType && matchesStatus && matchesPriority && matchesSearch;
                                    }).map((post, index) => (
                                        <tr key={`${post.uuid ?? post.id}-${index}`} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">{post.title}</td>
                                            <td className="px-6 py-4 text-sm">
                                                <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-xs font-semibold">
                                                    {post.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{post.category || 'N/A'}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{post.authorName || post.author || 'N/A'}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{post.createdAt}</td>
                                            <td className="px-6 py-4 text-sm">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                    post.status === 'published' 
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                                                }`}>
                                                    {post.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                {post.isFeatured ? (
                                                    <span className="px-2 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 rounded-full text-xs font-semibold flex items-center gap-1 w-fit">
                                                        ⭐ Featured
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-500 rounded-full text-xs font-semibold">
                                                        Not Featured
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <button 
                                                        onClick={() => setDetailModal({ type: 'post', data: post })}
                                                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                                                        title="View Details"
                                                    >
                                                        <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                                    </button>
                                                    <button 
                                                        onClick={() => setEditingPost(post)}
                                                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                                                        title="Edit Post"
                                                    >
                                                        <Edit className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                    </button>
                                                    <button 
                                                        onClick={() => setShowDeleteConfirm({ type: 'post', id: post.id })}
                                                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                                                        title="Delete Post"
                                                    >
                                                        <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Users Management Tab */}
                {activeTab === 'users' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white">User Management</h2>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={userSearch}
                                    onChange={(e) => setUserSearch(e.target.value)}
                                    placeholder="Search by name, email, barangay, or role..."
                                    className="pl-10 pr-4 py-2 w-96 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white"
                                />
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="grid grid-cols-4 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Barangay</label>
                                <select
                                    value={userFilters.barangay}
                                    onChange={(e) => setUserFilters({ ...userFilters, barangay: e.target.value })}
                                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white"
                                >
                                    <option value="All">All Barangays</option>
                                    {barangays.map(brgy => <option key={brgy} value={brgy}>{brgy}</option>)}
                                    <option value="N/A">Visitors (N/A)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Role</label>
                                <select
                                    value={userFilters.role}
                                    onChange={(e) => setUserFilters({ ...userFilters, role: e.target.value })}
                                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white"
                                >
                                    <option value="All">All Roles</option>
                                    <option value="citizen">Citizen</option>
                                    <option value="visitor">Visitor</option>
                                    <option value="barangay captain">Barangay Captain</option>
                                    <option value="barangay kagawad">Barangay Kagawad</option>
                                    <option value="department head">Department Head</option>
                                    <option value="mayor">Mayor</option>
                                    <option value="news publisher">News Publisher</option>
                                    <option value="event creator">Event Creator</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Status</label>
                                <select
                                    value={userFilters.status}
                                    onChange={(e) => setUserFilters({ ...userFilters, status: e.target.value })}
                                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white"
                                >
                                    <option value="All">All Status</option>
                                    <option value="Verified">Verified</option>
                                    <option value="Pending">Pending</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Sort By</label>
                                <select
                                    value={userFilters.sortBy}
                                    onChange={(e) => setUserFilters({ ...userFilters, sortBy: e.target.value })}
                                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white"
                                >
                                    <option value="name">Name (A-Z)</option>
                                    <option value="pointsHigh">Points (High to Low)</option>
                                    <option value="pointsLow">Points (Low to High)</option>
                                    <option value="dateNew">Registration (Newest)</option>
                                    <option value="dateOld">Registration (Oldest)</option>
                                </select>
                            </div>
                        </div>

                        {/* Users List */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-900">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Barangay</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Role</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Points</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {users
                                        .filter(user => {
                                            const searchLower = userSearch.toLowerCase();
                                            const matchesSearch = !userSearch || 
                                                user.name.toLowerCase().includes(searchLower) ||
                                                user.email.toLowerCase().includes(searchLower) ||
                                                (user.barangay ?? '').toLowerCase().includes(searchLower) ||
                                                user.role.toLowerCase().includes(searchLower);
                                            const matchesBarangay = userFilters.barangay === 'All' || (user.barangay ?? 'N/A') === userFilters.barangay;
                                            const matchesRole = userFilters.role === 'All' || user.role === userFilters.role;
                                            const matchesStatus = userFilters.status === 'All' || 
                                                (userFilters.status === 'Verified' && user.verified) ||
                                                (userFilters.status === 'Pending' && !user.verified);
                                            return matchesSearch && matchesBarangay && matchesRole && matchesStatus;
                                        })
                                        .sort((a, b) => {
                                            switch (userFilters.sortBy) {
                                                case 'name':
                                                    return a.name.localeCompare(b.name);
                                                case 'pointsHigh':
                                                    return (b.points ?? 0) - (a.points ?? 0);
                                                case 'pointsLow':
                                                    return (a.points ?? 0) - (b.points ?? 0);
                                                case 'dateNew':
                                                    return new Date(b.registeredAt ?? new Date().toISOString()).getTime() - new Date(a.registeredAt ?? new Date().toISOString()).getTime();
                                                case 'dateOld':
                                                    return new Date(a.registeredAt ?? new Date().toISOString()).getTime() - new Date(b.registeredAt ?? new Date().toISOString()).getTime();
                                                default:
                                                    return 0;
                                            }
                                        })
                                        .map((user, index) => (
                                        <tr key={`${user.id}-${index}`} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">{user.name}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{user.email}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{user.barangay ?? 'N/A'}</td>
                                            <td className="px-6 py-4 text-sm">
                                                <span className={`px-2 py-1 rounded text-xs font-semibold ${getRoleColor(user.role)}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">{user.points ?? 0}</td>
                                            <td className="px-6 py-4 text-sm">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                    user.verified 
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                }`}>
                                                    {user.verified ? 'Verified' : 'Pending'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <button 
                                                        onClick={() => setDetailModal({ type: 'user', data: user })}
                                                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                                                        title="View Details"
                                                    >
                                                        <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                                    </button>
                                                    <button 
                                                        onClick={() => setEditingUser(user)}
                                                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                                                        title="Edit User"
                                                    >
                                                        <Edit className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                    </button>
                                                    <button 
                                                        onClick={() => setShowDeleteConfirm({ type: 'user', id: user.id })}
                                                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                                                        title="Delete User"
                                                    >
                                                        <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                {/* Verification Requests Tab */}
                {activeTab === 'verification' && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white">Verification Requests</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
                            {users.filter(u => !u.isVerified && (u.faceVerificationUrl || u.frontIdDocumentUrl || u.backIdDocumentUrl)).length === 0 ? (
                                <div className="col-span-full text-center py-12">
                                    <p className="text-gray-500 dark:text-gray-400">No pending verification requests</p>
                                </div>
                            ) : users.filter(u => !u.isVerified && (u.faceVerificationUrl || u.frontIdDocumentUrl || u.backIdDocumentUrl)).map((user, index) => {
                                const isVisitor = user.role === 'visitor' || user.barangay === 'N/A';
                                return (
                                    <div key={`${user.id}-${index}`} className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 p-6 ${
                                        isVisitor 
                                            ? 'border-yellow-300 dark:border-yellow-700' 
                                            : 'border-gray-200 dark:border-gray-700'
                                    }`}>
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-black text-xl ${
                                                isVisitor ? 'bg-gradient-to-br from-yellow-500 to-orange-500' : 'bg-gradient-to-br from-red-500 to-orange-500'
                                            }`}>
                                                {user.name.charAt(0)}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-black text-gray-900 dark:text-white">{user.name}</h3>
                                                    {isVisitor && (
                                                        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 rounded text-xs font-semibold">
                                                            Visitor
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Registered: {user.registeredAt ?? 'N/A'}</p>
                                            </div>
                                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-full text-xs font-semibold">
                                                Pending
                                            </span>
                                        </div>

                                        {isVisitor && (
                                            <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                                                <p className="text-xs text-yellow-800 dark:text-yellow-400">
                                                    ℹ️ <strong>Visitor Account:</strong> No barangay verification required. User will have limited access to visitor features.
                                                </p>
                                            </div>
                                        )}

                                        <div className="space-y-3 mb-4">
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                                <IdCard className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                                <div className="flex-1">
                                                    <p className="text-xs font-semibold text-gray-900 dark:text-white">User Document</p>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">User Identification uploaded</p>
                                                </div>
                                                <button 
                                                    onClick={() => setDetailModal({ type: 'verification', data: { ...user, docType: 'id' } })}
                                                    className="text-xs text-red-600 dark:text-red-400 font-semibold hover:underline"
                                                >
                                                    View
                                                </button>
                                            </div>
                                        </div>

                                        {!isVisitor && (
                                            <div className="mb-3">
                                                <label className="block text-xs font-semibold text-gray-900 dark:text-white mb-2">
                                                    Verify for Barangay <span className="text-red-500">*</span>
                                                </label>
                                                <select 
                                                    value={user.verifiedBarangay || ''}
                                                    onChange={(e) => setUsers(users.map(u => u.id === user.id ? { ...u, verifiedBarangay: e.target.value } : u))}
                                                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white"
                                                >
                                                    <option value="">Select Barangay</option>
                                                    {barangays.map(brgy => (
                                                        <option key={brgy} value={brgy}>{brgy}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}

                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => {
                                                    if (!isVisitor && !user.verifiedBarangay) {
                                                        toast.error('Please select a barangay before approving.');
                                                        return;
                                                    }
                                                    handleApproveVerification(user.id);
                                                    toast.success(
                                                        <div>
                                                            <p className="font-semibold">{user.name} verified!</p>
                                                            <p className="text-sm">User role: {isVisitor ? 'Visitor' : 'Citizen'}</p>
                                                        </div>
                                                    );
                                                }}
                                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all"
                                            >
                                                <Check className="w-4 h-4" />
                                                Approve {isVisitor ? 'as Visitor' : ''}
                                            </button>
                                            <button 
                                                onClick={() => setShowDeleteConfirm({ type: 'verification', id: user.id })}
                                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all"
                                            >
                                                <X className="w-4 h-4" />
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Service Requests Tab */}
                {activeTab === 'services' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white">Service Requests</h2>
                            <div className="flex items-center gap-3">
                                <select
                                    value={serviceRequestStatusFilter}
                                    onChange={(e) => setServiceRequestStatusFilter(e.target.value)}
                                    className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white font-semibold"
                                >
                                    <option value="all">All Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="completed">Completed</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                                <button
                                    onClick={() => {
                                        setBulkEditMode(!bulkEditMode);
                                        if (bulkEditMode) {
                                            setSelectedRequests([]);
                                            setBulkEditData({});
                                        }
                                    }}
                                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                                        bulkEditMode
                                            ? 'bg-gray-600 hover:bg-gray-700 text-white'
                                            : 'bg-red-600 hover:bg-red-700 text-white'
                                    }`}
                                >
                                    {bulkEditMode ? 'Cancel Bulk Edit' : 'Bulk Edit Mode'}
                                </button>
                            </div>
                        </div>

                        {/* Bulk Edit Controls */}
                        {bulkEditMode && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-300 dark:border-blue-700 rounded-xl p-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Update Status</label>
                                        <select
                                            value={bulkEditData.status || ''}
                                            onChange={(e) => setBulkEditData({ ...bulkEditData, status: e.target.value })}
                                            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
                                        >
                                            <option value="">-- Keep Current --</option>
                                            <option value="pending">Pending</option>
                                            <option value="processing">Processing</option>
                                            <option value="completed">Completed</option>
                                            <option value="rejected">Rejected</option>
                                        </select>
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Admin Note (sent to users)</label>
                                        <input
                                            type="text"
                                            value={bulkEditData.note || ''}
                                            onChange={(e) => setBulkEditData({ ...bulkEditData, note: e.target.value })}
                                            placeholder="e.g., Please visit office for pickup"
                                            className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
                                        />
                                    </div>
                                    <div className="flex gap-2 items-end">
                                        <button
                                            onClick={handleBulkUpdate}
                                            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all"
                                        >
                                            Save All ({selectedRequests.length})
                                        </button>
                                    </div>
                                </div>
                                <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">Selected: {selectedRequests.length} request(s)</p>
                            </div>
                        )}
                        
                        {/* Service Requests List */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-900">
                                    <tr>
                                        {bulkEditMode && (
                                            <th className="px-4 py-3">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedRequests.length === serviceRequests.length && serviceRequests.length > 0}
                                                    onChange={selectAllRequests}
                                                    className="w-4 h-4 cursor-pointer"
                                                />
                                            </th>
                                        )}
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Request ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">User</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Service Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Submitted</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {serviceRequests
                                        .filter(request => serviceRequestStatusFilter === 'all' || request.status?.toLowerCase() === serviceRequestStatusFilter.toLowerCase())
                                        .sort((a, b) => new Date(a.submittedAt ?? new Date().toISOString()).getTime() - new Date(b.submittedAt ?? new Date().toISOString()).getTime())
                                        .map(request => (
                                        <tr key={request.id} className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${selectedRequests.includes(request.id) ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                                            {bulkEditMode && (
                                                <td className="px-4 py-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedRequests.includes(request.id)}
                                                        onChange={() => toggleSelectRequest(request.id)}
                                                        className="w-4 h-4 cursor-pointer"
                                                    />
                                                </td>
                                            )}
                                            <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">#{request.id}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{request.userName ?? 'N/A'}</td>
                                            <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">{request.serviceType ?? 'N/A'}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{request.submittedAt ?? 'N/A'}</td>
                                            <td className="px-6 py-4 text-sm">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(request.status)}`}>
                                                    {request.status}
                                                </span>
                                                {request.adminNote && (
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">Note: {request.adminNote}</p>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                {!bulkEditMode && (
                                                    <div className="flex items-center gap-2">
                                                        <button 
                                                            onClick={() => setDetailModal({ type: 'service', data: request })}
                                                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold"
                                                        >
                                                            View
                                                        </button>
                                                        <button 
                                                            onClick={() => {
                                                                setServiceNotes({ ...serviceNotes, [request.id]: request.adminNote || '' });
                                                                setDetailModal({ type: 'service', data: { ...request, isEditing: true } });
                                                            }}
                                                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                                                            title="Update Status"
                                                        >
                                                            <Edit className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                        </button>
                                                        <button 
                                                            onClick={() => setShowDeleteConfirm({ type: 'service', id: request.id })}
                                                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                                                            title="Delete Request"
                                                        >
                                                            <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

            </div>

            {/* Create Post Modal */}
            {showCreatePostModal && (
                <div 
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setShowCreatePostModal(false)}
                >
                    <div 
                        className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white">Create New Post</h3>
                                <button 
                                    onClick={() => setShowCreatePostModal(false)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Post Type Selection */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Post Type</label>
                                <div className="flex gap-2">
                                    {['news', 'announcement', 'event'].map(type => (
                                        <button
                                            key={type}
                                            onClick={() => setNewPost({...newPost, type: type as any})}
                                            className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                                                newPost.type === type
                                                    ? 'bg-red-600 text-white'
                                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                                            }`}
                                        >
                                            {type.charAt(0).toUpperCase() + type.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Title */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Title</label>
                                <input
                                    type="text"
                                    value={newPost.title || ''}
                                    onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                                    placeholder="Enter post title..."
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
                                />
                            </div>

                            {/* Content */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Content</label>
                                <textarea
                                    rows={6}
                                    value={newPost.content || ''}
                                    onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                                    placeholder="Write your content here..."
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white resize-none"
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Category</label>
                                <input
                                    type="text"
                                    value={newPost.category || ''}
                                    onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                                    placeholder={newPost.type === 'news' ? 'e.g., Community Development, Health' : newPost.type === 'event' ? 'e.g., Cultural, Sports' : 'e.g., Government, Public Service'}
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
                                />
                            </div>

                            {/* Priority */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Priority</label>
                                <select 
                                    value={newPost.priority || 'normal'}
                                    onChange={(e) => setNewPost({...newPost, priority: e.target.value as any})}
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
                                >
                                    <option value="high">High Priority</option>
                                    <option value="normal">Normal Priority</option>
                                    <option value="low">Low Priority</option>
                                </select>
                            </div>

                            {/* Featured Post Checkbox */}
                            <div className="flex items-center gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                                <input
                                    type="checkbox"
                                    id="featured-checkbox"
                                    checked={newPost.isFeatured || false}
                                    onChange={(e) => setNewPost({...newPost, isFeatured: e.target.checked})}
                                    className="w-5 h-5 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                />
                                <label htmlFor="featured-checkbox" className="flex-1">
                                    <span className="block text-sm font-bold text-gray-900 dark:text-white">Feature on Homepage</span>
                                    <span className="block text-xs text-gray-600 dark:text-gray-400">Display this post in the featured section (max 5 posts)</span>
                                </label>
                            </div>

                            {/* Event-specific fields */}
                            {newPost.type === 'event' && (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Date</label>
                                            <input
                                                type="date"
                                                value={newPost.eventDate || ''}
                                                onChange={(e) => setNewPost({...newPost, eventDate: e.target.value})}
                                                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Time</label>
                                            <input
                                                type="time"
                                                value={newPost.eventTime || ''}
                                                onChange={(e) => setNewPost({...newPost, eventTime: e.target.value})}
                                                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Event Status</label>
                                        <select 
                                            value={newPost.eventStatus || 'upcoming'}
                                            onChange={(e) => setNewPost({...newPost, eventStatus: e.target.value as any})}
                                            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
                                        >
                                            <option value="featured">Featured</option>
                                            <option value="upcoming">Upcoming</option>
                                            <option value="done">Done</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Event Location</label>
                                        <input
                                            type="text"
                                            value={newPost.location || ''}
                                            onChange={(e) => setNewPost({...newPost, location: e.target.value})}
                                            placeholder="Enter location name (e.g., Cordova Sports Complex)..."
                                            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Coordinates (Optional)</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <input
                                                type="text"
                                                value={newPost.locationLat || ''}
                                                onChange={(e) => setNewPost({...newPost, locationLat: parseFloat(e.target.value) || undefined})}
                                                placeholder="Latitude (e.g., 10.2580)"
                                                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
                                            />
                                            <input
                                                type="text"
                                                value={newPost.locationLng || ''}
                                                onChange={(e) => setNewPost({...newPost, locationLng: parseFloat(e.target.value) || undefined})}
                                                placeholder="Longitude (e.g., 123.9550)"
                                                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
                                            />
                                        </div>
                                        <a href="https://www.google.com/maps/place/Cordova,+Cebu/" target="_blank" rel="noopener noreferrer" className="text-xs text-red-600 dark:text-red-400 hover:underline mt-1 inline-block">
                                            📍 Find coordinates on Google Maps
                                        </a>
                                    </div>
                                </>
                            )}

                            {/* Image URL */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Image URL</label>
                                <input
                                    type="url"
                                    value={newPost.imageUrl || ''}
                                    onChange={(e) => setNewPost({...newPost, imageUrl: e.target.value})}
                                    placeholder="https://example.com/image.jpg"
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Enter the URL of an image hosted online</p>
                                {newPost.imageUrl && (
                                    <div className="mt-3 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                                        <img 
                                            src={newPost.imageUrl} 
                                            alt="Post preview" 
                                            className="w-full h-48 object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=Invalid+Image+URL';
                                            }}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                                    <div className="flex gap-3 pt-4">
                                <button 
                                    onClick={async () => {
                                        try {
                                            const postData = {
                                                type: newPost.type || 'news',
                                                title: newPost.title || 'Untitled',
                                                content: newPost.content || '',
                                                imageUrl: newPost.imageUrl,
                                                category: newPost.category,
                                                priority: newPost.priority || 'normal',
                                                status: 'draft' as 'draft' | 'published',
                                                location: newPost.location,
                                                eventDate: newPost.eventDate,
                                                eventTime: newPost.eventTime,
                                                eventStatus: newPost.type === 'event' ? newPost.eventStatus : undefined,
                                                isFeatured: newPost.isFeatured || false
                                            };
                                            const created = await postsApi.create(postData as any);
                                            setPosts(prev => [...prev, created]);
                                            toast.success('Post saved as draft');
                                            setNewPost({ type: 'news', status: 'draft', isFeatured: false });
                                            setShowCreatePostModal(false);
                                        } catch (err: any) {
                                            console.error('Failed to create post:', err);
                                            toast.error(err.message || 'Failed to create post');
                                        }
                                    }}
                                    className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                                >
                                    Save as Draft
                                </button>
                                <button 
                                    onClick={async () => {
                                        const post: Post = {
                                            id: getNextPostId(),
                                            uuid: (typeof crypto !== 'undefined' && (crypto as any).randomUUID) ? (crypto as any).randomUUID() : `${Date.now()}-${Math.floor(Math.random() * 1e9)}`,
                                            type: newPost.type || 'news',
                                            title: newPost.title || 'Untitled',
                                            content: newPost.content || '',
                                            author: 'Admin',
                                            createdAt: new Date().toISOString(),
                                            status: 'published',
                                            imageUrl: newPost.imageUrl,
                                            category: newPost.category,
                                            priority: newPost.priority || 'normal',
                                            eventStatus: newPost.eventStatus,
                                            location: newPost.location,
                                            locationLat: newPost.locationLat,
                                            locationLng: newPost.locationLng,
                                        };
                                        try {
                                            const postData = {
                                                type: newPost.type || 'news',
                                                title: newPost.title || 'Untitled',
                                                content: newPost.content || '',
                                                imageUrl: newPost.imageUrl,
                                                category: newPost.category,
                                                priority: newPost.priority || 'normal',
                                                status: 'published' as 'draft' | 'published',
                                                location: newPost.location,
                                                eventDate: newPost.eventDate,
                                                eventTime: newPost.eventTime,
                                                eventStatus: newPost.type === 'event' ? newPost.eventStatus : undefined,
                                                isFeatured: newPost.isFeatured || false
                                            };
                                            const created = await postsApi.create(postData as any);
                                            setPosts(prev => [...prev, created]);
                                            toast.success(newPost.isFeatured ? 'Post published and featured!' : 'Post published successfully!');
                                            setNewPost({ type: 'news', status: 'draft', isFeatured: false });
                                            setShowCreatePostModal(false);
                                        } catch (err: any) {
                                            console.error('Failed to create post:', err);
                                            toast.error(err.message || 'Failed to publish post');
                                        }
                                    }}
                                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all"
                                >
                                    Publish Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Barangay official creation from Admin is disabled — officials are managed via the static data source. */}

            {/* Detail Modal */}
            {detailModal?.type && (
                <div 
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setDetailModal({ type: null, data: null })}
                >
                    <div 
                        className="bg-white dark:bg-gray-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                                    {detailModal?.type === 'user' && 'User Details'}
                                    {detailModal?.type === 'post' && 'Post Details'}
                                    {detailModal?.type === 'service' && (detailModal?.data?.isEditing ? 'Update Service Request' : 'Service Request Details')}
                                    {detailModal?.type === 'verification' && 'Verification Request Details'}
                                    {detailModal?.type === 'official' && 'Official Details'}
                                </h3>
                                <button 
                                    onClick={() => setDetailModal({ type: null, data: null })}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            {/* User Details */}
                            {detailModal?.type === 'user' && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                        <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white font-black text-2xl">
                                            {detailModal?.data?.name?.charAt(0)}
                                        </div>
                                        <div className="flex-1">
                                                <h4 className="text-xl font-black text-gray-900 dark:text-white">{detailModal?.data?.name}</h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">{detailModal?.data?.email}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                            detailModal?.data?.verified 
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                        }`}>
                                            {detailModal?.data?.verified ? 'Verified' : 'Pending'}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Barangay</p>
                                            <p className="font-semibold text-gray-900 dark:text-white">{detailModal?.data?.barangay}</p>
                                        </div>
                                        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Role</p>
                                            <p className="font-semibold text-gray-900 dark:text-white">{detailModal?.data?.role}</p>
                                        </div>
                                        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Reward Points</p>
                                            <p className="font-semibold text-gray-900 dark:text-white">{detailModal?.data?.points} pts</p>
                                        </div>
                                        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Registered</p>
                                            <p className="font-semibold text-gray-900 dark:text-white">{detailModal?.data?.registeredAt}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Post Details */}
                            {detailModal.type === 'post' && (
                                <div className="space-y-4">
                                    {detailModal?.data?.imageUrl && (
                                        <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                                            <img 
                                                src={detailModal?.data?.imageUrl} 
                                                alt={detailModal?.data?.title}
                                                className="w-full h-64 object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                                            <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-sm font-semibold">
                                                {detailModal?.data?.type}
                                            </span>
                                            {detailModal?.data?.category && (
                                                <span className="px-3 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 rounded-full text-sm font-semibold">
                                                    {detailModal?.data?.category}
                                                </span>
                                            )}
                                            {detailModal?.data?.priority && (
                                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                                    detailModal?.data?.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                                                    detailModal?.data?.priority === 'normal' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                    'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                                                }`}>
                                                    {detailModal?.data?.priority} priority
                                                </span>
                                            )}
                                            {detailModal?.data?.eventStatus && (
                                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                                    detailModal?.data?.eventStatus === 'featured' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' :
                                                    detailModal?.data?.eventStatus === 'upcoming' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                                                    'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                                                }`}>
                                                    {detailModal?.data?.eventStatus}
                                                </span>
                                            )}
                                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                                detailModal?.data?.status === 'published' 
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                                            }`}>
                                                {detailModal?.data?.status}
                                            </span>
                                        </div>
                                        <h4 className="text-2xl font-black text-gray-900 dark:text-white mb-2">{detailModal?.data?.title}</h4>
                                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{detailModal?.data?.content}</p>
                                        {detailModal?.data?.location && (
                                            <div className="mb-4 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Location</p>
                                                <p className="font-semibold text-gray-900 dark:text-white">{detailModal?.data?.location}</p>
                                                {detailModal?.data?.locationLat && detailModal?.data?.locationLng && (
                                                    <a 
                                                        href={`https://www.google.com/maps/dir/?api=1&destination=${detailModal?.data?.locationLat},${detailModal?.data?.locationLng}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-xs text-red-600 dark:text-red-400 hover:underline mt-1 inline-block"
                                                    >
                                                        Get Directions →
                                                    </a>
                                                )}
                                            </div>
                                        )}
                                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                            <span>By {detailModal?.data?.author}</span>
                                            <span>•</span>
                                            <span>{detailModal?.data?.createdAt}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Service Request Details */}
                            {detailModal.type === 'service' && (
                                <div className="space-y-4">
                                    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="text-xl font-black text-gray-900 dark:text-white">Request #{detailModal?.data?.id}</h4>
                                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(detailModal?.data?.status)}`}>
                                                {detailModal?.data?.status}
                                            </span>
                                        </div>
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Requestor</p>
                                                <p className="font-semibold text-gray-900 dark:text-white">{detailModal?.data?.userName}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Service Type</p>
                                                <p className="font-semibold text-gray-900 dark:text-white">{detailModal?.data?.serviceType}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Submitted Date</p>
                                                <p className="font-semibold text-gray-900 dark:text-white">{detailModal?.data?.submittedAt}</p>
                                            </div>
                                            {detailModal?.data?.details && (
                                                <div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Description</p>
                                                    <div className="bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700">
                                                        <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">{detailModal?.data?.details}</p>
                                                    </div>
                                                </div>
                                            )}
                                            {detailModal?.data?.adminNote && (
                                                <div>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Previous Admin Note</p>
                                                    <p className="text-sm italic text-gray-700 dark:text-gray-300 bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded">{detailModal?.data?.adminNote}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Edit Mode */}
                                    {detailModal?.data?.isEditing && detailModal?.type === 'service' && (
                                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-300 dark:border-blue-700 rounded-lg space-y-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Update Status</label>
                                                <select
                                                    value={serviceNotes[detailModal?.data?.id as number] !== undefined ? detailModal?.data?.status : detailModal?.data?.status}
                                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateServiceDetail({ status: e.target.value as ServiceRequest['status'] })}
                                                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="processing">Processing</option>
                                                    <option value="completed">Completed</option>
                                                    <option value="rejected">Rejected</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Admin Note (sent to user)</label>
                                                <textarea
                                                    value={serviceNotes[detailModal?.data?.id as number] || ''}
                                                    onChange={(e) => setServiceNotes({ ...serviceNotes, [detailModal?.data?.id as number]: e.target.value })}
                                                    rows={3}
                                                    placeholder="Add a note for the user (e.g., 'Document is ready for pickup at the office', 'Please provide additional documents')"
                                                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white resize-none"
                                                />
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">💡 This note will be sent to the user</p>
                                            </div>
                                            <div className="flex gap-3 pt-2">
                                                <button
                                                    onClick={() => setDetailModal({ type: null, data: null })}
                                                    className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        handleUpdateServiceStatus(detailModal?.data?.id as number, detailModal?.data?.status as any, serviceNotes[detailModal?.data?.id as number]);
                                                        setDetailModal({ type: null, data: null });
                                                        setServiceNotes({ ...serviceNotes, [detailModal?.data?.id as number]: '' });
                                                    }}
                                                    className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all"
                                                >
                                                    Save & Notify User
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Verification Document Details */}
                            {detailModal.type === 'verification' && (
                                <div className="space-y-4">
                                    {/* User Information */}
                                    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg space-y-2">
                                        <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">User:</span>
                                            <span className="text-sm font-semibold text-gray-900 dark:text-white">{detailModal?.data?.name}</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">Email:</span>
                                            <span className="text-sm font-semibold text-gray-900 dark:text-white">{detailModal?.data?.email}</span>
                                        </div>
                                        <div className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">Barangay:</span>
                                            <span className="text-sm font-semibold text-gray-900 dark:text-white">{detailModal?.data?.barangay}</span>
                                        </div>
                                        <div className="flex justify-between py-2">
                                            <span className="text-sm text-gray-600 dark:text-gray-400">Registered:</span>
                                            <span className="text-sm font-semibold text-gray-900 dark:text-white">{detailModal?.data?.registeredAt}</span>
                                        </div>
                                    </div>

                                    {/* Front ID Document */}
                                    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                        <h4 className="text-lg font-black text-gray-900 dark:text-white mb-3">
                                            Front ID Document
                                        </h4>
                                        <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                                            {detailModal?.data?.frontIdDocumentUrl ? (
                                                <img 
                                                    src={detailModal?.data?.frontIdDocumentUrl}
                                                    alt="Front ID Document"
                                                    className="w-full h-auto"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-48 text-gray-400">
                                                    No front ID uploaded
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Back ID Document */}
                                    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                        <h4 className="text-lg font-black text-gray-900 dark:text-white mb-3">
                                            Back ID Document
                                        </h4>
                                        <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                                            {detailModal?.data?.backIdDocumentUrl ? (
                                                <img 
                                                    src={detailModal?.data?.backIdDocumentUrl}
                                                    alt="Back ID Document"
                                                    className="w-full h-auto"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-48 text-gray-400">
                                                    No back ID uploaded
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Face Verification Photo */}
                                    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                        <h4 className="text-lg font-black text-gray-900 dark:text-white mb-3">
                                            Face Verification Photo
                                        </h4>
                                        <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                                            {detailModal?.data?.faceVerificationUrl ? (
                                                <img 
                                                    src={detailModal?.data?.faceVerificationUrl}
                                                    alt="Face Verification"
                                                    className="w-full h-auto"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-48 text-gray-400">
                                                    No face photo uploaded
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Barangay Official Details */}
                            {detailModal.type === 'official' && (
                                <div className="space-y-4">
                                    <div className="relative h-64 rounded-xl overflow-hidden">
                                        <img 
                                            src={detailModal?.data?.imageUrl} 
                                            alt={detailModal?.data?.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                                        <div className="absolute bottom-4 left-4 right-4">
                                            <h4 className="text-3xl font-black text-white mb-1">{detailModal?.data?.name}</h4>
                                            <p className="text-lg text-white/90 font-semibold">{detailModal?.data?.position}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Barangay</p>
                                            <p className="font-semibold text-gray-900 dark:text-white">{detailModal?.data?.barangay}</p>
                                        </div>
                                        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Term Start</p>
                                            <p className="font-semibold text-gray-900 dark:text-white">{detailModal?.data?.termStart}</p>
                                        </div>
                                        <div className="col-span-2 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Contact Email</p>
                                            <p className="font-semibold text-gray-900 dark:text-white">{detailModal?.data?.contactEmail}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Post Modal */}
            {editingPost && (
                <div 
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setEditingPost(null)}
                >
                    <div 
                        className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white">Edit Post</h3>
                                <button 
                                    onClick={() => setEditingPost(null)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                </button>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Type</label>
                                <select 
                                    value={editingPost.type}
                                    onChange={(e) => setEditingPost({...editingPost, type: e.target.value as any})}
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
                                >
                                    <option value="news">News</option>
                                    <option value="announcement">Announcement</option>
                                    <option value="event">Event</option>
                                    <option value="lost-and-found">Lost and Found</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Title</label>
                                <input
                                    type="text"
                                    value={editingPost.title}
                                    onChange={(e) => setEditingPost({...editingPost, title: e.target.value})}
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Content</label>
                                <textarea
                                    value={editingPost.content}
                                    onChange={(e) => setEditingPost({...editingPost, content: e.target.value})}
                                    rows={8}
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Image URL</label>
                                <input
                                    type="url"
                                    value={editingPost.imageUrl || ''}
                                    onChange={(e) => setEditingPost({...editingPost, imageUrl: e.target.value})}
                                    placeholder="https://example.com/image.jpg"
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Enter the URL of an image hosted online</p>
                                {editingPost.imageUrl && (
                                    <div className="mt-3 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                                        <img 
                                            src={editingPost.imageUrl} 
                                            alt="Post preview" 
                                            className="w-full h-48 object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=Invalid+Image+URL';
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Category</label>
                                <input
                                    type="text"
                                    value={editingPost.category || ''}
                                    onChange={(e) => setEditingPost({...editingPost, category: e.target.value})}
                                    placeholder="Enter category..."
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Priority</label>
                                <select 
                                    value={editingPost.priority || 'normal'}
                                    onChange={(e) => setEditingPost({...editingPost, priority: e.target.value as any})}
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
                                >
                                    <option value="high">High Priority</option>
                                    <option value="normal">Normal Priority</option>
                                    <option value="low">Low Priority</option>
                                </select>
                            </div>
                            {editingPost.type === 'event' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Event Status</label>
                                        <select 
                                            value={editingPost.eventStatus || 'upcoming'}
                                            onChange={(e) => setEditingPost({...editingPost, eventStatus: e.target.value as any})}
                                            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
                                        >
                                            <option value="featured">Featured</option>
                                            <option value="upcoming">Upcoming</option>
                                            <option value="done">Done</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Event Location</label>
                                        <input
                                            type="text"
                                            value={editingPost.location || ''}
                                            onChange={(e) => setEditingPost({...editingPost, location: e.target.value})}
                                            placeholder="Enter location name..."
                                            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Coordinates (Optional)</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <input
                                                type="text"
                                                value={editingPost.locationLat || ''}
                                                onChange={(e) => setEditingPost({...editingPost, locationLat: parseFloat(e.target.value) || undefined})}
                                                placeholder="Latitude"
                                                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
                                            />
                                            <input
                                                type="text"
                                                value={editingPost.locationLng || ''}
                                                onChange={(e) => setEditingPost({...editingPost, locationLng: parseFloat(e.target.value) || undefined})}
                                                placeholder="Longitude"
                                                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Status</label>
                                <select 
                                    value={editingPost.status}
                                    onChange={(e) => setEditingPost({...editingPost, status: e.target.value as any})}
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
                                >
                                    <option value="published">Published</option>
                                    <option value="draft">Draft</option>
                                </select>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button 
                                    onClick={() => setEditingPost(null)}
                                    className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={() => handleUpdatePost(editingPost)}
                                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {editingUser && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white">Edit User</h3>
                                <button 
                                    onClick={() => setEditingUser(null)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                </button>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">First Name</label>
                                    <input
                                        type="text"
                                        value={editingUser.firstName || ''}
                                        onChange={(e) => setEditingUser({...editingUser, firstName: e.target.value, name: `${e.target.value} ${editingUser.middleName || ''} ${editingUser.lastName || ''}`.trim()})}
                                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Middle Name</label>
                                    <input
                                        type="text"
                                        value={editingUser.middleName || ''}
                                        onChange={(e) => setEditingUser({...editingUser, middleName: e.target.value, name: `${editingUser.firstName || ''} ${e.target.value} ${editingUser.lastName || ''}`.trim()})}
                                        placeholder="Optional"
                                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Last Name</label>
                                    <input
                                        type="text"
                                        value={editingUser.lastName || ''}
                                        onChange={(e) => setEditingUser({...editingUser, lastName: e.target.value, name: `${editingUser.firstName || ''} ${editingUser.middleName || ''} ${e.target.value}`.trim()})}
                                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Email</label>
                                <input
                                    type="email"
                                    value={editingUser.email}
                                    onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Profile Image URL</label>
                                <input
                                    type="url"
                                    value={editingUser.profileImageUrl || ''}
                                    onChange={(e) => setEditingUser({...editingUser, profileImageUrl: e.target.value})}
                                    placeholder="https://example.com/image.jpg"
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Barangay</label>
                                <select 
                                    value={editingUser.barangay}
                                    onChange={(e) => setEditingUser({...editingUser, barangay: e.target.value})}
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
                                >
                                    {barangays.map(brgy => (
                                        <option key={brgy} value={brgy}>{brgy}</option>
                                    ))}
                                    <option value="N/A">N/A (Visitor)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Role</label>
                                <select 
                                    value={editingUser.role}
                                    onChange={(e) => setEditingUser({...editingUser, role: e.target.value as User['role']})}
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
                                >
                                    <option>Citizen</option>
                                    <option>Visitor</option>
                                    <option>Barangay Captain</option>
                                    <option>Barangay Kagawad</option>
                                    <option>Department Head</option>
                                    <option>Mayor</option>
                                    <option>News Publisher</option>
                                    <option>Event Creator</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Reward Points</label>
                                <input
                                    type="number"
                                    value={editingUser.points}
                                    onChange={(e) => setEditingUser({...editingUser, points: parseInt(e.target.value) || 0})}
                                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={editingUser.verified}
                                    onChange={(e) => setEditingUser({...editingUser, verified: e.target.checked})}
                                    className="w-4 h-4"
                                />
                                <label className="text-sm font-semibold text-gray-900 dark:text-white">Verified</label>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button 
                                    onClick={() => setEditingUser(null)}
                                    className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={async () => {
                                        const prev = users;
                                        setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
                                        setEditingUser(null);
                                        try {
                                            if (isDbMode && editingUser?.id) {
                                                // Send all editable fields to backend
                                                await apiClient.updateUser(editingUser.id, {
                                                    firstName: editingUser.firstName,
                                                    middleName: editingUser.middleName,
                                                    lastName: editingUser.lastName,
                                                    email: editingUser.email,
                                                    profileImageUrl: editingUser.profileImageUrl,
                                                    barangay: editingUser.barangay,
                                                    role: editingUser.role,
                                                    isVerified: editingUser.verified,
                                                    contactNumber: editingUser.contactNumber,
                                                    points: editingUser.points
                                                });
                                                toast.success('User updated successfully');
                                                
                                                // Reload users from database
                                                const dbUsers = await statsApi.getAllUsers();
                                                const mappedUsers = dbUsers.map(u => ({
                                                    id: u.id,
                                                    name: `${u.firstName || ''} ${u.middleName || ''} ${u.lastName || ''}`.trim() || u.email,
                                                    firstName: u.firstName,
                                                    middleName: u.middleName,
                                                    lastName: u.lastName,
                                                    email: u.email,
                                                    barangay: u.barangay || 'Not specified',
                                                    role: u.role as any,
                                                    verified: u.isVerified,
                                                    isVerified: u.isVerified,
                                                    points: 0,
                                                    registeredAt: new Date(u.createdAt).toLocaleDateString(),
                                                    contactNumber: u.contactNumber || 'Not provided',
                                                    profileImageUrl: u.profileImageUrl,
                                                    frontIdDocumentUrl: u.frontIdDocumentUrl,
                                                    backIdDocumentUrl: u.backIdDocumentUrl,
                                                    faceVerificationUrl: u.faceVerificationUrl
                                                }));
                                                setUsers(mappedUsers);
                                            }
                                        } catch (err: any) {
                                            setUsers(prev);
                                            console.error('Failed to update user via API:', err);
                                            toast.error(err.message || 'Failed to update user on server');
                                        }
                                    }}
                                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Barangay Official modal has been removed — officials are read-only */}

            {/* Delete Confirmation Dialog */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full shadow-2xl">
                        <div className="p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                                    <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-gray-900 dark:text-white">Confirm Deletion</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">This action cannot be undone</p>
                                </div>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 mb-6">
                                {showDeleteConfirm.type === 'verification' 
                                    ? 'Are you sure you want to reject this verification request? The user will need to resubmit their documents.'
                                    : `Are you sure you want to delete this ${showDeleteConfirm.type}? All associated data will be permanently removed.`
                                }
                            </p>
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setShowDeleteConfirm(null)}
                                    className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={() => {
                                        if (showDeleteConfirm.type === 'post') handleDeletePost(showDeleteConfirm.id);
                                        else if (showDeleteConfirm.type === 'user') handleDeleteUser(showDeleteConfirm.id);
                                        else if (showDeleteConfirm.type === 'service') handleDeleteServiceRequest(showDeleteConfirm.id);
                                        else if (showDeleteConfirm.type === 'verification') handleRejectVerification(showDeleteConfirm.id);
                                    }}
                                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all"
                                >
                                    {showDeleteConfirm.type === 'verification' ? 'Reject' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
