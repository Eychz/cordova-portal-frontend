import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 5 Minutes default staleTime: Data remains 'fresh' in memory for 5 minutes.
      // Back/forward browser navigation within 5 minutes will serve cached data instantly.
      staleTime: 5 * 60 * 1000,

      // 15 Minutes gcTime (formerly cacheTime): Unused/inactive query cache is held in memory for 15 minutes.
      // Garbage collector sweeps it after 15 minutes of inactivity.
      gcTime: 15 * 60 * 1000,

      // UI/UX Navigation Defaults
      refetchOnWindowFocus: false, // Prevents layout flashing when users switch browser tabs.
      refetchOnMount: true,        // Queries refetch on mount ONLY if the cached data is marked stale.
      refetchOnReconnect: true,    // Restores and refetches state seamlessly if network drops and recovers.
      
      // Error Handling
      retry: 1,                    // Retries failed API calls exactly once before surfacing the error to the UI.
    },
  },
});
