const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const businessSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  corporateId: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    trim: true
  },
  address: {
    type: Schema.Types.Mixed,
    default: {}
  },
  phone: {
    type: String,
    trim: true
  },
  mobile: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  contactPerson: {
    type: String,
    trim: true
  },
  designation: {
    type: String,
    trim: true
  },
  memberClass: {
    type: String,
    trim: true
  },
  contact: {
    phone: { type: String, trim: true },
    email: { type: String, trim: true },
    website: { type: String, trim: true }
  },
  hours: {
    type: Schema.Types.Mixed,
    default: {}
  },
  images: {
    type: [String],
    default: []
  },
  logo: {
    type: String
  },
  coverPhoto: {
    type: String
  },
  rating: {
    type: Number,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  scrapingStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  socialMedia: {
    instagram: { type: String, trim: true },
    facebook: { type: String, trim: true },
    linkedin: { type: String, trim: true },
    twitter: { type: String, trim: true }
  }
}, { timestamps: true });

businessSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'businessId'
});

// Set to enable virtual fields in toJSON
businessSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Business', businessSchema);