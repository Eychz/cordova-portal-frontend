import { httpClient } from './apiClient';

export interface Post {
  id?: number;
  uuid?: string;
  title: string;
  content: string;
  imageUrl?: string;
  type: 'news' | 'announcement' | 'event';
  priority?: string;
  status?: 'published' | 'draft';
  location?: string;
  eventDate?: string;
  eventTime?: string;
  createdAt?: string;
  updatedAt?: string;
  isFeatured?: boolean;
  eventStatus?: string; // 'upcoming' or 'done'
  category?: string;
  authorName?: string;
}

export const postsApi = {
  // Get all posts with optional pagination and filtering
  getAll: async (params?: { type?: string; priority?: string; page?: number; limit?: number }): Promise<Post[]> => {
    const result = await httpClient.get<any>('/posts', params as any);
    
    // Support both raw array responses and paginated responses
    if (Array.isArray(result)) return result;
    if (result && result.posts) return result.posts;
    return [];
  },

  // Get single post by ID
  getById: async (id: number): Promise<Post> => {
    return httpClient.get<Post>(`/posts/${id}`);
  },

  // Get single post by Slug (Direct backend call)
  getBySlug: async (slug: string, type?: string): Promise<Post> => {
    return httpClient.get<Post>(`/posts/slug/${slug}`);
  },

  // Create post (admin/official)
  create: async (post: Post): Promise<Post> => {
    return httpClient.post<Post>('/posts', post);
  },

  // Update post (admin/official)
  update: async (id: number, post: Partial<Post>): Promise<Post> => {
    return httpClient.patch<Post>(`/posts/${id}`, post);
  },

  // Delete post (admin/official)
  delete: async (id: number): Promise<any> => {
    return httpClient.delete(`/posts/${id}`);
  },

  // Get featured posts (public)
  getFeatured: async (limit = 6): Promise<Post[]> => {
    const result = await httpClient.get<Post[]>('/posts/featured', { limit });
    return Array.isArray(result) ? result : [];
  },

  // Toggle featured status (admin only)
  toggleFeatured: async (id: number, isFeatured: boolean): Promise<Post> => {
    return httpClient.put<Post>(`/posts/${id}/featured`, { isFeatured });
  },
};
