import cloudinary from '../config/cloudinary.js';

/**
 * Uploads a file buffer to Cloudinary targeting a dynamic folder path
 * with automated optimization (auto format & auto quality) and metadata retrieval.
 * 
 * @param {Buffer} fileBuffer - The file buffer in memory
 * @param {string} folder - The dynamic folder subdirectory (e.g. 'products', 'categories', 'offers', 'profile')
 * @returns {Promise<object>} Image upload result metadata
 */
export const uploadToCloudinary = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `mahakaalfashiontrends/${folder}`,
        resource_type: 'image',
        quality: 'auto',
        fetch_format: 'auto', // Cloudinary f_auto configuration
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve({
          public_id: result.public_id,
          url: result.secure_url,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
        });
      }
    );

    uploadStream.end(fileBuffer);
  });
};
