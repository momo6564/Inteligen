const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  corporateId: {
    type: String,
    default: 'N/A'
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Restaurant', 'Retail', 'Service', 'Entertainment', 'Other']
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  contact: {
    phone: String,
    email: String,
    website: String
  },
  phone: {
    type: String,
    default: 'N/A'
  },
  website: {
    type: String,
    default: 'N/A'
  },
  contactPerson: {
    type: String,
    default: 'N/A'
  },
  memberClass: String,
  designation: String,
  mobile: String,
  email: String,
  hours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String }
  },
  images: [{
    type: String
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }],
  socialMedia: {
    instagram: String,
    facebook: String,
    linkedin: String,
    twitter: String
  },
  searchResult: {
    url: String,
    title: String,
    snippet: String
  },
  detectedCategory: String,
  scrapingStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  lastScraped: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
businessSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Business = mongoose.model('Business', businessSchema);

module.exports = Business; 