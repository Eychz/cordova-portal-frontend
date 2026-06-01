import { httpClient } from './apiClient';

export const userApi = {
  getProfile: async (): Promise<any> => {
    const result = await httpClient.get<any>('/users/profile');
    return result.user;
  },

  updateProfile: async (data: {
    firstName?: string;
    middleName?: string;
    lastName?: string;
    barangay?: string;
    contactNumber?: string;
    profileImageUrl?: string;
  }): Promise<any> => {
    const result = await httpClient.put<any>('/users/profile', data);
    return result.user;
  },
};
