const mongoose = require('mongoose');
const Business = require('../models/business');
const { searchSocialMedia } = require('../utils/socialMediaScraper');
require('dotenv').config();

async function updateBusinessLinks() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/business-directory');
    console.log('Connected to MongoDB');

    // Get all businesses that have been scraped (have contactPerson)
    const businesses = await Business.find({
      contactPerson: { $exists: true, $ne: 'N/A' }
    });

    console.log(`Found ${businesses.length} businesses to update`);

    // Update each business
    for (const business of businesses) {
      try {
        console.log(`Processing ${business.name}...`);
        
        // Search for social media links
        const results = await searchSocialMedia(business.name);

        // Update business record
        business.links = results.links;
        business.hasPublicPresence = results.hasPublicPresence;
        business.scrapingStatus = 'completed';
        business.lastScraped = new Date();

        await business.save();
        console.log(`Updated ${business.name}`);
        console.log('Links found:', results.links);
        console.log('-------------------');

        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Error updating ${business.name}:`, error);
        continue;
      }
    }

    console.log('Finished updating all businesses');
    process.exit(0);
  } catch (error) {
    console.error('Script error:', error);
    process.exit(1);
  }
}

updateBusinessLinks(); 