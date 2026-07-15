import multer from 'multer';

// Configure multer memory storage
const storage = multer.memoryStorage();

// Define allowed image MIME types
const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

// Multer file filter function
const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, JPEG, PNG, and WEBP formats are allowed.'), false);
  }
};

// Initialize multer middleware configuration
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB Limit per file
  },
  fileFilter,
});

/**
 * Reusable upload parser middleware factory.
 * Customizes field names and maximum file counts depending on the resource type.
 * 
 * @param {string} fieldName - The form-data key for the uploaded files
 * @param {number} maxCount - The maximum number of files allowed
 */
export const uploadParser = (fieldName, maxCount = 8) => {
  const multerUpload = upload.array(fieldName, maxCount);

  return (req, res, next) => {
    multerUpload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        res.status(400);
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(new Error('File size limit exceeded. Maximum size is 5MB per image.'));
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return next(new Error(`File limit exceeded. Maximum of ${maxCount} images are allowed.`));
        }
        return next(err);
      } else if (err) {
        res.status(400);
        return next(err);
      }
      next();
    });
  };
};
