const express = require('express');
const router = express.Router();
const {
  getBusinesses,
  getBusiness,
  createBusiness,
  updateBusiness,
  deleteBusiness,
  bulkImportBusinesses,
  scrapeSocialMedia
} = require('../controllers/businessController');

// Bulk import route
router.post('/bulk', bulkImportBusinesses);

// Get all businesses and create a new business
router.route('/')
  .get(getBusinesses)
  .post(createBusiness);

// Get, update, and delete a specific business
router.route('/:id')
  .get(getBusiness)
  .put(updateBusiness)
  .delete(deleteBusiness);

// Social media scraping route
router.post('/:id/scrape-social', scrapeSocialMedia);

module.exports = router; 