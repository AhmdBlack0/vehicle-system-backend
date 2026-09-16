/**
 * Upload Middleware
 * Handles file uploads using multer
 */

const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { ApiError } = require('../utils/ApiError');

// Configure multer to use memory storage
const storage = multer.memoryStorage();

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new ApiError(400, 'Only image files are allowed'), false);
  }
};

// Configure multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB default
  },
});

/**
 * Upload single image to Cloudinary
 * @param {Buffer} fileBuffer - The file buffer
 * @param {string} folder - Cloudinary folder name
 * @returns {Promise<string>} - The secure URL of the uploaded image
 */
const uploadToCloudinary = async (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        folder: `vehicle-system/${folder}`,
        quality: 'auto:good',
        fetch_format: 'auto',
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    ).end(fileBuffer);
  });
};

/**
 * Handle multiple image uploads
 * Processes uploaded files and uploads them to Cloudinary
 */
const handleImageUploads = async (req, res, next) => {
  try {
    console.log('Files received:', req.files);
    const { odometerBefore, odometerAfter, pumpBefore, pumpAfter } = req.files || {};

    if (odometerBefore) {
      console.log('Uploading odometerBefore...');
      req.body.odometerBefore = await uploadToCloudinary(odometerBefore[0].buffer, 'odometer');
      console.log('odometerBefore uploaded:', req.body.odometerBefore);
    }
    if (odometerAfter) {
      console.log('Uploading odometerAfter...');
      req.body.odometerAfter = await uploadToCloudinary(odometerAfter[0].buffer, 'odometer');
      console.log('odometerAfter uploaded:', req.body.odometerAfter);
    }
    if (pumpBefore) {
      console.log('Uploading pumpBefore...');
      req.body.pumpBefore = await uploadToCloudinary(pumpBefore[0].buffer, 'pump');
      console.log('pumpBefore uploaded:', req.body.pumpBefore);
    }
    if (pumpAfter) {
      console.log('Uploading pumpAfter...');
      req.body.pumpAfter = await uploadToCloudinary(pumpAfter[0].buffer, 'pump');
      console.log('pumpAfter uploaded:', req.body.pumpAfter);
    }

    console.log('Final req.body images:', {
      odometerBefore: req.body.odometerBefore,
      odometerAfter: req.body.odometerAfter,
      pumpBefore: req.body.pumpBefore,
      pumpAfter: req.body.pumpAfter,
    });

    next();
  } catch (error) {
    console.error('Image upload error:', error);
    next(new ApiError(500, 'Failed to upload images: ' + error.message));
  }
};

module.exports = {
  upload,
  handleImageUploads,
};
