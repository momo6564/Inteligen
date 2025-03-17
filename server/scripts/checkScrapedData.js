require('dotenv').config();
const mongoose = require('mongoose');
const Business = require('../models/business');

async function checkScrapedData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/business-directory');
    console.log('Connected to MongoDB');

    // Count total businesses
    const totalCount = await Business.countDocuments();
    console.log(`Total businesses in database: ${totalCount}`);

    // Count businesses with scraped data
    const scrapedCount = await Business.countDocuments({
      contactPerson: { $exists: true, $ne: 'N/A' }
    });
    console.log(`Businesses with contact person info: ${scrapedCount}`);

    // Get a sample of scraped businesses
    const scrapedBusinesses = await Business.find({
      contactPerson: { $exists: true, $ne: 'N/A' }
    })
    .limit(5)
    .select('name corporateId contactPerson category address');

    console.log('\nSample of scraped businesses:');
    scrapedBusinesses.forEach(business => {
      console.log('\n-------------------');
      console.log(`Name: ${business.name}`);
      console.log(`ID: ${business.corporateId}`);
      console.log(`Contact: ${business.contactPerson}`);
      console.log(`Category: ${business.category}`);
      console.log(`Address: ${business.address}`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

checkScrapedData(); 