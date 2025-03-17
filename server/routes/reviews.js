const express = require('express');
const router = express.Router();
const {
  getBusinessReviews,
  createReview,
  getReviewStats
} = require('../controllers/reviewController');

// Get reviews and create review for a business
router.route('/business/:businessId')
  .get(getBusinessReviews)
  .post(createReview);

// Get review statistics for a business
router.get('/business/:businessId/stats', getReviewStats);

module.exports = router; 