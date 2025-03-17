const express = require('express');
const router = express.Router();
const {
  getBusinesses,
  getBusiness,
  createBusiness,
  updateBusiness,
  deleteBusiness
} = require('../controllers/businessController');

// Get all businesses with pagination
router.get('/', getBusinesses);

// Get a single business
router.get('/:id', getBusiness);

// Create a new business
router.post('/', createBusiness);

// Update a business
router.put('/:id', updateBusiness);

// Delete a business
router.delete('/:id', deleteBusiness);

module.exports = router; 