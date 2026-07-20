'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast, { Toaster } from 'react-hot-toast';
import DashboardSidebar from '../components/DashboardSidebar';
import { servicesApi, Service } from 'lib/servicesApi';
import DashboardHeader from '../components/DashboardHeader';
import OverviewTab from '../components/OverviewTab';
import PostsTab from '../components/PostsTab';
import UsersTab from '../components/UsersTab';
import ServicesTab from '../components/ServicesTab';
import OfficialsTab from '../components/OfficialsTab';
import EmergenciesTab from '../components/EmergenciesTab';
import ChangeLogsTab from '../components/ChangeLogsTab';

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
    const queryClient = useQueryClient();

    const { data: statsData } = useQuery({
        queryKey: ['adminStats'],
        queryFn: () => statsApi.getAdminStats(),
        staleTime: 5 * 60 * 1000,
    });

    const { data: users = [] } = useQuery<User[]>({
        queryKey: ['adminUsers'],
        queryFn: async () => {
            const dbUsers = await statsApi.getAllUsers();
            return dbUsers.map(u => ({
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
        },
        staleTime: 5 * 60 * 1000,
    });

    const { data: services = [] } = useQuery<Service[]>({
        queryKey: ['adminServices'],
        queryFn: () => servicesApi.getAll().catch(() => []),
        staleTime: 5 * 60 * 1000,
    });

    const { data: adminActivities = [] } = useQuery<any[]>({
        queryKey: ['adminActivities'],
        queryFn: () => apiClient.getAdminActivities(100),
        staleTime: 5 * 60 * 1000,
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

    // Compute stats dynamically
    const totalPop = 7500 + 6200 + 5100 + 4500 + 3800 + 5200 + 4100 + 6500 + 1800 + 4300 + 5800 + 7200 + 4900;
    const stats = {
        totalUsers: statsData?.totalUsers || 0,
        verificationRequests: statsData?.verificationRequests || 0,
        totalPopulation: totalPop,
        publishedPosts: statsData?.publishedPosts || 0
    };

    // Handlers
    const handleUpdateUser = async (userId: number, updatedData: any) => {
        try {
            await apiClient.updateUser(userId, updatedData);
            queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
            queryClient.invalidateQueries({ queryKey: ['adminActivities'] });
            toast.success('User updated successfully');
        } catch (err) {
            toast.error('Failed to update user');
        }
    };

    const handleDeleteUser = async (id: number) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        try {
            await apiClient.deleteUser(id);
            queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
            queryClient.invalidateQueries({ queryKey: ['adminActivities'] });
            toast.success('User deleted successfully');
        } catch (err) {
            toast.error('Failed to delete user');
        }
    };



    const handleCreateService = async (data: any) => {
        try {
            await servicesApi.create(data);
            queryClient.invalidateQueries({ queryKey: ['adminServices'] });
            queryClient.invalidateQueries({ queryKey: ['adminActivities'] });
            queryClient.invalidateQueries({ queryKey: ['publicServices'] });
            toast.success('Service created successfully');
        } catch (err) {
            toast.error('Failed to create service');
        }
    };

    const handleUpdateService = async (id: number, data: any) => {
        try {
            await servicesApi.update(id, data);
            queryClient.invalidateQueries({ queryKey: ['adminServices'] });
            queryClient.invalidateQueries({ queryKey: ['adminActivities'] });
            queryClient.invalidateQueries({ queryKey: ['publicServices'] });
            toast.success('Service updated successfully');
        } catch (err) {
            toast.error('Failed to update service');
        }
    };

    const handleDeleteService = async (id: number) => {
        if (!confirm('Are you sure you want to delete this service?')) return;
        try {
            await servicesApi.delete(id);
            queryClient.invalidateQueries({ queryKey: ['adminServices'] });
            queryClient.invalidateQueries({ queryKey: ['adminActivities'] });
            queryClient.invalidateQueries({ queryKey: ['publicServices'] });
            toast.success('Service deleted successfully');
        } catch (err) {
            toast.error('Failed to delete service');
        }
    };

    const handleApproveVerification = async (id: number, updatedData?: any) => {
        try {
            if (updatedData) {
                await apiClient.updateUser(id, updatedData);
            }
            await apiClient.verifyUser(id, { isVerified: true });
            queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
            queryClient.invalidateQueries({ queryKey: ['adminActivities'] });
            toast.success('Verification approved');
        } catch (err) {
            toast.error('Failed to approve verification');
        }
    };

    const handleRejectVerification = async (id: number) => {
        try {
            await apiClient.updateUser(id, { isVerified: false, frontIdDocumentUrl: null });
            queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
            queryClient.invalidateQueries({ queryKey: ['adminActivities'] });
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
                return <PostsTab />;
            case 'verification':
            case 'users':
                return <UsersTab users={users} onUpdateUser={handleUpdateUser} onDelete={handleDeleteUser} />;
            case 'services':
                return <ServicesTab services={services} onEdit={handleUpdateService} onDelete={handleDeleteService} onCreate={handleCreateService} />;
            case 'officials':
                return <OfficialsTab />;
            case 'emergencies':
                return <EmergenciesTab />;
            case 'changelog':
                return <ChangeLogsTab />;
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
            emergencies: 'Emergency Hotlines',
            changelog: 'Change Log Tracking'
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
