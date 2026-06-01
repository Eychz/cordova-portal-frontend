import { httpClient } from './apiClient';

export interface EmergencyHotline {
    id: number;
    title: string;
    description: string;
    contact: string;
    category: string;
    icon: string;
    createdAt: string;
    updatedAt: string;
}

export const emergencyApi = {
    getAll: async (): Promise<EmergencyHotline[]> => {
        return httpClient.get<EmergencyHotline[]>('/emergency');
    },

    create: async (data: any): Promise<EmergencyHotline> => {
        return httpClient.post<EmergencyHotline>('/emergency', data);
    },

    update: async (id: number, data: any): Promise<EmergencyHotline> => {
        return httpClient.put<EmergencyHotline>(`/emergency/${id}`, data);
    },

    delete: async (id: number): Promise<void> => {
        return httpClient.delete(`/emergency/${id}`);
    }
};
