import { httpClient } from './apiClient';

export interface AdminStats {
  totalUsers: number;
  verificationRequests: number;
  publishedPosts: number;
  serviceRequests: number;
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
  isVerified: boolean;
  profileImageUrl?: string | null;
  frontIdDocumentUrl?: string | null;
  backIdDocumentUrl?: string | null;
  faceVerificationUrl?: string | null;
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
