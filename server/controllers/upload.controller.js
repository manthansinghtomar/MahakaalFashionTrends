import { uploadToCloudinary } from '../utils/cloudinaryHelper.js';
import cloudinary from '../config/cloudinary.js';
import crypto from 'crypto';

/**
 * Reusable controller to handle uploading multiple files to Cloudinary.
 * Features:
 *  1. Deduplicates images within the same request using MD5 hashes of file buffers.
 *  2. Uploads images concurrently while maintaining array selection order.
 *  3. Dynamic folder determination.
 *  4. Transactional upload: Automatically deletes successfully uploaded images from
 *     Cloudinary if one of the uploads in the request fails.
 */
export const uploadImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      res.status(400);
      return next(new Error('Please select at least one image file to upload.'));
    }

    const folder = req.uploadFolder || 'products';

    // 1. Deduplicate images by computing MD5 hashes of their buffer contents
    const uniqueFiles = [];
    const seenHashes = new Set();

    for (const file of req.files) {
      const hash = crypto.createHash('md5').update(file.buffer).digest('hex');
      if (!seenHashes.has(hash)) {
        seenHashes.add(hash);
        uniqueFiles.push(file);
      }
    }

    // 2. Map unique files to upload promises
    const uploadPromises = uniqueFiles.map((file) =>
      uploadToCloudinary(file.buffer, folder)
    );

    // 3. Resolve promises using Promise.allSettled to track each upload state
    const results = await Promise.allSettled(uploadPromises);

    const succeeded = [];
    let firstError = null;

    // Promise.allSettled preserves the exact array ordering of uniqueFiles
    for (const result of results) {
      if (result.status === 'fulfilled') {
        succeeded.push(result.value);
      } else {
        if (!firstError) {
          firstError = result.reason;
        }
      }
    }

    // 4. If any upload failed, delete all succeeded uploads from Cloudinary to keep the process transactional
    if (firstError) {
      const rollbackPromises = succeeded.map((img) =>
        cloudinary.uploader.destroy(img.public_id)
      );
      
      // Attempt to clean up orphan files in the background
      await Promise.allSettled(rollbackPromises);

      res.status(500);
      return next(new Error(`Image upload failed: ${firstError.message || firstError}`));
    }

    // 5. Success response containing all uploaded file details
    res.status(200).json({
      success: true,
      images: succeeded,
    });
  } catch (error) {
    next(error);
  }
};
