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
    index: true, // Adding index for search functionality
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  // Additional scraped fields
  contactPerson: {
    type: String,
    trim: true
  },
  memberClass: {
    type: String,
    default: 'N/A'
  },
  designation: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  mobile: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  description: {
    type: String,
    trim: true
  },
  businessType: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  isOpen: {
    type: Boolean,
    default: true
  },
  openToNewBusiness: {
    type: Boolean,
    default: true
  },
  hasPublicPresence: {
    type: Boolean,
    default: false
  },
  links: [{
    type: String,
    trim: true
  }],
  machinery: [machineSchema],
  // Add social media fields
  socialMedia: {
    instagram: {
      type: String,
      trim: true
    },
    facebook: {
      type: String,
      trim: true
    },
    linkedin: {
      type: String,
      trim: true
    },
    twitter: {
      type: String,
      trim: true
    }
  },
  // First search result info
  searchResult: {
    url: {
      type: String,
      trim: true
    },
    title: {
      type: String,
      trim: true
    },
    snippet: {
      type: String,
      trim: true
    }
  },
  // Detected category from search
  detectedCategory: {
    type: String,
    trim: true
  },
  // Track scraping status
  scrapingStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  lastScraped: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
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

// Update the updatedAt timestamp before saving
businessSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Business = mongoose.model('Business', businessSchema);

module.exports = Business; 