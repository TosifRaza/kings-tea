// Frontend/src/utils/image.jsx

// Base backend URL — strips "/api" from VITE_API_URL
// Example: "http://localhost:5000/api" → "http://localhost:5000"
export const IMAGE_URL =
  (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace('/api', '');

// ✅ NEW — Smart image URL helper
// Handles both legacy /uploads/ paths AND new Cloudinary URLs
export const getProductImage = (imgPath) => {
  if (!imgPath) return '';
  
  // Already a full URL (Cloudinary, AWS, etc.) — use as-is
  if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) {
    return imgPath;
  }
  
  // Legacy local upload — prepend backend URL
  if (imgPath.startsWith('/uploads/')) {
    return `${IMAGE_URL}${imgPath}`;
  }
  
  // Fallback — return as-is
  return imgPath;
};