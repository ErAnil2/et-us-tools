/**
 * Enhanced SEO Meta Generator for Calculator Pages
 * Reads SEO data from the centralized JSON file (synced with Firebase)
 */

import { MetaOptions, MetaData } from './meta-utils';
import allPagesSeo from '@/data/all-pages-seo.json';

// Type for SEO data from JSON
interface PageSeoData {
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
  faqs: Array<{ question: string; answer: string }>;
  faqsEnabled: boolean;
  isActive: boolean;
}

interface AllPagesSeo {
  calculators: PageSeoData[];
  games: PageSeoData[];
  apps: PageSeoData[];
}

// Cast the imported JSON
const seoData = allPagesSeo as AllPagesSeo;

// Create lookup maps for fast access
const calculatorSeoMap = new Map<string, PageSeoData>();
const gameSeoMap = new Map<string, PageSeoData>();
const appSeoMap = new Map<string, PageSeoData>();

// Initialize maps
seoData.calculators.forEach(calc => calculatorSeoMap.set(calc.pageId, calc));
seoData.games.forEach(game => gameSeoMap.set(game.pageId, game));
seoData.apps.forEach(app => appSeoMap.set(app.pageId, app));

// SEO templates for fallback (when not found in JSON)
const SEO_TEMPLATES = {
  financial: {
    titleSuffix: " | Free Financial Calculator - The Economic Times",
    descriptionTemplate: "Calculate {action} with our comprehensive calculator from The Economic Times.",
    keywords: ["financial calculator", "money calculator", "finance tools", "economic times"],
  },
  health: {
    titleSuffix: " | Free Health Calculator - The Economic Times",
    descriptionTemplate: "Calculate your {metric} with our accurate calculator from The Economic Times.",
    keywords: ["health calculator", "fitness calculator", "wellness tools", "economic times"],
  },
  math: {
    titleSuffix: " | Free Math Calculator - The Economic Times",
    descriptionTemplate: "Solve {type} problems instantly with our calculator from The Economic Times.",
    keywords: ["math calculator", "mathematics calculator", "calculation tools", "economic times"],
  },
  business: {
    titleSuffix: " | Free Business Calculator - The Economic Times",
    descriptionTemplate: "Calculate {metric} for your business with our calculator from The Economic Times.",
    keywords: ["business calculator", "profit calculator", "business tools", "economic times"],
  },
  utility: {
    titleSuffix: " | Free Online Calculator - The Economic Times",
    descriptionTemplate: "Convert and calculate {type} with our tool from The Economic Times.",
    keywords: ["conversion calculator", "unit converter", "utility calculator", "economic times"],
  },
};

/**
 * Get SEO data from the centralized JSON file
 */
export function getSeoFromJson(slug: string, type: 'calculators' | 'games' | 'apps' = 'calculators'): PageSeoData | null {
  switch (type) {
    case 'calculators':
      return calculatorSeoMap.get(slug) || null;
    case 'games':
      return gameSeoMap.get(slug) || null;
    case 'apps':
      return appSeoMap.get(slug) || null;
    default:
      return null;
  }
}

/**
 * Get enhanced SEO for a page (calculator, game, or app)
 */
export function getEnhancedSEO(pageSlug: string, options: MetaOptions = {}): MetaData {
  // Try to find in calculators first, then games, then apps
  let jsonData = calculatorSeoMap.get(pageSlug);
  if (!jsonData) jsonData = gameSeoMap.get(pageSlug);
  if (!jsonData) jsonData = appSeoMap.get(pageSlug);

  // If found in JSON, use that data
  if (jsonData) {
    return {
      title: jsonData.metaTitle || options.title || formatSlugToTitle(pageSlug),
      description: jsonData.metaDescription || options.description || '',
      keywords: jsonData.keywords || '',
      h1: jsonData.h1Title || formatSlugToTitle(pageSlug),
      metaTitle: jsonData.metaTitle || options.title || formatSlugToTitle(pageSlug),
      ogTitle: jsonData.ogTitle || jsonData.metaTitle || options.title || formatSlugToTitle(pageSlug),
      ogDescription: jsonData.ogDescription || jsonData.metaDescription || options.description || '',
      ogImage: jsonData.ogImage || `/images/${jsonData.category}/${pageSlug}-og.jpg`,
      longDescription: jsonData.seoContent || jsonData.metaDescription || '',
      faqs: jsonData.faqs || [],
    };
  }

  // Fallback to template-based generation
  const category = (options.category || 'utility') as keyof typeof SEO_TEMPLATES;
  const template = SEO_TEMPLATES[category] || SEO_TEMPLATES.utility;

  const pageName = formatSlugToTitle(pageSlug);
  const title = options.title || `${pageName}${template.titleSuffix}`;
  const description = options.description ||
    template.descriptionTemplate.replace('{type}', pageName.toLowerCase());
  const keywords = template.keywords.join(', ');

  return {
    title,
    description,
    keywords,
    h1: pageName,
    metaTitle: title,
    ogTitle: title,
    ogDescription: description,
    ogImage: `/images/calculators/${pageSlug}-og.jpg`,
    longDescription: description,
  };
}

