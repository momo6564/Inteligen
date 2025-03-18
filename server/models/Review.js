const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  reviewerName: {
    type: String,
    required: true
  },
  reviewerEmail: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a compound index for efficient querying
reviewSchema.index({ businessId: 1, createdAt: -1 });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review; 