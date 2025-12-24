/**
 * JSON-based SEO Data Management
 * Reads/writes SEO data from/to the local JSON file
 */

import fs from 'fs';
import path from 'path';

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
}

export interface PageSEOData {
  pageId: string;
  pagePath: string;
  pageName: string;
  category: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  h1Title: string;
  subHeading: string;
  seoContent: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  faqs: FAQ[];
  faqsEnabled: boolean;
  isActive: boolean;
  lastUpdated?: string;
  updatedBy?: string;
}

interface AllPagesSEO {
  calculators: PageSEOData[];
  games: PageSEOData[];
  apps: PageSEOData[];
}

const JSON_FILE_PATH = path.join(process.cwd(), 'data', 'all-pages-seo.json');

/**
 * Read all SEO data from JSON file
 */
export function readSEOJson(): AllPagesSEO {
  try {
    const data = fs.readFileSync(JSON_FILE_PATH, 'utf-8');
    return JSON.parse(data) as AllPagesSEO;
  } catch (error) {
    console.error('Error reading SEO JSON file:', error);
    return { calculators: [], games: [], apps: [] };
  }
}

/**
 * Write SEO data to JSON file
 */
export function writeSEOJson(data: AllPagesSEO): boolean {
  try {
    // Sort each category alphabetically
    data.calculators.sort((a, b) => a.pageId.localeCompare(b.pageId));
    data.games.sort((a, b) => a.pageId.localeCompare(b.pageId));
    data.apps.sort((a, b) => a.pageId.localeCompare(b.pageId));

    fs.writeFileSync(JSON_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing SEO JSON file:', error);
    return false;
  }
}

/**
 * Get all pages SEO data
 */
export function getAllPageSEO(): PageSEOData[] {
  const data = readSEOJson();
  return [...data.calculators, ...data.games, ...data.apps];
}

/**
 * Get SEO data for a specific page by ID
 */
export function getPageSEO(pageId: string): PageSEOData | null {
  const data = readSEOJson();

  // Search in all categories
  let page = data.calculators.find(p => p.pageId === pageId);
  if (!page) page = data.games.find(p => p.pageId === pageId);
  if (!page) page = data.apps.find(p => p.pageId === pageId);

  return page || null;
}

/**
 * Get SEO data for a specific page by path
 */
export function getPageSEOByPath(pagePath: string): PageSEOData | null {
  const data = readSEOJson();

  let page = data.calculators.find(p => p.pagePath === pagePath);
  if (!page) page = data.games.find(p => p.pagePath === pagePath);
  if (!page) page = data.apps.find(p => p.pagePath === pagePath);

  return page || null;
}

/**
 * Save SEO data for a page (create or update)
 */
export function savePageSEO(pageId: string, seoData: Partial<PageSEOData>): boolean {
  try {
    const data = readSEOJson();

    // Determine category from path or existing data
    let category: 'calculators' | 'games' | 'apps' = 'calculators';
    if (seoData.pagePath?.includes('/games/') || seoData.category === 'games') {
      category = 'games';
    } else if (seoData.pagePath?.includes('/apps/') || seoData.category === 'apps') {
      category = 'apps';
    }

    // Find existing page index
    const categoryData = data[category];
    const existingIndex = categoryData.findIndex(p => p.pageId === pageId);

    const now = new Date().toISOString();

    if (existingIndex >= 0) {
      // Update existing
      categoryData[existingIndex] = {
        ...categoryData[existingIndex],
        ...seoData,
        pageId,
        lastUpdated: now,
        updatedBy: seoData.updatedBy || 'admin'
      } as PageSEOData;
    } else {
      // Create new
      const newPage: PageSEOData = {
        pageId,
        pagePath: seoData.pagePath || `/us/tools/${category}/${pageId}`,
        pageName: seoData.pageName || pageId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        category,
        metaTitle: seoData.metaTitle || '',
        metaDescription: seoData.metaDescription || '',
        keywords: seoData.keywords || '',
        h1Title: seoData.h1Title || '',
        subHeading: seoData.subHeading || '',
        seoContent: seoData.seoContent || '',
        canonical: seoData.canonical || '',
        ogTitle: seoData.ogTitle || '',
        ogDescription: seoData.ogDescription || '',
        ogImage: seoData.ogImage || '',
        faqs: seoData.faqs || [],
        faqsEnabled: seoData.faqsEnabled || false,
        isActive: seoData.isActive !== false,
        lastUpdated: now,
        updatedBy: seoData.updatedBy || 'admin'
      };
      categoryData.push(newPage);
    }

    return writeSEOJson(data);
  } catch (error) {
    console.error('Error saving page SEO:', error);
    return false;
  }
}

/**
 * Delete SEO data for a page
 */
export function deletePageSEO(pageId: string): boolean {
  try {
    const data = readSEOJson();

    // Try to find and remove from each category
    let found = false;

    const calcIndex = data.calculators.findIndex(p => p.pageId === pageId);
    if (calcIndex >= 0) {
      data.calculators.splice(calcIndex, 1);
      found = true;
    }

    const gameIndex = data.games.findIndex(p => p.pageId === pageId);
    if (gameIndex >= 0) {
      data.games.splice(gameIndex, 1);
      found = true;
    }

    const appIndex = data.apps.findIndex(p => p.pageId === pageId);
    if (appIndex >= 0) {
      data.apps.splice(appIndex, 1);
      found = true;
    }

    if (found) {
      return writeSEOJson(data);
    }

    return false;
  } catch (error) {
    console.error('Error deleting page SEO:', error);
    return false;
  }
}

/**
 * Add FAQ to a page
 */
export function addFAQToPage(pageId: string, faq: Omit<FAQ, 'id' | 'order'>): boolean {
  const page = getPageSEO(pageId);
  if (!page) return false;

  const existingFaqs = page.faqs || [];
  const newFaq: FAQ = {
    id: `faq-${Date.now()}`,
    question: faq.question,
    answer: faq.answer,
    order: existingFaqs.length + 1
  };

  return savePageSEO(pageId, {
    ...page,
    faqs: [...existingFaqs, newFaq],
    faqsEnabled: true
  });
}

/**
 * Update a FAQ
 */
export function updateFAQ(pageId: string, faqId: string, updates: Partial<FAQ>): boolean {
  const page = getPageSEO(pageId);
  if (!page) return false;

  const faqs = page.faqs || [];
  const faqIndex = faqs.findIndex(f => f.id === faqId);
  if (faqIndex < 0) return false;

  faqs[faqIndex] = { ...faqs[faqIndex], ...updates };

  return savePageSEO(pageId, {
    ...page,
    faqs
  });
}

/**
 * Delete a FAQ
 */
export function deleteFAQ(pageId: string, faqId: string): boolean {
  const page = getPageSEO(pageId);
  if (!page) return false;

  const faqs = (page.faqs || []).filter(f => f.id !== faqId);

  return savePageSEO(pageId, {
    ...page,
    faqs,
    faqsEnabled: faqs.length > 0
  });
}

/**
 * Bulk import SEO data
 */
export function bulkImportPageSEO(pages: PageSEOData[]): { success: number; failed: number } {
  let success = 0;
  let failed = 0;

  for (const page of pages) {
    if (savePageSEO(page.pageId, page)) {
      success++;
    } else {
      failed++;
    }
  }

  return { success, failed };
}

/**
 * Get pages by category
 */
export function getPagesByCategory(category: string): PageSEOData[] {
  const data = readSEOJson();

  switch (category) {
    case 'calculators':
      return data.calculators;
    case 'games':
      return data.games;
    case 'apps':
      return data.apps;
    default:
      return [];
  }
}
