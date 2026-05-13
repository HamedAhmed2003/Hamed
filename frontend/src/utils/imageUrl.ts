import { API_BASE_URL } from '@/services/api';

const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

/**
 * Normalizes an image path to a full URL.
 * Handles absolute URLs, relative paths starting with /, and missing images.
 */
export const getImageUrl = (image?: string | null): string => {
  if (!image) return '';
  if (image.startsWith('blob:')) return image;
  if (image.startsWith('http://') || image.startsWith('https://')) return image;
  
  const cleanPath = image.startsWith('/') ? image : `/${image}`;
  return `${API_ORIGIN}${cleanPath}`;
};
