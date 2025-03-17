const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true,
    index: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true
  },
  reviewerName: {
    type: String,
    required: true,
    trim: true
  },
  reviewerEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  }
}, {
  timestamps: true
});

// Add compound index for efficient querying
reviewSchema.index({ businessId: 1, createdAt: -1 });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review; 