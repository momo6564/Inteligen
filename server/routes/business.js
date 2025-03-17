const express = require('express');
const router = express.Router();
const {
  getBusinesses,
  getBusiness,
  createBusiness,
  updateBusiness,
  deleteBusiness,
  bulkImportBusinesses
} = require('../controllers/businessController');

// ... existing routes ...

// Bulk import businesses
router.post('/bulk', bulkImportBusinesses);

module.exports = router; 