/**
 * Cloudinary Utility
 * Handles image upload to Cloudinary from Base64 strings
 */

const { v2: cloudinary } = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a Base64 image to Cloudinary
 * @param {string} base64String - The Base64 encoded image string
 * @param {string} folder - The folder name in Cloudinary (optional)
 * @returns {Promise<string>} - The secure URL of the uploaded image
 */
const uploadBase64Image = async (base64String, folder = 'fuel-logs') => {
  try {
    if (!base64String) {
      return null;
    }

    const result = await cloudinary.uploader.upload(base64String, {
      folder,
      format: 'jpg',
      transformation: [
        { quality: 'auto' },
        { fetch_format: 'auto' },
      ],
    });

    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
};

/**
 * Upload multiple Base64 images to Cloudinary
 * @param {Object} images - Object with image fields as Base64 strings
 * @returns {Promise<Object>} - Object with image fields as Cloudinary URLs
 */
const uploadMultipleImages = async (images) => {
  const uploadedImages = {};

  const uploadPromises = Object.entries(images).map(async ([key, base64String]) => {
    if (base64String) {
      const url = await uploadBase64Image(base64String, `fuel-logs/${key}`);
      uploadedImages[key] = url;
    } else {
      uploadedImages[key] = null;
    }
  });

  await Promise.all(uploadPromises);
  return uploadedImages;
};

module.exports = {
  uploadBase64Image,
  uploadMultipleImages,
};
