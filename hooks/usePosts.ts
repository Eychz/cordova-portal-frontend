import { useQuery } from '@tanstack/react-query';
import { postsApi, Post } from '@/lib/postsApi';

interface UsePostsParams {
  type?: string;
  priority?: string;
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: string;
}

export function usePosts(params?: UsePostsParams) {
  const type = params?.type || 'all';
  return useQuery<Post[]>({
    queryKey: ['posts', { type, ...params }],
    queryFn: () => postsApi.getAll(params),
    
    // Caching configuration:
    staleTime: 5 * 60 * 1000,    // 5 Minutes: Consider data fresh for 5 minutes.
    gcTime: 15 * 60 * 1000,      // 15 Minutes: Retain in memory.
  });
}

export function usePostBySlug(slug: string, type?: string) {
  return useQuery<Post>({
    queryKey: ['post', { slug, type }],
    queryFn: () => postsApi.getBySlug(slug, type),
    
    // Allow post detail view to remain fresh for 5 minutes.
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    enabled: !!slug,             // Only execute query if slug is defined.
  });
}
