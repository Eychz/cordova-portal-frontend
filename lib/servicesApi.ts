import { httpClient } from './apiClient';

export interface Service {
  id: number;
  name: string;
  title?: string; // for compatibility
  description: string;
  icon?: string; // made optional
  imageUrl?: string;
  externalUrl?: string;
  category: string;
  formFileUrl?: string;
  processSteps?: any;
  steps?: any; // for compatibility
  fee?: string;
  requirements?: any;
  hotline?: string;
  email?: string;
  processingTime?: string;
  createdAt: string;
  updatedAt: string;
}

export const servicesApi = {
  // Get all services
  getAll: async (): Promise<Service[]> => {
    return httpClient.get<Service[]>('/services');
  },

  // Get single service by ID
  getById: async (id: number): Promise<Service> => {
    return httpClient.get<Service>(`/services/${id}`);
  },

  // Get single service by Slug (Direct backend call)
  getBySlug: async (slug: string): Promise<Service> => {
    return httpClient.get<Service>(`/services/slug/${slug}`);
  },

  // Create service (admin only)
  create: async (serviceData: any): Promise<Service> => {
    return httpClient.post<Service>('/services', serviceData);
  },

  // Update service (admin only)
  update: async (id: number, serviceData: any): Promise<Service> => {
    return httpClient.put<Service>(`/services/${id}`, serviceData);
  },

  // Delete service (admin only)
  delete: async (id: number): Promise<void> => {
    return httpClient.delete(`/services/${id}`);
  }
};
