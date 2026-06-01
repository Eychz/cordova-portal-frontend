'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import DashboardSidebar from '../components/DashboardSidebar';
import { servicesApi, Service } from 'lib/servicesApi';
import DashboardHeader from '../components/DashboardHeader';
import OverviewTab from '../components/OverviewTab';
import PostsTab from '../components/PostsTab';
import UsersTab from '../components/UsersTab';
import VerificationTab from '../components/VerificationTab';
import ServicesTab from '../components/ServicesTab';
import OfficialsTab from '../components/OfficialsTab';
import EmergenciesTab from '../components/EmergenciesTab';

import {
    type Post,
    type User,
    initialServices,
    loadDataAsync,
    STORAGE_KEYS
} from 'data/adminData';
import * as apiClient from 'lib/apiClient';
import { postsApi } from 'lib/postsApi';
import { statsApi } from 'lib/statsApi';

const AdminDashboardPage = () => {
    const router = useRouter();
    const params = useParams();
    const activeTab = (params.tab as string) || 'overview';
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [users, setUsers] = useState<User[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [adminActivities, setAdminActivities] = useState<any[]>([]);
    const [stats, setStats] = useState({ 
        totalUsers: 0, 
        verificationRequests: 0, 
        totalPopulation: 0, 
        publishedPosts: 0 
    });

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

    // Data loading
    useEffect(() => {
        const initData = async () => {
            try {
                const apiPosts = await postsApi.getAll();
                setPosts(apiPosts || []);

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

                const loadedServices = await servicesApi.getAll().catch(() => []);
                setServices(loadedServices);

                const activities = await apiClient.getAdminActivities(100);
                setAdminActivities(activities);

                const totalPop = 7500 + 6200 + 5100 + 4500 + 3800 + 5200 + 4100 + 6500 + 1800 + 4300 + 5800 + 7200 + 4900;
                setStats({
                    totalUsers: mappedUsers.length,
                    verificationRequests: mappedUsers.filter(u => u.frontIdDocumentUrl && !u.isVerified).length,
                    totalPopulation: totalPop,
                    publishedPosts: apiPosts.length
                });

            } catch (err) {
                console.error('Failed to load dashboard data:', err);
                toast.error('Failed to load data from server.');
            }
        };
        initData();
    }, []);

    // Handlers
    const handleUpdateUser = async (userId: number, updatedData: any) => {
        const previous = users;
        setUsers(users.map(u => {
            if (u.id === userId) {
                const updated = { ...u, ...updatedData };
                // Also update the full name display
                const first = updated.firstName || '';
                const last = updated.lastName || '';
                if (first || last) {
                    updated.name = `${first} ${last}`.trim();
                }
                return updated;
            }
            return u;
        }));
        
        try {
            await apiClient.updateUser(userId, updatedData);
            toast.success('User updated successfully');
        } catch (err) {
            setUsers(previous);
            toast.error('Failed to update user');
        }
    };

    const handleDeleteUser = async (id: number) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        const previous = users;
        setUsers(users.filter(u => u.id !== id));
        try {
            await apiClient.deleteUser(id);
            toast.success('User deleted successfully');
        } catch (err) {
            setUsers(previous);
            toast.error('Failed to delete user');
        }
    };

    const handleDeletePost = async (id: number) => {
        if (!confirm('Are you sure you want to delete this post?')) return;
        const previous = posts;
        setPosts(posts.filter(p => p.id !== id));
        try {
            await postsApi.delete(id);
            toast.success('Post deleted successfully');
        } catch (err) {
            setPosts(previous);
            toast.error('Failed to delete post');
        }
    };

    const handleCreateService = async (data: any) => {
        try {
            const newService = await servicesApi.create(data);
            setServices([newService, ...services]);
            toast.success('Service created successfully');
        } catch (err) {
            toast.error('Failed to create service');
        }
    };

    const handleUpdateService = async (id: number, data: any) => {
        try {
            const updated = await servicesApi.update(id, data);
            setServices(services.map(s => s.id === id ? updated : s));
            toast.success('Service updated successfully');
        } catch (err) {
            toast.error('Failed to update service');
        }
    };

    const handleDeleteService = async (id: number) => {
        if (!confirm('Are you sure you want to delete this service?')) return;
        const previous = services;
        setServices(services.filter(s => s.id !== id));
        try {
            await servicesApi.delete(id);
            toast.success('Service deleted successfully');
        } catch (err) {
            setServices(previous);
            toast.error('Failed to delete service');
        }
    };

    const handleApproveVerification = async (id: number, updatedData?: any) => {
        try {
            if (updatedData) {
                await apiClient.updateUser(id, updatedData);
            }
            await apiClient.verifyUser(id, { isVerified: true });
            setUsers(users.map(u => u.id === id ? { ...u, ...updatedData, isVerified: true, verified: true } : u));
            toast.success('Verification approved');
        } catch (err) {
            toast.error('Failed to approve verification');
        }
    };

    const handleRejectVerification = async (id: number) => {
        try {
            await apiClient.updateUser(id, { isVerified: false, frontIdDocumentUrl: null });
            setUsers(users.map(u => u.id === id ? { ...u, isVerified: false, verified: false, frontIdDocumentUrl: null } : u));
            toast.success('Verification rejected');
        } catch (err) {
            toast.error('Failed to reject verification');
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return <OverviewTab stats={stats} adminActivities={adminActivities} />;
            case 'posts':
                return <PostsTab posts={posts} onEdit={(post) => router.push(`/admin/dashboard/posts/edit/${post.id}`)} onDelete={handleDeletePost} onCreate={() => router.push('/admin/dashboard/posts/create')} />;
            case 'users':
                return <UsersTab users={users} onUpdateUser={handleUpdateUser} onDelete={handleDeleteUser} />;
            case 'verification':
                return <VerificationTab users={users} onApprove={handleApproveVerification} onReject={handleRejectVerification} />;
            case 'services':
                return <ServicesTab services={services} onEdit={handleUpdateService} onDelete={handleDeleteService} onCreate={handleCreateService} />;
            case 'officials':
                return <OfficialsTab />;
            case 'emergencies':
                return <EmergenciesTab />;
            default:
                return <OverviewTab stats={stats} adminActivities={adminActivities} />;
        }
    };

    const getTabTitle = () => {
        const titles: Record<string, string> = {
            overview: 'System Overview',
            posts: 'Content Management',
            users: 'Citizen Registry',
            verification: 'Verifications',
            services: 'LGU Services',
            barangay: 'Barangay Units',
            municipal: 'Municipal Leaders',
            emergencies: 'Emergency Hotlines'
        };
        return titles[activeTab] || 'Dashboard';
    };

    return (
        <div className="flex h-screen overflow-hidden relative">
            <Toaster position="top-right" />
            
            {/* Mobile Sidebar overlay backdrop */}
            {isSidebarOpen && (
                <div 
                    onClick={() => setIsSidebarOpen(false)}
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity animate-fadeIn"
                />
            )}

            <DashboardSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            
            <main className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-[#0a0a0a]">
                <DashboardHeader title={getTabTitle()} onMenuClick={() => setIsSidebarOpen(true)} />
                <div className="flex-1 overflow-y-auto p-4 md:p-12">
                    <div className="max-w-7xl mx-auto">
                        {renderTabContent()}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboardPage;
