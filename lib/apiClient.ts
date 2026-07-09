// API Base URL
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export class HttpError extends Error {
    constructor(message: string, public status: number, public data?: any) {
        super(message);
        this.name = 'HttpError';
    }
}

interface RequestOptions extends RequestInit {
    params?: Record<string, string | number>;
}

class HttpClient {
    private getHeaders(customHeaders?: HeadersInit): Record<string, string> {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return { ...headers, ...customHeaders as any };
    }

    async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
        let url = `${API_BASE_URL}${endpoint}`;
        
        if (options.params) {
            const queryParams = new URLSearchParams();
            Object.entries(options.params).forEach(([key, val]) => {
                if (val !== undefined && val !== null) {
                    queryParams.append(key, String(val));
                }
            });
            url += `?${queryParams.toString()}`;
        }

        const response = await fetch(url, {
            ...options,
            headers: options.body instanceof FormData 
                ? { 'Authorization': this.getHeaders()['Authorization'] as string, ...options.headers }
                : this.getHeaders(options.headers),
        });

        if (!response.ok) {
            let errorMsg = `HTTP Error: ${response.status}`;
            let errData: any = null;
            try {
                errData = await response.json();
                errorMsg = errData.error || errData.message || errorMsg;
            } catch {}
            throw new HttpError(errorMsg, response.status, errData);
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return response.json();
        }
        return { success: true } as unknown as T;
    }

    get<T>(endpoint: string, params?: Record<string, string | number>, options?: RequestInit) {
        return this.request<T>(endpoint, { method: 'GET', params, ...options });
    }

    post<T>(endpoint: string, body: any, options?: RequestInit) {
        return this.request<T>(endpoint, { 
            method: 'POST', 
            body: body instanceof FormData ? body : JSON.stringify(body),
            ...options 
        });
    }

    put<T>(endpoint: string, body: any, options?: RequestInit) {
        return this.request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body), ...options });
    }

    patch<T>(endpoint: string, body: any, options?: RequestInit) {
        return this.request<T>(endpoint, { method: 'PATCH', body: JSON.stringify(body), ...options });
    }

    delete<T>(endpoint: string, body?: any, options?: RequestInit) {
        return this.request<T>(endpoint, { 
            method: 'DELETE', 
            body: body ? JSON.stringify(body) : undefined, 
            ...options 
        });
    }
}

export const httpClient = new HttpClient();

// Refactored high-level functions utilizing the new httpClient
export const verifySession = async () => {
  return httpClient.get<any>('/auth/me');
};

export const getPosts = async () => {
  return httpClient.get<any[]>('/posts');
};

export const createPost = async (post: any) => {
  return httpClient.post<any>('/posts', post);
};

export const updatePost = async (id: number, post: any) => {
  return httpClient.patch<any>(`/posts/${id}`, post);
};

export const deletePost = async (id: number) => {
  return httpClient.delete<any>(`/posts/${id}`);
};

export const updateUser = async (id: number, user: any) => {
  return httpClient.put<any>(`/users/${id}`, user);
};

export const deleteUser = async (id: number) => {
  return httpClient.delete<any>(`/users/${id}`);
};

export const getServiceRequests = async () => {
  return httpClient.get<any[]>('/service-requests');
};

export const updateServiceRequest = async (id: number, data: { status?: string; adminNote?: string }) => {
  return httpClient.put<any>(`/service-requests/${id}`, data);
};

export const deleteServiceRequest = async (id: number) => {
  return httpClient.delete<any>(`/service-requests/${id}`);
};

export const verifyUser = async (id: number, data: { isVerified: boolean; barangay?: string }) => {
  return httpClient.put<any>(`/users/${id}/verify`, data);
};

export const getAdminActivities = async (limit: number = 50) => {
  return httpClient.get<any[]>('/admin-activities', { limit });
};

export const uploadFile = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  const result = await httpClient.post<{ fileUrl: string }>('/upload/file', formData);
  return result.fileUrl;
};