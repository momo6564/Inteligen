const mongoose = require('mongoose');

const machineSchema = new mongoose.Schema({
  name: String,
  description: String,
  manufacturer: String,
  yearOfManufacture: String,
  specifications: String
});

const businessSchema = new mongoose.Schema({
  corporateId: {
    type: String,
    required: true,
    unique: true,
    index: true // Adding index for better query performance
  },
  name: {
    type: String,
    required: true,
    index: true // Adding index for search functionality
  },
  phone: {
    type: String,
    default: 'N/A'
  },
  website: {
    type: String,
    default: 'N/A'
  },
  // Additional scraped fields
  contactPerson: {
    type: String,
    default: 'N/A'
  },
  memberClass: {
    type: String,
    default: 'N/A'
  },
  designation: {
    type: String,
    default: 'N/A'
  },
  category: {
    type: String,
    default: 'N/A'
  },
  address: {
    type: String,
    default: 'N/A'
  },
  mobile: {
    type: String,
    default: 'N/A'
  },
  email: {
    type: String,
    default: 'N/A'
  },
  description: String,
  businessType: String,
  location: String,
  isOpen: {
    type: Boolean,
    default: true
  },
  openToNewBusiness: {
    type: Boolean,
    default: true
  },
  machinery: [machineSchema]
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Create index for location-based queries
businessSchema.index({ location: '2dsphere' });

// Add text index for search functionality
businessSchema.index({ 
  name: 'text', 
  corporateId: 'text',
  category: 'text',
  contactPerson: 'text'
});

const Business = mongoose.model('Business', businessSchema);

module.exports = Business; 