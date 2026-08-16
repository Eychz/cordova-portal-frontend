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
} from 'data/adminData';
import * as apiClient from 'lib/apiClient';
import { statsApi } from 'lib/statsApi';
import { hasTabAccess, getDefaultTabForRole, normalizeRole, type AdminRole } from '@/lib/rbac';

const AdminDashboardPage = () => {
    const router = useRouter();
    const params = useParams();
    const activeTab = (params.tab as string) || 'overview';
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [userRole, setUserRole] = useState<AdminRole>('ADMIN');
    const queryClient = useQueryClient();

    // Query stats and system metrics
    const { data: statsData, isLoading: isStatsLoading } = useQuery({
        queryKey: ['adminStats'],
        queryFn: () => statsApi.getAdminStats(),
        staleTime: 60 * 1000,
        refetchInterval: 30 * 1000, // Refresh metrics every 30s for live uptime/memory
    });

    // Query citizen registry
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
                role: u.role,
                points: 0,
                registeredAt: new Date(u.createdAt).toLocaleDateString(),
                contactNumber: u.contactNumber || 'Not provided',
                profileImageUrl: u.profileImageUrl,
            }));
        },
        staleTime: 5 * 60 * 1000,
    });

    // Query services
    const { data: services = [] } = useQuery<Service[]>({
        queryKey: ['adminServices'],
        queryFn: () => servicesApi.getAll().catch(() => []),
        staleTime: 5 * 60 * 1000,
    });

    // Query admin activities with roles and action types
    const { data: adminActivities = [] } = useQuery<any[]>({
        queryKey: ['adminActivities'],
        queryFn: () => apiClient.getAdminActivities(100),
        staleTime: 30 * 1000,
        refetchInterval: 30 * 1000,
    });

    // RBAC and Route Guard Protection
    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            toast.error('Please login to access admin dashboard');
            router.push('/auth/login');
            return;
        }

        try {
            const user = JSON.parse(userStr);
            const role = normalizeRole(user.role);
            setUserRole(role);

            // Guard active tab based on RBAC permissions
            if (!hasTabAccess(role, activeTab)) {
                const fallbackTab = getDefaultTabForRole(role);
                toast.error(`Access restricted for role '${role}'. Redirecting to ${fallbackTab}.`);
                router.replace(`/admin/dashboard/${fallbackTab}`);
            }
        } catch (e) {
            router.push('/auth/login');
        }
    }, [router, activeTab]);

    // Handlers
    const handleUpdateUser = async (userId: number, updatedData: any) => {
        try {
            await apiClient.updateUser(userId, updatedData);
            queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
            queryClient.invalidateQueries({ queryKey: ['adminActivities'] });
            toast.success('Citizen profile updated successfully');
        } catch (err) {
            toast.error('Failed to update citizen profile');
        }
    };

    const handleDeleteUser = async (id: number) => {
        if (!confirm('Are you sure you want to delete this user from the registry?')) return;
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

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return <OverviewTab stats={statsData} adminActivities={adminActivities} />;
            case 'posts':
                return <PostsTab />;
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
                return <OverviewTab stats={statsData} adminActivities={adminActivities} />;
        }
    };

    const getTabTitle = () => {
        const titles: Record<string, string> = {
            overview: 'System Overview & Metrics',
            posts: 'Content Management',
            users: 'Citizen Registry',
            services: 'LGU Services',
            officials: 'LGU Officials',
            emergencies: 'Emergency Hotlines',
            changelog: 'Change Log Tracking'
        };
        return titles[activeTab] || 'Dashboard';
    };

    return (
        <div className="flex h-screen overflow-hidden relative bg-gray-50 dark:bg-[#0a0a0a]">
            <Toaster position="top-right" />
            
            {/* Mobile Sidebar overlay backdrop */}
            {isSidebarOpen && (
                <div 
                    onClick={() => setIsSidebarOpen(false)}
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity animate-fadeIn"
                />
            )}

            <DashboardSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            
            <main className="flex-1 flex flex-col overflow-hidden">
                <DashboardHeader title={getTabTitle()} onMenuClick={() => setIsSidebarOpen(true)} />
                <div className="flex-1 overflow-y-auto p-4 md:p-10">
                    <div className="max-w-7xl mx-auto">
                        {renderTabContent()}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboardPage;
