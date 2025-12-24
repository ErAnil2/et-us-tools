/**
 * Meta utilities for calculator pages
 * Generates optimized metadata for SEO
 */

import { getEnhancedSEO } from './enhanced-seo-meta';

export interface MetaOptions {
  title?: string;
  description?: string;
  keywords?: string | string[];
  category?: string;
}

export interface MetaData {
  title: string;
  description: string;
  keywords: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  h1?: string;
  metaTitle?: string;
  longDescription?: string;
  faqs?: Array<{ question: string; answer: string }>;
}

// Backward compatibility function
export function getMetaForCalculator(calculatorSlug: string, options: MetaOptions = {}): MetaData {
  const {
    title = 'Calculator',
    description = 'Free online calculator',
    keywords = [],
    category = 'utility'
  } = options;

  // Try to get enhanced SEO data first
  try {
    const enhancedSEO = getEnhancedSEO(calculatorSlug, options);
    return {
      // Enhanced data first, then overrides
      ...enhancedSEO,
      // Override with options if provided
      title: options.title || enhancedSEO.title,
      description: options.description || enhancedSEO.description,
      keywords: enhancedSEO.keywords,
    };
  } catch (error) {
    console.warn(`Enhanced SEO not available for ${calculatorSlug}, using fallback`);
    
    // Fallback to original logic
    const baseKeywords = [
      'calculator',
      'free calculator',
      'online calculator',
      calculatorSlug.replace(/-/g, ' ')
    ];
    
    const allKeywords = Array.isArray(keywords) 
      ? [...baseKeywords, ...keywords]
      : [...baseKeywords, keywords];

    return {
      title,
      description,
      keywords: allKeywords.join(', ')
    };
  }
}

/**
 * Format slug to readable title
 */
export function formatSlugToTitle(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Generate calculator schema for structured data
 */
export function generateCalculatorSchema(slug: string, seoData: MetaData) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": seoData.title,
    "description": seoData.description,
    "applicationCategory": "UtilitiesApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "operatingSystem": "Any",
    "creator": {
      "@type": "Organization",
      "name": "The Economic Times",
      "url": "https://economictimes.indiatimes.com"
    }
  };
}
