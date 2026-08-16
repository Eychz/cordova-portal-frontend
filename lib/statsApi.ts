import { httpClient } from './apiClient';

export interface SystemMetrics {
  launchDate: string;
  serverUptimeSeconds: number;
  nodeVersion: string;
  platform: string;
  arch: string;
  cpuCount: number;
  memory: {
    heapUsedMB: number;
    heapTotalMB: number;
    rssMB: number;
    ramPercent: number;
    storagePercent: number;
  };
}

export interface AdminStats {
  totalUsers: number;
  totalServices: number;
  publishedPosts: number;
  totalAnnouncements: number;
  totalNews: number;
  totalEvents: number;
  totalHotlines: number;
  totalOfficials: number;
  totalChangeLogs: number;
  serviceRequests?: number;
  systemMetrics?: SystemMetrics;
}

export interface User {
  id: number;
  email: string;
  firstName: string | null;
  middleName: string | null;
  lastName: string | null;
  barangay: string | null;
  contactNumber: string | null;
  role: string;
  profileImageUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export const statsApi = {
  getAdminStats: async (): Promise<AdminStats> => {
    return httpClient.get<AdminStats>('/stats/admin/stats');
  },

  getAllUsers: async (): Promise<User[]> => {
    return httpClient.get<User[]>('/stats/users');
  },
};
