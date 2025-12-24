import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import CryptoTaxCalculatorClient from './CryptoTaxCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'crypto-tax-calculator',
  category: 'calculators',
  fallback: {
    title: 'Crypto Tax Calculator | The Economic Times',
    description: 'Free online crypto tax calculator. Calculate instantly with our easy-to-use tool.',
    keywords: '',
  }
});

export default function CryptoTaxCalculatorPage() {
  return <CryptoTaxCalculatorClient />;
}
