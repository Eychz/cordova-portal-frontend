import { httpClient } from './apiClient';

interface SaveEventData {
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime?: string;
  location?: string;
  notifyBefore?: number;
}

export const eventApi = {
  saveEvent: async (data: SaveEventData) => {
    return httpClient.post<any>('/users/events', data);
  },

  getUserEvents: async (upcomingOnly = false) => {
    const params: Record<string, string> = {};
    if (upcomingOnly) params.upcoming = 'true';
    
    // Attempt to fetch and return empty array if not supported
    try {
      const result = await httpClient.get<any>('/users/events', params);
      return result.events || [];
    } catch (err) {
      console.warn('User events API endpoint not available, returning empty array');
      return [];
    }
  },

  removeEvent: async (eventId: number) => {
    return httpClient.delete<any>(`/users/events/${eventId}`);
  },
};
