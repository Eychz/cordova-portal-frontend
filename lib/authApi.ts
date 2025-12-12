const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  barangay?: string;
  contactNumber?: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface VerifyEmailData {
  userId: number;
  code: string;
}

interface ResetPasswordData {
  email: string;
  code: string;
  newPassword: string;
}

export const authApi = {
  register: async (data: RegisterData) => {
    console.log('authApi.register called with:', {
      ...data,
      password: '***',
      barangay: data.barangay, // Explicitly log barangay
    });
    
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Registration failed');
    return result;
  },

  verifyEmail: async (data: VerifyEmailData) => {
    const response = await fetch(`${API_BASE_URL}/auth/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Verification failed');
    return result;
  },

  login: async (data: LoginData) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) {
      const error: any = new Error(result.error || 'Login failed');
      error.statusCode = response.status;
      error.requiresVerification = result.requiresVerification;
      error.userId = result.userId;
      throw error;
    }
    return result;
  },

  forgotPassword: async (email: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Request failed');
    return result;
  },

  resetPassword: async (data: ResetPasswordData) => {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Password reset failed');
    return result;
  },
};
