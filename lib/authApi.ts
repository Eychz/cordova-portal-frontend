import { httpClient } from './apiClient';

interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
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
  register: async (data: RegisterData, recaptchaToken?: string) => {
    console.log('authApi.register called with:', {
      ...data,
      password: '***',
      barangay: data.barangay,
    });
    return httpClient.post<any>('/auth/register', data, {
      headers: recaptchaToken ? { 'X-Recaptcha-Token': recaptchaToken } : undefined
    });
  },

  verifyEmail: async (data: VerifyEmailData) => {
    return httpClient.post<any>('/auth/verify-email', data);
  },

  login: async (data: LoginData, recaptchaToken?: string) => {
    try {
      return await httpClient.post<any>('/auth/login', data, {
        headers: recaptchaToken ? { 'X-Recaptcha-Token': recaptchaToken } : undefined
      });
    } catch (err: any) {
      if (err.name === 'HttpError') {
        const error: any = new Error(err.message);
        error.statusCode = err.status;
        error.requiresVerification = err.data?.requiresVerification;
        error.userId = err.data?.userId;
        throw error;
      }
      throw err;
    }
  },

  forgotPassword: async (email: string, recaptchaToken?: string) => {
    return httpClient.post<any>('/auth/forgot-password', { email }, {
      headers: recaptchaToken ? { 'X-Recaptcha-Token': recaptchaToken } : undefined
    });
  },

  resetPassword: async (data: ResetPasswordData) => {
    return httpClient.post<any>('/auth/reset-password', data);
  },
};
