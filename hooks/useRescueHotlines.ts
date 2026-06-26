import { useQuery } from '@tanstack/react-query';
import { emergencyApi, EmergencyHotline } from '@/lib/emergencyApi';

export function useRescueHotlines() {
  return useQuery<EmergencyHotline[]>({
    queryKey: ['rescueHotlines'],
    queryFn: () => emergencyApi.getAll(),
    
    // Caching configuration:
    // Safety directories are highly static, so they can safely remain fresh.
    staleTime: 60 * 60 * 1000,     // 1 Hour: Consider data fresh for 1 hour.
    gcTime: 24 * 60 * 60 * 1000,   // 24 Hours: Keep data in cache for up to 24 hours of inactivity.
    refetchOnMount: false,         // Do not refetch on mount if cache is already present.
    refetchOnWindowFocus: false,   // Bypass tab-switching refetches.
  });
}
