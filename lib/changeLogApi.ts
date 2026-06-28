import { httpClient } from './apiClient';

export interface ChangeLog {
    id: string;
    description: string;
    date: string;
    contributor: string;
    approvedBy: string;
    createdAt: string;
    updatedAt: string;
}

export interface PaginatedChangeLogs {
    data: ChangeLog[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export const changeLogApi = {
    getAll: async (page = 1, limit = 15): Promise<PaginatedChangeLogs> => {
        return httpClient.request<PaginatedChangeLogs>('/change-logs', {
            method: 'GET',
            params: { page, limit }
        });
    },

    create: async (data: { description: string; date: string; contributor: string; approvedBy: string }): Promise<ChangeLog> => {
        return httpClient.request<ChangeLog>('/change-logs', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    update: async (id: string, data: { description: string; date: string; contributor: string; approvedBy: string }): Promise<ChangeLog> => {
        return httpClient.request<ChangeLog>(`/change-logs/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    delete: async (id: string): Promise<void> => {
        return httpClient.request<void>(`/change-logs/${id}`, {
            method: 'DELETE'
        });
    }
};
