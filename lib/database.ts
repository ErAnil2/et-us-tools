import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const dbPath = path.join(process.cwd(), 'data');
const usersFile = path.join(dbPath, 'users.json');
const seoContentFile = path.join(dbPath, 'seo-content.json');
const analyticsFile = path.join(dbPath, 'analytics.json');
const contentFile = path.join(dbPath, 'content.json');
const pagesFile = path.join(dbPath, 'pages.json');
const bannersFile = path.join(dbPath, 'banners.json');
const globalScriptsFile = path.join(dbPath, 'global-scripts.json');
const calculatorFaqsFile = path.join(dbPath, 'calculator-faqs.json');

// Types
export interface BannerConfig {
  id: string;
  name: string;
  dimensions: string;
  enabled: boolean;
  script: string;
  fallbackAd: {
    text: string;
    width: number;
    height: number;
  };
  placement: string;
  createdAt: string;
  updatedAt: string;
}

export interface GlobalScripts {
  headScripts: {
    enabled: boolean;
    content: string;
  };
  bodyScripts: {
    enabled: boolean;
    content: string;
  };
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
}

export interface CalculatorFAQs {
  calculatorId: string;
  calculatorName: string;
  calculatorPath: string;
  isActive: boolean;
  lastUpdated: string;
  updatedBy: string;
  faqs: FAQ[];
}

