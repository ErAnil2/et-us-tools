/**
 * Generate Next.js Metadata from the SEO JSON file
 * Use this in page.tsx files to dynamically load SEO data
 */

import { Metadata } from 'next';
import { getPageSEO } from './seo-json';

interface MetadataOptions {
  pageId: string;
  category?: 'calculators' | 'games' | 'apps';
  fallback?: {
    title?: string;
    description?: string;
    keywords?: string;
    canonical?: string;
  };
}

/**
 * Generate metadata for a page from the SEO JSON file
 * @param options - Page ID and optional fallback values
 * @returns Metadata object for Next.js
 */
export function generatePageMetadata(options: MetadataOptions): Metadata {
  const { pageId, fallback = {} } = options;

  // Get SEO data from JSON
  const seoData = getPageSEO(pageId);

  if (!seoData) {
    // Return fallback if page not found in JSON
    return {
      title: fallback.title || pageId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      description: fallback.description || '',
      keywords: fallback.keywords || '',
    };
  }

  const baseUrl = 'https://economictimes.indiatimes.com';

  return {
    title: seoData.metaTitle || fallback.title,
    description: seoData.metaDescription || fallback.description,
    keywords: seoData.keywords || fallback.keywords,
    alternates: {
      canonical: seoData.canonical || fallback.canonical || `${baseUrl}${seoData.pagePath}`,
    },
    openGraph: {
      title: seoData.ogTitle || seoData.metaTitle || fallback.title,
      description: seoData.ogDescription || seoData.metaDescription || fallback.description,
      url: `${baseUrl}${seoData.pagePath}`,
      type: 'website',
      ...(seoData.ogImage && { images: [{ url: seoData.ogImage }] }),
    },
  };
}

/**
 * Async version for use with generateMetadata function
 */
export async function getMetadataForPage(pageId: string, fallback?: MetadataOptions['fallback']): Promise<Metadata> {
  return generatePageMetadata({ pageId, fallback });
}
