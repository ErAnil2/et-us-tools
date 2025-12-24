'use client';

import { useState, useEffect, useMemo } from 'react';
import allPagesSeo from '@/data/all-pages-seo.json';

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
}

export interface PageSEO {
  pageId: string;
  pagePath: string;
  pageName: string;
  category: string;
  metaTitle: string;
  metaDescription: string;
  canonical: string;
  keywords: string;
  h1Title: string;
  subHeading: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  faqs: FAQ[];
  faqsEnabled: boolean;
  isActive: boolean;
  lastUpdated?: string;
  updatedBy?: string;
  createdAt?: string;
}

interface AllPagesSeo {
  calculators: PageSEO[];
  games: PageSEO[];
  apps: PageSEO[];
}

// Cast the imported JSON
const seoJsonData = allPagesSeo as AllPagesSeo;

// Create lookup maps for instant access (no API call needed for initial data)
const seoLookupMap = new Map<string, PageSEO>();

// Initialize maps from JSON
[...seoJsonData.calculators, ...seoJsonData.games, ...seoJsonData.apps].forEach(page => {
  seoLookupMap.set(page.pageId, page as PageSEO);
});

/**
 * Get initial SEO data from JSON (synchronous, no flash)
 */
function getInitialSeoFromJson(pageId: string): PageSEO | null {
  return seoLookupMap.get(pageId) || null;
}

interface UsePageSEOResult {
  seoData: PageSEO | null;
  loading: boolean;
  error: Error | null;
  // Convenient getters with fallbacks
  getH1: (fallback?: string) => string;
  getSubHeading: (fallback?: string) => string;
  getFaqs: (fallback?: FAQ[]) => FAQ[];
  getMetaTitle: (fallback?: string) => string;
  getMetaDescription: (fallback?: string) => string;
  // Schema data
  faqSchema: object | null;
  refetch: () => Promise<void>;
}

export function usePageSEO(pageId: string): UsePageSEOResult {
  // Initialize with JSON data to prevent flash/flicker
  const initialData = useMemo(() => getInitialSeoFromJson(pageId), [pageId]);

  const [seoData, setSeoData] = useState<PageSEO | null>(initialData);
  const [loading, setLoading] = useState(false); // Start as false since we have initial data
  const [error, setError] = useState<Error | null>(null);

  // Generate FAQ schema from current data
  const faqSchema = useMemo(() => {
    if (seoData?.faqsEnabled && seoData?.faqs && seoData.faqs.length > 0) {
      const sortedFaqs = [...seoData.faqs].sort((a, b) => a.order - b.order);
      return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": sortedFaqs.map((faq) => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      };
    }
    return null;
  }, [seoData]);

  // Optional: Fetch fresh data from API (for real-time updates)
  // This is now optional since JSON has the same data as Firebase
  const fetchSEOData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/page-seo/${pageId}`);

      if (!response.ok) {
        if (response.status === 404) {
          // Page not found in Firebase, keep JSON data
          return;
        }
        throw new Error(`Failed to fetch SEO data: ${response.status}`);
      }

      const data = await response.json();

      if (data.isActive !== false) {
        setSeoData(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      // Keep initial JSON data on error
    } finally {
      setLoading(false);
    }
  };

  // Optionally fetch from API to get any real-time updates
  // Comment out this useEffect if you only want to use JSON data
  useEffect(() => {
    // Only fetch if we want real-time Firebase updates
    // fetchSEOData();
  }, [pageId]);

  // Helper functions with fallbacks
  const getH1 = (fallback = '') => seoData?.h1Title || fallback;
  const getSubHeading = (fallback = '') => seoData?.subHeading || fallback;
  const getMetaTitle = (fallback = '') => seoData?.metaTitle || fallback;
  const getMetaDescription = (fallback = '') => seoData?.metaDescription || fallback;

  const getFaqs = (fallback: FAQ[] = []) => {
    if (seoData?.faqsEnabled && seoData?.faqs?.length > 0) {
      return [...seoData.faqs].sort((a, b) => a.order - b.order);
    }
    return fallback;
  };

  return {
    seoData,
    loading,
    error,
    getH1,
    getSubHeading,
    getFaqs,
    getMetaTitle,
    getMetaDescription,
    faqSchema,
    refetch: fetchSEOData
  };
}

// Helper function to generate WebApplication schema
// Supports both object format and positional arguments
export function generateWebAppSchema(
  nameOrOptions: string | { name: string; description: string; url?: string; applicationCategory?: string; operatingSystem?: string },
  description?: string,
  url?: string,
  category: string = 'Utility'
) {
  // Handle object format
  if (typeof nameOrOptions === 'object') {
    const opts = nameOrOptions;
    return {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": opts.name,
      "description": opts.description,
      "url": opts.url || '',
      "applicationCategory": opts.applicationCategory || 'Utility',
      "operatingSystem": opts.operatingSystem || "All",
      "permissions": "none",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    };
  }

  // Handle positional arguments format
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": nameOrOptions,
    "description": description || '',
    "url": url || '',
    "applicationCategory": category,
    "operatingSystem": "All",
    "permissions": "none",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };
}
