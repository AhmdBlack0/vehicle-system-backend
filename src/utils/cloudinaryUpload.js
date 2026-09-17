/**
 * Cloudinary Upload Utility
 * Handles base64 image uploads to Cloudinary
 */

const cloudinary = require('../config/cloudinary');
const ApiError = require('./ApiError');

/**
 * Upload base64 image to Cloudinary
 * @param {string} base64String - Base64 encoded image string
 * @param {string} folder - Cloudinary folder name (optional)
 * @returns {Promise<string>} - Secure URL of uploaded image
 */
async function uploadBase64Image(base64String, folder = 'vehicle-system') {
  try {
    if (!base64String) {
      return null;
    }

    // Check if it's already a URL (skip upload)
    if (base64String.startsWith('http://') || base64String.startsWith('https://')) {
      return base64String;
    }

    // Extract the base64 data (remove data:image/xxx;base64, prefix if present)
    const base64Data = base64String.includes('base64,') 
      ? base64String.split('base64,')[1] 
      : base64String;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(
      `data:image/jpeg;base64,${base64Data}`,
      {
        folder,
        resource_type: 'image',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [
          { quality: 'auto', fetch_format: 'auto' },
          { width: 1200, crop: 'limit' }
        ]
      }
    );

    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new ApiError('Failed to upload image to Cloudinary', 500);
  }
}

/**
 * Delete image from Cloudinary
 * @param {string} imageUrl - Public ID or URL of image to delete
 * @returns {Promise<void>}
 */
async function deleteImage(imageUrl) {
  try {
    if (!imageUrl) {
      return;
    }

    // Extract public ID from URL
    const publicId = imageUrl.split('/').slice(-2).join('/').split('.')[0];
    
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    // Don't throw error for delete failures
  }
}

module.exports = {
  uploadBase64Image,
  deleteImage
};
