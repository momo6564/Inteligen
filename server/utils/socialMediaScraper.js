const axios = require('axios');
const cheerio = require('cheerio');

const searchSocialMedia = async (businessName) => {
  try {
    // Search for business on LinkedIn
    const linkedinUrl = `https://www.linkedin.com/search/results/companies/?keywords=${encodeURIComponent(businessName)}`;
    const linkedinResponse = await axios.get(linkedinUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const $ = cheerio.load(linkedinResponse.data);
    const linkedinData = {
      companyName: $('.entity-result__title-text').first().text().trim(),
      description: $('.entity-result__primary-subtitle').first().text().trim(),
      location: $('.entity-result__secondary-subtitle').first().text().trim()
    };

    // Search for business on Instagram
    const instagramUrl = `https://www.instagram.com/${encodeURIComponent(businessName.toLowerCase().replace(/\s+/g, ''))}`;
    const instagramResponse = await axios.get(instagramUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const instagram$ = cheerio.load(instagramResponse.data);
    const instagramData = {
      followers: instagram$('meta[property="og:description"]').attr('content'),
      profilePic: instagram$('meta[property="og:image"]').attr('content')
    };

    return {
      linkedin: linkedinData,
      instagram: instagramData
    };
  } catch (error) {
    console.error('Error in social media scraping:', error);
    return {
      linkedin: null,
      instagram: null,
      error: error.message
    };
  }
};

module.exports = {
  searchSocialMedia
}; 