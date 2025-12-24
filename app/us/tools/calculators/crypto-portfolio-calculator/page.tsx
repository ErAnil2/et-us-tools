import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import CryptoPortfolioClient from './CryptoPortfolioClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'crypto-portfolio-calculator',
  category: 'calculators',
  fallback: {
    title: 'Crypto Portfolio Calculator - Track Cryptocurrency Investments | The Economic Times',
    description: 'Calculate your cryptocurrency portfolio performance, track gains/losses, and analyze your crypto investments with real-time data and portfolio insights.',
    keywords: 'crypto portfolio calculator, cryptocurrency portfolio tracker, crypto investment calculator, bitcoin portfolio, crypto gains calculator',
  }
});

export default function CryptoPortfolioPage() {
  return <CryptoPortfolioClient />;
}
