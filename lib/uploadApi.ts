const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
  };
};

export const uploadApi = {
  /**
   * Upload a profile image
   * @param file - The image file to upload
   * @returns Promise with the uploaded image URL and updated user data
   */
  uploadProfileImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE_URL}/upload/profile-image`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData,
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'Failed to upload profile image');
    }

    return result;
  },

  /**
   * Upload multiple post images
   * @param files - Array of image files to upload
   * @returns Promise with the uploaded image URLs
   */
  uploadPostImages: async (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    const response = await fetch(`${API_BASE_URL}/upload/post-images`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData,
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'Failed to upload post images');
    }

    return result;
  },

  /**
   * Delete an image from storage
   * @param imageUrl - The URL of the image to delete
   */
  deleteImage: async (imageUrl: string) => {
    const response = await fetch(`${API_BASE_URL}/upload/image`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl }),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'Failed to delete image');
    }

    return result;
  },
};

export default uploadApi;
