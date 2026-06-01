import { httpClient } from './apiClient';

export const uploadApi = {
  /**
   * Upload a profile image
   * @param file - The image file to upload
   * @returns Promise with the uploaded image URL and updated user data
   */
  uploadProfileImage: async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('image', file);
    return httpClient.post<any>('/upload/profile-image', formData);
  },

  /**
   * Upload multiple post images
   * @param files - Array of image files to upload
   * @returns Promise with the uploaded image URLs
   */
  uploadPostImages: async (files: File[]): Promise<any> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });
    return httpClient.post<any>('/upload/post-images', formData);
  },

  /**
   * Delete an image/document from storage (Secured on backend)
   * @param imageUrl - The URL of the image to delete
   */
  deleteImage: async (imageUrl: string): Promise<any> => {
    return httpClient.delete<any>('/upload/file', { imageUrl });
  },
};

export default uploadApi;
