interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
}

export const getOptimizedImageUrl = (
  imagePath: string, 
  options: ImageOptimizationOptions = {}
): string => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  
  // If no image path, return empty string
  if (!imagePath) return '';
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) return imagePath;
  
  // Build query parameters for optimization
  const params = new URLSearchParams();
  
  if (options.width) params.append('w', options.width.toString());
  if (options.height) params.append('h', options.height.toString());
  if (options.quality) params.append('q', options.quality.toString());
  if (options.format) params.append('f', options.format);
  
  const queryString = params.toString();
  const optimizedPath = `/api/images${imagePath}${queryString ? `?${queryString}` : ''}`;
  
  return `${baseUrl}${optimizedPath}`;
};

// Predefined optimization presets
export const imagePresets = {
  thumbnail: (imagePath: string) => getOptimizedImageUrl(imagePath, { width: 150, height: 150, quality: 70, format: 'webp' }),
  small: (imagePath: string) => getOptimizedImageUrl(imagePath, { width: 300, height: 300, quality: 75, format: 'webp' }),
  medium: (imagePath: string) => getOptimizedImageUrl(imagePath, { width: 600, height: 600, quality: 80, format: 'webp' }),
  large: (imagePath: string) => getOptimizedImageUrl(imagePath, { width: 1200, height: 1200, quality: 85, format: 'webp' }),
  original: (imagePath: string) => getOptimizedImageUrl(imagePath, { quality: 90, format: 'webp' })
}; 