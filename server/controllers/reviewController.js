const { Review, Business } = require('../models');

// Get reviews for a business
const getBusinessReviews = async (req, res) => {
  try {
    const { businessId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      Review.find({ businessId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Review.countDocuments({ businessId })
    ]);

    // Calculate average rating
    const avgRating = await Review.aggregate([
      { $match: { businessId: businessId } },
      { $group: { _id: null, average: { $avg: "$rating" } } }
    ]);

    res.json({
      reviews,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalReviews: total,
      averageRating: avgRating[0]?.average || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new review
const createReview = async (req, res) => {
  try {
    const { businessId } = req.params;
    const { rating, comment, reviewerName, reviewerEmail } = req.body;

    // Validate business exists
    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    // Create review
    const review = new Review({
      businessId,
      rating,
      comment,
      reviewerName,
      reviewerEmail
    });

    const savedReview = await review.save();

    res.status(201).json(savedReview);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get review statistics for a business
const getReviewStats = async (req, res) => {
  try {
    const { businessId } = req.params;

    const stats = await Review.aggregate([
      { $match: { businessId: businessId } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
          ratingDistribution: {
            $push: "$rating"
          }
        }
      }
    ]);

    if (stats.length === 0) {
      return res.json({
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: {
          1: 0, 2: 0, 3: 0, 4: 0, 5: 0
        }
      });
    }

    // Calculate rating distribution
    const distribution = stats[0].ratingDistribution.reduce((acc, rating) => {
      acc[rating] = (acc[rating] || 0) + 1;
      return acc;
    }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });

    res.json({
      averageRating: stats[0].averageRating,
      totalReviews: stats[0].totalReviews,
      ratingDistribution: distribution
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBusinessReviews,
  createReview,
  getReviewStats
}; 