/**
 * Get SEO for calculator pages
 */
export function getCalculatorSEO(slug: string, defaults?: MetaOptions): MetaData {
  const jsonData = calculatorSeoMap.get(slug);

  if (jsonData) {
    return {
      title: jsonData.metaTitle || defaults?.title || formatSlugToTitle(slug),
      description: jsonData.metaDescription || defaults?.description || '',
      keywords: jsonData.keywords || '',
      h1: jsonData.h1Title || formatSlugToTitle(slug),
      metaTitle: jsonData.metaTitle || defaults?.title || formatSlugToTitle(slug),
      ogTitle: jsonData.ogTitle || jsonData.metaTitle || defaults?.title || formatSlugToTitle(slug),
      ogDescription: jsonData.ogDescription || jsonData.metaDescription || defaults?.description || '',
      ogImage: jsonData.ogImage || `/images/calculators/${slug}-og.jpg`,
      longDescription: jsonData.seoContent || jsonData.metaDescription || '',
      faqs: jsonData.faqs || [],
    };
  }

  // Return defaults if not found
  return getEnhancedSEO(slug, defaults);
}

/**
 * Get SEO for game pages
 */
export function getGameSEO(slug: string, defaults?: MetaOptions): MetaData {
  const jsonData = gameSeoMap.get(slug);

  if (jsonData) {
    return {
      title: jsonData.metaTitle || defaults?.title || formatSlugToTitle(slug),
      description: jsonData.metaDescription || defaults?.description || '',
      keywords: jsonData.keywords || '',
      h1: jsonData.h1Title || formatSlugToTitle(slug),
      metaTitle: jsonData.metaTitle || defaults?.title || formatSlugToTitle(slug),
      ogTitle: jsonData.ogTitle || jsonData.metaTitle || defaults?.title || formatSlugToTitle(slug),
      ogDescription: jsonData.ogDescription || jsonData.metaDescription || defaults?.description || '',
      ogImage: jsonData.ogImage || `/images/games/${slug}-og.jpg`,
      longDescription: jsonData.seoContent || jsonData.metaDescription || '',
      faqs: jsonData.faqs || [],
    };
  }

  // Return defaults if not found
  return getEnhancedSEO(slug, defaults);
}

/**
 * Get SEO for app pages
 */
export function getAppSEO(slug: string, defaults?: MetaOptions): MetaData {
  const jsonData = appSeoMap.get(slug);

  if (jsonData) {
    return {
      title: jsonData.metaTitle || defaults?.title || formatSlugToTitle(slug),
      description: jsonData.metaDescription || defaults?.description || '',
      keywords: jsonData.keywords || '',
      h1: jsonData.h1Title || formatSlugToTitle(slug),
      metaTitle: jsonData.metaTitle || defaults?.title || formatSlugToTitle(slug),
      ogTitle: jsonData.ogTitle || jsonData.metaTitle || defaults?.title || formatSlugToTitle(slug),
      ogDescription: jsonData.ogDescription || jsonData.metaDescription || defaults?.description || '',
      ogImage: jsonData.ogImage || `/images/apps/${slug}-og.jpg`,
      longDescription: jsonData.seoContent || jsonData.metaDescription || '',
      faqs: jsonData.faqs || [],
    };
  }

  // Return defaults if not found
  return getEnhancedSEO(slug, defaults);
}

function formatSlugToTitle(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Export for backward compatibility
export function addCalculatorSEO(slug: string, data: Partial<MetaData>) {
  console.warn('addCalculatorSEO is deprecated. Update the JSON file and run sync script instead.');
}
