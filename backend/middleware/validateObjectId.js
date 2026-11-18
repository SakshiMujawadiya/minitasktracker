const mongoose = require('mongoose');

const validateObjectId = (req, res, next) => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid task ID format. Must be a valid 24-character hexadecimal MongoDB ObjectId.',
    });
  }

  // Ensure strict match to avoid partial matches
  if (String(new mongoose.Types.ObjectId(id)) !== String(id).trim()) {
    return res.status(400).json({
      success: false,
      message: 'Invalid task ID format.',
    });
  }

  next();
};

module.exports = validateObjectId;

