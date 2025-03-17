const puppeteer = require('puppeteer');
const { execSync } = require('child_process');

function findChrome() {
  const defaultPaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  ];

  for (const path of defaultPaths) {
    try {
      execSync(`"${path}" --version`);
      return path;
    } catch (e) {
      continue;
    }
  }

  return null;
}

async function searchSocialMedia(businessName) {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(30000);
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    // Simple search query
    const searchQuery = `${businessName} sialkot pakistan`;
    await page.goto(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, {
      waitUntil: 'networkidle0'
    });

    // Get first 3 links
    const links = await page.evaluate(() => {
      const allLinks = Array.from(document.querySelectorAll('div.g a'));
      return allLinks
        .map(link => link.href)
        .filter(href => 
          href && 
          href.startsWith('http') && 
          !href.includes('google.com/') &&
          !href.includes('search?') &&
          !href.includes('cache:')
        )
        .slice(0, 3);
    });

    return {
      links,
      hasPublicPresence: links.length > 0
    };

  } catch (error) {
    console.error(`Error searching for ${businessName}:`, error);
    return {
      links: [],
      hasPublicPresence: false
    };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

module.exports = { searchSocialMedia }; 