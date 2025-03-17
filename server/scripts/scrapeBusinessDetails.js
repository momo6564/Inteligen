require('dotenv').config();
const mongoose = require('mongoose');
const puppeteer = require('puppeteer');
const Business = require('../models/business');

async function scrapeBusinessDetails() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/business-directory');
    console.log('Connected to MongoDB');

    // Launch browser
    const browser = await puppeteer.launch({
      headless: "new",
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu'
      ]
    });

    // Get all businesses
    const businesses = await Business.find({
      website: { $regex: /scci\.com\.pk\/member-detail/ },
      // Only get businesses that don't have additional details yet
      $or: [
        { contactPerson: { $exists: false } },
        { contactPerson: 'N/A' },
        { category: { $exists: false } },
        { category: 'N/A' }
      ]
    }).lean();

    console.log(`Found ${businesses.length} businesses to scrape`);

    let successCount = 0;
    let errorCount = 0;
    let currentBatch = 1;
    const batchSize = 100;
    const totalBatches = Math.ceil(businesses.length / batchSize);

    for (const business of businesses) {
      try {
        console.log(`\nProcessing business ${successCount + errorCount + 1} of ${businesses.length}`);
        console.log(`Batch ${currentBatch} of ${totalBatches}`);
        console.log(`Business: ${business.name} (${business.website})`);
        
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(30000);
        await page.setRequestInterception(true);

        // Block images and other unnecessary resources
        page.on('request', (request) => {
          if (['image', 'stylesheet', 'font', 'script'].includes(request.resourceType())) {
            request.abort();
          } else {
            request.continue();
          }
        });

        try {
          await page.goto(business.website, { 
            waitUntil: 'networkidle0',
            timeout: 30000
          });
        } catch (error) {
          console.error(`Failed to load page for ${business.name}:`, error.message);
          await page.close();
          errorCount++;
          continue;
        }

        // Extract business details
        const details = await page.evaluate(() => {
          const getTextContent = (label) => {
            const element = Array.from(document.querySelectorAll('td')).find(td => 
              td.textContent.trim().toLowerCase().includes(label.toLowerCase())
            );
            return element ? element.nextElementSibling?.textContent.trim() : null;
          };

          return {
            contactPerson: getTextContent('Contact Person'),
            companyName: getTextContent('Company Name'),
            memberClass: getTextContent('Member Class'),
            memberId: getTextContent('Member ID'),
            designation: getTextContent('Designation'),
            category: getTextContent('Category'),
            address: getTextContent('Address'),
            phone: getTextContent('Phone'),
            mobile: getTextContent('Mobile'),
            email: getTextContent('Email')
          };
        });

        // Update business in database
        await Business.updateOne(
          { _id: business._id },
          { 
            $set: {
              contactPerson: details.contactPerson || 'N/A',
              memberClass: details.memberClass || 'N/A',
              designation: details.designation || 'N/A',
              category: details.category || 'N/A',
              address: details.address || 'N/A',
              mobile: details.mobile || 'N/A',
              email: details.email || 'N/A',
              phone: details.phone || business.phone || 'N/A'
            }
          }
        );

        console.log(`Successfully updated ${business.name}`);
        successCount++;

        if ((successCount + errorCount) % batchSize === 0) {
          currentBatch++;
          console.log('\nBatch completed. Waiting 5 seconds before next batch...');
          await new Promise(resolve => setTimeout(resolve, 5000));
        } else {
          // Wait between requests to avoid overwhelming the server
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        await page.close();
      } catch (error) {
        console.error(`Error processing business ${business.name}:`, error);
        errorCount++;
      }
    }

    console.log('\nScraping completed:');
    console.log(`Successfully scraped: ${successCount} businesses`);
    console.log(`Failed to scrape: ${errorCount} businesses`);

    await browser.close();
  } catch (error) {
    console.error('Scraping failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

scrapeBusinessDetails(); 