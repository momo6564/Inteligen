const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

// Connection URLs
const LOCAL_URI = 'mongodb://localhost:27017/business-directory';
const OUTPUT_DIR = path.join(__dirname, '../../db_backup');

async function exportData() {
  console.log('Starting data export...');
  let localClient;

  try {
    // Create output directory if it doesn't exist
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    // Connect to local MongoDB
    console.log('Connecting to local MongoDB...');
    localClient = new MongoClient(LOCAL_URI);
    await localClient.connect();
    console.log('Connected to local MongoDB');

    const localDb = localClient.db();
    
    // Get all collections
    const collections = await localDb.listCollections().toArray();
    
    // Export each collection
    for (const collection of collections) {
      const collectionName = collection.name;
      console.log(`Exporting collection: ${collectionName}`);
      
      // Get all documents from the collection
      const docs = await localDb.collection(collectionName).find({}).toArray();
      
      // Save to JSON file
      const outputPath = path.join(OUTPUT_DIR, `${collectionName}.json`);
      fs.writeFileSync(outputPath, JSON.stringify(docs, null, 2));
      
      console.log(`Exported ${docs.length} documents to ${outputPath}`);
    }

    console.log('Export completed successfully!');
    console.log(`Data exported to: ${OUTPUT_DIR}`);
    console.log('\nNext steps:');
    console.log('1. Run the importData.js script to import this data to MongoDB Atlas');
    console.log('2. Update your application to use the MongoDB Atlas connection string');

  } catch (error) {
    console.error('Export failed:', error);
  } finally {
    if (localClient) {
      await localClient.close();
      console.log('Disconnected from MongoDB');
    }
  }
}

exportData(); 