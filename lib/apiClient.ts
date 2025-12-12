// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// API client functions
export const getPosts = async () => {
  // Implement API call
  return [];
};

export const createPost = async (post: any) => {
  // Implement
  console.log('createPost', post);
};

export const updatePost = async (id: number, post: any) => {
  // Implement
  console.log('updatePost', id, post);
};

export const deletePost = async (id: number) => {
  // Implement
  console.log('deletePost', id);
};

export const updateUser = async (id: number, user: any) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(user)
  });
  
  if (!response.ok) {
    throw new Error('This feature is currently unavailable');
  }
  
  return response.json();
};

export const deleteUser = async (id: number) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  console.log(`[Delete User] Calling: ${API_BASE_URL}/users/${id}`);
  
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  console.log(`[Delete User] Response status: ${response.status}`);
  
  if (!response.ok) {
    const contentType = response.headers.get('content-type');
    let errorMessage = `Failed to delete user (Status: ${response.status})`;
    
    if (contentType && contentType.includes('application/json')) {
      const error = await response.json().catch(() => ({ error: errorMessage }));
      errorMessage = error.error || error.message || errorMessage;
    } else {
      const text = await response.text();
      console.error('[Delete User] Non-JSON response:', text);
    }
    
    throw new Error(errorMessage);
  }
  
  // Some DELETE endpoints return empty response
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  
  return { success: true };
};

export const getServiceRequests = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/service-requests`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch service requests');
  }
  
  return response.json();
};

export const updateServiceRequest = async (id: number, data: { status?: string; adminNote?: string }) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/service-requests/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to update service request' }));
    throw new Error(error.error || 'Failed to update service request');
  }
  
  return response.json();
};

export const deleteServiceRequest = async (id: number) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/service-requests/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete service request');
  }
  
  return response.json();
};

export const verifyUser = async (id: number, data: { isVerified: boolean; barangay?: string }) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/users/${id}/verify`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to verify user' }));
    throw new Error(error.error || 'Failed to verify user');
  }
  
  return response.json();
};

export const getAdminActivities = async (limit: number = 50) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/admin-activities?limit=${limit}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch admin activities');
  }
  
  return response.json();
};

export const addEventToCalendar = async (eventData: { eventId: number | string; eventTitle: string; eventDate: string | Date; eventTime?: string; location?: string; notifyBefore?: number }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('No authentication token found. Please log in.');
  }
  
  const url = `${API_BASE_URL}/users/events`;
  const payload = {
    eventId: eventData.eventId.toString(),
    eventTitle: eventData.eventTitle,
    eventDate: eventData.eventDate instanceof Date ? eventData.eventDate.toISOString() : eventData.eventDate,
    eventTime: eventData.eventTime,
    location: eventData.location,
    notifyBefore: eventData.notifyBefore || 24
  };

  console.log('[Add Event to Calendar] Calling:', url);
  console.log('[Add Event to Calendar] Payload:', payload);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });
  
  console.log('[Add Event to Calendar] Response status:', response.status);
  
  if (!response.ok) {
    const contentType = response.headers.get('content-type');
    let errorMessage = `Failed to add event to calendar (Status: ${response.status})`;
    
    if (contentType && contentType.includes('application/json')) {
      const error = await response.json().catch(() => ({ error: errorMessage }));
      console.error('[Add Event to Calendar] Error response:', error);
      errorMessage = error.error || error.message || errorMessage;
    } else {
      const text = await response.text();
      console.error('[Add Event to Calendar] Non-JSON response:', text.substring(0, 200));
      
      // Check if endpoint doesn't exist (404 HTML response)
      if (response.status === 404 || text.includes('<!DOCTYPE')) {
        errorMessage = 'Calendar API endpoint not available. Please ensure the backend server is running.';
      }
    }
    
    throw new Error(errorMessage);
  }
  
  const result = await response.json();
  console.log('[Add Event to Calendar] Success:', result);
  return result;
};

// Add other functions as needed