require('dotenv').config();
const mongoose = require('mongoose');
const Business = require('../models/Business');

async function migrateData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/business-directory');
    console.log('Connected to MongoDB');

    // Get all businesses with old schema
    const businesses = await mongoose.connection.collection('businesses').find({}).toArray();
    console.log(`Found ${businesses.length} businesses to migrate`);

    // Update each business
    let successCount = 0;
    let errorCount = 0;

    for (const business of businesses) {
      try {
        const updatedBusiness = {
          corporateId: business['tablescraper-selected-row'] || 'N/A',
          name: business['tablescraper-selected-row 2'] || 'Unknown Business',
          phone: business['tablescraper-selected-row 3'] || 'N/A',
          website: business['tablescraper-selected-row href'] || 'N/A'
        };

        await mongoose.connection.collection('businesses').updateOne(
          { _id: business._id },
          { 
            $set: updatedBusiness,
            $unset: {
              'tablescraper-selected-row': "",
              'tablescraper-selected-row 2': "",
              'tablescraper-selected-row 3': "",
              'tablescraper-selected-row href': ""
            }
          }
        );
        successCount++;

        if (successCount % 1000 === 0) {
          console.log(`Migrated ${successCount} businesses`);
        }
      } catch (error) {
        console.error(`Error migrating business ${business._id}:`, error);
        errorCount++;
      }
    }

    console.log('\nMigration completed:');
    console.log(`Successfully migrated: ${successCount} businesses`);
    console.log(`Failed to migrate: ${errorCount} businesses`);

  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

migrateData(); 