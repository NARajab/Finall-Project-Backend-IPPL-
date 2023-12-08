const multer = require('multer');
const ApiError = require('../../utils/apiError');
const storage = multer.memoryStorage();
const allowedMimeType = ['image/jpg', 'image/png', 'image/jpeg'];

const fileFilter = (req, file, cb) => {
  const isAllowedMimeType = allowedMimeType.includes(file.mimetype);
  if (isAllowedMimeType) {
    return cb(null, true);
  }
  return cb(new ApiError('Invalid image extension', 400));
};

module.exports = multer({ storage, fileFilter });
