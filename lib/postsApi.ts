const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface Post {
  id?: number;
  title: string;
  content: string;
  imageUrl?: string;
  type: 'news' | 'announcements' | 'event';
  priority?: 'high' | 'normal' | 'low';
  status?: 'published' | 'draft';
  location?: string;
  eventDate?: string;
  eventTime?: string;
  createdAt?: string;
  updatedAt?: string;
  isFeatured?: boolean;
  eventStatus?: string; // 'upcoming' or 'done'
  category?: string;
}

const getAuthHeader = (): HeadersInit => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No authentication token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  } as HeadersInit;
};

export const postsApi = {
  // Get all posts
  getAll: async (type?: string) => {
    const url = type 
      ? `${API_BASE_URL}/posts?type=${type}`
      : `${API_BASE_URL}/posts`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to fetch posts');
    const result = await response.json();
    return Array.isArray(result) ? result : [];
  },

  // Get single post
  getById: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Failed to fetch post');
    return result.post;
  },

  // Create post (admin only)
  create: async (post: Post) => {
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(post),
    });
    if (!response.ok) {
      const text = await response.text();
      console.error('Create post error:', text);
      throw new Error('Failed to create post. Server error.');
    }
    const result = await response.json();
    return result;
  },

  // Update post (admin only)
  update: async (id: number, post: Partial<Post>) => {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify(post),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Failed to update post');
    return result.post;
  },

  // Delete post (admin only)
  delete: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Failed to delete post');
    return result;
  },

  // Get featured posts (public)
  getFeatured: async (limit = 6) => {
    const response = await fetch(`${API_BASE_URL}/posts/featured?limit=${limit}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to fetch featured posts');
    const result = await response.json();
    return Array.isArray(result) ? result : [];
  },

  // Toggle featured status (admin only)
  toggleFeatured: async (id: number, isFeatured: boolean) => {
    const response = await fetch(`${API_BASE_URL}/posts/${id}/featured`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify({ isFeatured }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Failed to update featured status');
    return result.post;
  },
};