// Ensure data directory and files exist
export function initDatabase() {
  if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(dbPath, { recursive: true });
  }

  // Initialize users file
  if (!fs.existsSync(usersFile)) {
    const adminPassword = process.env.ADMIN_PASSWORD || 'changeme123!';
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const hashedPassword = bcrypt.hashSync(adminPassword, 12);
    const users = [{
      id: 1,
      username: adminUsername,
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date().toISOString()
    }];
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
  }

  // Initialize other files with defaults
  if (!fs.existsSync(seoContentFile)) {
    fs.writeFileSync(seoContentFile, JSON.stringify({}, null, 2));
  }

  if (!fs.existsSync(analyticsFile)) {
    const initialAnalytics = {
      pageViews: {},
      dailyStats: {},
      popularCalculators: {},
      totalVisits: 0,
      createdAt: new Date().toISOString()
    };
    fs.writeFileSync(analyticsFile, JSON.stringify(initialAnalytics, null, 2));
  }

  if (!fs.existsSync(contentFile)) {
    const initialContent = {
      announcements: [],
      featuredCalculators: [],
      siteSettings: {
        siteName: "The Economic Times",
        tagline: "Free premium calculators backed by India's leading business newspaper!",
        adminEmail: "admin@economictimes.com"
      },
      createdAt: new Date().toISOString()
    };
    fs.writeFileSync(contentFile, JSON.stringify(initialContent, null, 2));
  }

  if (!fs.existsSync(pagesFile)) {
    fs.writeFileSync(pagesFile, JSON.stringify({}, null, 2));
  }

  // Initialize banners
  if (!fs.existsSync(bannersFile)) {
    const initialBanners = {
      topBanner: {
        id: 'topBanner',
        name: 'Top Header Banner',
        dimensions: '728x90',
        enabled: false,
        script: '',
        fallbackAd: { text: 'Advertisement', width: 728, height: 90 },
        placement: 'top-header',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      leftSkinBanner: {
        id: 'leftSkinBanner',
        name: 'Left Skin Banner',
        dimensions: '160x600',
        enabled: false,
        script: '',
        fallbackAd: { text: 'Advertisement', width: 160, height: 600 },
        placement: 'left-sidebar',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      rightSkinBanner: {
        id: 'rightSkinBanner',
        name: 'Right Skin Banner',
        dimensions: '160x600',
        enabled: false,
        script: '',
        fallbackAd: { text: 'Advertisement', width: 160, height: 600 },
        placement: 'right-sidebar',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      footerBanner: {
        id: 'footerBanner',
        name: 'Footer Banner',
        dimensions: '728x90',
        enabled: false,
        script: '',
        fallbackAd: { text: 'Advertisement', width: 728, height: 90 },
        placement: 'footer',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      banner1: {
        id: 'banner1',
        name: 'MREC Banner 1',
        dimensions: '300x250',
        enabled: false,
        script: '',
        fallbackAd: { text: 'Advertisement', width: 300, height: 250 },
        placement: 'content-mrec-1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      banner2: {
        id: 'banner2',
        name: 'MREC Banner 2',
        dimensions: '300x250',
        enabled: false,
        script: '',
        fallbackAd: { text: 'Advertisement', width: 300, height: 250 },
        placement: 'content-mrec-2',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };
    fs.writeFileSync(bannersFile, JSON.stringify(initialBanners, null, 2));
  }

  // Initialize global scripts
  if (!fs.existsSync(globalScriptsFile)) {
    const initialGlobalScripts = {
      headScripts: {
        enabled: false,
        content: "",
        description: "Scripts for <head> tag",
        lastUpdated: new Date().toISOString()
      },
      bodyScripts: {
        enabled: false,
        content: "",
        description: "Scripts for end of <body> tag",
        lastUpdated: new Date().toISOString()
      },
      createdAt: new Date().toISOString()
    };
    fs.writeFileSync(globalScriptsFile, JSON.stringify(initialGlobalScripts, null, 2));
  }

  // Initialize calculator FAQs
  if (!fs.existsSync(calculatorFaqsFile)) {
    fs.writeFileSync(calculatorFaqsFile, JSON.stringify({}, null, 2));
  }
}

// Banner functions
export function getBannerData(bannerId: string): BannerConfig | null {
  try {
    const banners = JSON.parse(fs.readFileSync(bannersFile, 'utf8'));
    return banners[bannerId] || null;
  } catch (error) {
    console.error('Error reading banner data:', error);
    return null;
  }
}

export function getAllBanners(): Record<string, BannerConfig> {
  try {
    return JSON.parse(fs.readFileSync(bannersFile, 'utf8'));
  } catch (error) {
    console.error('Error reading banners:', error);
    return {};
  }
}

export function updateBanner(bannerId: string, data: Partial<BannerConfig>): boolean {
  try {
    const banners = getAllBanners();
    if (!banners[bannerId]) return false;
    
    banners[bannerId] = {
      ...banners[bannerId],
      ...data,
      updatedAt: new Date().toISOString()
    };
    fs.writeFileSync(bannersFile, JSON.stringify(banners, null, 2));
    return true;
  } catch (error) {
    console.error('Error updating banner:', error);
    return false;
  }
}

// Global scripts functions
export function getActiveGlobalScripts(): GlobalScripts {
  try {
    const scripts = JSON.parse(fs.readFileSync(globalScriptsFile, 'utf8'));
    return {
      headScripts: scripts.headScripts?.enabled ? scripts.headScripts : { enabled: false, content: '' },
      bodyScripts: scripts.bodyScripts?.enabled ? scripts.bodyScripts : { enabled: false, content: '' }
    };
  } catch (error) {
    console.error('Error reading global scripts:', error);
    return {
      headScripts: { enabled: false, content: '' },
      bodyScripts: { enabled: false, content: '' }
    };
  }
}

// Content functions
export function getSiteSettings() {
  try {
    const content = JSON.parse(fs.readFileSync(contentFile, 'utf8'));
    return content.siteSettings || {
      siteName: "The Economic Times",
      tagline: "Free premium calculators",
      adminEmail: "admin@economictimes.com"
    };
  } catch (error) {
    console.error('Error reading site settings:', error);
    return {
      siteName: "The Economic Times",
      tagline: "Free premium calculators",
      adminEmail: "admin@economictimes.com"
    };
  }
}

// Calculator FAQ functions
export function getAllCalculatorFAQs(): Record<string, CalculatorFAQs> {
  try {
    return JSON.parse(fs.readFileSync(calculatorFaqsFile, 'utf8'));
  } catch (error) {
    console.error('Error reading calculator FAQs:', error);
    return {};
  }
}

export function getCalculatorFAQs(calculatorId: string): CalculatorFAQs | null {
  try {
    const allFaqs = getAllCalculatorFAQs();
    return allFaqs[calculatorId] || null;
  } catch (error) {
    console.error('Error reading calculator FAQs:', error);
    return null;
  }
}

export function getActiveFAQsForCalculator(calculatorId: string): FAQ[] {
  try {
    const calculatorData = getCalculatorFAQs(calculatorId);
    if (!calculatorData || !calculatorData.isActive) {
      return [];
    }
    return calculatorData.faqs.sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error('Error getting FAQs for calculator:', error);
    return [];
  }
}

export function updateCalculatorFAQs(calculatorId: string, data: Partial<CalculatorFAQs>): boolean {
  try {
    const allFaqs = getAllCalculatorFAQs();

    if (allFaqs[calculatorId]) {
      // Update existing
      allFaqs[calculatorId] = {
        ...allFaqs[calculatorId],
        ...data,
        lastUpdated: new Date().toISOString()
      };
    } else {
      // Create new
      allFaqs[calculatorId] = {
        calculatorId,
        calculatorName: data.calculatorName || calculatorId,
        calculatorPath: data.calculatorPath || `/us/tools/calculators/${calculatorId}`,
        isActive: data.isActive ?? true,
        lastUpdated: new Date().toISOString(),
        updatedBy: data.updatedBy || 'admin',
        faqs: data.faqs || []
      };
    }

    fs.writeFileSync(calculatorFaqsFile, JSON.stringify(allFaqs, null, 2));
    return true;
  } catch (error) {
    console.error('Error updating calculator FAQs:', error);
    return false;
  }
}

export function deleteCalculatorFAQs(calculatorId: string): boolean {
  try {
    const allFaqs = getAllCalculatorFAQs();
    if (!allFaqs[calculatorId]) return false;

    delete allFaqs[calculatorId];
    fs.writeFileSync(calculatorFaqsFile, JSON.stringify(allFaqs, null, 2));
    return true;
  } catch (error) {
    console.error('Error deleting calculator FAQs:', error);
    return false;
  }
}

export function addFAQToCalculator(calculatorId: string, faq: Omit<FAQ, 'id'>): boolean {
  try {
    const calculatorData = getCalculatorFAQs(calculatorId);
    if (!calculatorData) return false;

    const newFaq: FAQ = {
      ...faq,
      id: `${calculatorId.substring(0, 3)}-${Date.now()}`
    };

    calculatorData.faqs.push(newFaq);
    return updateCalculatorFAQs(calculatorId, calculatorData);
  } catch (error) {
    console.error('Error adding FAQ:', error);
    return false;
  }
}

export function updateFAQInCalculator(calculatorId: string, faqId: string, updates: Partial<FAQ>): boolean {
  try {
    const calculatorData = getCalculatorFAQs(calculatorId);
    if (!calculatorData) return false;

    const faqIndex = calculatorData.faqs.findIndex(f => f.id === faqId);
    if (faqIndex === -1) return false;

    calculatorData.faqs[faqIndex] = {
      ...calculatorData.faqs[faqIndex],
      ...updates
    };

    return updateCalculatorFAQs(calculatorId, calculatorData);
  } catch (error) {
    console.error('Error updating FAQ:', error);
    return false;
  }
}

export function deleteFAQFromCalculator(calculatorId: string, faqId: string): boolean {
  try {
    const calculatorData = getCalculatorFAQs(calculatorId);
    if (!calculatorData) return false;

    calculatorData.faqs = calculatorData.faqs.filter(f => f.id !== faqId);
    return updateCalculatorFAQs(calculatorId, calculatorData);
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    return false;
  }
}

// Initialize database on module load
initDatabase();
