const Business = require('../models/business');
const { searchSocialMedia } = require('../utils/socialMediaScraper');

// Get businesses with pagination
const getBusinesses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const showScrapedOnly = req.query.scrapedOnly === 'true';

    console.log(`Fetching page ${page} with limit ${limit}, skip ${skip}`);
    console.log('Show scraped only:', showScrapedOnly);

    // Query for businesses with scraped data
    const query = showScrapedOnly ? {
      contactPerson: { $exists: true, $ne: 'N/A' }
    } : {};

    // Sort to show scraped businesses first
    const sort = showScrapedOnly ? {} : {
      'contactPerson': -1  // Put non-N/A values first
    };

    const [businesses, total] = await Promise.all([
      Business.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean()
        .select('corporateId name phone website contactPerson memberClass designation category address mobile email'),
      Business.countDocuments(query)
    ]);

    console.log(`Found ${businesses.length} businesses out of ${total} total`);

    res.json({
      businesses,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalBusinesses: total
    });
  } catch (error) {
    console.error('Error in getBusinesses:', error);
    res.status(500).json({ 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Get a single business
const getBusiness = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }
    res.json(business);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new business
const createBusiness = async (req, res) => {
  try {
    const business = new Business(req.body);
    await business.save();
    res.status(201).json(business);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Bulk import businesses
const bulkImportBusinesses = async (req, res) => {
  try {
    const { businesses } = req.body;

    if (!Array.isArray(businesses)) {
      return res.status(400).json({ message: 'Businesses data must be an array' });
    }

    // Transform the data to match new schema
    const transformedBusinesses = businesses.map(business => ({
      corporateId: business['tablescraper-selected-row'] || 'N/A',
      name: business['tablescraper-selected-row 2'] || 'Unknown Business',
      phone: business['tablescraper-selected-row 3'] || 'N/A',
      website: business['tablescraper-selected-row href'] || 'N/A'
    }));

    // Insert all businesses
    const result = await Business.insertMany(transformedBusinesses);

    res.status(201).json({
      message: `Successfully imported ${result.length} businesses`,
      businesses: result
    });
  } catch (error) {
    console.error('Bulk import error:', error);
    res.status(500).json({ message: 'Error importing businesses', error: error.message });
  }
};

// Update a business
const updateBusiness = async (req, res) => {
  try {
    const business = await Business.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }
    res.json(business);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a business
const deleteBusiness = async (req, res) => {
  try {
    const business = await Business.findByIdAndDelete(req.params.id);
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }
    res.json({ message: 'Business deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Scrape social media for a business
const scrapeSocialMedia = async (req, res) => {
  try {
    const { id } = req.params;
    const business = await Business.findById(id);
    
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    // Start scraping
    console.log(`Starting social media scrape for ${business.name}`);
    business.scrapingStatus = 'pending';
    await business.save();

    const socialMediaResults = await searchSocialMedia(business.name);
    
    // Update business with social media results
    business.socialMedia = {
      instagram: socialMediaResults.instagram,
      facebook: socialMediaResults.facebook,
      linkedin: socialMediaResults.linkedin,
      twitter: socialMediaResults.twitter
    };
    business.website = socialMediaResults.website || business.website;
    
    // Update search result and category
    if (socialMediaResults.firstResult) {
      business.searchResult = {
        url: socialMediaResults.firstResult.url,
        title: socialMediaResults.firstResult.title,
        snippet: socialMediaResults.firstResult.snippet
      };
    }
    
    if (socialMediaResults.category) {
      business.detectedCategory = socialMediaResults.category;
    }
    
    business.scrapingStatus = 'completed';
    business.lastScraped = new Date();
    
    await business.save();

    res.json({
      message: 'Social media scraping completed',
      business
    });
  } catch (error) {
    console.error('Error in scrapeSocialMedia:', error);
    
    // Update business status to failed if it exists
    if (req.params.id) {
      try {
        const business = await Business.findById(req.params.id);
        if (business) {
          business.scrapingStatus = 'failed';
          await business.save();
        }
      } catch (err) {
        console.error('Error updating business status:', err);
      }
    }
    
    res.status(500).json({ 
      message: 'Error scraping social media',
      error: error.message 
    });
  }
};

module.exports = {
  getBusinesses,
  getBusiness,
  createBusiness,
  updateBusiness,
  deleteBusiness,
  bulkImportBusinesses,
  scrapeSocialMedia
}; 