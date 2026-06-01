import { httpClient } from './apiClient';

export interface Official {
    id: number;
    name: string;
    position: string;
    slug: string;
    type: 'MUNICIPAL' | 'DEPARTMENT' | 'BARANGAY' | 'SK';
    hierarchyOrder: number;
    imageUrl?: string;
    barangayName?: string;
    email?: string;
    contactNumber?: string;
    createdAt: string;
    updatedAt: string;
}

export const officialsApi = {
    getAll: async (type?: string, barangay?: string): Promise<Official[]> => {
        const params: Record<string, string> = {};
        if (type) params.type = type;
        if (barangay) params.barangay = barangay;
        return httpClient.get<Official[]>('/officials', params);
    },

    getById: async (id: number): Promise<Official> => {
        return httpClient.get<Official>(`/officials/${id}`);
    },

    getBySlug: async (slug: string): Promise<Official> => {
        return httpClient.get<Official>(`/officials/slug/${slug}`);
    },

    create: async (data: any): Promise<Official> => {
        return httpClient.post<Official>('/officials', data);
    },

    update: async (id: number, data: any): Promise<Official> => {
        return httpClient.put<Official>(`/officials/${id}`, data);
    },

    delete: async (id: number): Promise<void> => {
        return httpClient.delete(`/officials/${id}`);
    }
};
