const Business = require('../models/Business');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Simple placeholder upload function that doesn't require multer
const uploadImage = async (req, res) => {
  try {
    const { businessId } = req.params;
    const { type } = req.body || {}; // 'logo' or 'cover'
    
    // Use placeholder image URLs based on type
    const imageUrl = type === 'logo' 
      ? 'https://via.placeholder.com/150'
      : 'https://via.placeholder.com/1200x300';
    
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
    console.error('Error handling image:', error);
    res.status(500).json({ message: 'Error handling image' });
  }
};

module.exports = {
  uploadImage
}; 