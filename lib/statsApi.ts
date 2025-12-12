const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getAuthHeader = (): Record<string, string> => {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

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
    const response = await fetch(`${API_BASE_URL}/stats/admin/stats`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch admin statistics');
    }
    
    return response.json();
  },

  getAllUsers: async (): Promise<User[]> => {
    const response = await fetch(`${API_BASE_URL}/stats/users`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    
    return response.json();
  },
};
