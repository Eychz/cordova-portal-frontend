const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

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
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token');

    const response = await fetch(`${API_BASE_URL}/users/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Failed to save event');
    return result.event;
  },

  getUserEvents: async (upcomingOnly = false) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token');

    const url = upcomingOnly 
      ? `${API_BASE_URL}/users/events?upcoming=true`
      : `${API_BASE_URL}/users/events`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.warn('User events API endpoint not available, returning empty array');
      return [];
    }
    
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Failed to fetch events');
    return result.events || [];
  },

  removeEvent: async (eventId: number) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No authentication token');

    const response = await fetch(`${API_BASE_URL}/users/events/${eventId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Failed to remove event');
    return result;
  },
};
