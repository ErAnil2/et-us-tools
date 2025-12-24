import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import UrlShortenerClient from './UrlShortenerClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'url-shortener',
  category: 'apps',
  fallback: {
    title: 'URL Shortener - Free Link Shortener & Short URL Generator | The Economic Times',
    description: 'Shorten URLs online for free! Create short links instantly for easy sharing on social media, emails, and messaging. Simple and fast URL shortener tool.',
    keywords: 'URL shortener, shorten URL, link shortener, short URL, URL shortener free, create short link, tiny URL, link reducer, short link generator',
  }
});

export default function UrlShortenerPage() {
  return <UrlShortenerClient />;
}
