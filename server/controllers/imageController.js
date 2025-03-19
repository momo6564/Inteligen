const Business = require('../models/Business');
const multer = require('multer');
const path = require('path');

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }
});

const uploadImage = async (req, res) => {
  try {
    const { businessId } = req.params;
    const { type } = req.body; // 'logo' or 'cover'
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const imageUrl = `/uploads/${file.filename}`;
    
    const updateData = type === 'logo' 
      ? { logo: imageUrl }
      : { coverPhoto: imageUrl };

    const business = await Business.findByIdAndUpdate(
      businessId,
      { $set: updateData },
      { new: true }
    );

    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    res.json(business);
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Error uploading image' });
  }
};

module.exports = {
  upload,
  uploadImage
}; 