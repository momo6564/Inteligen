const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

// Connection URLs
const ATLAS_URI = 'mongodb+srv://momo6561:Ncuyz8esF7hw5Vs@sayrab.7hfx9.mongodb.net/business-directory?retryWrites=true&w=majority&appName=Sayrab';
const INPUT_DIR = path.join(__dirname, '../../db_backup');

async function importData() {
  console.log('Starting data import to MongoDB Atlas...');
  let atlasClient;

  try {
    // Check if backup directory exists
    if (!fs.existsSync(INPUT_DIR)) {
      throw new Error(`Backup directory not found: ${INPUT_DIR}`);
    }

    // Get all JSON files in the backup directory
    const files = fs.readdirSync(INPUT_DIR).filter(file => file.endsWith('.json'));
    
    if (files.length === 0) {
      throw new Error('No JSON files found in backup directory. Run exportData.js first.');
    }

    // Connect to MongoDB Atlas
    console.log('Connecting to MongoDB Atlas...');
    atlasClient = new MongoClient(ATLAS_URI);
    await atlasClient.connect();
    console.log('Connected to MongoDB Atlas');

    const atlasDb = atlasClient.db();
    
    // Import each collection
    for (const file of files) {
      const collectionName = path.basename(file, '.json');
      console.log(`Importing collection: ${collectionName}`);
      
      // Read data from JSON file
      const filePath = path.join(INPUT_DIR, file);
      const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      if (jsonData.length === 0) {
        console.log(`Skipping empty collection: ${collectionName}`);
        continue;
      }

      // Drop existing collection if it exists
      try {
        await atlasDb.collection(collectionName).drop();
        console.log(`Dropped existing collection: ${collectionName}`);
      } catch (err) {
        // Collection doesn't exist, which is fine
      }
      
      // Insert documents
      const result = await atlasDb.collection(collectionName).insertMany(jsonData);
      console.log(`Imported ${result.insertedCount} documents to ${collectionName}`);
    }

    console.log('\nImport completed successfully!');
    console.log('Your data has been imported to MongoDB Atlas.');

  } catch (error) {
    console.error('Import failed:', error);
  } finally {
    if (atlasClient) {
      await atlasClient.close();
      console.log('Disconnected from MongoDB Atlas');
    }
  }
}

importData(); 