import { httpClient } from './apiClient';

interface LoginData {
  email: string;
  password: string;
}

export const authApi = {
  login: async (data: LoginData, recaptchaToken?: string) => {
    try {
      return await httpClient.post<any>('/auth/login', data, {
        headers: recaptchaToken ? { 'X-Recaptcha-Token': recaptchaToken } : undefined
      });
    } catch (err: any) {
      if (err.name === 'HttpError') {
        const error: any = new Error(err.message);
        error.statusCode = err.status;
        throw error;
      }
      throw err;
    }
  },
};
